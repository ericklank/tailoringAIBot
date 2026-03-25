const SL_BASE = 'https://api.salesloft.com/v2';

function headers() {
  return { Authorization: `Bearer ${process.env.SALESLOFT_API_KEY}`, 'Content-Type': 'application/json' };
}

export async function listCadences() {
  const r = await fetch(`${SL_BASE}/cadences.json?per_page=100`, { headers: headers() });
  if (!r.ok) throw new Error(`Salesloft cadences failed: ${r.status}`);
  return r.json();
}

export async function upsertPerson(person) {
  const r = await fetch(`${SL_BASE}/people.json`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ first_name: person.firstName, last_name: person.lastName, email_address: person.emailAddress, title: person.title, company: person.company, phone: person.phone, tags: person.tags ?? [] }),
  });
  if (!r.ok && r.status !== 422) throw new Error(`Salesloft person create failed: ${r.status}`);
  return r.json();
}

export async function enrollInCadence(personId, cadenceId) {
  const r = await fetch(`${SL_BASE}/cadence_memberships.json`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ person_id: personId, cadence_id: cadenceId, step_id: null }),
  });
  if (!r.ok) throw new Error(`Salesloft enrollment failed: ${r.status}`);
  return r.json();
}

export function getCadenceIdForATS(ats) {
  const map = {
    Jobvite: process.env.SL_CADENCE_JOBVITE,
    Lever: process.env.SL_CADENCE_LEVER,
    JazzHR: process.env.SL_CADENCE_JAZZHR,
    iCIMS: process.env.SL_CADENCE_ICIMS,
    Greenhouse: process.env.SL_CADENCE_GREENHOUSE,
    ADP: process.env.SL_CADENCE_ADP,
    Dayforce: process.env.SL_CADENCE_DAYFORCE,
    UKG: process.env.SL_CADENCE_UKG,
    'SAP SuccessFactors': process.env.SL_CADENCE_SAP,
    Workday: process.env.SL_CADENCE_WORKDAY,
    Unknown: process.env.SL_CADENCE_DEFAULT,
  };
  return map[ats] ?? process.env.SL_CADENCE_DEFAULT ?? null;
}
