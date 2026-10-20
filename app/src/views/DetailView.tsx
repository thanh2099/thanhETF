import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle,
  PieChart,
  BarChart2,
  Layers,
  DollarSign,
  Calendar,
  ExternalLink,
  Bookmark,
  Search,
  Mail,
  Info,
  Check,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ETF_DATABASE, ETFSummary, searchAllETFs, resolveOrGenerateETF } from '../data/etfData';
import { InteractivePerformanceChart } from '../components/InteractivePerformanceChart';
import { LookThroughTreemap } from '../components/LookThroughTreemap';
import { CompareDotSlider } from '../components/CompareDetailModules';
import { ETFPerformanceSection } from '../components/ETFPerformanceSection';
import { ETFIncomeTaxSection } from '../components/ETFIncomeTaxSection';
import { ETFOverviewSection } from '../components/ETFOverviewSection';
import { ETFFundFactsSection } from '../components/ETFFundFactsSection';
import { ETFAllHoldingsSection } from '../components/ETFAllHoldingsSection';

interface DetailViewProps {
  symbol: string;
  initialSection?: DetailSection;
  onNavigate: (tab: string, symbol?: string) => void;
  onBack: () => void;
}

type DetailSection = 'overview' | 'performance' | 'holdings' | 'all_holdings' | 'tax' | 'similar' | 'facts';

