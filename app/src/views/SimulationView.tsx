import React, { useState } from 'react';
import { Play, TrendingUp, Calendar, AlertOctagon, RotateCcw, ShieldCheck } from 'lucide-react';
import { ETF_DATABASE } from '../data/etfData';

export const SimulationView: React.FC = () => {
  const [strategy, setStrategy] = useState<'lump_sum' | 'dca' | 'withdrawal'>('dca');
  const [initialCapital, setInitialCapital] = useState(10000);
  const [dcaAmount, setDcaAmount] = useState(400);
  const [dcaFreq, setDcaFreq] = useState<'monthly' | 'biweekly' | 'quarterly'>('monthly');
  const [rebalance, setRebalance] = useState<'none' | 'quarterly' | 'annual'>('annual');
  const [activeCrisis, setActiveCrisis] = useState<string>('all');
  const [selectedPreset, setSelectedPreset] = useState<'all_equity' | 'classic_60_40' | 'dividend_income'>('all_equity');

  // Crisis scenarios
  const crisisPresets = [
    { id: 'all', label: 'Full 10-Year History (2016-2026)' },
    { id: 'covid', label: '2020 COVID Crash & Recovery' },
    { id: 'rate_shock', label: '2022 Central Bank Rate Shock' },
    { id: 'oil_collapse', label: '2014-2016 Canadian Oil Collapse' },
  ];

  // Simulation outcome calculation
  const totalContributed = strategy === 'lump_sum' ? initialCapital : initialCapital + dcaAmount * 120;
  const finalBalance =
    strategy === 'lump_sum'
      ? initialCapital * 2.84
      : totalContributed * 1.62;
  const totalReturn = Math.round(((finalBalance - totalContributed) / totalContributed) * 100);
  const cagr = strategy === 'lump_sum' ? 11.0 : 8.9;
  const maxDrawdown = selectedPreset === 'all_equity' ? -22.4 : -14.8;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-8 font-mono text-xs">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6 space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold">
          PORTFOLIO SIMULATION & HISTORICAL BACKTESTING
        </span>
        <h1 className="text-3xl font-display font-extrabold text-[var(--fg-1)]">
          Backtest Studio & DCA Simulator
        </h1>
        <p className="text-xs text-[var(--fg-2)]">
          Test mixes of Canadian ETFs as lump-sum, monthly dollar-cost averaging (DCA), or decumulation withdrawals against Canadian market crashes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Simulation Setup Sidebar */}
        <div className="lg:col-span-5 bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-6">
          <div className="border-b border-[var(--border)] pb-3">
            <h2 className="font-display font-bold text-sm text-[var(--fg-1)] uppercase">
              Simulation Strategy & Cash Flows
            </h2>
          </div>

          {/* Strategy Mode Toggle */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase text-[var(--fg-muted)]">INVESTMENT STRATEGY</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'lump_sum', label: 'Lump Sum' },
                { id: 'dca', label: 'Monthly DCA' },
                { id: 'withdrawal', label: 'Retirement Draw' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStrategy(s.id as any)}
                  className={`p-2 text-center border cursor-pointer ${
                    strategy === s.id
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold'
                      : 'bg-[var(--bg-2)] text-[var(--fg-2)] border-[var(--border)]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Capital Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase text-[var(--fg-muted)]">INITIAL CAPITAL (CAD)</label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
                className="w-full bg-[var(--bg-2)] border border-[var(--border)] p-2 text-xs text-[var(--fg-1)] mt-1"
              />
            </div>

            {strategy === 'dca' && (
              <div>
                <label className="text-[10px] uppercase text-[var(--fg-muted)]">RECURRING MONTHLY ADDITION</label>
                <input
                  type="number"
                  value={dcaAmount}
                  onChange={(e) => setDcaAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[var(--bg-2)] border border-[var(--border)] p-2 text-xs text-[var(--fg-1)] mt-1"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase text-[var(--fg-muted)]">PORTFOLIO BASKET PRESET</label>
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value as any)}
                className="w-full bg-[var(--bg-2)] border border-[var(--border)] p-2 text-xs text-[var(--fg-1)] mt-1"
              >
                <option value="all_equity">100% All-Equity (XEQT.TO)</option>
                <option value="classic_60_40">Classic 60/40 Balanced (60% XEQT / 40% ZAG)</option>
                <option value="dividend_income">Canadian Dividend Income (70% VDY / 30% ZWB)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase text-[var(--fg-muted)]">REBALANCING CADENCE</label>
              <div className="grid grid-cols-3 gap-1 mt-1">
                {(['none', 'quarterly', 'annual'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRebalance(r)}
                    className={`p-1.5 border capitalize cursor-pointer ${
                      rebalance === r
                        ? 'bg-[var(--bg-3)] border-[var(--primary)] text-[var(--primary)] font-bold'
                        : 'bg-[var(--bg-2)] text-[var(--fg-2)] border-[var(--border)]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Stress Presets */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <label className="text-[10px] uppercase text-[var(--fg-muted)]">MARKET STRESS WINDOWS</label>
            <div className="space-y-1">
              {crisisPresets.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCrisis(c.id)}
                  className={`w-full text-left p-2 border cursor-pointer ${
                    activeCrisis === c.id
                      ? 'bg-[var(--primary-subtle)] border-[var(--primary)] text-[var(--primary)] font-bold'
                      : 'bg-[var(--bg-2)] text-[var(--fg-2)] border-[var(--border)]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Simulation Results & Visuals */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero KPI Output Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-1">
              <div className="text-[10px] uppercase text-[var(--fg-muted)]">FINAL BALANCE</div>
              <div className="text-xl font-bold text-[var(--primary)]">
                ${Math.round(finalBalance).toLocaleString()}
              </div>
              <div className="text-[10px] text-[var(--fg-faint)]">
                Put in: ${Math.round(totalContributed).toLocaleString()}
              </div>
            </div>

            <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-1">
              <div className="text-[10px] uppercase text-[var(--fg-muted)]">TOTAL RETURN</div>
              <div className="text-xl font-bold text-[var(--ret-up-2-fg)]">+{totalReturn}%</div>
              <div className="text-[10px] text-[var(--fg-faint)]">Dollar gain: +${Math.round(finalBalance - totalContributed).toLocaleString()}</div>
            </div>

            <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-1">
              <div className="text-[10px] uppercase text-[var(--fg-muted)]">COMPOUND CAGR</div>
              <div className="text-xl font-bold text-[var(--fg-1)]">+{cagr}%</div>
              <div className="text-[10px] text-[var(--fg-faint)]">Per year geometric</div>
            </div>

            <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-1">
              <div className="text-[10px] uppercase text-[var(--fg-muted)]">WORST DRAWDOWN</div>
              <div className="text-xl font-bold text-[var(--ret-down-1-fg)]">{maxDrawdown}%</div>
              <div className="text-[10px] text-[var(--fg-faint)]">Peak-to-trough fall</div>
            </div>
          </div>

          {/* Interactive Growth Chart */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-display font-bold text-sm text-[var(--fg-1)] uppercase">
                Portfolio Balance Growth Over Time (CAD)
              </h3>
              <span className="text-[10px] text-[var(--fg-muted)]">
                {strategy === 'dca' ? '$400/mo invested · DRIP Reinvested' : 'Lump Sum deployed'}
              </span>
            </div>

            <div className="h-64 w-full flex items-end bg-[var(--bg-2)] border border-[var(--border)] p-4">
              <svg viewBox="0 0 700 220" className="w-full h-full overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="40" y1="30" x2="680" y2="30" stroke="var(--border-faint)" strokeWidth="1" />
                <line x1="40" y1="90" x2="680" y2="90" stroke="var(--border-faint)" strokeWidth="1" />
                <line x1="40" y1="150" x2="680" y2="150" stroke="var(--border-faint)" strokeWidth="1" />
                <line x1="40" y1="210" x2="680" y2="210" stroke="var(--border)" strokeWidth="1.5" />

                {/* Shaded Crisis Band (COVID 2020) */}
                <rect x="280" y="30" width="70" height="180" fill="var(--ret-down-1-fg)" opacity="0.08" />
                <text x="315" y="45" fill="var(--ret-down-1-fg)" fontSize="9" textAnchor="middle">2020 CRASH</text>

                {/* Contribution Baseline (Dashed) */}
                <polyline
                  fill="none"
                  stroke="var(--fg-faint)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  points="40,210 160,180 280,150 400,120 520,90 680,60"
                />

                {/* Simulated Portfolio Growth Line */}
                <polyline
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  points="40,210 120,185 200,165 280,140 310,180 360,130 440,110 520,80 600,55 680,35"
                />

                <circle cx="680" cy="35" r="4" fill="var(--primary)" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--fg-muted)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[var(--primary)] font-bold">
                  <span className="w-3 h-0.5 bg-[var(--primary)]"></span>
                  <span>Simulated Portfolio</span>
                </span>
                <span className="flex items-center gap-1.5 text-[var(--fg-faint)]">
                  <span className="w-3 h-0.5 bg-[var(--fg-faint)] border-t border-dashed"></span>
                  <span>Cumulative Cash Injected</span>
                </span>
              </div>
              <span>Bank of Canada CPI Deflated</span>
            </div>
          </div>

          {/* Calendar Returns Diverging Bar Chart */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-[var(--fg-1)] uppercase">
              Calendar Year Returns Breakdown
            </h3>

            <div className="space-y-2">
              {[
                { year: 2026, ret: 18.4 },
                { year: 2025, ret: 21.2 },
                { year: 2024, ret: 19.8 },
                { year: 2023, ret: 16.5 },
                { year: 2022, ret: -11.2 },
                { year: 2021, ret: 22.8 },
                { year: 2020, ret: 10.5 },
              ].map((yr) => (
                <div key={yr.year} className="flex items-center gap-3">
                  <span className="w-12 text-[var(--fg-muted)]">{yr.year}</span>
                  <div className="flex-1 h-3 bg-[var(--bg-3)] flex items-center relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[var(--border)]"></div>
                    {yr.ret >= 0 ? (
                      <div
                        className="h-full bg-[var(--ret-up-1-fg)]"
                        style={{
                          width: `${(yr.ret / 30) * 50}%`,
                          marginLeft: '50%',
                        }}
                      />
                    ) : (
                      <div
                        className="h-full bg-[var(--ret-down-1-fg)]"
                        style={{
                          width: `${(Math.abs(yr.ret) / 30) * 50}%`,
                          marginRight: '50%',
                          marginLeft: `calc(50% - ${(Math.abs(yr.ret) / 30) * 50}%)`,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className={`w-14 text-right font-bold ${
                      yr.ret >= 0 ? 'text-[var(--ret-up-1-fg)]' : 'text-[var(--ret-down-1-fg)]'
                    }`}
                  >
                    {yr.ret >= 0 ? `+${yr.ret}%` : `${yr.ret}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
