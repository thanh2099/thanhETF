import React, { useState } from 'react';
import { DollarSign, ShieldAlert, TrendingUp, Info, Calendar, ArrowRight, ArrowLeftRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { ETF_DATABASE, ETFSummary } from '../data/etfData';

interface DividendHubViewProps {
  onSelectETF: (symbol: string) => void;
  onNavigate: (tab: string, symbol?: string) => void;
  initialSubTab?: 'yield' | 'covered_calls';
}

export const DividendHubView: React.FC<DividendHubViewProps> = ({
  onSelectETF,
  onNavigate,
  initialSubTab = 'yield',
}) => {
  const [activeTab, setActiveTab] = useState<'yield' | 'covered_calls' | 'calendar'>(initialSubTab);
  const [yieldCategory, setYieldCategory] = useState<string>('All');
  const [selectedTwin, setSelectedTwin] = useState<'banks' | 'sp500'>('banks');

  // Yield Hub Subcategories
  const categories = [
    { id: 'All', label: 'All Yield Funds' },
    { id: 'Stocks', label: 'Dividend Stocks' },
    { id: 'Covered Call', label: 'Covered Calls' },
    { id: 'Cash', label: 'High Interest Cash' },
    { id: 'Bonds', label: 'Fixed Income Bonds' },
  ];

  const yieldETFs = ETF_DATABASE.filter((etf) => {
    if (yieldCategory === 'All') return etf.yieldTTM > 1.0;
    if (yieldCategory === 'Stocks') return etf.assetClass === 'Equity' && etf.yieldTTM >= 3.0;
    if (yieldCategory === 'Covered Call') return etf.strategy === 'covered_call';
    if (yieldCategory === 'Cash') return etf.assetClass === 'Cash';
    if (yieldCategory === 'Bonds') return etf.assetClass === 'Fixed Income';
    return true;
  });

  // Twin comparison presets
  const twinA = ETF_DATABASE.find((e) => e.symbol === 'ZWB.TO') || ETF_DATABASE[3]; // Covered Call Banks
  const twinB = ETF_DATABASE.find((e) => e.symbol === 'ZEB.TO') || ETF_DATABASE[4]; // Plain Banks

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-10">
      {/* Masthead */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">
              SPECIALTY HUB // INCOME, DISTRIBUTIONS & OPTIONS
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--fg-1)]">
            Canadian Yield & Covered Call Hub
          </h1>
          <p className="font-mono text-sm text-[var(--fg-muted)] mt-2 max-w-2xl">
            Analyze true cash distributions, uncover covered call upside caps vs downside capture, and inspect CRA T3 tax classification.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center border border-[var(--border)] p-1 bg-[var(--bg-1)] self-start md:self-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('yield')}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === 'yield'
                ? 'bg-[var(--primary)] text-[var(--bg-0)] font-bold'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
            }`}
          >
            Yield Hub
          </button>
          <button
            onClick={() => setActiveTab('covered_calls')}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === 'covered_calls'
                ? 'bg-[var(--primary)] text-[var(--bg-0)] font-bold'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
            }`}
          >
            Covered Call Comparator
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-[var(--primary)] text-[var(--bg-0)] font-bold'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
            }`}
          >
            Distribution Calendar
          </button>
        </div>
      </div>

      {/* TAB 1: YIELD HUB */}
      {activeTab === 'yield' && (
        <div className="space-y-8">
          {/* Subcategory Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setYieldCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-mono border transition-colors cursor-pointer ${
                  yieldCategory === c.id
                    ? 'bg-[var(--primary)] text-[var(--bg-0)] border-[var(--primary)] font-bold'
                    : 'bg-[var(--bg-1)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-1)] hover:border-[var(--border-muted)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* CDIC Warning Alert if Cash category or All */}
          {(yieldCategory === 'Cash' || yieldCategory === 'All') && (
            <div className="p-4 bg-[var(--bg-1)] border-l-4 border-amber-500 border-t border-r border-b border-[var(--border)] flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs font-mono space-y-1">
                <span className="font-bold text-[var(--fg-1)]">
                  CRA & Regulatory Disclosure: High Interest Savings ETFs (CASH.TO, PSA.TO)
                </span>
                <p className="text-[var(--fg-muted)]">
                  Unlike conventional bank GICs or savings accounts, Canadian Cash ETFs are <strong>NOT insured by the Canada Deposit Insurance Corporation (CDIC)</strong>.
                  Assets are held as institutional deposits at Schedule 1 Canadian chartered banks. Yields float daily with Bank of Canada policy rate adjustments.
                </p>
              </div>
            </div>
          )}

          {/* Yield Table */}
          <div className="border-2 border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase tracking-wider">
                  <th className="py-3 px-4">Ticker & Fund Name</th>
                  <th className="py-3 px-4">Asset Class</th>
                  <th className="py-3 px-4">Strategy</th>
                  <th className="py-3 px-4 text-right">Trailing Yield</th>
                  <th className="py-3 px-4 text-right">Frequency</th>
                  <th className="py-3 px-4 text-right">MER</th>
                  <th className="py-3 px-4 text-right">1Y Total Return</th>
                  <th className="py-3 px-4 text-center">Tax Character (T3)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-faint)]">
                {yieldETFs.map((etf) => (
                  <tr key={etf.symbol} className="hover:bg-[var(--bg-1)] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <button
                          onClick={() => onSelectETF(etf.symbol)}
                          className="font-bold text-sm text-[var(--primary)] hover:underline text-left cursor-pointer"
                        >
                          {etf.symbol}
                        </button>
                        <span className="text-[11px] text-[var(--fg-muted)] truncate max-w-xs">{etf.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--fg-muted)]">{etf.assetClass}</td>
                    <td className="py-3.5 px-4">
                      {etf.strategy === 'covered_call' ? (
                        <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/10 border border-amber-500/40 text-amber-400 font-semibold">
                          Covered Call
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg-muted)]">
                          Standard Plain
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-sm text-[var(--primary)]">
                      {etf.yieldTTM.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-[var(--fg-1)]">{etf.distributionFreq}</td>
                    <td className="py-3.5 px-4 text-right text-[var(--fg-muted)]">{(etf.mer * 100).toFixed(2)}%</td>
                    <td className={`py-3.5 px-4 text-right font-semibold ${etf.return1Y >= 0 ? 'text-[var(--primary)]' : 'text-[var(--accent-2)]'}`}>
                      {etf.return1Y >= 0 ? `+${etf.return1Y.toFixed(1)}%` : `${etf.return1Y.toFixed(1)}%`}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 text-[10px]">
                        <span className="px-1 bg-[var(--bg-2)] text-[var(--primary)] border border-[var(--border)]" title="Eligible Dividend">
                          Div: {(etf.taxCharacter.eligibleDiv * 100).toFixed(0)}%
                        </span>
                        <span className="px-1 bg-[var(--bg-2)] text-amber-400 border border-[var(--border)]" title="Return of Capital">
                          ROC: {(etf.taxCharacter.roc * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectETF(etf.symbol)}
                        className="px-2.5 py-1 text-[11px] font-mono border border-[var(--border)] hover:border-[var(--primary)] text-[var(--fg-muted)] hover:text-[var(--fg-1)] transition-colors cursor-pointer"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COVERED CALL COMPARATOR */}
      {activeTab === 'covered_calls' && (
        <div className="space-y-8">
          <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-faint)] pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--fg-1)]">
                  The Covered Call Reality Check: Yield vs Total Return
                </h3>
                <p className="text-xs font-mono text-[var(--fg-muted)] mt-1">
                  Comparing covered call versions against their underlying plain ETF twins to reveal call drag, NAV caps, and asymmetric downside capture.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[var(--fg-muted)]">Benchmark Twin:</span>
                <span className="px-2.5 py-1 bg-[var(--bg-2)] border border-[var(--primary)] text-[var(--fg-1)] font-bold">
                  Canadian Big 6 Banks (ZWB vs ZEB)
                </span>
              </div>
            </div>

            {/* Twin Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* ETF A: Covered Call */}
              <div className="bg-[var(--bg-0)] border-2 border-amber-500/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    COVERED CALL STRATEGY
                  </span>
                  <span className="text-xs font-mono text-[var(--fg-muted)]">Overlay: ~33% written</span>
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-[var(--fg-1)]">{twinA.symbol}</h4>
                  <p className="text-xs font-mono text-[var(--fg-muted)]">{twinA.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-faint)] font-mono text-xs">
                  <div>
                    <span className="text-[var(--fg-muted)] block">Distribution Yield</span>
                    <span className="text-xl font-bold text-[var(--primary)]">{twinA.yieldTTM.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">1Y Total Return</span>
                    <span className="text-xl font-bold text-[var(--fg-1)]">+{twinA.return1Y.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">Management Expense (MER)</span>
                    <span className="font-semibold text-[var(--fg-1)]">{(twinA.mer * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">Upside Capture</span>
                    <span className="font-semibold text-amber-400">68%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">Downside Capture</span>
                    <span className="font-semibold text-[var(--accent-2)]">94%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">Payout Mechanism</span>
                    <span className="font-semibold text-[var(--fg-1)]">Monthly Cash</span>
                  </div>
                </div>
              </div>

              {/* ETF B: Plain Underlying */}
              <div className="bg-[var(--bg-0)] border-2 border-[var(--primary)]/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 bg-[var(--primary)]/20 text-[var(--primary)] font-bold border border-[var(--primary)]/30">
                    PLAIN BENCHMARK TWIN
                  </span>
                  <span className="text-xs font-mono text-[var(--fg-muted)]">No Options Overlay</span>
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-[var(--fg-1)]">{twinB.symbol}</h4>
                  <p className="text-xs font-mono text-[var(--fg-muted)]">{twinB.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-faint)] font-mono text-xs">
                  <div>
                    <span className="text-[var(--fg-muted)] block">Distribution Yield</span>
                    <span className="text-xl font-bold text-[var(--primary)]">{twinB.yieldTTM.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">1Y Total Return</span>
                    <span className="text-xl font-bold text-[var(--primary)]">+{twinB.return1Y.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">Management Expense (MER)</span>
                    <span className="font-semibold text-[var(--fg-1)]">{(twinB.mer * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">Upside Capture</span>
                    <span className="font-semibold text-[var(--primary)]">100% (Uncapped)</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">Downside Capture</span>
                    <span className="font-semibold text-[var(--fg-muted)]">100%</span>
                  </div>
                  <div>
                    <span className="text-[var(--fg-muted)] block">Payout Mechanism</span>
                    <span className="font-semibold text-[var(--fg-1)]">Monthly Cash</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Gap Analysis */}
            <div className="p-4 bg-[var(--bg-2)] border border-[var(--border)] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--fg-1)]">The 1-Year Performance Gap:</span>
                <span className="text-[var(--accent-2)] font-bold">-6.0% Total Return Gap</span>
              </div>
              <p className="text-[var(--fg-muted)]">
                While <strong>ZWB.TO</strong> yielded 7.20% cash vs 4.80% for <strong>ZEB.TO</strong>, the plain fund ZEB generated <strong>+18.4%</strong> total return 
                compared to ZWB's <strong>+12.4%</strong>. The written call options capped capital appreciation during strong bull runs while providing negligible downside protection during drops.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISTRIBUTION CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="p-4 bg-[var(--bg-1)] border border-[var(--border)] flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--fg-muted)]">
              Showing upcoming and recent distribution schedules for Canadian funds
            </span>
            <span className="font-mono text-xs text-[var(--primary)]">
              CRA T3 Distribution Character Tracked
            </span>
          </div>

          <div className="border-2 border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase tracking-wider">
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Ex-Dividend Date</th>
                  <th className="py-3 px-4">Record Date</th>
                  <th className="py-3 px-4">Pay Date</th>
                  <th className="py-3 px-4 text-right">Est. Cash Per Unit</th>
                  <th className="py-3 px-4 text-center">Safety Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-faint)]">
                {[
                  { sym: 'VDY.TO', freq: 'Monthly', ex: '2026-10-28', rec: '2026-10-29', pay: '2026-11-06', cash: '$0.1850', safety: 'High (All Canadian Divs)' },
                  { sym: 'ZWB.TO', freq: 'Monthly', ex: '2026-10-29', rec: '2026-10-30', pay: '2026-11-05', cash: '$0.1200', safety: 'Moderate (ROC component)' },
                  { sym: 'CASH.TO', freq: 'Monthly', ex: '2026-10-30', rec: '2026-10-31', pay: '2026-11-08', cash: '$0.1780', safety: 'High (Interest Income)' },
                  { sym: 'XEQT.TO', freq: 'Quarterly', ex: '2026-12-29', rec: '2026-12-30', pay: '2027-01-08', cash: '$0.1420', safety: 'Very High (Organic Global Divs)' },
                  { sym: 'VFV.TO', freq: 'Quarterly', ex: '2026-12-28', rec: '2026-12-29', pay: '2027-01-07', cash: '$0.3810', safety: 'Very High (S&P 500 Divs)' },
                ].map((row) => (
                  <tr key={row.sym} className="hover:bg-[var(--bg-1)] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--primary)] cursor-pointer" onClick={() => onSelectETF(row.sym)}>
                      {row.sym}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--fg-muted)]">{row.freq}</td>
                    <td className="py-3.5 px-4 text-[var(--fg-1)]">{row.ex}</td>
                    <td className="py-3.5 px-4 text-[var(--fg-muted)]">{row.rec}</td>
                    <td className="py-3.5 px-4 text-[var(--primary)] font-semibold">{row.pay}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--fg-1)]">{row.cash}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] text-[10px] text-[var(--fg-muted)]">
                        {row.safety}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
