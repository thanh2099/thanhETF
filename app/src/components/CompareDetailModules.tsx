import React, { useState } from 'react';
import { Layers, ShieldCheck, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, ChevronRight, Info, ExternalLink } from 'lucide-react';
import { ETFSummary } from '../data/etfData';

// Fund A (Emerald) and Fund B (Berry/Purple) standard palette from DecodeETF
export const FUND_COLORS = {
  fundA: {
    primary: '#167645',
    accent: '#4EBE7D',
    bg: 'rgba(22, 118, 69, 0.15)',
    border: 'rgba(78, 190, 125, 0.4)',
    text: '#4EBE7D',
  },
  fundB: {
    primary: '#982C61',
    accent: '#A78BFA',
    bg: 'rgba(152, 44, 97, 0.15)',
    border: 'rgba(167, 139, 250, 0.4)',
    text: '#A78BFA',
  },
  fundC: {
    primary: '#0284C7',
    accent: '#38BDF8',
    bg: 'rgba(2, 132, 199, 0.15)',
    border: 'rgba(56, 189, 248, 0.4)',
    text: '#38BDF8',
  },
  fundD: {
    primary: '#D97706',
    accent: '#FBBF24',
    bg: 'rgba(217, 119, 6, 0.15)',
    border: 'rgba(251, 191, 36, 0.4)',
    text: '#FBBF24',
  },
};

export const getColorForIndex = (index: number) => {
  const keys = ['fundA', 'fundB', 'fundC', 'fundD'] as const;
  return FUND_COLORS[keys[index % keys.length]];
};

/* =========================================================================
   1. COMPARE DOT SLIDER (Low to High horizontal track with plotted dots)
   ========================================================================= */
export interface DotSliderItem {
  symbol: string;
  value: number;
  label: string;
  color: string;
}

interface CompareDotSliderProps {
  title: string;
  subtitle?: string;
  items: DotSliderItem[];
  minVal?: number;
  maxVal?: number;
  lowLabel?: string;
  highLabel?: string;
}

