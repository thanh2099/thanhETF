import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Play, Pause, TrendingUp, Layers, Cpu, ShieldCheck, CheckCircle2, ChevronRight, BarChart3, Database } from 'lucide-react';
import { ETF_DATABASE, ETFSummary } from '../data/etfData';
import { ThanhMascot, MascotPose } from '../components/ThanhMascot';

interface HomeViewProps {
  onNavigate: (tab: string, symbol?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeToolTab, setActiveToolTab] = useState<'lookup' | 'compare' | 'rate' | 'holders' | 'backtest' | 'yield'>('lookup');
  const [searchInput, setSearchInput] = useState('');
  const [activeSectorPeriod, setActiveSectorPeriod] = useState<'1D' | '1W' | 'YTD' | '1Y'>('1W');

  // Auto carousel rotation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 5);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const slideTitles = [
    'Every Canadian-listed ETF, decoded.',
    'What just listed in Canada?',
    'Latest Research & Insights',
    'Portfolio Lab: Track accounts & ACB',
    'Covered Calls & High-Yield Truth',
  ];

  const mascotSlides: Array<{ pose: MascotPose; speech: React.ReactNode }> = [
    {
      pose: 'presenting',
      speech: (
        <span>Type any fund like <b>XEQT.TO</b> or <b>VDY.TO</b>.<br/>I'll open it up to its true underlying stocks.</span>
      ),
    },
    {
      pose: 'front',
      speech: (
        <span>Fresh Canadian ETF listings,<br/>tracked directly from TSX & Cboe.</span>
      ),
    },
    {
      pose: 'desk',
      speech: (
        <span>In-depth research studies:<br/>why adding VFV to XEQT dilutes diversification.</span>
      ),
    },
    {
      pose: 'desk',
      speech: (
        <span>Positions, not grades.<br/>Audit your real asset location & tax drag.</span>
      ),
    },
    {
      pose: 'presenting',
      speech: (
        <span>Covered calls deconstructed:<br/>high yield often conceals Return of Capital.</span>
      ),
    },
  ];

  const toolTabs = [
    { id: 'lookup', label: 'Look up an ETF' },
    { id: 'compare', label: 'Compare Overlap' },
    { id: 'rate', label: 'Rate my portfolio' },
    { id: 'holders', label: 'Who holds a stock' },
    { id: 'backtest', label: 'Backtest Studio' },
    { id: 'yield', label: 'Yield Hub' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Official ThanhETF Brand Banner Showcase */}
      <section className="bg-[var(--bg-1)] border-b border-[var(--border)] py-6 px-4 sm:px-6 lg:px-14">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary)] uppercase tracking-wider">
              <span className="w-2 h-2 bg-[var(--primary)]"></span>
              <span>Official ThanhETF Brand Banner</span>
            </div>
            <span className="text-[11px] font-mono text-[var(--fg-muted)]">BRUTALIST FINANCIAL TERMINAL</span>
          </div>

          <div className="border border-[var(--border)] overflow-hidden shadow-2xl">
            <img
              src="/assets/thanhetf-banner.svg"
              alt="ThanhETF Banner"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5-Slide Dynamic Hero Module (DecodeETF HomeHighlights Pattern) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 md:p-8 space-y-6">
          {/* Top Story-Style Segment Bars */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className="flex-1 h-1 bg-[var(--bg-4)] overflow-hidden cursor-pointer"
                aria-label={`Slide ${idx + 1}`}
              >
                <div
                  className={`h-full bg-[var(--primary)] transition-all ${
                    activeSlide === idx
                      ? 'w-full duration-[7000ms] ease-linear'
                      : activeSlide > idx
                      ? 'w-full'
                      : 'w-0'
                  }`}
                />
              </button>
            ))}

            <div className="flex items-center gap-2 ml-3 text-[11px] font-mono text-[var(--fg-muted)] shrink-0">
              <span>{activeSlide + 1} OF 5</span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:text-[var(--primary)] text-[var(--fg-2)] cursor-pointer"
                title={isPlaying ? 'Pause auto-play' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Hero Content Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Mascot & Speech Bubble */}
            <div className="lg:col-span-3 flex flex-col items-center md:items-start pt-1">
              <ThanhMascot
                pose={mascotSlides[activeSlide]?.pose || 'presenting'}
                speechText={mascotSlides[activeSlide]?.speech}
              />
            </div>

            {/* Center/Right: Interactive Tool Switcher */}
            <div className="lg:col-span-9 space-y-6">
              {/* Tool Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
                {toolTabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveToolTab(t.id as any)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                      activeToolTab === t.id
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold'
                        : 'bg-[var(--bg-2)] text-[var(--fg-2)] hover:text-[var(--fg-1)] border-[var(--border)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Panel based on activeToolTab */}
              {activeToolTab === 'lookup' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--primary)] font-bold">
                      LOOK UP AN ETF · 1,776 CANADIAN FUNDS
                    </span>
                    <h1 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--fg-1)] mt-1">
                      {slideTitles[0]}
                    </h1>
                    <p className="text-xs text-[var(--fg-2)] mt-1 max-w-2xl">
                      One comprehensive look: what it pays, what it holds, how it's built, its CRA T3 tax character, and what it costs.
                    </p>
                  </div>

                  {/* Search Input Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[var(--fg-muted)] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search a fund or ticker, e.g. XEQT.TO, VDY, CASH..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && searchInput) {
                            onNavigate('detail', searchInput.toUpperCase());
                          }
                        }}
                        className="w-full bg-[var(--bg-2)] border border-[var(--border)] pl-9 pr-3 py-2.5 text-xs font-mono text-[var(--fg-1)] focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <button
                      onClick={() => onNavigate('detail', searchInput || 'XEQT.TO')}
                      className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Open Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sample Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
                    <span className="text-[var(--fg-muted)] text-[11px]">TRY:</span>
                    {['XUS.TO', 'HYLD.TO', 'HMAX.TO', 'XEQT.TO', 'VFV.TO', 'VDY.TO', 'ZWB.TO', 'CASH.TO', 'TEC.TO'].map((sym) => (
                      <button
                        key={sym}
                        onClick={() => onNavigate('detail', sym)}
                        className="px-2.5 py-1 bg-[var(--bg-2)] hover:bg-[var(--primary)] hover:text-[var(--bg-0)] border border-[var(--border)] text-[var(--fg-1)] text-xs transition-colors cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeToolTab === 'compare' && (
                <div className="space-y-4">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--primary)] font-bold">
                    COMPARE OVERLAP & HOLDINGS
                  </span>
                  <h2 className="text-2xl font-display font-bold text-[var(--fg-1)]">
                    How different are these ETFs?
                  </h2>
                  <p className="text-xs text-[var(--fg-2)] max-w-2xl">
                    Calculate weighted overlap ($\sum \min(w_A, w_B)$), shared stocks, unique holdings, and fee differences side-by-side.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onNavigate('compare')}
                      className="px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Open Comparison Studio (XEQT vs VEQT) →
                    </button>
                  </div>
                </div>
              )}

              {activeToolTab === 'rate' && (
                <div className="space-y-4">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--primary)] font-bold">
                    RATE MY PORTFOLIO · HEALTH CHECK
                  </span>
                  <h2 className="text-2xl font-display font-bold text-[var(--fg-1)]">
                    What do you really own?
                  </h2>
                  <p className="text-xs text-[var(--fg-2)] max-w-2xl">
                    "Positions, Not Grades". Compare your portfolio against a plain index mix for fees, drawdowns, single-stock concentration, and overlap duplication.
                  </p>
                  <button
                    onClick={() => onNavigate('rate')}
                    className="px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Diagnose My Portfolio →
                  </button>
                </div>
              )}

              {activeToolTab === 'holders' && (
                <div className="space-y-4">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--primary)] font-bold">
                    REVERSE LOOKUP · WHO OWNS A STOCK
                  </span>
                  <h2 className="text-2xl font-display font-bold text-[var(--fg-1)]">
                    Which Canadian ETFs hold this stock?
                  </h2>
                  <p className="text-xs text-[var(--fg-2)] max-w-2xl">
                    Search any company like Royal Bank (RY), Shopify, Apple, or NVIDIA, and see every Canadian ETF holding it directly or via underlying funds.
                  </p>
                  <button
                    onClick={() => onNavigate('reverse')}
                    className="px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Search Canadian ETF Holders →
                  </button>
                </div>
              )}

              {activeToolTab === 'backtest' && (
                <div className="space-y-4">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--primary)] font-bold">
                    SIMULATION & BACKTEST STUDIO
                  </span>
                  <h2 className="text-2xl font-display font-bold text-[var(--fg-1)]">
                    How would your mix have held up?
                  </h2>
                  <p className="text-xs text-[var(--fg-2)] max-w-2xl">
                    Simulate DCA contributions, lump-sum investments, or retirement decumulation across 7 historical market crashes with Bank of Canada inflation deflation.
                  </p>
                  <button
                    onClick={() => onNavigate('simulation')}
                    className="px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Launch Backtest Studio →
                  </button>
                </div>
              )}

              {activeToolTab === 'yield' && (
                <div className="space-y-4">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--primary)] font-bold">
                    YIELD HUB & COVERED CALL TRUTH
                  </span>
                  <h2 className="text-2xl font-display font-bold text-[var(--fg-1)]">
                    How much of that yield do you keep?
                  </h2>
                  <p className="text-xs text-[var(--fg-2)] max-w-2xl">
                    Break down distribution yields into CRA T3 eligible dividends vs Return of Capital (ROC). Benchmark covered call ETFs against their plain twins.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('yield')}
                      className="px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Open Yield Hub →
                    </button>
                    <button
                      onClick={() => onNavigate('covered_calls')}
                      className="px-5 py-2.5 bg-[var(--bg-3)] border border-[var(--border)] text-[var(--fg-1)] text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Covered Call Hub →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sector Map & Market Pulse */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
            <div>
              <h3 className="text-lg font-display font-bold text-[var(--fg-1)]">
                Canadian Market Pulse · 43 Sectors
              </h3>
              <p className="text-xs text-[var(--fg-muted)]">
                Performance across Canadian ETF sectors with trailing price changes
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1 font-mono text-xs">
              {(['1D', '1W', 'YTD', '1Y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActiveSectorPeriod(period)}
                  className={`px-3 py-1 border cursor-pointer ${
                    activeSectorPeriod === period
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold'
                      : 'bg-[var(--bg-2)] text-[var(--fg-2)] border-[var(--border)] hover:text-[var(--fg-1)]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Sector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { name: 'Canadian Oil & Gas', change: '+7.0%', pos: true },
              { name: 'Canadian Financials', change: '+3.7%', pos: true },
              { name: 'Consumer Staples', change: '+2.8%', pos: true },
              { name: 'Canadian Utilities', change: '+1.9%', pos: true },
              { name: 'Aggregate Bonds', change: '+0.4%', pos: true },
              { name: 'High Interest Cash', change: '+0.1%', pos: true },
              { name: 'Canadian REITs', change: '-1.2%', pos: false },
              { name: 'Cybersecurity', change: '-7.4%', pos: false },
              { name: 'Blockchain/Crypto', change: '-8.0%', pos: false },
              { name: 'Artificial Intell.', change: '-10.1%', pos: false },
              { name: 'Semiconductors', change: '-10.6%', pos: false },
              { name: 'Space Exploration', change: '-12.8%', pos: false },
              { name: 'Clean Energy', change: '-5.2%', pos: false },
              { name: 'Gold / Bullion', change: '+4.1%', pos: true },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-[var(--bg-1)] border border-[var(--border)] p-2.5 hover-glow flex flex-col justify-between min-h-[74px]"
              >
                <span className="text-[11px] font-medium text-[var(--fg-2)] line-clamp-1">{s.name}</span>
                <div className="flex items-center justify-between mt-2 font-mono text-xs">
                  <span className={s.pos ? 'text-[var(--ret-up-1-fg)] font-bold' : 'text-[var(--ret-down-1-fg)] font-bold'}>
                    {s.change}
                  </span>
                  <span className="text-[10px] text-[var(--fg-muted)]">{activeSectorPeriod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Major Canadian Benchmark Proxies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <div className="bg-[var(--bg-2)] border border-[var(--border)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-[var(--fg-1)] uppercase tracking-wider">
              Major Benchmark Indexes
            </h4>
            <span className="text-xs font-mono text-[var(--fg-muted)]">CANADIAN DOLLAR ACCESS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <button
              onClick={() => onNavigate('detail', 'VFV.TO')}
              className="p-3 bg-[var(--bg-1)] border border-[var(--border)] text-left hover-glow"
            >
              <div className="text-[var(--fg-muted)] text-[10px]">US LARGE CAP</div>
              <div className="font-bold text-sm text-[var(--primary)]">S&P 500</div>
              <div className="text-[var(--fg-1)] mt-1">13 Canadian trackers · VFV.TO</div>
            </button>

            <button
              onClick={() => onNavigate('detail', 'XIU.TO')}
              className="p-3 bg-[var(--bg-1)] border border-[var(--border)] text-left hover-glow"
            >
              <div className="text-[var(--fg-muted)] text-[10px]">CANADA BLUE CHIP</div>
              <div className="font-bold text-sm text-[var(--primary)]">S&P/TSX 60</div>
              <div className="text-[var(--fg-1)] mt-1">5 Canadian trackers · XIU.TO</div>
            </button>

            <button
              onClick={() => onNavigate('detail', 'XEQT.TO')}
              className="p-3 bg-[var(--bg-1)] border border-[var(--border)] text-left hover-glow"
            >
              <div className="text-[var(--fg-muted)] text-[10px]">ALL-IN-ONE GLOBAL</div>
              <div className="font-bold text-sm text-[var(--primary)]">All-Equity 100%</div>
              <div className="text-[var(--fg-1)] mt-1">Global balanced · XEQT.TO</div>
            </button>

            <button
              onClick={() => onNavigate('detail', 'ZAG.TO')}
              className="p-3 bg-[var(--bg-1)] border border-[var(--border)] text-left hover-glow"
            >
              <div className="text-[var(--fg-muted)] text-[10px]">CANADIAN FIXED INCOME</div>
              <div className="font-bold text-sm text-[var(--primary)]">Aggregate Bond</div>
              <div className="text-[var(--fg-1)] mt-1">Gov + Corp debt · ZAG.TO</div>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Value Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-3">
            <div className="w-8 h-8 bg-[var(--primary-subtle)] border border-[var(--primary)] flex items-center justify-center text-[var(--primary)]">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-base text-[var(--fg-1)]">
              True Look-Through Decomposition
            </h3>
            <p className="text-xs text-[var(--fg-2)] leading-relaxed">
              Never be blinded by fund-of-funds again. We dissolve Canadian all-in-one portfolios into their thousands of underlying direct stocks with exact weighting math.
            </p>
          </div>

          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-3">
            <div className="w-8 h-8 bg-[var(--primary-subtle)] border border-[var(--primary)] flex items-center justify-center text-[var(--primary)]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-base text-[var(--fg-1)]">
              Weighted Overlap Engine
            </h3>
            <p className="text-xs text-[var(--fg-2)] leading-relaxed">
              Calculate exact holding overlap between any 2 to 5 Canadian ETFs ($\sum \min(w_A, w_B)$), uncover duplicate stock risk, and see which holdings are exclusive to each fund.
            </p>
          </div>

          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-3">
            <div className="w-8 h-8 bg-[var(--primary-subtle)] border border-[var(--primary)] flex items-center justify-center text-[var(--primary)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-base text-[var(--fg-1)]">
              CRA T3 Distribution Tax Breakdown
            </h3>
            <p className="text-xs text-[var(--fg-2)] leading-relaxed">
              Distinguish between genuine Canadian eligible dividends, capital gains, phantom reinvested distributions, and Return of Capital (ROC) that degrades your cost base.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
