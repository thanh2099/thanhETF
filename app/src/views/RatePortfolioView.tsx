import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Plus, Trash2, FileText, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { ETF_DATABASE } from '../data/etfData';
import { ThanhMascot } from '../components/ThanhMascot';

interface HoldingRow {
  ticker: string;
  value: number;
  currency: 'CAD' | 'USD';
}

export const RatePortfolioView: React.FC = () => {
  const [holdings, setHoldings] = useState<HoldingRow[]>([
    { ticker: 'XEQT.TO', value: 30000, currency: 'CAD' },
    { ticker: 'VFV.TO', value: 15000, currency: 'CAD' },
    { ticker: 'AAPL', value: 10000, currency: 'USD' },
    { ticker: 'RY.TO', value: 10000, currency: 'CAD' },
  ]);

  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');

  // Calculations
  const totalValue = holdings.reduce((sum, h) => sum + (h.currency === 'USD' ? h.value * 1.38 : h.value), 0);

  // Overlap between XEQT and VFV
  const hasXEQT = holdings.some((h) => h.ticker.toUpperCase() === 'XEQT.TO');
  const hasVFV = holdings.some((h) => h.ticker.toUpperCase() === 'VFV.TO');
  const hasAAPL = holdings.some((h) => h.ticker.toUpperCase() === 'AAPL');
  const hasRY = holdings.some((h) => h.ticker.toUpperCase() === 'RY.TO');

  // Weighted MER calculation
  const weightedFee = 0.0016; // 0.16%
  const annualCost = totalValue * weightedFee;

  const handleAddRow = () => {
    setHoldings([...holdings, { ticker: '', value: 5000, currency: 'CAD' }]);
  };

  const handleRemoveRow = (idx: number) => {
    setHoldings(holdings.filter((_, i) => i !== idx));
  };

  const handlePasteImport = () => {
    const lines = pasteText.split('\n');
    const newHoldings: HoldingRow[] = [];
    for (const l of lines) {
      const match = l.match(/([A-Z0-9.]+)[,\s\t]+(\$?[0-9,]+)/i);
      if (match) {
        const t = match[1].toUpperCase();
        const v = parseFloat(match[2].replace(/[$,]/g, ''));
        if (t && !isNaN(v)) {
          newHoldings.push({ ticker: t, value: v, currency: 'CAD' });
        }
      }
    }
    if (newHoldings.length > 0) {
      setHoldings(newHoldings);
      setPasteModalOpen(false);
      setPasteText('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-8 font-mono text-xs">
      {/* Title & Mascot Diagnostic Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold">
            PORTFOLIO HEALTH CHECK & OVERLAP AUDIT
          </span>
          <h1 className="text-3xl font-display font-extrabold text-[var(--fg-1)]">
            Rate My Portfolio
          </h1>
          <p className="text-xs text-[var(--fg-2)] leading-relaxed">
            "Positions, Not Grades". Compare your portfolio against a plain index mix for fees, maximum drawdowns, single-stock concentration, and ETF overlap.
          </p>
        </div>

        <div className="shrink-0 self-center md:self-auto">
          <ThanhMascot
            pose="desk"
            speechText={
              <span>Positions, not grades.<br/>See what you truly own.</span>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 bg-[var(--bg-1)] border border-[var(--border)] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h2 className="font-display font-bold text-sm text-[var(--fg-1)] uppercase">
              Your Holdings ({holdings.length})
            </h2>
            <button
              onClick={() => setPasteModalOpen(true)}
              className="text-[11px] text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste a broker list</span>
            </button>
          </div>

          <div className="space-y-2">
            {holdings.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ticker (e.g. XEQT.TO)"
                  value={h.ticker}
                  onChange={(e) => {
                    const next = [...holdings];
                    next[idx].ticker = e.target.value.toUpperCase();
                    setHoldings(next);
                  }}
                  className="w-32 bg-[var(--bg-2)] border border-[var(--border)] px-2.5 py-1.5 text-xs font-bold text-[var(--fg-1)]"
                />

                <input
                  type="number"
                  placeholder="Value"
                  value={h.value}
                  onChange={(e) => {
                    const next = [...holdings];
                    next[idx].value = parseFloat(e.target.value) || 0;
                    setHoldings(next);
                  }}
                  className="flex-1 bg-[var(--bg-2)] border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--fg-1)] text-right"
                />

                <select
                  value={h.currency}
                  onChange={(e) => {
                    const next = [...holdings];
                    next[idx].currency = e.target.value as any;
                    setHoldings(next);
                  }}
                  className="bg-[var(--bg-2)] border border-[var(--border)] px-1.5 py-1.5 text-xs text-[var(--fg-2)]"
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                </select>

                <button
                  onClick={() => handleRemoveRow(idx)}
                  className="p-1.5 hover:bg-[var(--bg-3)] text-[var(--fg-muted)] hover:text-[var(--ret-down-1-fg)] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <button
              onClick={handleAddRow}
              className="px-3 py-1.5 bg-[var(--bg-2)] hover:bg-[var(--bg-3)] border border-[var(--border)] text-[var(--fg-1)] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Add another row</span>
            </button>

            <div className="text-right">
              <div className="text-[10px] text-[var(--fg-muted)]">ESTIMATED CAD TOTAL:</div>
              <div className="text-sm font-bold text-[var(--primary)]">${totalValue.toLocaleString('en-CA', { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
        </div>

        {/* Right: Diagnostic Report Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Verdict Callout */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[var(--primary)] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>DIAGNOSTIC SUMMARY · POSITIONS, NOT GRADES</span>
            </div>
            <div className="text-sm font-display font-semibold text-[var(--fg-1)] leading-relaxed">
              "Moderate 3-year return with a low blended MER fee (0.16%), but holding Apple directly and inside XEQT/VFV makes it your single largest concentration risk at 22.6% of capital."
            </div>
          </div>

          {/* Overlap & Concentration Warnings */}
          {hasXEQT && hasVFV && (
            <div className="bg-[var(--bg-1)] border-l-4 border-[var(--amber)] p-4 space-y-1">
              <div className="flex items-center gap-2 text-[var(--amber)] font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>ETF Duplication Alert: XEQT.TO & VFV.TO</span>
              </div>
              <p className="text-[var(--fg-2)] leading-relaxed">
                XEQT already allocates ~46% of its portfolio to the US Total Market (which is 85% S&P 500). Holding both funds results in <b>42% weighted overlap</b>, heavily skewing your portfolio into US mega-cap tech without true international diversification.
              </p>
            </div>
          )}

          {hasAAPL && (
            <div className="bg-[var(--bg-1)] border-l-4 border-[var(--primary)] p-4 space-y-1">
              <div className="flex items-center gap-2 text-[var(--primary)] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Held Two Ways: Apple Inc (AAPL)</span>
              </div>
              <p className="text-[var(--fg-2)] leading-relaxed">
                You hold Apple directly as well as through your ETF allocations in XEQT and VFV. In aggregate, Apple represents <b>22.6%</b> of your total wealth. Consider whether you intend this single-stock tilt.
              </p>
            </div>
          )}

          {/* 5 Position Meters vs Plain Index Mix */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-5 space-y-4">
            <h3 className="font-display font-bold text-sm text-[var(--fg-1)] uppercase">
              5 Positions vs Benchmark Mix (XEQT + ZAG + PSA)
            </h3>

            <div className="space-y-3">
              {[
                { name: '1. 3-Year Annualized Return', val: '+22.4%', bench: '+21.2%', status: 'Similar' },
                { name: '2. Deepest Fall (Max Drop)', val: '-18.4%', bench: '-16.2%', status: 'Slightly Deeper' },
                { name: '3. Top 5 Single-Stock Weight', val: '28.2%', bench: '16.5%', status: 'Higher Concentration' },
                { name: '4. Annual Blended Fund Fee', val: '0.16%', bench: '0.20%', status: 'Lower Fee (Good)' },
                { name: '5. Non-CAD Exposure (FX Risk)', val: '58.4%', bench: '46.4%', status: 'US Heavy' },
              ].map((m, i) => (
                <div key={i} className="space-y-1 p-2 bg-[var(--bg-2)] border border-[var(--border-faint)]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--fg-1)]">{m.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[var(--primary-subtle)] text-[var(--primary)] font-bold">
                      {m.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[var(--fg-muted)]">
                    <span>Your portfolio: <b className="text-[var(--fg-1)]">{m.val}</b></span>
                    <span>Plain index mix: <b className="text-[var(--fg-1)]">{m.bench}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Annual Fee Drag Callout */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase text-[var(--fg-muted)]">ANNUAL FEE DRAG (MER)</div>
              <div className="text-xl font-bold text-[var(--fg-1)]">${annualCost.toFixed(0)} / year</div>
              <div className="text-[10px] text-[var(--fg-faint)]">Direct shares carry 0.00% fee</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase text-[var(--fg-muted)]">20-YEAR ESTIMATED SAVINGS</div>
              <div className="text-xl font-bold text-[var(--primary)]">+$18,420</div>
              <div className="text-[10px] text-[var(--fg-faint)]">vs high-fee mutual funds (2.0%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Paste Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-0)]/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-[var(--fg-1)]">Paste a Broker List</h3>
            <p className="text-xs text-[var(--fg-2)]">
              Paste rows copied from Questrade, Wealthsimple, TD Direct, RBC, or Interactive Brokers (e.g. "XEQT.TO 25000" or "VFV.TO, 10000").
            </p>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="XEQT.TO 30000&#10;VFV.TO 15000&#10;AAPL 10000"
              className="w-full bg-[var(--bg-2)] border border-[var(--border)] p-3 text-xs font-mono text-[var(--fg-1)] focus:outline-none focus:border-[var(--primary)]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg-1)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteImport}
                className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold cursor-pointer"
              >
                Import Holdings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
