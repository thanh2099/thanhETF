import React, { useState } from 'react';
import { Search, ArrowUpDown, Layers, Star, Download, Filter, CheckSquare, Square } from 'lucide-react';
import { ETF_DATABASE, ETFSummary } from '../data/etfData';

interface DirectoryViewProps {
  onSelectETF: (symbol: string) => void;
  onCompareSelected: (symbols: string[]) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  onSelectETF,
  onCompareSelected,
}) => {
  const [activeAssetClass, setActiveAssetClass] = useState<string>('All');
  const [activeStrategy, setActiveStrategy] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'aum' | 'return1Y' | 'yieldTTM'>('aum');

  const assetClasses = ['All', 'Equity', 'Fixed Income', 'Multi-Asset', 'Cash', 'Covered Call'];
  const strategies = ['All', 'plain', 'covered_call'];

  const filtered = ETF_DATABASE.filter((etf) => {
    const matchesAsset = activeAssetClass === 'All' || etf.assetClass === activeAssetClass;
    const matchesStrategy = activeStrategy === 'All' || etf.strategy === activeStrategy;
    const matchesSearch =
      searchFilter === '' ||
      etf.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
      etf.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      etf.provider.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesAsset && matchesStrategy && matchesSearch;
  }).sort((a, b) => b[sortField] - a[sortField]);

  const toggleSelect = (sym: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const getReturnBadgeClass = (ret: number) => {
    if (ret >= 20) return 'bg-[var(--ret-up-2-bg)] text-[var(--ret-up-2-fg)]';
    if (ret > 0) return 'bg-[var(--ret-up-1-bg)] text-[var(--ret-up-1-fg)]';
    if (ret === 0) return 'bg-[var(--ret-flat-bg)] text-[var(--ret-flat-fg)]';
    if (ret > -15) return 'bg-[var(--ret-down-1-bg)] text-[var(--ret-down-1-fg)]';
    return 'bg-[var(--ret-down-2-bg)] text-[var(--ret-down-2-fg)]';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-6">
      {/* Title & Filter Bar */}
      <div className="space-y-4 border-b border-[var(--border)] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] font-bold">
              CANADIAN ETF DIRECTORY & SCREENER
            </span>
            <h1 className="text-3xl font-display font-extrabold text-[var(--fg-1)] mt-1">
              Canadian ETF Directory
            </h1>
            <p className="text-xs text-[var(--fg-2)] mt-0.5">
              Browse 1,776 Canadian ETFs. Tap any fund to open look-through holdings or check rows to compare.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--fg-muted)] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search symbol, issuer..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-[var(--bg-2)] border border-[var(--border)] pl-8 pr-3 py-1.5 text-xs text-[var(--fg-1)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <span className="text-[var(--fg-muted)] text-[11px] mr-1">ASSET:</span>
            {assetClasses.map((ac) => (
              <button
                key={ac}
                onClick={() => setActiveAssetClass(ac)}
                className={`px-2.5 py-1 border cursor-pointer ${
                  activeAssetClass === ac
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold'
                    : 'bg-[var(--bg-1)] text-[var(--fg-2)] border-[var(--border)] hover:text-[var(--fg-1)]'
                }`}
              >
                {ac}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[var(--fg-muted)] text-[11px]">SORT BY:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-[var(--bg-2)] border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--fg-1)]"
            >
              <option value="aum">Reported AUM ($)</option>
              <option value="return1Y">1Y Total Return (%)</option>
              <option value="yieldTTM">Distribution Yield (%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 8-COLUMN DATA GRID */}
      <div className="bg-[var(--bg-1)] border border-[var(--border)] overflow-hidden">
        {/* Super Header: Returns */}
        <div className="hidden md:grid grid-cols-12 px-4 pt-2 text-[10px] font-mono uppercase tracking-widest text-[var(--fg-faint)] border-b border-[var(--border-faint)]">
          <div className="col-span-1"></div>
          <div className="col-span-4"></div>
          <div className="col-span-3 text-center border-b border-[var(--primary)] pb-0.5 text-[var(--primary)] font-bold">
            Total Returns
          </div>
          <div className="col-span-4"></div>
        </div>

        {/* Main Column Headers */}
        <div className="grid grid-cols-12 px-4 py-2.5 bg-[var(--bg-2)] border-b border-[var(--border)] font-mono text-[11px] font-bold text-[var(--fg-muted)] uppercase">
          <div className="col-span-1 flex items-center">#</div>
          <div className="col-span-4">ETF / Legal Fund Name</div>
          <div className="col-span-1 text-center">YTD</div>
          <div className="col-span-1 text-center">1Y</div>
          <div className="col-span-1 text-center">3Y</div>
          <div className="col-span-1 text-center">Yield</div>
          <div className="col-span-2 text-right">Reported AUM</div>
          <div className="col-span-1 text-right">MER</div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-[var(--border-faint)] font-mono text-xs">
          {filtered.map((etf, idx) => {
            const isSelected = selectedSymbols.includes(etf.symbol);
            return (
              <div
                key={etf.symbol}
                className={`grid grid-cols-12 items-center px-4 py-3 hover:bg-[var(--bg-2)] transition-colors ${
                  isSelected ? 'bg-[var(--primary-subtle)]' : ''
                }`}
              >
                {/* Checkbox & Rank */}
                <div className="col-span-1 flex items-center gap-2">
                  <button
                    onClick={() => toggleSelect(etf.symbol)}
                    className="text-[var(--fg-muted)] hover:text-[var(--primary)] cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[var(--primary)]" />
                    ) : (
                      <Square className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-[10px] text-[var(--fg-faint)]">{idx + 1}</span>
                </div>

                {/* ETF Compound Identity */}
                <div className="col-span-4 pr-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectETF(etf.symbol)}
                      className="font-bold text-sm text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      {etf.symbol}
                    </button>
                    <span className="text-[10px] px-1 bg-[var(--bg-3)] border border-[var(--border)] text-[var(--fg-faint)]">
                      {etf.exchange}
                    </span>
                    {etf.strategy === 'covered_call' && (
                      <span className="text-[10px] px-1 bg-[var(--accent-2-muted)] text-[var(--accent-2-fg)] font-bold">
                        Covered Call
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--fg-2)] truncate mt-0.5">{etf.name}</div>
                  <div className="text-[10px] text-[var(--fg-muted)]">
                    {etf.provider} · {etf.theme}
                  </div>
                </div>

                {/* Returns: YTD, 1Y, 3Y */}
                <div className="col-span-1 text-center">
                  <span className={`px-1.5 py-0.5 text-[11px] font-bold ${getReturnBadgeClass(etf.returnYTD)}`}>
                    +{etf.returnYTD}%
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <span className={`px-1.5 py-0.5 text-[11px] font-bold ${getReturnBadgeClass(etf.return1Y)}`}>
                    +{etf.return1Y}%
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <span className={`px-1.5 py-0.5 text-[11px] font-bold ${getReturnBadgeClass(etf.return3Y)}`}>
                    +{etf.return3Y}%
                  </span>
                </div>

                {/* Yield */}
                <div className="col-span-1 text-center font-bold text-[var(--fg-1)]">
                  {etf.yieldTTM}%
                </div>

                {/* AUM */}
                <div className="col-span-2 text-right font-bold text-[var(--fg-1)]">
                  ${(etf.aum / 1e6).toFixed(0)}M
                </div>

                {/* Fee */}
                <div className="col-span-1 text-right text-[var(--fg-muted)]">
                  {(etf.mer * 100).toFixed(2)}%
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-10 text-center bg-[var(--bg-1)] border border-[var(--border)] space-y-3 font-mono">
              <p className="text-sm text-[var(--fg-muted)]">
                No pre-cached fund matched "{searchFilter}".
              </p>
              {searchFilter.trim() && (
                <button
                  onClick={() => onSelectETF(searchFilter.trim().toUpperCase())}
                  className="px-4 py-2 bg-[var(--primary)] text-[var(--bg-0)] font-bold text-xs uppercase cursor-pointer hover:opacity-90 inline-flex items-center gap-1.5"
                >
                  <span>⚡ Decode & Research "{searchFilter.trim().toUpperCase()}" Live &rarr;</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Multi-Select Compare Dock */}
      {selectedSymbols.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--bg-1)] border-2 border-[var(--primary)] shadow-2xl px-6 py-3 flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--fg-1)]">{selectedSymbols.length} ETFs Selected:</span>
            <div className="flex gap-1.5">
              {selectedSymbols.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-[var(--bg-3)] border border-[var(--border)] text-[var(--primary)] font-bold">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => onCompareSelected(selectedSymbols)}
            className="px-4 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold uppercase tracking-wider cursor-pointer hover:bg-[var(--primary-hover)]"
          >
            Compare Overlap ({selectedSymbols.length}) →
          </button>

          <button
            onClick={() => setSelectedSymbols([])}
            className="text-[var(--fg-muted)] hover:text-[var(--fg-1)] cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
