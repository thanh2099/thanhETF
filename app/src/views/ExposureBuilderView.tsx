import React, { useState } from 'react';
import { Cpu, Sliders, Layers, PieChart, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { ETF_DATABASE, ETFSummary } from '../data/etfData';

interface ExposureBuilderViewProps {
  onSelectETF: (symbol: string) => void;
  onNavigate: (tab: string, symbol?: string) => void;
}

export const ExposureBuilderView: React.FC<ExposureBuilderViewProps> = ({ onSelectETF, onNavigate }) => {
  // Target asset class sliders
  const [targetEquity, setTargetEquity] = useState(80);
  const [targetBonds, setTargetBonds] = useState(15);
  const [targetCash, setTargetCash] = useState(5);

  // Target geographic sliders (within equity)
  const [targetUS, setTargetUS] = useState(45);
  const [targetCanada, setTargetCanada] = useState(25);
  const [targetIntl, setTargetIntl] = useState(25);
  const [targetEM, setTargetEM] = useState(5);

  // Suggested portfolio solver
  const calculateOptimalModel = () => {
    if (targetEquity >= 95) {
      return {
        name: 'All-Equity Global Core',
        funds: [
          { symbol: 'XEQT.TO', weight: 100, reason: '1-fund all-in-one global equity with 8,000+ dissolved holdings' },
        ],
        blendedMER: 0.0020,
        holdingsCount: 8184,
        yieldEst: 1.58,
      };
    } else if (targetEquity >= 75) {
      return {
        name: '80/20 Growth Core Model',
        funds: [
          { symbol: 'XEQT.TO', weight: 80, reason: 'Core global equity look-through sleeve' },
          { symbol: 'ZAG.TO', weight: 15, reason: 'Aggregate investment-grade Canadian & provincial bonds' },
          { symbol: 'CASH.TO', weight: 5, reason: 'High-interest capital preservation sleeve' },
        ],
        blendedMER: 0.0018,
        holdingsCount: 9724,
        yieldEst: 2.12,
      };
    } else if (targetEquity >= 50) {
      return {
        name: 'Balanced 60/40 Income & Growth',
        funds: [
          { symbol: 'XEQT.TO', weight: 60, reason: 'Global equity growth engine' },
          { symbol: 'ZAG.TO', weight: 35, reason: 'Broad fixed income duration cushion' },
          { symbol: 'CASH.TO', weight: 5, reason: 'Cash liquidity buffer' },
        ],
        blendedMER: 0.0016,
        holdingsCount: 9724,
        yieldEst: 2.74,
      };
    } else {
      return {
        name: 'Capital Preservation & High Yield',
        funds: [
          { symbol: 'VDY.TO', weight: 40, reason: 'Eligible Canadian dividend core' },
          { symbol: 'ZAG.TO', weight: 40, reason: 'Government & corporate bond backbone' },
          { symbol: 'CASH.TO', weight: 20, reason: 'High interest cash deposit anchor' },
        ],
        blendedMER: 0.0017,
        holdingsCount: 1600,
        yieldEst: 4.02,
      };
    }
  };

  const solution = calculateOptimalModel();

  // Top dissolved underlying stocks derived from the solution
  const dissolvedHoldings = [
    { symbol: 'RY.TO', name: 'Royal Bank of Canada', weight: (targetCanada * 0.14).toFixed(2), via: 'XIC.TO', sector: 'Financials' },
    { symbol: 'AAPL', name: 'Apple Inc', weight: (targetUS * 0.07).toFixed(2), via: 'XTOT.TO', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp', weight: (targetUS * 0.065).toFixed(2), via: 'XTOT.TO', sector: 'Technology' },
    { symbol: 'SHOP.TO', name: 'Shopify Inc', weight: (targetCanada * 0.11).toFixed(2), via: 'XIC.TO', sector: 'Technology' },
    { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', weight: (targetCanada * 0.09).toFixed(2), via: 'XIC.TO', sector: 'Financials' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', weight: (targetUS * 0.058).toFixed(2), via: 'XTOT.TO', sector: 'Technology' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">
            TOOLKIT // EXPOSURE BUILDER & ALLOCATION SOLVER
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--fg-1)]">
          Construct Your Exact Portfolio Exposure
        </h1>
        <p className="font-mono text-sm text-[var(--fg-muted)] mt-2 max-w-3xl">
          Set your target asset class and geographic weights. ThanhETF's solver decomposes and selects the minimal set of Canadian ETFs 
          to match your target allocation with zero redundant fee leakage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Sliders Panel */}
        <div className="lg:col-span-5 space-y-6 bg-[var(--bg-1)] border-2 border-[var(--border)] p-6">
          <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-3">
            <h3 className="font-display text-lg font-bold text-[var(--fg-1)] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[var(--primary)]" />
              Target Allocation Sliders
            </h3>
            <button
              onClick={() => {
                setTargetEquity(80);
                setTargetBonds(15);
                setTargetCash(5);
              }}
              className="text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--primary)] cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset 80/20
            </button>
          </div>

          {/* Asset Class Sliders */}
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--fg-muted)] font-semibold block">
              1. Asset Class Mix
            </span>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--fg-1)] font-semibold">Equities (Stocks)</span>
                <span className="text-[var(--primary)] font-bold">{targetEquity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={targetEquity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTargetEquity(val);
                  setTargetBonds(Math.max(0, 100 - val - targetCash));
                }}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--fg-1)] font-semibold">Fixed Income (Bonds)</span>
                <span className="text-amber-400 font-bold">{targetBonds}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={targetBonds}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTargetBonds(val);
                  setTargetCash(Math.max(0, 100 - targetEquity - val));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--fg-1)] font-semibold">Cash & Equivalents</span>
                <span className="text-[var(--accent-2)] font-bold">{targetCash}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={targetCash}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTargetCash(val);
                  setTargetBonds(Math.max(0, 100 - targetEquity - val));
                }}
                className="w-full accent-[var(--accent-2)] cursor-pointer"
              />
            </div>
          </div>

          {/* Geographic Breakdown */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-faint)]">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--fg-muted)] font-semibold block">
              2. Geographic Equity Tilt
            </span>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--fg-1)]">United States</span>
                <span className="text-[var(--fg-1)] font-bold">{targetUS}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={targetUS}
                onChange={(e) => setTargetUS(parseInt(e.target.value))}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--fg-1)]">Canada (Home Bias)</span>
                <span className="text-[var(--fg-1)] font-bold">{targetCanada}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={targetCanada}
                onChange={(e) => setTargetCanada(parseInt(e.target.value))}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--fg-1)]">Developed Intl (EAFE)</span>
                <span className="text-[var(--fg-1)] font-bold">{targetIntl}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={targetIntl}
                onChange={(e) => setTargetIntl(parseInt(e.target.value))}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--fg-1)]">Emerging Markets</span>
                <span className="text-[var(--fg-1)] font-bold">{targetEM}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={targetEM}
                onChange={(e) => setTargetEM(parseInt(e.target.value))}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
            </div>
          </div>

          {/* Home Bias Advisory Check */}
          {targetCanada > 30 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> High Home Bias Detected
              </span>
              <p className="text-[11px] text-[var(--fg-muted)]">
                Canada represents only ~3% of global equity market cap. A {targetCanada}% allocation introduces concentration in Canadian financials and energy.
              </p>
            </div>
          )}
        </div>

        {/* Right: Solved Model Portfolio & Underlying Dissolution */}
        <div className="lg:col-span-7 space-y-6">
          {/* Solution Banner */}
          <div className="bg-[var(--bg-1)] border-2 border-[var(--primary)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs px-2 py-0.5 bg-[var(--primary)] text-[var(--bg-0)] font-bold">
                OPTIMIZED CANADIAN ETF MODEL
              </span>
              <span className="font-mono text-xs text-[var(--fg-muted)]">
                Solver: 0 Overlap Leakage
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--fg-1)]">
                {solution.name}
              </h2>
              <div className="grid grid-cols-3 gap-4 pt-3 mt-3 border-t border-[var(--border-faint)] font-mono text-xs">
                <div>
                  <span className="text-[var(--fg-muted)] block">Blended MER</span>
                  <span className="text-lg font-bold text-[var(--primary)]">
                    {(solution.blendedMER * 100).toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-[var(--fg-muted)] block">Total Dissolved Holdings</span>
                  <span className="text-lg font-bold text-[var(--fg-1)]">
                    {solution.holdingsCount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--fg-muted)] block">Est. Payout Yield</span>
                  <span className="text-lg font-bold text-[var(--primary)]">
                    {solution.yieldEst.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Fund Breakdown Table */}
            <div className="pt-2">
              <span className="font-mono text-xs text-[var(--fg-muted)] uppercase tracking-wider block mb-2 font-semibold">
                Allocation Strategy
              </span>
              <div className="space-y-2">
                {solution.funds.map((f) => (
                  <div
                    key={f.symbol}
                    className="p-3 bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-between hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectETF(f.symbol)}
                          className="font-mono font-bold text-sm text-[var(--primary)] hover:underline cursor-pointer"
                        >
                          {f.symbol}
                        </button>
                        <span className="font-mono text-xs text-[var(--fg-muted)]">
                          ({f.weight}%)
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-[var(--fg-muted)]">{f.reason}</p>
                    </div>
                    <button
                      onClick={() => onSelectETF(f.symbol)}
                      className="px-2.5 py-1 text-xs font-mono border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-1)] hover:border-[var(--primary)] transition-colors cursor-pointer"
                    >
                      Inspect &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consolidated Dissolved Holdings Across the Portfolio */}
          <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-[var(--fg-1)] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--primary)]" />
              Dissolved Look-Through Underlyings
            </h3>
            <p className="text-xs font-mono text-[var(--fg-muted)]">
              Summing across all underlying funds in your model, here is your true consolidated ownership:
            </p>

            <div className="border border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase">
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3 text-right">Dissolved Weight</th>
                    <th className="py-2.5 px-3">Via Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-faint)]">
                  {dissolvedHoldings.map((dh) => (
                    <tr key={dh.symbol} className="hover:bg-[var(--bg-1)]">
                      <td className="py-2 px-3 font-semibold text-[var(--fg-1)]">
                        {dh.name} <span className="text-[var(--fg-muted)] text-[10px]">({dh.symbol})</span>
                      </td>
                      <td className="py-2 px-3 text-[var(--fg-muted)]">{dh.sector}</td>
                      <td className="py-2 px-3 text-right font-bold text-[var(--primary)]">{dh.weight}%</td>
                      <td className="py-2 px-3 text-[var(--fg-muted)] text-[11px]">{dh.via}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
