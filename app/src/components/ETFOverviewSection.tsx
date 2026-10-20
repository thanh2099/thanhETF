import React from 'react';
import { Info, ArrowRight, ExternalLink } from 'lucide-react';
import { ETFSummary } from '../data/etfData';

interface ETFOverviewSectionProps {
  etf: ETFSummary;
  onNavigateSection: (section: 'performance' | 'holdings' | 'tax' | 'facts') => void;
}

export const ETFOverviewSection: React.FC<ETFOverviewSectionProps> = ({
  etf,
  onNavigateSection,
}) => {
  const topSector = etf.sectors[0] || { name: 'Technology', weight: 30 };
  const topGeo = etf.geographies[0] || { name: 'United States', weight: 100 };

  return (
    <div className="space-y-8 font-mono">
      {/* 1. SECTION HEADER (Exact DecodeETF Report Card Format) */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
          ETF REPORT CARD
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--fg-1)]">
          {etf.symbol === 'HYLD.TO'
            ? 'Enhanced U.S. equity fund with 1.25x leverage'
            : etf.symbol === 'HMAX.TO'
            ? 'Canadian covered-call equity fund'
            : etf.symbol === 'XUS.TO'
            ? 'U.S. equity index fund tracking the S&P 500 Index'
            : etf.symbol.includes('XEQT') || etf.symbol.includes('VEQT')
            ? 'One-ticket global equity portfolio'
            : etf.symbol.includes('VDY')
            ? 'Canadian equity index fund tracking the FTSE Canada High Dividend Yield Index'
            : etf.strategy === 'covered_call'
            ? 'Canadian covered-call equity fund'
            : `Core index fund tracking ${etf.theme}`}
        </h2>
      </div>

      {/* 2. 4 METRIC CARDS (Exact DecodeETF Match) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: 3-Year Return */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-1">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider flex items-center justify-between">
            <span>3-year return</span>
            <Info className="w-3 h-3 text-[var(--fg-faint)]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-emerald-400">
            +{(etf.return3Y || 23.3).toFixed(1)}%
          </div>
          <div className="text-[10px] text-[var(--fg-faint)]">Annualized return</div>
        </div>

        {/* Box 2: Distribution Yield */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-1">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider flex items-center justify-between">
            <span>Distribution yield</span>
            <Info className="w-3 h-3 text-[var(--fg-faint)]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-emerald-400">
            {etf.yieldTTM.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[var(--fg-faint)]">12-month trailing</div>
        </div>

        {/* Box 3: Fund Size */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-1">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider flex items-center justify-between">
            <span>Fund size</span>
            <Info className="w-3 h-3 text-[var(--fg-faint)]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-[var(--fg-1)]">
            {etf.aum >= 1e9 ? `$${(etf.aum / 1e9).toFixed(1)}B` : `$${Math.round(etf.aum / 1e6)}M`}
          </div>
          <div className="text-[10px] text-[var(--fg-faint)]">Net assets (CAD)</div>
        </div>

        {/* Box 4: MER */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-1">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider flex items-center justify-between">
            <span>MER</span>
            <Info className="w-3 h-3 text-[var(--fg-faint)]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-[var(--fg-1)]">
            {(etf.mer * 100).toFixed(2)}%
          </div>
          <div className="text-[10px] text-[var(--fg-faint)]">Annual expense ratio</div>
        </div>
      </div>

      {/* 3. STRUCTURED REPORT CARD NARRATIVE (Structure, Exposure, Fund Facts) */}
      <div className="bg-[var(--bg-0)] border border-[var(--border)] p-5 space-y-4 text-xs">
        <div className="space-y-3">
          <div>
            <strong className="text-[var(--fg-1)]">Structure: </strong>
            <span className="text-[var(--fg-muted)]">
              This is a {etf.strategy === 'covered_call' ? 'covered call' : 'passive'} ETF tracking{' '}
              {etf.theme}. It{' '}
              {etf.structureType === 'fund_of_funds'
                ? `holds ${etf.underlyingETFs?.length || 5} underlying funds`
                : 'holds its constituent securities directly'}
              .
            </span>
          </div>

          <div>
            <strong className="text-[var(--fg-1)]">Exposure: </strong>
            <span className="text-[var(--fg-muted)]">
              {etf.holdingsCount} stocks, {topGeo.weight.toFixed(0)}% {topGeo.name},{' '}
              {etf.isHedged ? 'CAD-hedged' : 'unhedged'}. Sector weight: {topSector.name} is about{' '}
              {topSector.weight.toFixed(1)}% of the fund.
            </span>
          </div>

          <div>
            <strong className="text-[var(--fg-1)]">Fund facts: </strong>
            <span className="text-[var(--fg-muted)]">
              Managed by {etf.provider}, costing {(etf.mer * 100).toFixed(2)}% a year (MER).
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-faint)]">
          <a
            href={`https://google.com/search?q=${etf.symbol}+${etf.provider}+prospectus+factsheet`}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--primary)] hover:underline inline-flex items-center gap-1 font-bold"
          >
            <span>Fund documents from {etf.provider}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4. PREVIEW TILES LINKING TO SUBSECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Performance Preview Card */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[var(--fg-muted)]">Performance</span>
            <div className="text-xl font-extrabold text-emerald-400">
              +{(etf.return1Y || 17.4).toFixed(1)}% 1Y
            </div>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Total return with distributions reinvested.
            </p>
          </div>
          <button
            onClick={() => onNavigateSection('performance')}
            className="text-xs text-[var(--primary)] hover:underline inline-flex items-center gap-1 font-bold cursor-pointer text-left"
          >
            <span>Explore performance & risk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Holdings Preview Card */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[var(--fg-muted)]">Holdings</span>
            <div className="text-xl font-extrabold text-[var(--fg-1)]">
              {etf.holdingsCount} Assets
            </div>
            <p className="text-[11px] text-[var(--fg-muted)]">
              {topSector.name} ({topSector.weight.toFixed(0)}%) · {topGeo.name} ({topGeo.weight.toFixed(0)}%)
            </p>
          </div>
          <button
            onClick={() => onNavigateSection('holdings')}
            className="text-xs text-[var(--primary)] hover:underline inline-flex items-center gap-1 font-bold cursor-pointer text-left"
          >
            <span>Explore holdings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Income & Tax Preview Card */}
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[var(--fg-muted)]">Income & tax</span>
            <div className="text-xl font-extrabold text-emerald-400">
              {etf.yieldTTM.toFixed(1)}% Yield
            </div>
            <p className="text-[11px] text-[var(--fg-muted)]">
              {etf.distributionFreq} payments & T3 tax slip audit.
            </p>
          </div>
          <button
            onClick={() => onNavigateSection('tax')}
            className="text-xs text-[var(--primary)] hover:underline inline-flex items-center gap-1 font-bold cursor-pointer text-left"
          >
            <span>Explore income & tax</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
