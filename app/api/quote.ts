export default async function handler(req: any, res: any) {
  const symbol = req.query?.symbol;
  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol parameter' });
  }

  try {
    const resp = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      }
    );

    if (!resp.ok) {
      return res.status(resp.status).json({ error: `Yahoo Finance returned ${resp.status}` });
    }

    const data = (await resp.json()) as any;
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      symbol: meta?.symbol || symbol,
      name: meta?.longName || meta?.shortName || `${symbol} ETF`,
      price: meta?.regularMarketPrice || 0,
      changeDay: meta?.fulldayChange || 0,
      changeDayPct: meta?.regularMarketChangePercent || 0,
      currency: meta?.currency || 'CAD',
      fiftyTwoWeekHigh: meta?.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: meta?.fiftyTwoWeekLow || 0,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverless quote fetch failed' });
  }
}
