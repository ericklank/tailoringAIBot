export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.TAILORING_PASSWORD}`) return res.status(401).json({ error: 'Unauthorized' });

  const integrations = [
    { id: 'zoominfo', name: 'ZoomInfo', phase: 1, ready: !!(process.env.ZOOMINFO_CLIENT_ID && process.env.ZOOMINFO_CLIENT_SECRET), missing: [!process.env.ZOOMINFO_CLIENT_ID && 'ZOOMINFO_CLIENT_ID', !process.env.ZOOMINFO_CLIENT_SECRET && 'ZOOMINFO_CLIENT_SECRET'].filter(Boolean) },
    { id: 'apollo', name: 'Apollo.io', phase: 1, ready: !!process.env.APOLLO_API_KEY, missing: [!process.env.APOLLO_API_KEY && 'APOLLO_API_KEY'].filter(Boolean) },
    { id: 'anthropic', name: 'Claude AI', phase: 1, ready: !!process.env.ANTHROPIC_API_KEY, missing: [!process.env.ANTHROPIC_API_KEY && 'ANTHROPIC_API_KEY'].filter(Boolean) },
    { id: 'salesloft', name: 'Salesloft', phase: 2, ready: !!process.env.SALESLOFT_API_KEY, missing: [!process.env.SALESLOFT_API_KEY && 'SALESLOFT_API_KEY'].filter(Boolean), note: process.env.SALESLOFT_API_KEY ? 'API connected' : 'CSV export works now. API auto-enrollment needs key.' },
    { id: 'salesforce', name: 'Salesforce', phase: 5, ready: !!(process.env.SFDC_CLIENT_ID && process.env.SFDC_CLIENT_SECRET && process.env.SFDC_INSTANCE_URL), missing: [!process.env.SFDC_CLIENT_ID && 'SFDC_CLIENT_ID', !process.env.SFDC_CLIENT_SECRET && 'SFDC_CLIENT_SECRET', !process.env.SFDC_INSTANCE_URL && 'SFDC_INSTANCE_URL'].filter(Boolean), note: 'Requires Connected App approval from SFDC admin' },
    { id: 'nooks', name: 'Nooks', phase: 3, ready: !!process.env.NOOKS_API_KEY, missing: [!process.env.NOOKS_API_KEY && 'NOOKS_API_KEY'].filter(Boolean), note: 'Direct dial CSV export works now. Auto-push needs Nooks API key.' },
  ];
  return res.status(200).json({ integrations });
}
