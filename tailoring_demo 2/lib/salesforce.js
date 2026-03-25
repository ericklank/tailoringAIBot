const SFDC_INSTANCE = process.env.SFDC_INSTANCE_URL ?? '';
const SFDC_API = `${SFDC_INSTANCE}/services/data/v59.0`;

let _sfToken = null;
let _sfExpiry = 0;

async function getSFToken() {
  if (_sfToken && Date.now() < _sfExpiry) return _sfToken;
  const r = await fetch(`${SFDC_INSTANCE}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SFDC_CLIENT_ID,
      client_secret: process.env.SFDC_CLIENT_SECRET,
    }),
  });
  if (!r.ok) throw new Error(`SFDC auth failed: ${r.status}`);
  const d = await r.json();
  _sfToken = d.access_token;
  _sfExpiry = Date.now() + 55 * 60 * 1000;
  return _sfToken;
}

export async function sfdcPreflightCheck(companyName, contactEmail) {
  const token = await getSFToken();
  const soql = `SELECT Id, Name, OwnerId, Owner.Name, LastActivityDate, (SELECT Id FROM Opportunities WHERE IsClosed = false LIMIT 1) FROM Account WHERE Name LIKE '${(companyName || '').replace(/'/g, "\\'")}%' LIMIT 1`;
  const r = await fetch(`${SFDC_API}/query?q=${encodeURIComponent(soql)}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!r.ok) throw new Error(`SFDC query failed: ${r.status}`);
  const data = await r.json();
  if (!data.records?.length) return { safe: true };
  const acct = data.records[0];
  if (acct.Opportunities?.records?.length > 0) return { safe: false, reason: 'open_opportunity' };
  const ownerName = acct.Owner?.Name ?? '';
  if (!ownerName.toLowerCase().includes('integration user')) return { safe: false, reason: 'rep_owned' };
  if (acct.LastActivityDate) {
    const daysSince = (Date.now() - new Date(acct.LastActivityDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 60) return { safe: false, reason: 'recent_activity' };
  }
  return { safe: true };
}

export async function logActivity(params) {
  const token = await getSFToken();
  const soql = `SELECT Id FROM Contact WHERE Email = '${params.contactEmail}' LIMIT 1`;
  const r = await fetch(`${SFDC_API}/query?q=${encodeURIComponent(soql)}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await r.json();
  const contactId = data.records?.[0]?.Id;
  if (!contactId) return;
  await fetch(`${SFDC_API}/sobjects/Task`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ WhoId: contactId, Subject: params.subject, Description: params.description, ActivityDate: params.activityDate, Status: 'Completed', Type: 'Email' }),
  });
}
