import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function liveQuoteApiPlugin(): Plugin {
  return {
    name: 'live-quote-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/quote')) {
          const url = new URL(req.url, 'http://localhost');
          const symbol = url.searchParams.get('symbol');
          if (!symbol) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing symbol parameter' }));
            return;
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
              res.statusCode = resp.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: `Yahoo Finance returned ${resp.status}` }));
              return;
            }

            const data = (await resp.json()) as any;
            const result = data?.chart?.result?.[0];
            const meta = result?.meta;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(
              JSON.stringify({
                symbol: meta?.symbol || symbol,
                name: meta?.longName || meta?.shortName || `${symbol} ETF`,
                price: meta?.regularMarketPrice || 0,
                changeDay: meta?.fulldayChange || 0,
                changeDayPct: meta?.regularMarketChangePercent || 0,
                fiftyTwoWeekHigh: meta?.fiftyTwoWeekHigh || 0,
                fiftyTwoWeekLow: meta?.fiftyTwoWeekLow || 0,
                currency: meta?.currency || 'CAD',
                exchange: meta?.exchangeName || 'TSX',
                volume: meta?.regularMarketVolume || 0,
              })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Failed to fetch quote' }));
          }
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    liveQuoteApiPlugin(),
  ],
});
