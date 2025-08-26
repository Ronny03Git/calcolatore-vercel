export default async function handler(req, res) {
  const tenor = (req.query.tenor || '3m').toLowerCase();
  const map = { '1m':'EST.B.EU000A2QQF24.CR', '3m':'EST.B.EU000A2QQF32.CR', '6m':'EST.B.EU000A2QQF40.CR' };
  const series = map[tenor] || map['3m'];

  async function getCsv(url) {
    const r = await fetch(url, {
      headers: {
        'Accept': 'text/csv',
        'User-Agent': 'Mozilla/5.0 (compatible; CalcolatoreFido/1.0; +https://example.org/)'
      }
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = (await r.text()).trim();
    if (/blocked due to security/i.test(text)) throw new Error('WAF blocked');
    const rows = text.split('\n').filter(l => l && !l.startsWith('#'));
    const last = rows[rows.length - 1].split(',');
    const date = last[0];
    const value = Number(last[1]);
    if (!Number.isFinite(value)) throw new Error('NaN');
    return { date, value };
  }

  try {
    let out;
    try {
      out = await getCsv(`https://data-api.ecb.europa.eu/service/data/EST/${series}?lastNObservations=1&format=csvdata`);
    } catch (e1) {
      out = await getCsv(`https://sdw-wsrest.ecb.europa.eu/service/data/EST/${series}?lastNObservations=1&format=csvdata`);
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=600');
    return res.status(200).json({ tenor, value: out.value, date: out.date, source: 'ECB (server proxy)' });
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(502).json({ error: String(e) });
  }
}