export const DetailView: React.FC<DetailViewProps> = ({ symbol, initialSection, onNavigate, onBack }) => {
  const [activeSection, setActiveSection] = useState<DetailSection>(() => {
    if (initialSection) return initialSection;
    const hash = window.location.hash.replace(/^#\/?/, '');
    const parts = hash.split('/');
    if (parts.length >= 3 && ['overview', 'performance', 'holdings', 'all_holdings', 'tax', 'similar', 'facts'].includes(parts[2])) {
      return parts[2] as DetailSection;
    }
    return 'performance'; // Default to performance as in Screenshot 1
  });

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const parts = hash.split('/');
      if (parts.length >= 3 && ['overview', 'performance', 'holdings', 'all_holdings', 'tax', 'similar', 'facts'].includes(parts[2])) {
        setActiveSection(parts[2] as DetailSection);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  const [riskHorizon, setRiskHorizon] = useState<'1yr' | '3yrs'>('3yrs');
  const [holdingSearch, setHoldingSearch] = useState('');
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearching, setIsHeaderSearching] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentETF, setCurrentETF] = useState<ETFSummary>(() => {
    return ETF_DATABASE.find((e) => e.symbol.toUpperCase() === symbol.toUpperCase()) || ETF_DATABASE[0];
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Sync when symbol prop changes
  useEffect(() => {
    let isCancelled = false;
    const fetchFund = async () => {
      const found = await resolveOrGenerateETF(symbol);
      if (!isCancelled && found) {
        setCurrentETF(found);
      }
    };
    fetchFund();
    return () => {
      isCancelled = true;
    };
  }, [symbol]);

  const etf = currentETF;

  // Search results for header search box
  const headerSearchResults = searchAllETFs(headerSearchQuery);

  const handleSelectSearchedETF = (newSymbol: string) => {
    setHeaderSearchQuery('');
    setIsHeaderSearching(false);
    onNavigate('detail', newSymbol);
  };

  // Similar ETFs dataset (specifically curated for US Equity / Covered Calls / All-Equity)
  const similarETFsList: Array<{
    symbol: string;
    name: string;
    isHedged: boolean;
    badges: string[];
    mer: number;
    returnYTD: number;
    return1Y: number;
    return3Y: number;
    volatility1Y: number;
    volatility3Y: number;
    sharpe1Y: number;
    sharpe3Y: number;
    aum: number;
  }> = [
    {
      symbol: 'HYLD.TO',
      name: 'Hamilton Enhanced U.S. Covered Call ETF',
      isHedged: true,
      badges: ['HOLDS CANADIAN ETFS', 'BROAD MARKET', 'LEVERAGED'],
      mer: 0.0102,
      returnYTD: 15.9,
      return1Y: 19.2,
      return3Y: 23.9,
      volatility1Y: 18.5,
      volatility3Y: 16.8,
      sharpe1Y: 1.1,
      sharpe3Y: 1.0,
      aum: 1220000000,
    },
    {
      symbol: 'VFV.TO',
      name: 'Vanguard S&P 500 Index ETF',
      isHedged: false,
      badges: ['HOLDS US ETFS', 'BROAD MARKET', 'INDEX'],
      mer: 0.0008,
      returnYTD: 16.1,
      return1Y: 17.4,
      return3Y: 23.3,
      volatility1Y: 14.6,
      volatility3Y: 14.2,
      sharpe1Y: 1.3,
      sharpe3Y: 1.2,
      aum: 36200000000,
    },
    {
      symbol: 'ZSP.TO',
      name: 'BMO S&P 500 Index ETF',
      isHedged: false,
      badges: ['DIRECT HOLDINGS', 'BROAD MARKET', 'INDEX'],
      mer: 0.0009,
      returnYTD: 16.1,
      return1Y: 17.4,
      return3Y: 23.3,
      volatility1Y: 14.6,
      volatility3Y: 14.2,
      sharpe1Y: 1.3,
      sharpe3Y: 1.2,
      aum: 25600000000,
    },
    {
      symbol: 'VUN.TO',
      name: 'Vanguard Morningstar U.S. Total Market Index ETF',
      isHedged: false,
      badges: ['HOLDS US ETFS', 'BROAD MARKET', 'INDEX'],
      mer: 0.0016,
      returnYTD: 15.7,
      return1Y: 16.5,
      return3Y: 22.8,
      volatility1Y: 14.9,
      volatility3Y: 14.5,
      sharpe1Y: 1.2,
      sharpe3Y: 1.1,
      aum: 20300000000,
    },
    {
      symbol: 'XSP.TO',
      name: 'iShares Core S&P 500 Index ETF (CAD-Hedged)',
      isHedged: true,
      badges: ['HOLDS US ETFS', 'BROAD MARKET', 'INDEX'],
      mer: 0.0009,
      returnYTD: 10.7,
      return1Y: 14.2,
      return3Y: 19.8,
      volatility1Y: 14.8,
      volatility3Y: 14.4,
      sharpe1Y: 1.1,
      sharpe3Y: 1.0,
      aum: 16400000000,
    },
    {
      symbol: 'XUS.TO',
      name: 'iShares Core S&P 500 Index ETF',
      isHedged: false,
      badges: ['HOLDS US ETFS', 'BROAD MARKET', 'INDEX'],
      mer: 0.0009,
      returnYTD: 16.1,
      return1Y: 17.4,
      return3Y: 23.3,
      volatility1Y: 14.6,
      volatility3Y: 14.2,
      sharpe1Y: 1.3,
      sharpe3Y: 1.2,
      aum: 13800000000,
    },
  ];

  const filteredHoldings = etf.holdings.filter(
    (h) =>
      h.name.toLowerCase().includes(holdingSearch.toLowerCase()) ||
      h.symbol.toLowerCase().includes(holdingSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-8 font-mono">
      {/* =========================================================================
          TOP BREADCRUMB & HEADER SEARCH BAR (DecodeETF Header Layout)
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBack}
            className="text-[var(--fg-muted)] hover:text-[var(--primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Canadian ETFs</span>
          </button>
          <span className="font-bold text-[var(--fg-1)] text-sm ml-1">{etf.symbol}</span>
        </div>

        {/* Header ETF Search Box */}
        <div className="relative min-w-[220px] max-w-xs w-full">
          <div className="flex items-center bg-[var(--bg-0)] border border-[var(--border)] px-3 py-1.5 text-xs focus-within:border-[var(--primary)]">
            <Search className="w-3.5 h-3.5 text-[var(--fg-muted)] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="SEARCH ETFS..."
              value={headerSearchQuery}
              onChange={(e) => {
                setHeaderSearchQuery(e.target.value);
                setIsHeaderSearching(true);
              }}
              onFocus={() => setIsHeaderSearching(true)}
              className="w-full bg-transparent text-[var(--fg-1)] uppercase outline-none placeholder:text-[var(--fg-faint)] text-xs font-semibold"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isHeaderSearching && headerSearchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[var(--bg-0)] border-2 border-[var(--primary)] shadow-2xl max-h-56 overflow-y-auto">
              {headerSearchResults.slice(0, 8).map((res) => (
                <button
                  key={res.symbol}
                  onClick={() => handleSelectSearchedETF(res.symbol)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-2)] flex items-center justify-between text-[var(--fg-1)] border-b border-[var(--border-faint)] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--primary)]">{res.symbol}</span>
                    <span className="text-[11px] text-[var(--fg-muted)] truncate max-w-xs">{res.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--fg-muted)] shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAIN FUND HEADER SNAPSHOT & PRICE BANNER
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-[var(--border)] pb-6">
        <div className="lg:col-span-8 space-y-3">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[var(--fg-1)] leading-tight">
            {etf.name}
          </h1>

          {/* Category Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-2.5 py-0.5 bg-[var(--bg-1)] border border-[var(--border)] text-[var(--fg-muted)]">
              {etf.provider}
            </span>
            <span className="px-2.5 py-0.5 bg-[var(--bg-1)] border border-[var(--border)] text-[var(--fg-muted)]">
              {etf.geographies[0]?.name || 'United States'}
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
              {etf.strategy === 'covered_call' ? 'Covered Call' : etf.assetClass}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-2 text-xs">
            <button
              onClick={() => onNavigate('compare', etf.symbol)}
              className="px-3 py-1.5 bg-[var(--bg-0)] hover:bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg-1)] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Compare ↗</span>
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`px-3 py-1.5 border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                  : 'bg-[var(--bg-0)] hover:bg-[var(--bg-2)] border-[var(--border)] text-[var(--fg-1)]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? '★ Saved' : '☆ Save'}</span>
            </button>
            <button
              onClick={() => onNavigate('simulation', etf.symbol)}
              className="px-3 py-1.5 bg-[var(--bg-0)] hover:bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg-1)] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Backtest ↗</span>
            </button>
          </div>
        </div>

        {/* Right Price Display Block */}
        <div className="lg:col-span-4 bg-[var(--bg-0)] border border-[var(--border)] p-5 text-right space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">
            Last close · {etf.currency} · 2026-10-16
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--fg-1)]">
            CA${etf.price.toFixed(2)}
          </div>
          <div className="flex items-center justify-end gap-3 text-xs pt-0.5">
            <span className={etf.changeDay >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {etf.changeDay >= 0 ? `+CA$${etf.changeDay.toFixed(2)} (+${etf.changeDayPct}%)` : `−CA$${Math.abs(etf.changeDay).toFixed(2)} (${etf.changeDayPct}%)`}
              <span className="text-[10px] text-[var(--fg-faint)] ml-1 font-normal">vs prior close</span>
            </span>
          </div>
          <div className="text-[11px] font-bold text-emerald-400 pt-1">
            +{etf.returnYTD.toFixed(2)}% YTD total return
          </div>
        </div>
      </div>

      {/* =========================================================================
          TWO-COLUMN LAYOUT: SIDEBAR (IN THIS REPORT) + MAIN CONTENT
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-6">
          <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--fg-faint)] block">
                IN THIS REPORT
              </span>
              <span className="font-bold text-sm text-[var(--fg-1)] block mt-0.5">
                {etf.symbol}
              </span>
            </div>

            {/* Section Links */}
            <div className="space-y-1 text-xs">
              {[
                { id: 'overview', num: '01', label: 'Overview' },
                { id: 'performance', num: '02', label: 'Performance & risk' },
                { id: 'holdings', num: '03', label: 'Holdings summary' },
                { id: 'all_holdings', num: '04', label: 'All holdings & weights' },
                { id: 'tax', num: '05', label: 'Income & tax' },
                { id: 'similar', num: '06', label: 'Similar ETFs' },
                { id: 'facts', num: '07', label: 'Fund facts' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id as DetailSection);
                    window.location.hash = `#etf/${etf.symbol}/${s.id}`;
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeSection === s.id
                      ? 'bg-[var(--bg-2)] text-[var(--primary)] font-bold border-l-2 border-[var(--primary)]'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg-1)] hover:bg-[var(--bg-1)]'
                  }`}
                >
                  <span className="text-[10px] text-[var(--fg-faint)]">{s.num}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--border-faint)] pt-3 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--fg-faint)] block">
                KEEP RESEARCHING
              </span>
              <div className="space-y-1.5 text-xs text-[var(--fg-muted)]">
                <button
                  onClick={() => onNavigate('compare', etf.symbol)}
                  className="w-full text-left hover:text-[var(--primary)] transition-colors cursor-pointer block"
                >
                  Compare this ETF ↗
                </button>
                <button
                  onClick={() => onNavigate('directory')}
                  className="w-full text-left hover:text-[var(--primary)] transition-colors cursor-pointer block"
                >
                  Browse Canadian ETFs ↗
                </button>
                <button
                  onClick={() => onNavigate('dividend_hub')}
                  className="w-full text-left hover:text-[var(--primary)] transition-colors cursor-pointer block"
                >
                  Explore the Yield Hub ↗
                </button>
                <button
                  onClick={() => onNavigate('rate_portfolio')}
                  className="w-full text-left hover:text-[var(--primary)] transition-colors cursor-pointer block"
                >
                  Rate your portfolio ↗
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="lg:col-span-9 space-y-10">
          {/* =========================================================================
              SECTION 03: HOLDINGS (Exact match to Screenshots 1 & 2!)
              ========================================================================= */}
          {activeSection === 'holdings' && (
            <div className="space-y-8">
              {/* Part 1: FUND STRUCTURE // What this fund is */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                  FUND STRUCTURE
                </span>
                <h2 className="text-2xl font-display font-bold text-[var(--fg-1)]">
                  What this fund is
                </h2>

                {/* Highlighted Narrative Callout Box (Screenshot 1) */}
                <div className="bg-[#1C241E] border border-emerald-500/30 p-4 rounded-sm text-xs text-[var(--fg-1)] leading-relaxed space-y-2">
                  <p>
                    <strong>
                      {etf.symbol === 'HYLD.TO'
                        ? 'Holds covered-call ETFs that sell call options on U.S. stocks for income, and has 1.25x leverage.'
                        : etf.symbol === 'HMAX.TO'
                        ? 'Equity exposure with a covered-call overlay.'
                        : etf.symbol === 'XUS.TO'
                        ? 'Broad U.S. equity exposure.'
                        : etf.symbol.includes('XEQT') || etf.symbol.includes('VEQT')
                        ? 'Broad equity exposure.'
                        : etf.strategy === 'covered_call'
                        ? 'Equity exposure with an active covered-call overlay.'
                        : `Holds ${etf.holdingsCount} stocks directly tracking the ${etf.theme} index with pure equity exposure.`}
                    </strong>{' '}
                    {etf.symbol === 'HYLD.TO'
                      ? 'Returns come from the underlying equity basket plus option income, with some upside typically traded away for higher cash distributions. The fund borrows money to increase its exposure, which amplified both gains and losses and added borrowing costs.'
                      : etf.symbol === 'HMAX.TO'
                      ? 'Returns come from the underlying equity basket plus option income, with some upside typically traded away for higher cash distributions.'
                      : etf.symbol === 'XUS.TO'
                      ? 'This is benchmark-driven single-country exposure rather than a narrow stock pick. It tracks the S&P 500 Index.'
                      : etf.symbol.includes('XEQT') || etf.symbol.includes('VEQT')
                      ? 'The portfolio is spread across many holdings rather than depending on any one stock.'
                      : etf.strategy === 'covered_call'
                      ? 'Returns come from the underlying equity basket plus option income, with some upside typically traded away for higher cash distributions.'
                      : 'Returns come directly from underlying corporate earnings, market valuation expansion, and regular dividends without options overlay.'}
                  </p>
                </div>

                {/* Currency & Structure Fact Rows */}
                <div className="border border-[var(--border)] bg-[var(--bg-0)] divide-y divide-[var(--border-faint)] text-xs">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-[var(--fg-muted)]">Currency</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[var(--fg-1)]">
                        {etf.isHedged ? 'CAD-hedged' : 'CAD unhedged'}
                      </span>
                      <button
                        onClick={() => setActiveSection('facts')}
                        className="text-[10px] text-[var(--primary)] hover:underline cursor-pointer"
                      >
                        facts ↓
                      </button>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-[var(--fg-muted)]">How it's built</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[var(--fg-1)]">
                        {etf.structureType === 'fund_of_funds' ? 'Fund of covered-call ETFs' : 'Direct physical holding'}
                      </span>
                      <button
                        onClick={() => {
                          const el = document.getElementById('construction-tree');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[10px] text-[var(--primary)] hover:underline cursor-pointer"
                      >
                        holdings ↓
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: HOLDINGS // What the fund holds */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                  HOLDINGS
                </span>
                <h2 className="text-2xl font-display font-bold text-[var(--fg-1)]">
                  What the fund holds
                </h2>
                <p className="text-xs text-[var(--fg-muted)]">
                  {etf.symbol === 'HYLD.TO'
                    ? "Weights reflect the fund's roughly 1.25x leverage, so they add up to more than 100%."
                    : etf.symbol === 'HMAX.TO'
                    ? 'Share of the stock basket. Active call options are written against these constituent financial holdings.'
                    : 'Weights reflect constituent percentage of total fund net asset value.'}
                </p>

                {/* TOP 10 HOLDINGS TABLE WITH PROPORTION BARS */}
                <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)] border-b border-[var(--border-faint)] pb-2">
                    <span>TOP 10 HOLDINGS</span>
                    <span>current weight</span>
                  </div>
                  <div className="text-[10px] text-[var(--fg-faint)]">Share of fund, %</div>

                  <div className="space-y-2 pt-1 text-xs">
                    {etf.holdings.slice(0, 10).map((h) => (
                      <div key={h.symbol} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[var(--fg-1)]">{h.displayName || h.name}</span>
                          <span className="font-bold text-[var(--fg-1)]">{h.weight.toFixed(1)}%</span>
                        </div>
                        {/* Horizontal Cyan/Green Proportion Bar */}
                        <div className="h-2 w-full bg-[var(--bg-2)] overflow-hidden rounded-sm">
                          <div
                            className="h-full bg-cyan-400"
                            style={{ width: `${Math.min(100, h.weight * 14)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-[var(--fg-faint)] pt-2 border-t border-[var(--border-faint)]">
                    Reported underlying weights. Leverage is stated separately; these bars are not a complete accounting of net assets.
                  </div>

                  {/* Quick link button to All Holdings view */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActiveSection('all_holdings');
                        window.location.hash = `#etf/${etf.symbol}/all_holdings`;
                      }}
                      className="w-full py-2.5 px-3 bg-[var(--bg-1)] hover:bg-[var(--bg-2)] border border-[var(--primary)] text-[var(--primary)] hover:text-[var(--fg-1)] text-xs font-bold flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[var(--primary)]" />
                        <span>View complete list of all {etf.holdings.length} holdings & constituent weights</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Open All Holdings →
                      </span>
                    </button>
                  </div>
                </div>

                {/* SECTORS & GEOGRAPHY SEGMENTED RIBBONS (Screenshot 1 Bottom) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Sectors Ribbon */}
                  <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-3">
                    <span className="font-bold text-sm text-[var(--fg-1)] block">Sectors</span>
                    <span className="text-[10px] text-[var(--fg-faint)] block -mt-2">Share of fund, %</span>

                    {/* Segmented Color Bar */}
                    <div className="h-3 w-full bg-[var(--bg-2)] flex overflow-hidden rounded-sm">
                      {etf.sectors.map((sec, idx) => {
                        const colors = ['#0284C7', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];
                        return (
                          <div
                            key={sec.name}
                            style={{
                              width: `${sec.weight}%`,
                              backgroundColor: colors[idx % colors.length],
                            }}
                            title={`${sec.name}: ${sec.weight}%`}
                          />
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="text-[10px] text-[var(--fg-muted)] leading-relaxed space-y-1">
                      <div>
                        {etf.sectors.map((s) => (
                          <span key={s.name} className="mr-2 inline-block">
                            ■ {s.name} {s.weight.toFixed(1)}%
                          </span>
                        ))}
                      </div>
                      <div className="text-[9px] text-[var(--fg-faint)] pt-1">
                        Based on the stocks inside the funds this ETF holds.
                      </div>
                    </div>
                  </div>

                  {/* Geography Ribbon */}
                  <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-3">
                    <span className="font-bold text-sm text-[var(--fg-1)] block">Geography</span>
                    <span className="text-[10px] text-[var(--fg-faint)] block -mt-2">Share of fund, %</span>

                    {/* Segmented Color Bar */}
                    <div className="h-3 w-full bg-[var(--bg-2)] flex overflow-hidden rounded-sm">
                      {etf.geographies.map((geo, idx) => {
                        const colors = ['#10B981', '#38BDF8', '#F59E0B', '#8B5CF6'];
                        return (
                          <div
                            key={geo.name}
                            style={{
                              width: `${geo.weight}%`,
                              backgroundColor: colors[idx % colors.length],
                            }}
                            title={`${geo.name}: ${geo.weight}%`}
                          />
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="text-[10px] text-[var(--fg-muted)] leading-relaxed space-y-1">
                      <div>
                        {etf.geographies.map((g) => (
                          <span key={g.name} className="mr-2 inline-block">
                            ■ {g.name} {g.weight.toFixed(1)}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 3: HOW IT'S CONSTRUCTED (Screenshot 2 Tree Box) */}
              <div id="construction-tree" className="space-y-4 pt-4 border-t border-[var(--border)]">
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                  HOW IT'S CONSTRUCTED
                </span>
                <h2 className="text-2xl font-display font-bold text-[var(--fg-1)]">
                  {etf.symbol === 'HYLD.TO'
                    ? 'HYLD.TO holds covered-call ETFs instead of writing the options itself.'
                    : etf.symbol === 'HMAX.TO'
                    ? 'HMAX.TO holds the basket of stocks and writes call options on it.'
                    : etf.symbol === 'XUS.TO'
                    ? 'XUS.TO holds a single US-listed ETF.'
                    : etf.symbol.includes('XEQT') || etf.symbol.includes('VEQT')
                    ? `${etf.symbol} holds a fixed mix of index ETFs listed in Canada and the US.`
                    : `${etf.symbol} construction and look-through structure.`}
                </h2>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {etf.symbol === 'HYLD.TO'
                    ? 'The covered-call ETFs it holds write the options, and their premiums help fund the payout. Those funds are Canadian-listed, so there is no extra US-listing layer; foreign tax on the underlying stocks is still withheld at the fund level.'
                    : etf.symbol === 'HMAX.TO'
                    ? 'The fund is paid a premium for selling those options, and that premium is what lifts the payout.'
                    : etf.symbol === 'XUS.TO'
                    ? 'The US keeps 15% of the dividends as tax. In a non-registered account you get a credit for it on your Canadian tax; in a TFSA or RRSP it is a drag.'
                    : etf.symbol.includes('XEQT') || etf.symbol.includes('VEQT')
                    ? 'The US-listed sleeve can add a withholding layer for any non-US stocks it holds; the effect depends on what account you hold it in.'
                    : 'Transparent ETF structure breaking down underlying asset exposure and sleeve replication methods.'}
                </p>

                {/* Visual Fund Tree Card */}
                <div className="bg-[var(--bg-0)] border-2 border-[var(--border)] p-5 space-y-4">
                  {/* Root Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-faint)] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-base text-[var(--fg-1)]">{etf.symbol}</span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {etf.symbol === 'HYLD.TO'
                          ? 'FUND OF COVERED-CALL ETFS'
                          : etf.symbol === 'HMAX.TO'
                          ? 'COVERED CALL OVERLAY'
                          : etf.structureType === 'fund_of_funds'
                          ? 'FUND OF ETFS'
                          : 'PHYSICAL REPLICATION'}
                      </span>
                      {etf.symbol === 'HYLD.TO' && (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          BORROWS UP TO 1.25X
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hierarchy Tree Nodes */}
                  {etf.underlyingETFs && etf.underlyingETFs.length > 0 ? (
                    <div className="space-y-2.5 pl-2 font-mono text-xs">
                      {etf.underlyingETFs.map((sleeve) => (
                        <div key={sleeve.symbol} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--fg-faint)]">─</span>
                              <span className="font-bold text-[var(--primary)] hover:underline cursor-pointer">
                                {sleeve.symbol}
                              </span>
                              <span className="px-1 py-0.2 bg-[var(--bg-2)] border border-[var(--border-faint)] text-[9px] text-[var(--fg-muted)]">
                                {sleeve.country || 'CA'}
                              </span>
                            </div>
                            <span className="font-bold text-[var(--fg-1)]">{sleeve.weight.toFixed(1)}%</span>
                          </div>

                          {/* Nested sleeve constituent preview */}
                          {sleeve.preview && sleeve.preview.length > 0 && (
                            <div className="pl-6 text-[10px] text-[var(--fg-muted)] flex items-center gap-1">
                              <span className="text-[var(--fg-faint)]">└─</span>
                              <span>{sleeve.preview.join(' ')} ...</span>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="text-[10px] text-[var(--fg-faint)] pt-3 border-t border-[var(--border-faint)]">
                        Call options provide income and cap gains
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[var(--bg-1)] text-xs text-[var(--fg-muted)]">
                      Direct physical ownership of constituent stocks. No nested wrapper fees or options overlay.
                    </div>
                  )}
                </div>
              </div>

              {/* Part 4: NEWSLETTER SIGNUP BOX (Screenshot 2 Bottom) */}
              <div className="bg-[var(--bg-0)] border border-[var(--border)] p-6 space-y-3">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <Mail className="w-5 h-5" />
                  <span className="font-bold text-sm text-[var(--fg-1)]">
                    ETF insights, straight to your inbox
                  </span>
                </div>
                <p className="text-xs text-[var(--fg-muted)]">
                  We break down what Canadian ETF investors need to know. Free. No account needed. Unsubscribe anytime.
                </p>

                {newsletterSubscribed ? (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Subscribed! Check your inbox for the weekly Canadian ETF tear sheet.</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 max-w-lg">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 bg-[var(--bg-1)] border border-[var(--border)] px-3 py-2 text-xs text-[var(--fg-1)] placeholder:text-[var(--fg-faint)] outline-none focus:border-[var(--primary)]"
                    />
                    <button
                      onClick={() => {
                        if (newsletterEmail.includes('@')) {
                          setNewsletterSubscribed(true);
                        }
                      }}
                      className="px-4 py-2 bg-[var(--primary)] text-[var(--bg-0)] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                    >
                      Subscribe →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 05: SIMILAR ETFS (Exact match to Screenshot 3!)
              ========================================================================= */}
          {activeSection === 'similar' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                  THE ALTERNATIVES
                </span>
                <h2 className="text-2xl font-display font-bold text-[var(--fg-1)] mt-1">
                  Funds that do a similar job
                </h2>
                <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                  Shares this category; holdings and strategy may differ.
                </p>
              </div>

              {/* Comparative Table with 1Y/3Y Risk Horizon Toggle */}
              <div className="bg-[var(--bg-0)] border border-[var(--border)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    {/* Top subheader row */}
                    <tr className="border-b border-[var(--border)] bg-[var(--bg-2)] text-[10px] uppercase font-bold text-[var(--fg-muted)]">
                      <th className="p-3" colSpan={2}></th>
                      <th className="p-3 text-center border-l border-r border-[var(--border)]" colSpan={3}>
                        RETURNS
                      </th>
                      <th className="p-3 text-center border-r border-[var(--border)]" colSpan={2}>
                        <div className="flex items-center justify-center gap-2">
                          <span>RISK</span>
                          <div className="inline-flex bg-[var(--bg-0)] border border-[var(--border)] p-0.5 rounded text-[9px]">
                            <button
                              onClick={() => setRiskHorizon('1yr')}
                              className={`px-1.5 py-0.5 cursor-pointer ${riskHorizon === '1yr' ? 'bg-[var(--primary)] text-[var(--bg-0)] font-bold' : 'text-[var(--fg-muted)]'}`}
                            >
                              1 yr
                            </button>
                            <button
                              onClick={() => setRiskHorizon('3yrs')}
                              className={`px-1.5 py-0.5 cursor-pointer ${riskHorizon === '3yrs' ? 'bg-[var(--primary)] text-[var(--bg-0)] font-bold' : 'text-[var(--fg-muted)]'}`}
                            >
                              3 yrs
                            </button>
                          </div>
                        </div>
                      </th>
                      <th className="p-3"></th>
                    </tr>

                    {/* Column Headers */}
                    <tr className="border-b border-[var(--border)] bg-[var(--bg-1)] text-[10px] uppercase font-bold text-[var(--fg-muted)]">
                      <th className="p-3">Fund</th>
                      <th className="p-3 text-right">MER</th>
                      <th className="p-3 text-right">Year to date</th>
                      <th className="p-3 text-right">1 year</th>
                      <th className="p-3 text-right">3 yrs, yearly</th>
                      <th className="p-3 text-right">Volatility</th>
                      <th className="p-3 text-right">Sharpe</th>
                      <th className="p-3 text-right">Size ↓</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-faint)]">
                    {similarETFsList.map((item) => {
                      const isTarget = item.symbol === etf.symbol;
                      return (
                        <tr
                          key={item.symbol}
                          className={`hover:bg-[var(--bg-2)] transition-colors ${isTarget ? 'bg-[var(--bg-1)]' : ''}`}
                        >
                          {/* Fund Symbol & Name */}
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onNavigate('detail', item.symbol)}
                                  className="font-bold text-xs text-[var(--fg-1)] hover:text-[var(--primary)] cursor-pointer"
                                >
                                  {item.symbol}
                                </button>
                                {item.isHedged && (
                                  <span className="px-1 py-0.2 bg-[var(--bg-2)] border border-[var(--border)] text-[9px] text-[var(--fg-faint)]">
                                    HEDGED
                                  </span>
                                )}
                                <span className="text-[11px] text-[var(--fg-muted)] truncate max-w-xs hidden sm:inline">
                                  {item.name}
                                </span>
                              </div>
                              {/* Badges */}
                              <div className="flex flex-wrap items-center gap-1">
                                {item.badges.map((b) => (
                                  <span
                                    key={b}
                                    className="px-1.5 py-0.2 bg-[var(--bg-2)] text-[var(--fg-faint)] text-[9px] uppercase font-semibold"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* MER */}
                          <td className="p-3 text-right font-semibold text-[var(--fg-1)]">
                            {(item.mer * 100).toFixed(2)}%
                          </td>

                          {/* YTD Return */}
                          <td className="p-3 text-right font-bold text-emerald-400">
                            {item.returnYTD.toFixed(1)}%
                          </td>

                          {/* 1Y Return */}
                          <td className="p-3 text-right font-bold text-emerald-400">
                            {item.return1Y.toFixed(1)}%
                          </td>

                          {/* 3Y Return */}
                          <td className="p-3 text-right font-bold text-[var(--fg-1)]">
                            {item.return3Y.toFixed(1)}%
                          </td>

                          {/* Volatility (Toggled) */}
                          <td className="p-3 text-right text-[var(--fg-muted)]">
                            {riskHorizon === '1yr' ? `${item.volatility1Y.toFixed(1)}%` : `${item.volatility3Y.toFixed(1)}%`}
                          </td>

                          {/* Sharpe (Toggled) */}
                          <td className="p-3 text-right text-[var(--fg-muted)]">
                            {riskHorizon === '1yr' ? item.sharpe1Y.toFixed(1) : item.sharpe3Y.toFixed(1)}
                          </td>

                          {/* Size */}
                          <td className="p-3 text-right font-semibold text-[var(--fg-1)]">
                            ${(item.aum / 1000000000).toFixed(2)}B
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Quick Jump Links below table (Screenshot 3) */}
              <div className="space-y-1.5 text-xs text-[var(--fg-muted)]">
                <div>
                  Compare {etf.symbol} with{' '}
                  {['VFV.TO', 'ZSP.TO', 'VUN.TO', 'XSP.TO', 'XUS.TO'].map((alt, idx, arr) => (
                    <React.Fragment key={alt}>
                      <button
                        onClick={() => onNavigate('compare', `${etf.symbol},${alt}`)}
                        className="text-[var(--primary)] hover:underline font-bold cursor-pointer"
                      >
                        {alt}
                      </button>
                      {idx < arr.length - 1 && ' · '}
                    </React.Fragment>
                  ))}
                </div>
                <div>
                  <a
                    href={`https://google.com/search?q=${etf.symbol}+etf+factsheet`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                  >
                    Official {etf.provider} page for {etf.symbol} ↗
                  </a>
                </div>
              </div>

              {/* Newsletter Box */}
              <div className="bg-[var(--bg-0)] border border-[var(--border)] p-6 space-y-3">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <Mail className="w-5 h-5" />
                  <span className="font-bold text-sm text-[var(--fg-1)]">
                    ETF insights, straight to your inbox
                  </span>
                </div>
                <p className="text-xs text-[var(--fg-muted)]">
                  We break down what Canadian ETF investors need to know. Free. No account needed. Unsubscribe anytime.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 max-w-lg">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 bg-[var(--bg-1)] border border-[var(--border)] px-3 py-2 text-xs text-[var(--fg-1)] placeholder:text-[var(--fg-faint)] outline-none"
                  />
                  <button className="px-4 py-2 bg-[var(--primary)] text-[var(--bg-0)] font-bold text-xs cursor-pointer shrink-0">
                    Subscribe →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 04: ALL HOLDINGS (Interactive Full Constituent Table & Simulator)
              ========================================================================= */}
          {activeSection === 'all_holdings' && (
            <ETFAllHoldingsSection
              etf={etf}
              onSelectHoldingSymbol={(sym) => onNavigate('detail', sym)}
            />
          )}

          {/* =========================================================================
              SECTION 01: OVERVIEW (Exact DecodeETF Report Card)
              ========================================================================= */}
          {activeSection === 'overview' && (
            <ETFOverviewSection
              etf={etf}
              onNavigateSection={(sec) => {
                setActiveSection(sec);
                window.location.hash = `#etf/${etf.symbol}/${sec}`;
              }}
            />
          )}

          {/* =========================================================================
              SECTION 02: PERFORMANCE & RISK (Exact DecodeETF Architecture)
              ========================================================================= */}
          {activeSection === 'performance' && (
            <ETFPerformanceSection
              etf={etf}
              onNavigateTax={() => {
                setActiveSection('tax');
                window.location.hash = `#etf/${etf.symbol}/tax`;
              }}
            />
          )}

          {/* =========================================================================
              SECTION 04: INCOME & TAX (Exact DecodeETF T3 Breakdown & Growth)
              ========================================================================= */}
          {activeSection === 'tax' && (
            <ETFIncomeTaxSection
              etf={etf}
              onNavigateCompare={() => onNavigate('compare', etf.symbol)}
              onNavigateTaxStudio={() => onNavigate('tax_opt')}
            />
          )}

          {/* =========================================================================
              SECTION 06: FUND FACTS (Exact DecodeETF Fund Facts & Audited Specs)
              ========================================================================= */}
          {activeSection === 'facts' && (
            <ETFFundFactsSection
              etf={etf}
              onNavigateSection={(sec) => {
                setActiveSection(sec);
                window.location.hash = `#etf/${etf.symbol}/${sec}`;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
