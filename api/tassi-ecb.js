export default async function handler(req, res) {
  const tenor = (req.query.tenor || '3m').toLowerCase();
  const map = { '1m':'EST.B.EU000A2QQF24.CR', '3m':'EST.B.EU000A2QQF32.CR', '6m':'EST.B.EU000A2QQF40.CR' };
  const series = map[tenor] || map['3m'];
  const url = `https://data-api.ecb.europa.eu/service/data/EST/${series}?lastNObservations=1&format=csvdata`;

  try {
    const r = await fetch(url, { headers: { 'Accept': 'text/csv' } });
    if (!r.ok) throw new Error('ECB ' + r.status);
    const text = (await r.text()).trim();
    const rows = text.split('\n').filter(l => l && !l.startsWith('#'));
    const last = rows[rows.length - 1].split(',');
    const date = last[0];
    const value = parseFloat(last[1]);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=600');
    return res.status(200).json({ tenor, value, date, source: 'ECB Data Portal (server)' });
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(502).json({ error: String(e) });
  }
}
