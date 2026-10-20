import React, { useState } from 'react';
import { Search, ArrowRight, ExternalLink, Layers, ShieldCheck, CheckCircle2, Filter, AlertCircle, Info } from 'lucide-react';
import { ETF_DATABASE, ETFSummary } from '../data/etfData';

interface ReverseLookupViewProps {
  onSelectETF: (symbol: string) => void;
  onNavigate: (tab: string, symbol?: string) => void;
}

interface StockMatch {
  etf: ETFSummary;
  holdingSymbol: string;
  holdingName: string;
  weight: number;
  viaETF: string | null;
  sector: string;
  country: string;
}

export const ReverseLookupView: React.FC<ReverseLookupViewProps> = ({ onSelectETF, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('RY.TO');
  const [minWeight, setMinWeight] = useState(0.5);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('All');
  const [coverageSearch, setCoverageSearch] = useState<string[]>(['RY.TO', 'AAPL']);
  const [activeCoverageInput, setActiveCoverageInput] = useState('');

  const quickPicks = [
    { label: 'Royal Bank (RY.TO)', sym: 'RY.TO' },
    { label: 'Shopify (SHOP.TO)', sym: 'SHOP.TO' },
    { label: 'Apple (AAPL)', sym: 'AAPL' },
    { label: 'NVIDIA (NVDA)', sym: 'NVDA' },
    { label: 'Enbridge (ENB.TO)', sym: 'ENB.TO' },
    { label: 'TD Bank (TD.TO)', sym: 'TD.TO' },
    { label: 'Microsoft (MSFT)', sym: 'MSFT' },
  ];

  // Scan all ETFs in database for this holding
  const query = searchTerm.trim().toLowerCase();
  const matches: StockMatch[] = [];

  if (query) {
    ETF_DATABASE.forEach((etf) => {
      if (selectedAssetClass !== 'All' && etf.assetClass !== selectedAssetClass) return;

      etf.holdings.forEach((h) => {
        const symMatch = h.symbol.toLowerCase().includes(query);
        const nameMatch = h.name.toLowerCase().includes(query) || h.displayName.toLowerCase().includes(query);

        if ((symMatch || nameMatch) && h.weight >= minWeight) {
          matches.push({
            etf,
            holdingSymbol: h.symbol,
            holdingName: h.displayName,
            weight: h.weight,
            viaETF: h.viaETF,
            sector: h.sector,
            country: h.country,
          });
        }
      });
    });
  }

  // Sort by effective weight descending
  matches.sort((a, b) => b.weight - a.weight);

  const handleAddCoverageTicker = () => {
    const sym = activeCoverageInput.trim().toUpperCase();
    if (sym && !coverageSearch.includes(sym)) {
      setCoverageSearch([...coverageSearch, sym]);
      setActiveCoverageInput('');
    }
  };

  const handleRemoveCoverageTicker = (sym: string) => {
    setCoverageSearch(coverageSearch.filter((s) => s !== sym));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">
            TOOLKIT // REVERSE STOCK LOOKUP & COVERAGE
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--fg-1)]">
          Who Holds This Stock?
        </h1>
        <p className="font-mono text-sm text-[var(--fg-muted)] mt-2 max-w-3xl">
          Search any individual stock or bond to reverse-engineer which Canadian-listed ETFs hold it, 
          dissolving multi-layer fund-of-funds structures down to direct ownership percentage.
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticker (e.g. RY, AAPL, SHOP, TD, NVDA)..."
              className="w-full pl-11 pr-4 py-3 bg-[var(--bg-0)] border border-[var(--border)] text-[var(--fg-1)] font-mono text-sm placeholder:text-[var(--fg-faint)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--fg-muted)]">Min Weight:</span>
              <select
                value={minWeight}
                onChange={(e) => setMinWeight(parseFloat(e.target.value))}
                className="bg-[var(--bg-0)] border border-[var(--border)] px-3 py-2 text-xs font-mono text-[var(--fg-1)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value={0.1}>&ge; 0.1%</option>
                <option value={0.5}>&ge; 0.5%</option>
                <option value={1.0}>&ge; 1.0%</option>
                <option value={2.0}>&ge; 2.0%</option>
                <option value={5.0}>&ge; 5.0%</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--fg-muted)]">Asset Class:</span>
              <select
                value={selectedAssetClass}
                onChange={(e) => setSelectedAssetClass(e.target.value)}
                className="bg-[var(--bg-0)] border border-[var(--border)] px-3 py-2 text-xs font-mono text-[var(--fg-1)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="All">All Assets</option>
                <option value="Equity">Equity</option>
                <option value="Multi-Asset">Multi-Asset</option>
                <option value="Covered Call">Covered Call</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Pick Tickers */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-faint)]">
          <span className="text-xs font-mono text-[var(--fg-muted)] mr-2">Quick Lookups:</span>
          {quickPicks.map((p) => (
            <button
              key={p.sym}
              onClick={() => setSearchTerm(p.sym)}
              className={`px-2.5 py-1 text-xs font-mono border transition-colors cursor-pointer ${
                searchTerm.toLowerCase() === p.sym.toLowerCase()
                  ? 'bg-[var(--primary)] text-[var(--bg-0)] border-[var(--primary)] font-bold'
                  : 'bg-[var(--bg-0)] border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--primary)] hover:text-[var(--fg-1)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[var(--fg-1)] flex items-center gap-2">
            <span>Matching Canadian ETFs</span>
            <span className="font-mono text-xs px-2 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] text-[var(--primary)]">
              {matches.length} found
            </span>
          </h2>
          <span className="text-xs font-mono text-[var(--fg-muted)]">
            Sorted by Dissolved Weight (%)
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="p-12 text-center bg-[var(--bg-1)] border border-[var(--border)]">
            <AlertCircle className="w-8 h-8 text-[var(--fg-muted)] mx-auto mb-3" />
            <p className="font-mono text-sm text-[var(--fg-muted)]">
              No Canadian ETFs found holding "{searchTerm}" with minimum weight &ge; {minWeight}%.
            </p>
            <p className="text-xs font-mono text-[var(--fg-faint)] mt-1">
              Try adjusting the minimum weight threshold or searching a major constituent like RY, TD, SHOP, AAPL.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-[var(--border)]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase tracking-wider">
                  <th className="py-3 px-4">ETF Symbol & Name</th>
                  <th className="py-3 px-4">Ownership Route</th>
                  <th className="py-3 px-4 text-right">Holding Weight</th>
                  <th className="py-3 px-4 text-right">Weight Visual</th>
                  <th className="py-3 px-4 text-right">AUM</th>
                  <th className="py-3 px-4 text-right">MER</th>
                  <th className="py-3 px-4 text-right">Yield</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-faint)] bg-[var(--bg-0)]">
                {matches.map((m, idx) => (
                  <tr key={`${m.etf.symbol}-${idx}`} className="hover:bg-[var(--bg-1)] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <button
                          onClick={() => onSelectETF(m.etf.symbol)}
                          className="font-bold text-sm text-[var(--primary)] hover:underline text-left cursor-pointer flex items-center gap-1.5"
                        >
                          {m.etf.symbol}
                          <span className="text-[10px] px-1 py-0.2 bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg-muted)] font-normal">
                            {m.etf.exchange}
                          </span>
                        </button>
                        <span className="text-[11px] text-[var(--fg-muted)] truncate max-w-xs">
                          {m.etf.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {m.viaETF ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] text-[var(--accent-2)] text-[10px] font-semibold">
                            INDIRECT
                          </span>
                          <span className="text-[11px] text-[var(--fg-muted)]">
                            via <strong className="text-[var(--fg-1)]">{m.viaETF}</strong>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-[var(--primary)]/10 border border-[var(--primary)]/40 text-[var(--primary)] text-[10px] font-semibold">
                            DIRECT
                          </span>
                          <span className="text-[11px] text-[var(--fg-muted)]">Physical share</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-sm text-[var(--fg-1)]">
                      {m.weight.toFixed(2)}%
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="w-28 ml-auto bg-[var(--bg-2)] h-2 border border-[var(--border-faint)] relative overflow-hidden">
                        <div
                          className="bg-[var(--primary)] h-full transition-all"
                          style={{ width: `${Math.min(100, (m.weight / 15) * 100)}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right text-[var(--fg-muted)]">
                      ${(m.etf.aum / 1000000000).toFixed(2)}B
                    </td>

                    <td className="py-3.5 px-4 text-right text-[var(--fg-muted)]">
                      {(m.etf.mer * 100).toFixed(2)}%
                    </td>

                    <td className="py-3.5 px-4 text-right text-[var(--primary)] font-semibold">
                      {m.etf.yieldTTM.toFixed(2)}%
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectETF(m.etf.symbol)}
                        className="px-2.5 py-1 text-[11px] font-mono border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg-0)] text-[var(--fg-muted)] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        Breakdown <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Look-Through Basket Coverage Checker */}
      <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-faint)] pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--fg-1)] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--primary)]" />
              Look-Through Basket Coverage Engine
            </h3>
            <p className="text-xs font-mono text-[var(--fg-muted)] mt-1">
              Looking to own multiple stocks in a single Canadian ETF? Enter your target tickers to discover which fund maximizes combined coverage.
            </p>
          </div>
        </div>

        {/* Multi-ticker Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={activeCoverageInput}
              onChange={(e) => setActiveCoverageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCoverageTicker()}
              placeholder="Add stock (e.g. SHOP.TO, NVDA)..."
              className="bg-[var(--bg-0)] border border-[var(--border)] px-3 py-1.5 text-xs font-mono text-[var(--fg-1)] focus:outline-none focus:border-[var(--primary)] w-56"
            />
            <button
              onClick={handleAddCoverageTicker}
              className="px-3 py-1.5 bg-[var(--bg-2)] border border-[var(--border)] text-xs font-mono text-[var(--fg-1)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {coverageSearch.map((sym) => (
              <span
                key={sym}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-2)] border border-[var(--primary)] text-xs font-mono text-[var(--fg-1)]"
              >
                <strong>{sym}</strong>
                <button
                  onClick={() => handleRemoveCoverageTicker(sym)}
                  className="text-[var(--fg-muted)] hover:text-[var(--accent-2)] cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Coverage Recommendation Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-[var(--bg-0)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[var(--primary)]">RECOMMENDED 1-FUND SOLUTION</span>
              <span className="text-xs font-mono text-[var(--fg-muted)]">Coverage: 100%</span>
            </div>
            <div className="font-display text-xl font-bold text-[var(--fg-1)]">
              XEQT.TO &bull; iShares Core Equity ETF
            </div>
            <p className="text-xs font-mono text-[var(--fg-muted)]">
              Holds both <strong className="text-[var(--fg-1)]">RY.TO (3.42%)</strong> via XIC and <strong className="text-[var(--fg-1)]">AAPL (2.91%)</strong> via XTOT.
              Total basket weight dissolved: <strong>6.33%</strong> with 0 single-stock execution commission.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onSelectETF('XEQT.TO')}
                className="px-3 py-1.5 bg-[var(--primary)] text-[var(--bg-0)] font-mono text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Inspect XEQT Dissolution &rarr;
              </button>
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-0)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[var(--fg-muted)]">DIRECT CONCENTRATED ALTERNATIVE</span>
              <span className="text-xs font-mono text-[var(--fg-muted)]">Coverage: 50%</span>
            </div>
            <div className="font-display text-xl font-bold text-[var(--fg-1)]">
              VDY.TO &bull; Vanguard Canadian High Dividend
            </div>
            <p className="text-xs font-mono text-[var(--fg-muted)]">
              Holds <strong className="text-[var(--fg-1)]">RY.TO (13.80%)</strong> directly with high yield, but zero US tech exposure (AAPL excluded).
            </p>
            <div className="pt-2">
              <button
                onClick={() => onSelectETF('VDY.TO')}
                className="px-3 py-1.5 border border-[var(--border)] text-[var(--fg-muted)] font-mono text-xs hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                Inspect VDY Dissolution &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
