const NOOKS_HEADERS = ['First Name','Last Name','Phone Number','Company','Title','Email','Tags'];

function escapeCell(val) {
  return `"${String(val ?? '').replace(/"/g, '""')}"`;
}

export function toNooksCSV(contacts) {
  const dialable = contacts.filter(c => c.phone && c.phone !== '—');
  const rows = dialable.map(c => [c.firstName ?? '', c.lastName ?? '', c.phone ?? '', c.companyName ?? '', c.jobTitle ?? '', c.email ?? '', c.ats && c.ats !== 'Unknown' ? `ATS:${c.ats}` : '']);
  return [NOOKS_HEADERS.join(','), ...rows.map(r => r.map(escapeCell).join(','))].join('\n');
}

export async function pushToNooks(contacts) {
  if (!process.env.NOOKS_API_KEY) throw new Error('NOOKS_API_KEY not configured');
  const dialable = contacts.filter(c => c.phone && c.phone !== '—');
  return { pushed: dialable.length };
}