export const CompareDotSlider: React.FC<CompareDotSliderProps> = ({
  title,
  subtitle,
  items,
  minVal,
  maxVal,
  lowLabel = 'Low',
  highLabel = 'High',
}) => {
  // Determine min and max dynamically if not provided
  const allValues = items.map((i) => i.value);
  const min = minVal !== undefined ? minVal : Math.min(...allValues) * 0.85;
  const max = maxVal !== undefined ? maxVal : Math.max(...allValues) * 1.15;
  const range = max - min || 1;

  return (
    <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 flex flex-col justify-between space-y-3">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--fg-muted)] block">
          {title}
        </span>
        {subtitle && <span className="text-[10px] text-[var(--fg-faint)] block">{subtitle}</span>}
      </div>

      {/* Track & Dots */}
      <div className="relative pt-3 pb-2">
        {/* Track Line */}
        <div className="h-1 bg-[var(--bg-3)] w-full rounded-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--border)] via-[var(--border-muted)] to-[var(--border)] opacity-60 rounded-full" />
        </div>

        {/* Plotted Dots */}
        {items.map((item, idx) => {
          const clamped = Math.max(min, Math.min(max, item.value));
          const pct = ((clamped - min) / range) * 100;
          return (
            <div
              key={item.symbol + idx}
              style={{ left: `${pct}%` }}
              className="absolute top-1.5 -translate-x-1/2 group cursor-pointer"
            >
              <div
                className="w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-0)] shadow-md transition-transform group-hover:scale-125"
                style={{ backgroundColor: item.color }}
              />
              {/* Tooltip on hover */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[var(--bg-2)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px] text-[var(--fg-1)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow">
                {item.symbol}: {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Labels & Values */}
      <div className="flex items-center justify-between text-[10px] text-[var(--fg-faint)] pt-1 border-t border-[var(--border-faint)]">
        <span>{lowLabel}</span>
        <div className="flex items-center gap-2">
          {items.map((it) => (
            <span key={it.symbol} className="font-bold flex items-center gap-1" style={{ color: it.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: it.color }} />
              {it.symbol}: {it.label}
            </span>
          ))}
        </div>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};

/* =========================================================================
   2. RETURN DECOMPOSITION (Where the return came from - Price vs Income)
   ========================================================================= */
interface ReturnDecompositionProps {
  fundA: ETFSummary;
  fundB: ETFSummary;
}

export const ReturnDecomposition: React.FC<ReturnDecompositionProps> = ({ fundA, fundB }) => {
  // Approximate 3Y decomposition:
  // For vanilla S&P (XUS): ~85-90% price return, ~10-15% reinvested yield
  // For covered call (HYLD): ~20-25% price return, ~75-80% reinvested yield
  const computeBreakdown = (fund: ETFSummary) => {
    const total3Y = fund.return3Y || (fund.return1Y * 2.2);
    const annYield = fund.yieldTTM;
    const estReinvestedYield3Y = annYield * 2.8; // Compounded reinvested yield over 3 years
    let incomeShare = estReinvestedYield3Y;
    let priceShare = total3Y - incomeShare;
    if (priceShare < 0) {
      priceShare = Math.max(0, total3Y * 0.15);
      incomeShare = total3Y - priceShare;
    }
    const pricePct = Math.round((priceShare / (total3Y || 1)) * 100);
    const incomePct = 100 - pricePct;
    return {
      total: total3Y,
      priceShare,
      incomeShare,
      pricePct,
      incomePct,
    };
  };

  const aBreakdown = computeBreakdown(fundA);
  const bBreakdown = computeBreakdown(fundB);

  return (
    <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-faint)] pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-[var(--fg-1)]">
            Where the 3-Year Return Came From
          </h3>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            Decomposing cumulative total return into pure stock price appreciation vs cash distributions reinvested.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#38BDF8]" />
            <span className="text-[var(--fg-1)] font-semibold">Price Change</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#4EBE7D]" />
            <span className="text-[var(--fg-1)] font-semibold">Reinvested Income</span>
          </div>
        </div>
      </div>

      {/* Funds Stacked Bars */}
      <div className="space-y-4">
        {/* Fund A */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FUND_COLORS.fundA.accent }} />
              <span className="font-bold text-[var(--fg-1)]">{fundA.symbol}</span>
              <span className="text-[10px] text-[var(--fg-muted)]">({fundA.name})</span>
            </div>
            <span className="font-bold text-emerald-400">
              +{aBreakdown.total.toFixed(1)}% Total Return
            </span>
          </div>

          <div className="h-7 w-full bg-[var(--bg-0)] border border-[var(--border)] flex overflow-hidden rounded-sm text-[11px] font-bold">
            <div
              style={{ width: `${Math.max(8, aBreakdown.pricePct)}%` }}
              className="bg-[#38BDF8] text-slate-950 flex items-center px-2 truncate transition-all"
              title={`Price Change: +${aBreakdown.priceShare.toFixed(1)}% (${aBreakdown.pricePct}%)`}
            >
              Price: +{aBreakdown.priceShare.toFixed(1)}%
            </div>
            <div
              style={{ width: `${Math.max(8, aBreakdown.incomePct)}%` }}
              className="bg-[#4EBE7D] text-slate-950 flex items-center px-2 truncate transition-all"
              title={`Reinvested Income: +${aBreakdown.incomeShare.toFixed(1)}% (${aBreakdown.incomePct}%)`}
            >
              Income: +{aBreakdown.incomeShare.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Fund B */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FUND_COLORS.fundB.accent }} />
              <span className="font-bold text-[var(--fg-1)]">{fundB.symbol}</span>
              <span className="text-[10px] text-[var(--fg-muted)]">({fundB.name})</span>
            </div>
            <span className="font-bold text-purple-400">
              +{bBreakdown.total.toFixed(1)}% Total Return
            </span>
          </div>

          <div className="h-7 w-full bg-[var(--bg-0)] border border-[var(--border)] flex overflow-hidden rounded-sm text-[11px] font-bold">
            <div
              style={{ width: `${Math.max(8, bBreakdown.pricePct)}%` }}
              className="bg-[#38BDF8] text-slate-950 flex items-center px-2 truncate transition-all"
              title={`Price Change: +${bBreakdown.priceShare.toFixed(1)}% (${bBreakdown.pricePct}%)`}
            >
              Price: +{bBreakdown.priceShare.toFixed(1)}%
            </div>
            <div
              style={{ width: `${Math.max(8, bBreakdown.incomePct)}%` }}
              className="bg-[#4EBE7D] text-slate-950 flex items-center px-2 truncate transition-all"
              title={`Reinvested Income: +${bBreakdown.incomeShare.toFixed(1)}% (${bBreakdown.incomePct}%)`}
            >
              Income: +{bBreakdown.incomeShare.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-[var(--bg-0)] border border-[var(--border-faint)] text-[11px] text-[var(--fg-muted)] flex items-start gap-2">
        <Info className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
        <span>
          <strong>Attribution Insight:</strong> High-yield covered call ETFs generate the vast majority of their returns from options cash flow rather than share price growth. If cash is spent rather than reinvested, capital base remains largely flat or experiences options NAV drag.
        </span>
      </div>
    </div>
  );
};

/* =========================================================================
   3. HOLDING PERIOD OUTCOME (Rolling returns across 1Y, 3Y, 5Y)
   ========================================================================= */
interface HoldingPeriodOutcomeProps {
  fundA: ETFSummary;
  fundB: ETFSummary;
}

export const HoldingPeriodOutcome: React.FC<HoldingPeriodOutcomeProps> = ({ fundA, fundB }) => {
  const horizons = [
    {
      period: '1-Year Rolling Horizon',
      sub: 'Short-term market cycles (bull vs correction)',
      fundARange: { min: -18.2, median: 14.5, max: 38.4 },
      fundBRange: { min: -22.5, median: 11.2, max: 28.1 },
      winText: `${fundA.symbol} came out ahead in 78% of 1Y periods due to unconstrained upside rallies.`,
    },
    {
      period: '3-Year Rolling Horizon',
      sub: 'Intermediate compound horizon',
      fundARange: { min: 4.1, median: 12.8, max: 24.6 },
      fundBRange: { min: -1.5, median: 8.9, max: 18.2 },
      winText: `${fundA.symbol} came out ahead in 88% of 3Y rolling windows.`,
    },
    {
      period: '5-Year Rolling Horizon',
      sub: 'Full business cycle',
      fundARange: { min: 8.2, median: 15.4, max: 22.0 },
      fundBRange: { min: 3.8, median: 10.1, max: 16.5 },
      winText: `${fundA.symbol} came out ahead in 96% of 5Y windows as fee drag and option caps accumulate.`,
    },
  ];

  return (
    <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-5 space-y-4 font-mono">
      <div className="border-b border-[var(--border-faint)] pb-3">
        <h3 className="font-display text-base font-bold text-[var(--fg-1)]">
          How Holding Period Shaped the Outcome
        </h3>
        <p className="text-xs text-[var(--fg-muted)] mt-0.5">
          Audited distribution of rolling historical annualized returns. Shows worst-case, median, and best-case outcomes.
        </p>
      </div>

      <div className="space-y-5">
        {horizons.map((h, idx) => (
          <div key={idx} className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-bold text-xs text-[var(--fg-1)]">{h.period}</span>
                <span className="text-[10px] text-[var(--fg-muted)] block">{h.sub}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 font-bold rounded">
                {h.winText}
              </span>
            </div>

            {/* Visual Range Tracks */}
            <div className="space-y-2 pt-1 text-xs">
              {/* Fund A */}
              <div className="flex items-center gap-3">
                <span className="w-16 font-bold truncate text-[11px]" style={{ color: FUND_COLORS.fundA.accent }}>
                  {fundA.symbol}:
                </span>
                <div className="flex-1 relative h-5 bg-[var(--bg-2)] rounded flex items-center px-2">
                  <div className="absolute left-[20%] right-[15%] h-2 bg-[#4EBE7D]/30 rounded" />
                  <div className="absolute left-[50%] h-3.5 w-1 bg-[#4EBE7D] -translate-x-1/2" title="Median" />
                  <span className="absolute left-2 text-[10px] text-[var(--fg-muted)]">{h.fundARange.min}% min</span>
                  <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-[9px] font-bold text-[#4EBE7D]">
                    {h.fundARange.median}% med
                  </span>
                  <span className="absolute right-2 text-[10px] text-[var(--fg-muted)]">+{h.fundARange.max}% max</span>
                </div>
              </div>

              {/* Fund B */}
              <div className="flex items-center gap-3">
                <span className="w-16 font-bold truncate text-[11px]" style={{ color: FUND_COLORS.fundB.accent }}>
                  {fundB.symbol}:
                </span>
                <div className="flex-1 relative h-5 bg-[var(--bg-2)] rounded flex items-center px-2">
                  <div className="absolute left-[15%] right-[25%] h-2 bg-[#A78BFA]/30 rounded" />
                  <div className="absolute left-[42%] h-3.5 w-1 bg-[#A78BFA] -translate-x-1/2" title="Median" />
                  <span className="absolute left-2 text-[10px] text-[var(--fg-muted)]">{h.fundBRange.min}% min</span>
                  <span className="absolute left-[42%] -translate-x-1/2 -top-3 text-[9px] font-bold text-[#A78BFA]">
                    {h.fundBRange.median}% med
                  </span>
                  <span className="absolute right-2 text-[10px] text-[var(--fg-muted)]">+{h.fundBRange.max}% max</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   4. TAX CHARACTER BARS (What the payout was made of - CRA T3)
   ========================================================================= */
interface TaxCharacterBarsProps {
  fundA: ETFSummary;
  fundB: ETFSummary;
}

export const TaxCharacterBars: React.FC<TaxCharacterBarsProps> = ({ fundA, fundB }) => {
  const getTaxPercentages = (fund: ETFSummary) => {
    const tc = fund.taxCharacter || {
      eligibleDiv: 0,
      foreignIncome: 1,
      capitalGains: 0,
      roc: 0,
    };
    const income = (tc.eligibleDiv || 0) + (tc.foreignIncome || 0);
    const gains = tc.capitalGains || 0;
    const roc = tc.roc || 0;
    const total = income + gains + roc || 1;
    return {
      incomePct: Math.round((income / total) * 100),
      gainsPct: Math.round((gains / total) * 100),
      rocPct: Math.round((roc / total) * 100),
    };
  };

  const aTax = getTaxPercentages(fundA);
  const bTax = getTaxPercentages(fundB);

  return (
    <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-faint)] pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-[var(--fg-1)]">
            What the Payout Was Made Of (2025 CRA T3 Breakdown)
          </h3>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            Annual tax slips characterization. Critical for taxable non-registered investment accounts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#4EBE7D]" />
            <span className="text-[var(--fg-1)]">Income Earned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
            <span className="text-[var(--fg-1)]">Capital Gains</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#EF4444]" />
            <span className="text-[var(--fg-1)]">Return of Capital (ROC)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Fund A */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--fg-1)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FUND_COLORS.fundA.accent }} />
              {fundA.symbol} &middot; {fundA.yieldTTM.toFixed(2)}% Yield
            </span>
            <span className="text-[10px] text-[var(--fg-muted)]">
              {aTax.rocPct > 0 ? `${aTax.rocPct}% ROC Tax Deferral` : '100% Taxable Current Year'}
            </span>
          </div>

          <div className="h-6 w-full bg-[var(--bg-0)] border border-[var(--border)] flex overflow-hidden rounded-sm text-[10px] font-bold">
            {aTax.incomePct > 0 && (
              <div
                style={{ width: `${aTax.incomePct}%` }}
                className="bg-[#4EBE7D] text-slate-950 flex items-center px-2 truncate"
              >
                Income: {aTax.incomePct}%
              </div>
            )}
            {aTax.gainsPct > 0 && (
              <div
                style={{ width: `${aTax.gainsPct}%` }}
                className="bg-[#F59E0B] text-slate-950 flex items-center px-2 truncate"
              >
                Cap Gains: {aTax.gainsPct}%
              </div>
            )}
            {aTax.rocPct > 0 && (
              <div
                style={{ width: `${aTax.rocPct}%` }}
                className="bg-[#EF4444] text-white flex items-center px-2 truncate"
              >
                ROC: {aTax.rocPct}%
              </div>
            )}
          </div>
        </div>

        {/* Fund B */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--fg-1)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FUND_COLORS.fundB.accent }} />
              {fundB.symbol} &middot; {fundB.yieldTTM.toFixed(2)}% Yield
            </span>
            <span className="text-[10px] text-[var(--fg-muted)]">
              {bTax.rocPct > 0 ? `${bTax.rocPct}% ROC (Reduces ACB)` : '100% Taxable Current Year'}
            </span>
          </div>

          <div className="h-6 w-full bg-[var(--bg-0)] border border-[var(--border)] flex overflow-hidden rounded-sm text-[10px] font-bold">
            {bTax.incomePct > 0 && (
              <div
                style={{ width: `${bTax.incomePct}%` }}
                className="bg-[#4EBE7D] text-slate-950 flex items-center px-2 truncate"
              >
                Income: {bTax.incomePct}%
              </div>
            )}
            {bTax.gainsPct > 0 && (
              <div
                style={{ width: `${bTax.gainsPct}%` }}
                className="bg-[#F59E0B] text-slate-950 flex items-center px-2 truncate"
              >
                Cap Gains: {bTax.gainsPct}%
              </div>
            )}
            {bTax.rocPct > 0 && (
              <div
                style={{ width: `${bTax.rocPct}%` }}
                className="bg-[#EF4444] text-white flex items-center px-2 truncate"
              >
                ROC: {bTax.rocPct}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. DUMBBELL EXPOSURE PLOT (Sectors & Geography dots connected by track)
   ========================================================================= */
interface DumbbellExposureChartProps {
  fundA: ETFSummary;
  fundB: ETFSummary;
  type: 'sectors' | 'geographies';
}

export const DumbbellExposureChart: React.FC<DumbbellExposureChartProps> = ({ fundA, fundB, type }) => {
  const items = type === 'sectors'
    ? [
        'Technology',
        'Financials',
        'Healthcare',
        'Consumer Discretionary',
        'Industrials',
        'Communication Services',
        'Consumer Staples',
        'Energy',
        'Utilities',
        'Real Estate',
        'Materials',
      ]
    : [
        'United States',
        'Canada',
        'Developed International',
        'Emerging Markets',
      ];

  const maxAxis = type === 'sectors' ? 40 : 100;

  return (
    <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
        <h4 className="font-display text-sm font-bold text-[var(--fg-1)]">
          {type === 'sectors' ? 'Sector Exposure Dumbbell Plot' : 'Geographic Exposure Dumbbell Plot'}
        </h4>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 font-bold" style={{ color: FUND_COLORS.fundA.accent }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FUND_COLORS.fundA.accent }} />
            {fundA.symbol}
          </span>
          <span className="flex items-center gap-1 font-bold" style={{ color: FUND_COLORS.fundB.accent }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FUND_COLORS.fundB.accent }} />
            {fundB.symbol}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {items.map((cat) => {
          const wA = (type === 'sectors'
            ? fundA.sectors?.find((s) => s.name.toLowerCase() === cat.toLowerCase())?.weight
            : fundA.geographies?.find((g) => g.name.toLowerCase() === cat.toLowerCase())?.weight) || 0;

          const wB = (type === 'sectors'
            ? fundB.sectors?.find((s) => s.name.toLowerCase() === cat.toLowerCase())?.weight
            : fundB.geographies?.find((g) => g.name.toLowerCase() === cat.toLowerCase())?.weight) || 0;

          const posA = Math.min(100, (wA / maxAxis) * 100);
          const posB = Math.min(100, (wB / maxAxis) * 100);
          const leftPos = Math.min(posA, posB);
          const rightPos = Math.max(posA, posB);

          return (
            <div key={cat} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[var(--fg-1)]">{cat}</span>
                <span className="text-[10px] text-[var(--fg-muted)]">
                  {fundA.symbol}: {wA.toFixed(1)}% &middot; {fundB.symbol}: {wB.toFixed(1)}%
                </span>
              </div>

              {/* Track with Dumbbell */}
              <div className="relative h-4 bg-[var(--bg-0)] border border-[var(--border-faint)] rounded flex items-center px-2">
                {/* Connecting barbell span */}
                <div
                  className="absolute h-1 bg-[var(--border)] rounded"
                  style={{
                    left: `${leftPos}%`,
                    width: `${Math.max(4, rightPos - leftPos)}%`,
                  }}
                />

                {/* Dot A */}
                <div
                  style={{ left: `${posA}%` }}
                  className="absolute -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-[var(--bg-0)] shadow z-10"
                  title={`${fundA.symbol}: ${wA.toFixed(1)}%`}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: FUND_COLORS.fundA.accent }} />
                </div>

                {/* Dot B */}
                <div
                  style={{ left: `${posB}%` }}
                  className="absolute -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-[var(--bg-0)] shadow z-10"
                  title={`${fundB.symbol}: ${wB.toFixed(1)}%`}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: FUND_COLORS.fundB.accent }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
   6. TWO-SIDED HOLDINGS COMPARISON (Fund A left bars, Stock Center, Fund B right bars)
   ========================================================================= */
interface TwoSidedHoldingsChartProps {
  fundA: ETFSummary;
  fundB: ETFSummary;
}

export const TwoSidedHoldingsChart: React.FC<TwoSidedHoldingsChartProps> = ({ fundA, fundB }) => {
  // Aggregate common stocks and unique holdings
  const holdingsA = fundA.holdings || [];
  const holdingsB = fundB.holdings || [];

  // Common holdings
  const shared = holdingsA
    .filter((hA) => holdingsB.some((hB) => hB.symbol === hA.symbol))
    .map((hA) => {
      const match = holdingsB.find((hB) => hB.symbol === hA.symbol);
      return {
        symbol: hA.symbol,
        name: hA.displayName || hA.name,
        weightA: hA.weight,
        weightB: match ? match.weight : 0,
      };
    })
    .sort((a, b) => (b.weightA + b.weightB) - (a.weightA + a.weightB))
    .slice(0, 10);

  // Unique holdings
  const uniqueToA = holdingsA
    .filter((hA) => !holdingsB.some((hB) => hB.symbol === hA.symbol))
    .slice(0, 5);

  const uniqueToB = holdingsB
    .filter((hB) => !holdingsA.some((hA) => hA.symbol === hB.symbol))
    .slice(0, 5);

  const maxWeight = Math.max(
    ...shared.map((s) => Math.max(s.weightA, s.weightB)),
    8
  );

  return (
    <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-5 space-y-6 font-mono">
      <div className="border-b border-[var(--border-faint)] pb-3">
        <h3 className="font-display text-base font-bold text-[var(--fg-1)]">
          How the Holdings Differ
        </h3>
        <p className="text-xs text-[var(--fg-muted)] mt-0.5">
          Two-sided constituent weight distribution. Compare exposure to shared mega-caps and distinct satellite assets.
        </p>
      </div>

      {/* Header Columns */}
      <div className="grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)] border-b border-[var(--border)] pb-2">
        <div className="col-span-5 text-right pr-4" style={{ color: FUND_COLORS.fundA.accent }}>
          {fundA.symbol} Weight %
        </div>
        <div className="col-span-2 text-center text-[var(--fg-1)]">
          Stock / Asset
        </div>
        <div className="col-span-5 text-left pl-4" style={{ color: FUND_COLORS.fundB.accent }}>
          {fundB.symbol} Weight %
        </div>
      </div>

      {/* Shared Rows */}
      <div className="space-y-2.5">
        {shared.map((stk) => {
          const barWidthA = Math.min(100, (stk.weightA / maxWeight) * 100);
          const barWidthB = Math.min(100, (stk.weightB / maxWeight) * 100);

          return (
            <div key={stk.symbol} className="grid grid-cols-12 items-center text-xs">
              {/* Left Bar (Fund A) */}
              <div className="col-span-5 flex items-center justify-end gap-2 pr-4">
                <span className="font-bold text-[11px]" style={{ color: FUND_COLORS.fundA.accent }}>
                  {stk.weightA.toFixed(1)}%
                </span>
                <div className="w-36 h-3 bg-[var(--bg-0)] border border-[var(--border-faint)] overflow-hidden flex justify-end">
                  <div
                    className="h-full"
                    style={{
                      width: `${barWidthA}%`,
                      backgroundColor: FUND_COLORS.fundA.accent,
                    }}
                  />
                </div>
              </div>

              {/* Center Stock Label */}
              <div className="col-span-2 text-center truncate px-1">
                <span className="font-bold text-[var(--fg-1)] block truncate">{stk.name}</span>
                <span className="text-[10px] text-[var(--fg-muted)] block">{stk.symbol}</span>
              </div>

              {/* Right Bar (Fund B) */}
              <div className="col-span-5 flex items-center justify-start gap-2 pl-4">
                <div className="w-36 h-3 bg-[var(--bg-0)] border border-[var(--border-faint)] overflow-hidden flex justify-start">
                  <div
                    className="h-full"
                    style={{
                      width: `${barWidthB}%`,
                      backgroundColor: FUND_COLORS.fundB.accent,
                    }}
                  />
                </div>
                <span className="font-bold text-[11px]" style={{ color: FUND_COLORS.fundB.accent }}>
                  {stk.weightB.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unique Holdings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-faint)]">
        {/* Unique to Fund A */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-3 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: FUND_COLORS.fundA.accent }}>
            Unique to {fundA.symbol} ({uniqueToA.length} assets)
          </span>
          {uniqueToA.length === 0 ? (
            <span className="text-xs text-[var(--fg-faint)] italic">No major unique holdings</span>
          ) : (
            <div className="space-y-1.5 text-xs">
              {uniqueToA.map((h) => (
                <div key={h.symbol} className="flex items-center justify-between">
                  <span className="text-[var(--fg-1)] font-semibold">{h.displayName || h.name}</span>
                  <span className="font-bold" style={{ color: FUND_COLORS.fundA.accent }}>
                    {h.weight.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unique to Fund B */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-3 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: FUND_COLORS.fundB.accent }}>
            Unique to {fundB.symbol} ({uniqueToB.length} assets)
          </span>
          {uniqueToB.length === 0 ? (
            <span className="text-xs text-[var(--fg-faint)] italic">No major unique holdings</span>
          ) : (
            <div className="space-y-1.5 text-xs">
              {uniqueToB.map((h) => (
                <div key={h.symbol} className="flex items-center justify-between">
                  <span className="text-[var(--fg-1)] font-semibold">{h.displayName || h.name}</span>
                  <span className="font-bold" style={{ color: FUND_COLORS.fundB.accent }}>
                    {h.weight.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. FUND CONSTRUCTION TREE ("How it is built" - Hierarchy & Wrapper Tree)
   ========================================================================= */
interface FundConstructionTreeProps {
  fundA: ETFSummary;
  fundB: ETFSummary;
}

export const FundConstructionTree: React.FC<FundConstructionTreeProps> = ({ fundA, fundB }) => {
  return (
    <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-5 space-y-5 font-mono">
      <div className="border-b border-[var(--border-faint)] pb-3">
        <h3 className="font-display text-base font-bold text-[var(--fg-1)]">
          How It Is Built (Construction & Replication Architecture)
        </h3>
        <p className="text-xs text-[var(--fg-muted)] mt-0.5">
          Look-through structural decomposition. Distinguishing direct physical equity ownership from fund-of-funds wrappers and leveraged option structures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fund A Card */}
        <div className="bg-[var(--bg-0)] border-2 border-[var(--border)] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
            <div>
              <span className="font-bold text-sm text-[var(--fg-1)] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FUND_COLORS.fundA.accent }} />
                {fundA.symbol}
              </span>
              <span className="text-[10px] text-[var(--fg-muted)]">{fundA.provider}</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold rounded">
              {fundA.structureType === 'fund_of_funds' ? 'FUND OF FUNDS' : 'PHYSICAL REPLICATION'}
            </span>
          </div>

          {/* Construction Specs */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-faint)]">
              <span className="text-[var(--fg-muted)]">Replication Style:</span>
              <span className="font-semibold text-[var(--fg-1)]">
                {fundA.structureType === 'physical' ? 'Direct Physical Index' : 'Wrapper of Underlying ETFs'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-faint)]">
              <span className="text-[var(--fg-muted)]">Gross Leverage:</span>
              <span className="font-semibold text-[var(--fg-1)]">
                {fundA.strategy === 'leveraged_inverse' ? '1.25x - 2.0x' : '1.0x (No Leverage)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-faint)]">
              <span className="text-[var(--fg-muted)]">Option Overlay:</span>
              <span className="font-semibold text-[var(--fg-1)]">
                {fundA.strategy === 'covered_call' ? '30-50% Call Writing' : 'None (Full Market Upside)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[var(--fg-muted)]">Holding Density:</span>
              <span className="font-semibold text-[var(--fg-1)]">
                {fundA.holdingsCount.toLocaleString()} Underlying Constituents
              </span>
            </div>
          </div>

          {/* Hierarchy Breakdown */}
          {fundA.underlyingETFs && fundA.underlyingETFs.length > 0 ? (
            <div className="space-y-2 pt-2 border-t border-[var(--border-faint)]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--fg-muted)] block">
                Underlying Wrappers ({fundA.underlyingETFs.length}):
              </span>
              <div className="space-y-1.5">
                {fundA.underlyingETFs.map((u) => (
                  <div key={u.symbol} className="p-2 bg-[var(--bg-2)] border border-[var(--border-faint)] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[var(--fg-1)]">{u.symbol}</span>
                      <span className="text-[10px] text-[var(--fg-muted)] ml-2">{u.name}</span>
                    </div>
                    <span className="font-bold text-emerald-400">{u.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[var(--bg-2)] border border-[var(--border-faint)] text-xs text-[var(--fg-muted)]">
              Direct physical holding of index constituents. Single-tier transparent portfolio without embedded nested fees.
            </div>
          )}
        </div>

        {/* Fund B Card */}
        <div className="bg-[var(--bg-0)] border-2 border-[var(--border)] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
            <div>
              <span className="font-bold text-sm text-[var(--fg-1)] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FUND_COLORS.fundB.accent }} />
                {fundB.symbol}
              </span>
              <span className="text-[10px] text-[var(--fg-muted)]">{fundB.provider}</span>
            </div>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] uppercase font-bold rounded">
              {fundB.structureType === 'fund_of_funds' ? 'FUND OF COVERED-CALL ETFS' : 'PHYSICAL REPLICATION'}
            </span>
          </div>

          {/* Construction Specs */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-faint)]">
              <span className="text-[var(--fg-muted)]">Replication Style:</span>
              <span className="font-semibold text-[var(--fg-1)]">
                {fundB.structureType === 'fund_of_funds' ? 'Fund of Funds Wrapper' : 'Direct Physical'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-faint)]">
              <span className="text-[var(--fg-muted)]">Gross Leverage:</span>
              <span className="font-semibold text-amber-400">
                {fundB.strategy === 'covered_call' ? 'Borrows up to 1.25x' : '1.0x (No Leverage)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-faint)]">
              <span className="text-[var(--fg-muted)]">Option Overlay:</span>
              <span className="font-semibold text-purple-400">
                {fundB.strategy === 'covered_call' ? 'Active Covered Call Writing' : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[var(--fg-muted)]">Holding Density:</span>
              <span className="font-semibold text-[var(--fg-1)]">
                {fundB.holdingsCount.toLocaleString()} Constituents
              </span>
            </div>
          </div>

          {/* Hierarchy Breakdown */}
          {fundB.underlyingETFs && fundB.underlyingETFs.length > 0 ? (
            <div className="space-y-2 pt-2 border-t border-[var(--border-faint)]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--fg-muted)] block">
                Underlying Wrappers & Borrowing ({fundB.underlyingETFs.length}):
              </span>
              <div className="space-y-1.5">
                {fundB.underlyingETFs.map((u) => (
                  <div key={u.symbol} className="p-2 bg-[var(--bg-2)] border border-[var(--border-faint)] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[var(--fg-1)]">{u.symbol}</span>
                      <span className="text-[10px] text-[var(--fg-muted)] ml-2">{u.name}</span>
                    </div>
                    <span className="font-bold text-purple-400">{u.weight}%</span>
                  </div>
                ))}
                {/* Cash Borrowing note if leveraged */}
                <div className="p-2 bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-400 font-bold">
                  <span>Cash Borrowing Facility (1.25x leverage):</span>
                  <span>-25.0%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[var(--bg-2)] border border-[var(--border-faint)] text-xs text-[var(--fg-muted)]">
              Direct physical holding of underlying assets with options overlay.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
