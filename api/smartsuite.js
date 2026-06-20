export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, ACCOUNT-ID');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const apiKey   = req.headers['x-api-key'];
  const accountId = req.headers['x-account-id'];

  if (!apiKey || !accountId) {
    return res.status(400).json({ error: 'Missing API key or account ID' });
  }

  const url = `https://app.smartsuite.com/api/v1/${path}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': `Token ${apiKey}`,
        'ACCOUNT-ID': accountId,
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PATCH', 'PUT'].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
