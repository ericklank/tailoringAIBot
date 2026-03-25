const ZI_AUTH_URL = 'https://api.zoominfo.com/authenticate';
const ZI_BASE_URL = 'https://api.zoominfo.com';

let _token = null;
let _tokenExpiry = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const res = await fetch(ZI_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: process.env.ZOOMINFO_CLIENT_ID, password: process.env.ZOOMINFO_CLIENT_SECRET }),
  });
  if (!res.ok) throw new Error(`ZoomInfo auth failed: ${res.status}`);
  const data = await res.json();
  _token = data.jwt;
  _tokenExpiry = Date.now() + 55 * 60 * 1000;
  return _token;
}

export async function ziSearchContacts(params) {
  const token = await getToken();
  const res = await fetch(`${ZI_BASE_URL}/search/contact`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      outputFields: ['id', 'firstName', 'lastName', 'jobTitle', 'companyName', 'email', 'phone', 'mobilePhone', 'hasEmail', 'hasPhone', 'contactAccuracyScore'],
      ...params,
      pageSize: params.pageSize ?? 25,
      page: params.page ?? 1,
    }),
  });
  if (!res.ok) throw new Error(`ZoomInfo search failed: ${res.status}`);
  return res.json();
}

export async function ziEnrichContacts(personIds) {
  const token = await getToken();
  const res = await fetch(`${ZI_BASE_URL}/enrich/contact`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matchPersonInput: personIds.map(id => ({ personId: id })),
      outputFields: ['firstName', 'lastName', 'email', 'phone', 'mobilePhone', 'jobTitle', 'companyName'],
    }),
  });
  if (!res.ok) throw new Error(`ZoomInfo enrich failed: ${res.status}`);
  return res.json();
}
