import { toSalesloftCSV } from '../../lib/csv';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.TAILORING_PASSWORD}`) return res.status(401).json({ error: 'Unauthorized' });
  const { contacts } = req.body;
  if (!contacts?.length) return res.status(400).json({ error: 'No contacts' });
  const csv = toSalesloftCSV(contacts);
  const filename = `tailoring_export_${new Date().toISOString().slice(0, 10)}.csv`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csv);
}
