import { ziSearchContacts } from '../../lib/zoominfo';

const MGMT_MAP = { Director: 'Director', 'VP Level Exec': 'VP Level Exec', 'C Level Exec': 'C Level Exec', Manager: 'Manager' };

function inferATS(company) {
  const c = (company || '').toLowerCase();
  if (c.includes('greenhouse')) return 'Greenhouse';
  if (c.includes('lever')) return 'Lever';
  if (c.includes('jazz')) return 'JazzHR';
  if (c.includes('icims')) return 'iCIMS';
  if (c.includes('jobvite')) return 'Jobvite';
  if (c.includes('workday')) return 'Workday';
  if (c.includes('adp')) return 'ADP';
  return 'Unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.TAILORING_PASSWORD}`) return res.status(401).json({ error: 'Unauthorized' });

  const { titles, managementLevels, country, page } = req.body;
  try {
    const jobTitle = (titles ?? ['Director of Talent Acquisition']).join(' OR ');
    const mgmt = (managementLevels ?? ['Director']).map(m => MGMT_MAP[m] ?? m).join(',');
    const data = await ziSearchContacts({ jobTitle, managementLevel: mgmt, country: country ?? 'United States', requiredFields: 'email,phone', sort: '-contactAccuracyScore', pageSize: 25, page: page ?? 1 });
    const contacts = (data.data ?? []).map(c => ({
      id: String(c.id), firstName: c.firstName ?? '', lastName: c.lastName ?? '',
      jobTitle: c.jobTitle ?? '', companyName: c.companyName ?? '',
      email: c.email ?? null, phone: c.phone ?? c.mobilePhone ?? null,
      ats: inferATS(c.companyName ?? ''), zoominfoId: String(c.id),
    }));
    return res.status(200).json({ contacts, total: data.meta?.totalResults ?? contacts.length, page: page ?? 1 });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
