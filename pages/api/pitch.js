const PITCH_COPY = {
  speed: (ats) => `Unlike ${ats && ats !== 'Unknown' ? ats : 'HRIS bolt-ons'} — which started as payroll systems and layered recruiting on top — Teamtailor was built from day one as an ATS. Faster to implement, fewer workarounds, and a recruiter-first UX your team will actually use.`,
  ai: () => `AI screening interviews let candidates self-select on their own schedule. Interview summarization cuts debrief time in half. AI analytics surface pipeline insights without building a report from scratch.`,
  ui: () => `Hiring managers actually log in without being chased. Candidates get a branded, mobile-first experience. Your team stops asking IT for help navigating the thing.`,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.TAILORING_PASSWORD}`) return res.status(401).json({ error: 'Unauthorized' });

  const { contact, ats, angles } = req.body;
  const resolvedATS = contact?.ats || ats || 'Unknown';
  const contextLine = contact
    ? `Prospect: ${contact.firstName} ${contact.lastName}, ${contact.jobTitle} at ${contact.companyName}. Current ATS: ${resolvedATS}.`
    : resolvedATS !== 'Unknown' ? `Prospect is currently using ${resolvedATS}.` : '';
  const angleText = (angles || []).map(k => PITCH_COPY[k]?.(resolvedATS) ?? '').filter(Boolean).join('\n\n');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `You write cold outreach emails for Teamtailor, a modern ATS and employer branding platform. Rules: no em dashes, no buzzwords, max 120 words, conversational and direct. Include a subject line on the first line prefixed with "Subject: ". Sign off as Eric from Teamtailor.`,
        messages: [{ role: 'user', content: `Write a cold email pitch for Teamtailor.\n${contextLine}\n\nAngles:\n${angleText}` }],
      }),
    });
    const data = await response.json();
    const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') ?? '';
    return res.status(200).json({ pitch: text });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
