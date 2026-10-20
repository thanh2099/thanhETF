import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Copy,
  Check,
  Filter,
  Layers,
  PieChart,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Table as TableIcon,
  BarChart2,
  ListFilter,
  X,
} from 'lucide-react';
import { ETFSummary, ETFHolding } from '../data/etfData';

interface ETFAllHoldingsSectionProps {
  etf: ETFSummary;
  onSelectHoldingSymbol?: (symbol: string) => void;
}

export const ETFAllHoldingsSection: React.FC<ETFAllHoldingsSectionProps> = ({
  etf,
  onSelectHoldingSymbol,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'weight-desc' | 'weight-asc' | 'name-asc' | 'symbol-asc'>('weight-desc');
  const [viewMode, setViewMode] = useState<'table' | 'bars'>('table');
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [customInvestment, setCustomInvestment] = useState<number>(10000);

  // Available unique sectors for filter dropdown
  const availableSectors = useMemo(() => {
    const sectorsSet = new Set<string>();
    etf.holdings.forEach((h) => {
      if (h.sector) sectorsSet.add(h.sector);
    });
    return Array.from(sectorsSet).sort();
  }, [etf.holdings]);

  // Filtered & sorted holdings
  const filteredHoldings = useMemo(() => {
    return etf.holdings
      .filter((h) => {
        const matchesQuery =
          !searchQuery.trim() ||
          h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.country.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSector = selectedSector === 'ALL' || h.sector === selectedSector;

        return matchesQuery && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === 'weight-desc') return b.weight - a.weight;
        if (sortBy === 'weight-asc') return a.weight - b.weight;
        if (sortBy === 'name-asc') return (a.displayName || a.name).localeCompare(b.displayName || b.name);
        if (sortBy === 'symbol-asc') return a.symbol.localeCompare(b.symbol);
        return 0;
      });
  }, [etf.holdings, searchQuery, selectedSector, sortBy]);

  // Pagination calculation
  const totalItems = filteredHoldings.length;
  const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(totalItems / rowsPerPage);
  const effectivePage = Math.min(currentPage, totalPages || 1);

  const paginatedHoldings = useMemo(() => {
    if (rowsPerPage === -1) return filteredHoldings;
    const startIndex = (effectivePage - 1) * rowsPerPage;
    return filteredHoldings.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredHoldings, effectivePage, rowsPerPage]);

  // Aggregate statistics
  const totalFilteredWeight = useMemo(() => {
    return filteredHoldings.reduce((sum, h) => sum + Math.max(0, h.weight), 0);
  }, [filteredHoldings]);

  const maxSingleWeight = useMemo(() => {
    return Math.max(...etf.holdings.map((h) => h.weight), 1);
  }, [etf.holdings]);

  // Export CSV handler
  const handleDownloadCSV = () => {
    const headers = ['Rank', 'Symbol', 'Name', 'Sector', 'Country', 'Via_Sleeve', 'Weight_Percent', 'Value_On_10k_CAD'];
    const rows = filteredHoldings.map((h, idx) => [
      idx + 1,
      `"${h.symbol}"`,
      `"${h.displayName || h.name}"`,
      `"${h.sector}"`,
      `"${h.country}"`,
      `"${h.viaETF || 'Direct Physical'}"`,
      h.weight.toFixed(2),
      ((h.weight / 100) * customInvestment).toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${etf.symbol}_all_holdings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy JSON handler
  const handleCopyJSON = () => {
    const exportData = filteredHoldings.map((h, idx) => ({
      rank: idx + 1,
      symbol: h.symbol,
      name: h.displayName || h.name,
      sector: h.sector,
      country: h.country,
      viaETF: h.viaETF || null,
      weight: h.weight,
      valueOnInvestment: Number(((h.weight / 100) * customInvestment).toFixed(2)),
    }));

    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for country flags
  const getCountryFlag = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes('canada')) return '🇨🇦';
    if (c.includes('united states') || c.includes('us')) return '🇺🇸';
    if (c.includes('japan')) return '🇯🇵';
    if (c.includes('united kingdom') || c.includes('uk')) return '🇬🇧';
    if (c.includes('netherlands')) return '🇳🇱';
    if (c.includes('denmark')) return '🇩🇰';
    if (c.includes('germany')) return '🇩🇪';
    if (c.includes('france')) return '🇫🇷';
    if (c.includes('switzerland')) return '🇨🇭';
    if (c.includes('taiwan')) return '🇹🇼';
    if (c.includes('korea')) return '🇰🇷';
    if (c.includes('china')) return '🇨🇳';
    if (c.includes('australia')) return '🇦🇺';
    return '🌐';
  };

  // Sector badge color mapping
  const getSectorColor = (sector: string) => {
    const s = sector.toLowerCase();
    if (s.includes('tech')) return 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10';
    if (s.includes('financ')) return 'border-blue-500/40 text-blue-400 bg-blue-500/10';
    if (s.includes('health')) return 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10';
    if (s.includes('energy')) return 'border-amber-500/40 text-amber-400 bg-amber-500/10';
    if (s.includes('consumer disc')) return 'border-purple-500/40 text-purple-400 bg-purple-500/10';
    if (s.includes('consumer stap')) return 'border-teal-500/40 text-teal-400 bg-teal-500/10';
    if (s.includes('comm')) return 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10';
    if (s.includes('indust')) return 'border-orange-500/40 text-orange-400 bg-orange-500/10';
    if (s.includes('mat')) return 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10';
    if (s.includes('util')) return 'border-lime-500/40 text-lime-400 bg-lime-500/10';
    if (s.includes('real')) return 'border-rose-500/40 text-rose-400 bg-rose-500/10';
    if (s.includes('deriv') || s.includes('option')) return 'border-red-500/40 text-red-400 bg-red-500/10';
    return 'border-zinc-500/40 text-zinc-400 bg-zinc-500/10';
  };

  return (
    <div className="space-y-6 font-mono">
      {/* =========================================================================
          1. SECTION HEADER & INSTITUTIONAL NARRATIVE
          ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold block">
            ALL CONSTITUENT HOLDINGS
          </span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
            100% UNLOCKED · ZERO PAYWALLS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--fg-1)]">
          All Holdings & Look-Through Weights
        </h2>
        <p className="text-xs text-[var(--fg-muted)] leading-relaxed max-w-3xl">
          Complete, unfiltered transparency into every underlying constituent holding inside{' '}
          <strong className="text-[var(--fg-1)]">{etf.symbol}</strong>. Filter by sector, search by ticker or company name,
          inspect look-through sleeves, and evaluate single-stock portfolio exposure down to fractional percentage points.
        </p>
      </div>

      {/* =========================================================================
          2. KPI SUMMARY STRIP (Total assets, filtered weight, top 10 concentration)
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-3">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">Total Holdings</div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--fg-1)] font-display">
            {etf.holdingsCount || etf.holdings.length}
          </div>
          <div className="text-[10px] text-[var(--fg-faint)]">
            {filteredHoldings.length === etf.holdings.length
              ? 'All positions listed'
              : `${filteredHoldings.length} matching filter`}
          </div>
        </div>

        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-3">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">Top 10 Concentration</div>
          <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-display">
            {(etf.top10Weight || 39.4).toFixed(1)}%
          </div>
          <div className="text-[10px] text-[var(--fg-faint)]">Share of top 10 assets</div>
        </div>

        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-3">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">Max Single Position</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-display">
            {etf.holdings[0]?.weight ? `${etf.holdings[0].weight.toFixed(1)}%` : 'N/A'}
          </div>
          <div className="text-[10px] text-[var(--fg-faint)] truncate max-w-[140px]">
            {etf.holdings[0]?.displayName || etf.holdings[0]?.name || 'Largest asset'}
          </div>
        </div>

        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-3">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">Filtered Weight</div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--primary)] font-display">
            {totalFilteredWeight.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[var(--fg-faint)]">
            ${Math.round((totalFilteredWeight / 100) * customInvestment).toLocaleString()} on ${customInvestment.toLocaleString()}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. SEARCH, SECTOR FILTER, SORT & EXPORT TOOLBAR
          ========================================================================= */}
      <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-3.5 h-3.5 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker, company, or sector..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--bg-1)] border border-[var(--border)] pl-9 pr-8 py-2 text-xs text-[var(--fg-1)] placeholder:text-[var(--fg-faint)] outline-none focus:border-[var(--primary)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-faint)] hover:text-[var(--fg-1)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls Right Group */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Sector Dropdown */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-1)] border border-[var(--border)] px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
              <select
                value={selectedSector}
                onChange={(e) => {
                  setSelectedSector(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-[var(--fg-1)] outline-none text-xs cursor-pointer"
              >
                <option value="ALL">All Sectors ({availableSectors.length})</option>
                {availableSectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-1)] border border-[var(--border)] px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[var(--fg-1)] outline-none text-xs cursor-pointer"
              >
                <option value="weight-desc">Weight: High → Low</option>
                <option value="weight-asc">Weight: Low → High</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="symbol-asc">Ticker: A → Z</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-[var(--border)] bg-[var(--bg-1)] p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'table' ? 'bg-[var(--bg-0)] text-[var(--primary)] shadow-sm' : 'text-[var(--fg-muted)]'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3 h-3" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('bars')}
                className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'bars' ? 'bg-[var(--bg-0)] text-[var(--primary)] shadow-sm' : 'text-[var(--fg-muted)]'
                }`}
                title="Bar Proportion View"
              >
                <BarChart2 className="w-3 h-3" />
                <span className="hidden sm:inline">Bars</span>
              </button>
            </div>

            {/* Export Buttons */}
            <button
              onClick={handleDownloadCSV}
              className="bg-[var(--bg-1)] hover:bg-[var(--bg-2)] border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--fg-1)] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Download CSV of filtered holdings"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={handleCopyJSON}
              className="bg-[var(--bg-1)] hover:bg-[var(--bg-2)] border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--fg-1)] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Copy JSON data"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'JSON'}</span>
            </button>
          </div>
        </div>

        {/* Investment Size Helper Slider */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-[var(--fg-muted)] border-t border-[var(--border-faint)] pt-2.5">
          <div className="flex items-center gap-2">
            <span>Calculate position dollar value on:</span>
            <div className="flex items-center gap-1">
              {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCustomInvestment(amt)}
                  className={`px-1.5 py-0.5 border text-[10px] cursor-pointer ${
                    customInvestment === amt
                      ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/10'
                      : 'border-[var(--border)] text-[var(--fg-faint)] hover:text-[var(--fg-1)]'
                  }`}
                >
                  ${(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-[var(--fg-faint)]">
            Showing <strong className="text-[var(--fg-1)]">{paginatedHoldings.length}</strong> of{' '}
            <strong className="text-[var(--fg-1)]">{totalItems}</strong> holdings
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. ALL HOLDINGS MAIN CONTENT (TABLE OR PROPORTIONAL BARS)
          ========================================================================= */}
      {filteredHoldings.length === 0 ? (
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-[var(--fg-faint)] mx-auto" />
          <h3 className="text-sm font-bold text-[var(--fg-1)]">No holdings match your search</h3>
          <p className="text-xs text-[var(--fg-muted)] max-w-sm mx-auto">
            No constituents found matching "{searchQuery}" in sector "{selectedSector}". Try clearing your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSector('ALL');
            }}
            className="px-4 py-1.5 bg-[var(--primary)] text-[var(--bg-0)] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-[var(--bg-0)] border border-[var(--border)] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-1)] text-[10px] font-bold uppercase text-[var(--fg-muted)] tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[200px]">Asset / Company</th>
                <th className="py-2.5 px-3 min-w-[140px]">Sector</th>
                <th className="py-2.5 px-3 min-w-[120px]">Country</th>
                <th className="py-2.5 px-3 min-w-[130px]">Via Sleeve</th>
                <th className="py-2.5 px-3 min-w-[160px] text-right">Weight</th>
                <th className="py-2.5 px-3 min-w-[120px] text-right">Value on ${customInvestment.toLocaleString()}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-faint)]">
              {paginatedHoldings.map((h, idx) => {
                const globalIndex = rowsPerPage === -1 ? idx + 1 : (effectivePage - 1) * rowsPerPage + idx + 1;
                const valueOnInvest = (h.weight / 100) * customInvestment;
                const isShortCall = h.weight < 0;

                return (
                  <tr
                    key={`${h.symbol}-${idx}`}
                    className="hover:bg-[var(--bg-1)]/60 transition-colors group"
                  >
                    {/* Rank */}
                    <td className="py-2.5 px-3 text-center text-[11px] text-[var(--fg-faint)] font-mono">
                      {globalIndex}
                    </td>

                    {/* Asset Name + Symbol */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--primary)] bg-[var(--bg-2)] px-1.5 py-0.5 rounded text-[11px] font-mono shrink-0">
                          {h.symbol}
                        </span>
                        <div className="truncate">
                          <span className="font-semibold text-[var(--fg-1)] block truncate">
                            {h.displayName || h.name}
                          </span>
                          {h.name && h.name !== h.displayName && (
                            <span className="text-[10px] text-[var(--fg-faint)] block truncate">
                              {h.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold border rounded-sm ${getSectorColor(h.sector)}`}>
                        {h.sector || 'Unclassified'}
                      </span>
                    </td>

                    {/* Country */}
                    <td className="py-2.5 px-3 text-[11px] text-[var(--fg-muted)]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-sm">{getCountryFlag(h.country)}</span>
                        <span>{h.country || 'Global'}</span>
                      </span>
                    </td>

                    {/* Via Sleeve / Underlying */}
                    <td className="py-2.5 px-3 text-[11px]">
                      {h.viaETF ? (
                        <span className="text-cyan-400 font-mono text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                          via {h.viaETF}
                        </span>
                      ) : (
                        <span className="text-[var(--fg-faint)] text-[10px]">
                          Direct Physical
                        </span>
                      )}
                    </td>

                    {/* Weight with Mini Progress Bar */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-[var(--bg-2)] rounded-sm overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${isShortCall ? 'bg-red-400' : 'bg-cyan-400'}`}
                            style={{ width: `${Math.min(100, Math.abs(h.weight) * (100 / maxSingleWeight))}%` }}
                          />
                        </div>
                        <span className={`font-bold font-mono text-xs ${isShortCall ? 'text-red-400' : 'text-[var(--fg-1)]'}`}>
                          {h.weight > 0 ? `${h.weight.toFixed(2)}%` : `${h.weight.toFixed(2)}%`}
                        </span>
                      </div>
                    </td>

                    {/* Dollar Value */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-xs text-[var(--fg-1)]">
                      {isShortCall ? `-$${Math.abs(valueOnInvest).toFixed(2)}` : `$${valueOnInvest.toFixed(2)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* PROPORTIONAL BARS VIEW */
        <div className="bg-[var(--bg-0)] border border-[var(--border)] p-5 space-y-3">
          <div className="text-[10px] text-[var(--fg-faint)] uppercase tracking-wider border-b border-[var(--border-faint)] pb-2 flex justify-between">
            <span>HOLDING PROPORTIONS RELATIVE TO FUND</span>
            <span>CURRENT WEIGHT</span>
          </div>

          <div className="space-y-3 pt-1">
            {paginatedHoldings.map((h, idx) => {
              const globalIndex = rowsPerPage === -1 ? idx + 1 : (effectivePage - 1) * rowsPerPage + idx + 1;
              const isShortCall = h.weight < 0;
              const barWidth = Math.min(100, (Math.abs(h.weight) / maxSingleWeight) * 100);

              return (
                <div key={`${h.symbol}-${idx}`} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--fg-faint)] font-mono w-6 text-right">
                        #{globalIndex}
                      </span>
                      <span className="font-bold text-[var(--primary)] font-mono">{h.symbol}</span>
                      <span className="text-[var(--fg-1)] font-semibold">{h.displayName || h.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 border rounded ${getSectorColor(h.sector)} hidden sm:inline`}>
                        {h.sector}
                      </span>
                      {h.viaETF && (
                        <span className="text-[9px] text-cyan-400 font-mono hidden md:inline">
                          via {h.viaETF}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[var(--fg-muted)] font-mono hidden sm:inline">
                        ${((h.weight / 100) * customInvestment).toFixed(2)}
                      </span>
                      <span className={`font-bold font-mono ${isShortCall ? 'text-red-400' : 'text-[var(--fg-1)]'}`}>
                        {h.weight.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-[var(--bg-2)] rounded-sm overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isShortCall ? 'bg-red-500' : 'bg-cyan-400'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. PAGINATION & ROWS PER PAGE FOOTER
          ========================================================================= */}
      {filteredHoldings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-0)] border border-[var(--border)] p-3 text-xs">
          {/* Rows Per Page */}
          <div className="flex items-center gap-2 text-[var(--fg-muted)]">
            <span>Show:</span>
            {[25, 50, 100, -1].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRowsPerPage(r);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 border text-xs cursor-pointer ${
                  rowsPerPage === r
                    ? 'border-[var(--primary)] text-[var(--primary)] font-bold bg-[var(--primary)]/10'
                    : 'border-[var(--border)] text-[var(--fg-faint)] hover:text-[var(--fg-1)]'
                }`}
              >
                {r === -1 ? 'All' : r}
              </button>
            ))}
            <span>holdings per page</span>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={effectivePage <= 1}
                className="px-2.5 py-1 bg-[var(--bg-1)] border border-[var(--border)] text-[var(--fg-1)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-2)] cursor-pointer flex items-center gap-1 font-bold"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="text-[var(--fg-muted)] px-2">
                Page <strong className="text-[var(--fg-1)]">{effectivePage}</strong> of{' '}
                <strong className="text-[var(--fg-1)]">{totalPages}</strong>
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={effectivePage >= totalPages}
                className="px-2.5 py-1 bg-[var(--bg-1)] border border-[var(--border)] text-[var(--fg-1)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-2)] cursor-pointer flex items-center gap-1 font-bold"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Information Footnote */}
      <div className="p-3 bg-[var(--bg-1)] border border-[var(--border-faint)] text-[11px] text-[var(--fg-muted)] space-y-1">
        <p>
          <strong className="text-[var(--fg-1)]">Institutional Look-Through Methodology:</strong> Holdings reflect
          disclosed regulatory filings and fund-of-funds dissolution. For funds holding underlying ETFs (such as{' '}
          {etf.symbol}), nested sleeves are decomposed so weights reflect actual economic exposure to the operating
          companies.
        </p>
      </div>
    </div>
  );
};
