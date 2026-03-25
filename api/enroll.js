import { upsertPerson, enrollInCadence, getCadenceIdForATS } from '../../lib/salesloft';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.TAILORING_PASSWORD}`) return res.status(401).json({ error: 'Unauthorized' });
  if (!process.env.SALESLOFT_API_KEY) return res.status(503).json({ error: 'Salesloft API key not configured. Add SALESLOFT_API_KEY to environment variables.', phase: 2 });

  const { contacts } = req.body;
  if (!contacts?.length) return res.status(400).json({ error: 'No contacts' });

  const results = [];
  for (const c of contacts) {
    if (!c.email) { results.push({ id: c.id, name: `${c.firstName} ${c.lastName}`, status: 'skipped', detail: 'No email' }); continue; }
    const cadenceId = getCadenceIdForATS(c.ats);
    if (!cadenceId) { results.push({ id: c.id, name: `${c.firstName} ${c.lastName}`, status: 'skipped', detail: `No cadence for ATS: ${c.ats}` }); continue; }
    try {
      const personRes = await upsertPerson({ firstName: c.firstName, lastName: c.lastName, emailAddress: c.email, title: c.jobTitle, company: c.companyName, phone: c.phone ?? undefined, tags: c.ats && c.ats !== 'Unknown' ? [`ATS:${c.ats}`] : [] });
      const personId = personRes?.data?.id ?? personRes?.id;
      if (!personId) throw new Error('No person ID returned');
      await enrollInCadence(String(personId), cadenceId);
      results.push({ id: c.id, name: `${c.firstName} ${c.lastName}`, status: 'enrolled' });
    } catch (e) {
      results.push({ id: c.id, name: `${c.firstName} ${c.lastName}`, status: 'error', detail: String(e) });
    }
    await new Promise(r => setTimeout(r, 120));
  }

  const enrolled = results.filter(r => r.status === 'enrolled').length;
  const errors = results.filter(r => r.status === 'error').length;
  return res.status(200).json({ results, summary: { enrolled, errors, skipped: results.length - enrolled - errors } });
}
