import { sfdcPreflightCheck } from '../../lib/salesforce';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.TAILORING_PASSWORD}`) return res.status(401).json({ error: 'Unauthorized' });
  if (!process.env.SFDC_CLIENT_ID) return res.status(503).json({ error: 'Salesforce not configured. Add SFDC_CLIENT_ID, SFDC_CLIENT_SECRET, SFDC_INSTANCE_URL.', phase: 5 });

  const { contacts } = req.body;
  if (!contacts?.length) return res.status(400).json({ error: 'No contacts' });

  const REASON_LABELS = {
    open_opportunity: 'Open opportunity — do not touch',
    recent_activity: 'Activity within 60 days',
    rep_owned: 'Owned by active rep',
    do_not_contact: 'Do not contact',
  };

  const results = await Promise.all(contacts.map(async (c) => {
    try {
      const check = await sfdcPreflightCheck(c.companyName, c.email);
      return { id: c.id, name: `${c.firstName} ${c.lastName}`, company: c.companyName, safe: check.safe, reason: check.safe ? null : REASON_LABELS[check.reason] ?? 'Blocked' };
    } catch (e) {
      return { id: c.id, name: `${c.firstName} ${c.lastName}`, company: c.companyName, safe: true, reason, warning: String(e) };
    }
  }));

  return res.status(200).json({ results, summary: { safe: results.filter(r => r.safe).length, blocked: results.filter(r => !r.safe).length } });
}
