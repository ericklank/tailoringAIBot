const APOLLO_BASE = 'https://api.apollo.io/v1';

export async function apolloSearchPeople(params) {
  const res = await fetch(`${APOLLO_BASE}/mixed_people/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-Api-Key': process.env.APOLLO_API_KEY },
    body: JSON.stringify({ ...params, per_page: params.perPage ?? 25, page: params.page ?? 1, reveal_personal_emails: false, reveal_phone_number: true }),
  });
  if (!res.ok) throw new Error(`Apollo search failed: ${res.status}`);
  return res.json();
}
