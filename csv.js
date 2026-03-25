const SALESLOFT_HEADERS = ['first_name','last_name','email_address','title','company','phone','city','state','country','tags','do_not_contact'];

function escapeCell(val) {
  return `"${String(val ?? '').replace(/"/g, '""')}"`;
}

export function toSalesloftCSV(contacts) {
  const rows = contacts.map(c => [
    c.firstName ?? '', c.lastName ?? '', c.email ?? '', c.jobTitle ?? '',
    c.companyName ?? '', c.phone ?? '', '', '', 'United States',
    c.ats && c.ats !== 'Unknown' ? `ATS:${c.ats}` : '', 'false',
  ]);
  return [SALESLOFT_HEADERS.join(','), ...rows.map(r => r.map(escapeCell).join(','))].join('\n');
}
