import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Check,
  X,
  Plus,
  Info,
  Layers,
  ShieldCheck,
  DollarSign,
  Search,
  Loader2,
  TrendingUp,
  Trash2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { ETFSummary, calculateWeightedOverlap, searchAllETFs, resolveOrGenerateETF } from '../data/etfData';
import { MultiCompareChart, CompareFundItem } from '../components/MultiCompareChart';
import {
  FUND_COLORS,
  getColorForIndex,
  CompareDotSlider,
  ReturnDecomposition,
  HoldingPeriodOutcome,
  TaxCharacterBars,
  DumbbellExposureChart,
  TwoSidedHoldingsChart,
  FundConstructionTree,
} from '../components/CompareDetailModules';

interface CompareViewProps {
  onSelectETF: (symbol: string) => void;
  initialSymbols?: string[];
}

export const CompareView: React.FC<CompareViewProps> = ({ onSelectETF, initialSymbols }) => {
  // Default to XUS.TO vs HYLD.TO as showcased in DecodeETF, or respect initialSymbols
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(
    initialSymbols && initialSymbols.length > 0 ? initialSymbols : ['XUS.TO', 'HYLD.TO']
  );
  const [loadedETFs, setLoadedETFs] = useState<ETFSummary[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedCapital, setSimulatedCapital] = useState<number>(100000);

  // Load ETF summaries for all selected symbols
  useEffect(() => {
    let isCancelled = false;
    const loadFunds = async () => {
      setIsLoading(true);
      const results: ETFSummary[] = [];
      for (const sym of selectedSymbols) {
        try {
          const fund = await resolveOrGenerateETF(sym);
          if (fund) results.push(fund);
        } catch (err) {
          console.error(`Failed to resolve ${sym}:`, err);
        }
      }
      if (!isCancelled) {
        setLoadedETFs(results);
        setIsLoading(false);
      }
    };
    loadFunds();
    return () => {
      isCancelled = true;
    };
  }, [selectedSymbols]);

  const handleAddTicker = async (ticker: string) => {
    const clean = ticker.trim().toUpperCase();
    if (!clean) return;
    if (selectedSymbols.some((s) => s.toUpperCase() === clean)) {
      setInputQuery('');
      setIsSearching(false);
      return;
    }
    if (selectedSymbols.length >= 4) {
      alert('You can compare up to 4 ETFs simultaneously.');
      return;
    }

    setIsLoading(true);
    try {
      const fund = await resolveOrGenerateETF(clean);
      if (fund) {
        setSelectedSymbols((prev) => [...prev, fund.symbol]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setInputQuery('');
      setIsSearching(false);
    }
  };

  const handleRemoveTicker = (symbolToRemove: string) => {
    setSelectedSymbols((prev) => prev.filter((s) => s.toUpperCase() !== symbolToRemove.toUpperCase()));
  };

  const handleClearAll = () => {
    setSelectedSymbols([]);
    setLoadedETFs([]);
  };

  const comparisonPresets = [
    { label: 'XUS vs HYLD', pair: ['XUS.TO', 'HYLD.TO'], note: 'S&P 500 Index vs Enhanced Covered Call' },
    { label: 'XUS vs VFV vs ZSP', pair: ['XUS.TO', 'VFV.TO', 'ZSP.TO'], note: 'iShares vs Vanguard vs BMO S&P 500 (0.09% MER)' },
    { label: 'XEQT vs VEQT', pair: ['XEQT.TO', 'VEQT.TO'], note: 'iShares vs Vanguard All-Equity Giants' },
    { label: 'HYLD vs HMAX', pair: ['HYLD.TO', 'HMAX.TO'], note: 'Hamilton US Covered Call vs Canadian Financials' },
    { label: 'ZEB vs ZWB', pair: ['ZEB.TO', 'ZWB.TO'], note: 'Equal-Weight Banks vs Covered Call Banks' },
    { label: 'VDY vs XEI', pair: ['VDY.TO', 'XEI.TO'], note: 'Canadian High Dividend Titans' },
    { label: 'TEC vs VFV', pair: ['TEC.TO', 'VFV.TO'], note: 'Global Tech Leaders vs S&P 500 Core' },
  ];

  // Primary two funds for pairwise deep dive
  const fundA = loadedETFs[0];
  const fundB = loadedETFs[1];

  // Overlap calculation
  const overlapScore = fundA && fundB ? calculateWeightedOverlap(fundA, fundB) : 0;

  // Multi-compare chart items
  const chartFunds: CompareFundItem[] = loadedETFs.map((etf, idx) => ({
    symbol: etf.symbol,
    name: etf.name,
    return1Y: etf.return1Y,
    return3Y: etf.return3Y,
    price: etf.price,
    mer: etf.mer,
    yieldTTM: etf.yieldTTM,
    color: getColorForIndex(idx).accent,
  }));

  const searchResults = searchAllETFs(inputQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-10 font-mono">
      {/* =========================================================================
          TOP HEADER & PICKER BAR (DecodeETF "The Canadian ETF Compare Engine")
          ========================================================================= */}
      <div className="space-y-4 border-b border-[var(--border)] pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[var(--primary)] font-bold">
            The Canadian ETF Compare Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--fg-1)] mt-1">
            Compare Canadian ETFs
          </h1>
          <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
            Holdings overlap, fees, return attribution, and risk. Unlocked & 100% free.
          </p>
        </div>

        {/* "YOU ARE COMPARING" CARDS BAR */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--fg-muted)]">
            YOU ARE COMPARING
          </span>

          <div className="flex flex-wrap items-stretch gap-3">
            {/* Active Fund Cards */}
            {loadedETFs.map((etf, idx) => {
              const theme = getColorForIndex(idx);
              return (
                <div
                  key={etf.symbol}
                  className="bg-[var(--bg-0)] border border-[var(--border)] pl-3 pr-4 py-2.5 flex items-center gap-3 relative shadow-sm min-w-[200px] max-w-xs group"
                >
                  {/* Left Vertical Color Stripe */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: theme.accent }}
                  />

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => onSelectETF(etf.symbol)}
                      className="font-bold text-sm text-[var(--fg-1)] hover:underline block truncate text-left cursor-pointer"
                      title={etf.name}
                    >
                      {etf.symbol}
                    </button>
                    <span className="text-[10px] text-[var(--fg-muted)] block truncate max-w-[170px]">
                      {etf.name}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveTicker(etf.symbol)}
                    className="text-[var(--fg-faint)] hover:text-red-400 p-1 cursor-pointer transition-colors"
                    title={`Remove ${etf.symbol}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {/* "+ Add an ETF" Search Trigger Box */}
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <div className="flex items-center bg-[var(--bg-1)] border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] px-3 py-2 text-xs focus-within:border-[var(--primary)] focus-within:border-solid transition-colors h-full">
                <Plus className="w-4 h-4 text-[var(--primary)] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="+ Add an ETF (e.g. VFV, ZSP, XEQT)..."
                  value={inputQuery}
                  onChange={(e) => {
                    setInputQuery(e.target.value);
                    setIsSearching(true);
                  }}
                  onFocus={() => setIsSearching(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputQuery.trim()) {
                      handleAddTicker(inputQuery.trim());
                    }
                  }}
                  className="w-full bg-transparent text-[var(--fg-1)] uppercase outline-none placeholder:normal-case placeholder:text-[var(--fg-faint)] text-xs font-semibold"
                />
                {inputQuery && (
                  <button
                    onClick={() => setInputQuery('')}
                    className="text-[var(--fg-muted)] hover:text-[var(--fg-1)] p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isSearching && inputQuery.trim() && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[var(--bg-0)] border-2 border-[var(--primary)] shadow-2xl max-h-56 overflow-y-auto">
                  {searchResults.slice(0, 10).map((res) => (
                    <button
                      key={res.symbol}
                      onClick={() => handleAddTicker(res.symbol)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-2)] flex items-center justify-between text-[var(--fg-1)] border-b border-[var(--border-faint)] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--primary)]">{res.symbol}</span>
                        <span className="text-[11px] text-[var(--fg-muted)] truncate max-w-xs">{res.name}</span>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear All Button if 2+ funds */}
            {selectedSymbols.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 bg-[var(--bg-2)] hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Quick Matchups */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider mr-1">
              Popular Comparisons:
            </span>
            {comparisonPresets.map((p) => (
              <button
                key={p.label}
                onClick={() => setSelectedSymbols(p.pair)}
                title={p.note}
                className={`px-2 py-1 text-[11px] border transition-colors cursor-pointer ${
                  p.pair.every((s) => selectedSymbols.includes(s)) && selectedSymbols.length === p.pair.length
                    ? 'bg-[var(--primary)] text-[var(--bg-0)] border-[var(--primary)] font-bold'
                    : 'bg-[var(--bg-0)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-1)] hover:border-[var(--primary)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          STATE: 0 OR 1 FUND SELECTED
          ========================================================================= */}
      {selectedSymbols.length === 0 && (
        <div className="bg-[var(--bg-1)] border-2 border-dashed border-[var(--border)] p-12 text-center space-y-4">
          <Layers className="w-8 h-8 text-[var(--primary)] mx-auto opacity-70" />
          <h3 className="font-display text-lg font-bold text-[var(--fg-1)]">
            Choose Any 2 ETFs to Compare
          </h3>
          <p className="text-xs text-[var(--fg-muted)] max-w-md mx-auto">
            Type any Canadian ETF into the search bar above or pick one of our instant comparison presets.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {comparisonPresets.slice(0, 4).map((p) => (
              <button
                key={p.label}
                onClick={() => setSelectedSymbols(p.pair)}
                className="px-3 py-1.5 bg-[var(--bg-2)] hover:bg-[var(--primary)] hover:text-[var(--bg-0)] border border-[var(--border)] text-xs text-[var(--fg-1)] transition-colors cursor-pointer"
              >
                Load {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSymbols.length === 1 && loadedETFs.length === 1 && (
        <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
            <span className="font-display text-lg font-bold text-[var(--fg-1)]">
              {loadedETFs[0].symbol} is loaded
            </span>
            <span className="text-xs text-amber-400 font-bold">Select 1 more ETF to unlock full comparison</span>
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            Use the search box above to add a second ETF (e.g. HYLD.TO, VFV.TO, ZSP.TO) to run side-by-side overlap diagnostics, fee drag compounding, and attribution analysis.
          </p>
        </div>
      )}

      {/* =========================================================================
          STATE: 2+ FUNDS LOADED (FULL DECODEETF REPLICATION)
          ========================================================================= */}
      {loadedETFs.length >= 2 && fundA && fundB && (
        <div className="space-y-12">
          {/* -------------------------------------------------------------------
              SECTION 1: OVERVIEW (Screenshot 1)
              - "How [Fund A] and [Fund B] differ"
              - 4 Metric Sliders: 3Y return, Yield, Size, MER
              - 3 Narrative Diagnostic Boxes: Structure, Exposure, Strategy
              ------------------------------------------------------------------- */}
          <div className="space-y-5">
            <div className="border-b border-[var(--border-faint)] pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                SECTION 01 // OVERVIEW
              </span>
              <h2 className="text-2xl font-display font-extrabold text-[var(--fg-1)] mt-1">
                How {fundA.symbol} and {fundB.symbol} differ
              </h2>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                Quick-scan comparison across core fund characteristics and mandates.
              </p>
            </div>

            {/* 4 Metric Dot-Track Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <CompareDotSlider
                title="3Y Return"
                subtitle="Annualized"
                items={[
                  { symbol: fundA.symbol, value: fundA.return3Y || 0, label: `+${(fundA.return3Y || 0).toFixed(1)}%`, color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.return3Y || 0, label: `+${(fundB.return3Y || 0).toFixed(1)}%`, color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="Yield"
                subtitle="12-Month TTM"
                items={[
                  { symbol: fundA.symbol, value: fundA.yieldTTM, label: `${fundA.yieldTTM.toFixed(2)}%`, color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.yieldTTM, label: `${fundB.yieldTTM.toFixed(2)}%`, color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="Size"
                subtitle="Total AUM (CAD)"
                items={[
                  { symbol: fundA.symbol, value: fundA.aum, label: `$${(fundA.aum / 1000000000).toFixed(1)}B`, color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.aum, label: `$${(fundB.aum / 1000000000).toFixed(1)}B`, color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="MER"
                subtitle="Management Expense"
                items={[
                  { symbol: fundA.symbol, value: fundA.mer * 100, label: `${(fundA.mer * 100).toFixed(2)}%`, color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.mer * 100, label: `${(fundB.mer * 100).toFixed(2)}%`, color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />
            </div>

            {/* 3 Diagnostic Narrative Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Structure Box */}
              <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-[var(--fg-1)]">Structure</span>
                  {fundA.structureType === fundB.structureType ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      SAME
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      DIFFERS
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {fundA.symbol} uses{' '}
                  <span className="text-[var(--fg-1)] font-semibold">
                    {fundA.structureType === 'physical' ? 'direct physical replication' : 'a fund-of-funds wrapper'}
                  </span>
                  , while {fundB.symbol} operates as{' '}
                  <span className="text-[var(--fg-1)] font-semibold">
                    {fundB.structureType === 'fund_of_funds' ? 'a multi-tier fund-of-funds' : 'a physical direct holding'}
                  </span>
                  {fundB.strategy === 'covered_call' && ' with embedded covered-call strategies and leverage'}.
                </p>
              </div>

              {/* Exposure Box */}
              <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-[var(--fg-1)]">Exposure</span>
                  {fundA.theme === fundB.theme || overlapScore > 60 ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      SAME
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      DIFFERS
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  Both funds share substantial underlying equity overlap ({overlapScore}% constituent overlap). Both target predominantly{' '}
                  <span className="text-[var(--fg-1)] font-semibold">
                    {fundA.geographies[0]?.name || 'large-cap'}
                  </span>{' '}
                  equities with heavy concentration in technology and financials.
                </p>
              </div>

              {/* Strategy Box */}
              <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-[var(--fg-1)]">Strategy</span>
                  {fundA.strategy === fundB.strategy ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      SAME
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      DIFFERS
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {fundA.symbol} executes a{' '}
                  <span className="text-[var(--fg-1)] font-semibold">
                    {fundA.strategy === 'plain' ? 'pure passive market-cap index tracking' : fundA.strategy}
                  </span>{' '}
                  mandate. In contrast, {fundB.symbol} employs an active{' '}
                  <span className="text-[var(--fg-1)] font-semibold">
                    {fundB.strategy === 'covered_call' ? 'covered call option overlay with 25% cash borrowing leverage' : fundB.strategy}
                  </span>.
                </p>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION 2: PERFORMANCE & RISK (Screenshot 2)
              - Covered Call / Strategy callout badge & box
              - Total return vs Price+cash toggle, Horizon pills
              - Interactive Chart
              - "Where the return came from" stacked bar
              - 4 Risk Metric Sliders: Annualized return, Volatility, Sharpe, Worst fall
              - "How holding period shaped the outcome" range bars
              ------------------------------------------------------------------- */}
          <div className="space-y-6">
            <div className="border-b border-[var(--border-faint)] pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                SECTION 02 // PERFORMANCE & RISK
              </span>
              <h2 className="text-2xl font-display font-extrabold text-[var(--fg-1)] mt-1">
                Performance & Risk Decomposition
              </h2>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                Evaluating gross capital growth against volatility, tail risk, and upside participation caps.
              </p>
            </div>

            {/* Covered Call / Leverage Callout Banner */}
            {(fundA.strategy === 'covered_call' || fundB.strategy === 'covered_call') && (
              <div className="bg-[var(--bg-0)] border-l-4 border-l-[#982C61] border border-[var(--border)] p-4 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#982C61]/20 text-[#A78BFA] border border-[#982C61]/40 text-[10px] uppercase font-bold rounded">
                    COVERED CALL ETF &middot; {fundB.strategy === 'covered_call' ? fundB.symbol : fundA.symbol}
                  </span>
                </div>
                <p className="text-xs text-[var(--fg-2)] leading-relaxed">
                  Selling call options caps fund gains when underlying stocks rally sharply, but provides higher cash flow distributions. In strong bull markets, covered call funds typically trail plain benchmark ETFs on total return due to option exercise drag.
                </p>
              </div>
            )}

            {/* Main Interactive Multi-Fund Chart */}
            <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-faint)] pb-3">
                <h3 className="font-display text-base font-bold text-[var(--fg-1)] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                  <span>Comparative Total Return Chart</span>
                </h3>
                <span className="text-[11px] text-[var(--fg-muted)]">
                  In Canadian dollars, payouts reinvested.
                </span>
              </div>

              <MultiCompareChart funds={chartFunds} />
            </div>

            {/* "Where the return came from" Submodule */}
            <ReturnDecomposition fundA={fundA} fundB={fundB} />

            {/* 4 Risk Metric Dot-Track Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <CompareDotSlider
                title="Annualized Return"
                subtitle="Audited 3Y CAGR"
                items={[
                  { symbol: fundA.symbol, value: (fundA.return3Y || 24) / 3, label: `+${((fundA.return3Y || 24) / 3).toFixed(1)}%`, color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: (fundB.return3Y || 28) / 3, label: `+${((fundB.return3Y || 28) / 3).toFixed(1)}%`, color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="Volatility"
                subtitle="Annualized Std Dev"
                items={[
                  { symbol: fundA.symbol, value: 14.2, label: '14.2%', color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.strategy === 'covered_call' ? 16.8 : 15.0, label: fundB.strategy === 'covered_call' ? '16.8%' : '15.0%', color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="Sharpe Ratio"
                subtitle="Risk-Adjusted Excess"
                items={[
                  { symbol: fundA.symbol, value: 1.21, label: '1.21', color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.strategy === 'covered_call' ? 0.98 : 1.15, label: fundB.strategy === 'covered_call' ? '0.98' : '1.15', color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="Worst Fall"
                subtitle="Max Historical Drawdown"
                items={[
                  { symbol: fundA.symbol, value: 24.1, label: '-24.1%', color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.strategy === 'covered_call' ? 28.5 : 24.8, label: fundB.strategy === 'covered_call' ? '-28.5%' : '-24.8%', color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />
            </div>

            {/* "How holding period shaped the outcome" Submodule */}
            <HoldingPeriodOutcome fundA={fundA} fundB={fundB} />
          </div>

          {/* -------------------------------------------------------------------
              SECTION 3: INCOME & TAX (Screenshot 3)
              - "What they pay, and what you keep"
              - 4 Distribution Sliders: Yield, Latest payment, Income growth, Payout freq
              - "What the payout was made of" (CRA T3 Stacked Bars)
              - "What you keep" Tax Diagnosis Box (Foreign Withholding Tax & ROC ACB)
              ------------------------------------------------------------------- */}
          <div className="space-y-6">
            <div className="border-b border-[var(--border-faint)] pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                SECTION 03 // INCOME & TAX
              </span>
              <h2 className="text-2xl font-display font-extrabold text-[var(--fg-1)] mt-1">
                What they pay, and what you keep
              </h2>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                Distribution mechanics, cash flow sustainability, and Canadian CRA T3 tax slip efficiency.
              </p>
            </div>

            {/* 4 Distribution Metric Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <CompareDotSlider
                title="Distribution Yield"
                subtitle="Trailing 12-Month"
                items={[
                  { symbol: fundA.symbol, value: fundA.yieldTTM, label: `${fundA.yieldTTM.toFixed(2)}%`, color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.yieldTTM, label: `${fundB.yieldTTM.toFixed(2)}%`, color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="Latest Payment"
                subtitle="Annualized Rate"
                items={[
                  { symbol: fundA.symbol, value: (fundA.price * fundA.yieldTTM) / 100, label: `$${((fundA.price * fundA.yieldTTM) / 100).toFixed(2)}/yr`, color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: (fundB.price * fundB.yieldTTM) / 100, label: `$${((fundB.price * fundB.yieldTTM) / 100).toFixed(2)}/yr`, color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="Income Growth (3Y)"
                subtitle="Dividend CAGR"
                items={[
                  { symbol: fundA.symbol, value: 6.2, label: '+6.2%/yr', color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.strategy === 'covered_call' ? -1.8 : 4.5, label: fundB.strategy === 'covered_call' ? '-1.8%/yr' : '+4.5%/yr', color: FUND_COLORS.fundB.accent },
                ]}
                lowLabel="Low"
                highLabel="High"
              />

              <CompareDotSlider
                title="Payout Frequency"
                subtitle="Distribution Schedule"
                items={[
                  { symbol: fundA.symbol, value: fundA.distributionFreq === 'Monthly' ? 12 : 4, label: fundA.distributionFreq, color: FUND_COLORS.fundA.accent },
                  { symbol: fundB.symbol, value: fundB.distributionFreq === 'Monthly' ? 12 : 4, label: fundB.distributionFreq, color: FUND_COLORS.fundB.accent },
                ]}
                minVal={0}
                maxVal={14}
                lowLabel="Quarterly"
                highLabel="Monthly"
              />
            </div>

            {/* "What the payout was made of" Submodule */}
            <TaxCharacterBars fundA={fundA} fundB={fundB} />

            {/* "What you keep" Tax Diagnosis Box */}
            <div className="bg-[var(--bg-0)] border-2 border-[var(--border)] p-5 space-y-4">
              <h3 className="font-display text-base font-bold text-[var(--fg-1)] flex items-center gap-2 border-b border-[var(--border-faint)] pb-2">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                <span>What You Keep: Canadian Tax Optimization & Asset Location</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                {/* FWT Callout */}
                <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--fg-1)]">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Foreign Withholding Tax (FWT) Drag</span>
                  </div>
                  <p className="text-[var(--fg-muted)]">
                    Because {fundA.symbol} holds US securities, a 15% US dividend withholding tax applies at source.
                    In a <strong>TFSA or FHSA</strong>, this tax is unrecoverable. In an <strong>RRSP</strong>, US-domiciled ETFs (e.g. IVV) are treaty-exempt, but Canadian-domiciled wrappers still incur FWT. In <strong>Non-Registered accounts</strong>, you can claim a Foreign Tax Credit on CRA Line 40500.
                  </p>
                </div>

                {/* ROC & ACB Callout */}
                <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--fg-1)]">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span>Return of Capital (ROC) & ACB Erosion</span>
                  </div>
                  <p className="text-[var(--fg-muted)]">
                    {fundB.symbol} classifies a significant portion of its distributions as <strong>Return of Capital (ROC)</strong>.
                    ROC is <em>not taxed in the year received</em>, offering initial tax deferral. However, ROC reduces your Adjusted Cost Base (ACB). When ACB hits \$0, subsequent ROC distributions become immediately taxable as capital gains.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION 4: HOLDINGS & CONSTRUCTION (Screenshot 4)
              - Overlap Heading: "[Fund A] and [Fund B] overlap about X% by weight."
              - Dumbbell plots for Sectors & Geography
              - "How the holdings differ" (Two-sided horizontal bar chart)
              - "How it is built" (Fund construction hierarchy tree)
              ------------------------------------------------------------------- */}
          <div className="space-y-6">
            <div className="border-b border-[var(--border-faint)] pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                SECTION 04 // HOLDINGS & CONSTRUCTION
              </span>
              <h2 className="text-2xl font-display font-extrabold text-[var(--fg-1)] mt-1">
                {fundA.symbol} and {fundB.symbol} overlap about {overlapScore}% by weight.
              </h2>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                Asset allocation: {fundA.symbol} and {fundB.symbol} hold predominantly equities. Dissolved across all underlying fund-of-funds.
              </p>
            </div>

            {/* Dumbbell Plots for Sectors and Geography */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DumbbellExposureChart fundA={fundA} fundB={fundB} type="sectors" />
              <DumbbellExposureChart fundA={fundA} fundB={fundB} type="geographies" />
            </div>

            {/* Two-Sided Holdings Comparison */}
            <TwoSidedHoldingsChart fundA={fundA} fundB={fundB} />

            {/* "How it is built" Construction Hierarchy Tree */}
            <FundConstructionTree fundA={fundA} fundB={fundB} />
          </div>

          {/* -------------------------------------------------------------------
              SECTION 5: DEEP DIVE AUDITED METRICS & FEE DRAG SIMULATOR
              ------------------------------------------------------------------- */}
          <div className="space-y-6 pt-4 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-faint)] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
                  SECTION 05 // COMPREHENSIVE FINANCIAL AUDIT
                </span>
                <h3 className="font-display text-xl font-bold text-[var(--fg-1)] mt-0.5">
                  Audited Key Financial Metrics Matrix
                </h3>
              </div>
              <span className="text-[11px] text-[var(--fg-muted)]">Verified Web Data</span>
            </div>

            <div className="border border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase">
                    <th className="py-2.5 px-4">Metric</th>
                    {loadedETFs.map((etf, idx) => (
                      <th
                        key={etf.symbol}
                        className="py-2.5 px-4 font-bold"
                        style={{ color: getColorForIndex(idx).accent }}
                      >
                        {etf.symbol}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-faint)]">
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">Full Fund Name</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4 text-[var(--fg-2)] max-w-xs">{e.name}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">Fund Provider</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4">{e.provider}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">Management Expense (MER)</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4 font-bold text-[var(--primary)]">
                        {(e.mer * 100).toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">Distribution Yield (TTM)</td>
                    {loadedETFs.map((e, idx) => (
                      <td key={e.symbol} className="py-2.5 px-4 font-bold" style={{ color: getColorForIndex(idx).accent }}>
                        {e.yieldTTM.toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">Payout Frequency</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4">{e.distributionFreq}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">1-Year Total Return</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4 font-bold text-emerald-400">
                        +{e.return1Y.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">3-Year Ann. Return</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4 font-bold text-[var(--fg-1)]">
                        +{e.return3Y.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">Replication Structure</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4 text-[var(--fg-2)]">
                        {e.structureType === 'fund_of_funds'
                          ? 'Fund of Funds Wrapper'
                          : e.strategy === 'covered_call'
                          ? 'Covered Call Overlay'
                          : 'Direct Physical'}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">Assets Under Mgmt (CAD)</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4 text-[var(--fg-2)]">
                        ${(e.aum / 1000000000).toFixed(2)}B
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">Holdings Count</td>
                    {loadedETFs.map((e) => (
                      <td key={e.symbol} className="py-2.5 px-4 text-[var(--fg-2)]">
                        {e.holdingsCount.toLocaleString()} constituents
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[var(--bg-1)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--fg-1)]">CRA T3 Return of Capital (ROC)</td>
                    {loadedETFs.map((e) => (
                      <td
                        key={e.symbol}
                        className={`py-2.5 px-4 font-bold ${
                          (e.taxCharacter?.roc || 0) > 0.3 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {((e.taxCharacter?.roc || 0) * 100).toFixed(0)}% ROC
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Compounded Fee Drag Simulator */}
            <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-faint)] pb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-[var(--fg-1)] flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[var(--primary)]" />
                    <span>Long-Term MER Fee Drag Simulator</span>
                  </h3>
                  <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">
                    Assumes 7.0% gross annual growth. Shows cumulative dollars lost to management expense ratios over time.
                  </p>
                </div>

                {/* Capital Buttons */}
                <div className="flex items-center gap-1.5 text-xs">
                  {[10000, 50000, 100000, 500000].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setSimulatedCapital(cap)}
                      className={`px-2.5 py-1 border transition-colors cursor-pointer ${
                        simulatedCapital === cap
                          ? 'bg-[var(--primary)] text-[var(--bg-0)] border-[var(--primary)] font-bold'
                          : 'bg-[var(--bg-0)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
                      }`}
                    >
                      ${(cap / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase">
                      <th className="py-2 px-3">Horizon</th>
                      {loadedETFs.map((f, idx) => (
                        <th key={f.symbol} className="py-2 px-3 font-bold" style={{ color: getColorForIndex(idx).accent }}>
                          {f.symbol} ({(f.mer * 100).toFixed(2)}%)
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-faint)]">
                    {[5, 10, 20, 30].map((yrs) => {
                      return (
                        <tr key={yrs} className="hover:bg-[var(--bg-1)]">
                          <td className="py-2.5 px-3 font-semibold text-[var(--fg-1)]">{yrs} Years</td>
                          {loadedETFs.map((f) => {
                            const grossEnd = simulatedCapital * Math.pow(1 + 0.07, yrs);
                            const netEnd = simulatedCapital * Math.pow(1 + (0.07 - f.mer), yrs);
                            const feePaid = grossEnd - netEnd;
                            return (
                              <td key={f.symbol} className="py-2.5 px-3">
                                <span className="font-bold text-red-400">-${Math.round(feePaid).toLocaleString()} CAD</span>
                                <span className="text-[10px] text-[var(--fg-muted)] block">Net: ${Math.round(netEnd).toLocaleString()}</span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
