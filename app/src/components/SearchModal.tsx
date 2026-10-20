import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Zap, Loader2, Sparkles, Database } from 'lucide-react';
import { ETF_DATABASE, searchAllETFs, resolveOrGenerateETF } from '../data/etfData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectETF: (symbol: string) => void;
  onNavigate: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectETF,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodingStatus, setDecodingStatus] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const popularPicks = [
    { sym: 'XUS.TO', label: 'iShares S&P 500 (0.09% MER)' },
    { sym: 'HYLD.TO', label: 'Hamilton US Covered Call (11.8% Yield)' },
    { sym: 'HMAX.TO', label: 'Hamilton Financials Maximizer (13.9% Yield)' },
    { sym: 'XEQT.TO', label: 'iShares Core All-Equity' },
    { sym: 'VFV.TO', label: 'Vanguard S&P 500' },
    { sym: 'VDY.TO', label: 'Vanguard High Dividend' },
    { sym: 'ZWB.TO', label: 'BMO Covered Call Banks' },
    { sym: 'CASH.TO', label: 'Global X Cash Savings' },
  ];

  const searchResults = searchAllETFs(query);

  const handlePickSymbol = async (symbol: string) => {
    setIsDecoding(true);
    setDecodingStatus(`Decoding ${symbol}... querying look-through constituent book`);
    try {
      const etf = await resolveOrGenerateETF(symbol);
      setIsDecoding(false);
      onSelectETF(etf.symbol);
      onClose();
    } catch (err) {
      console.error(err);
      setIsDecoding(false);
      onSelectETF(symbol);
      onClose();
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const targetSym = searchResults.length > 0 ? searchResults[0].symbol : query.trim().toUpperCase();
      if (targetSym) {
        handlePickSymbol(targetSym);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[var(--bg-0)]/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[var(--bg-1)] border-2 border-[var(--border)] shadow-2xl p-0 overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border)] bg-[var(--bg-2)]">
          <Search className="w-5 h-5 text-[var(--primary)] mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search any ETF (e.g. XUS.TO, HYLD.TO, HMAX.TO, VFV, ZWB, QQQ)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInput}
            className="w-full bg-transparent text-[var(--fg-1)] text-sm font-mono placeholder-[var(--fg-muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg-1)] mr-3"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--bg-3)] text-[var(--fg-muted)] hover:text-[var(--fg-1)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading Overlay if decoding an ETF */}
        {isDecoding ? (
          <div className="p-8 text-center space-y-3 bg-[var(--bg-0)]">
            <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" />
            <p className="font-mono text-sm text-[var(--fg-1)] font-bold">{decodingStatus}</p>
            <p className="font-mono text-xs text-[var(--fg-muted)]">
              Dissolving fund holdings down to underlying equities and extracting CRA T3 factors...
            </p>
          </div>
        ) : (
          /* Results List */
          <div className="max-h-[420px] overflow-y-auto p-2">
            {/* Quick Picks */}
            {!query.trim() && (
              <div className="px-3 pt-2 pb-3 border-b border-[var(--border-faint)] space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg-muted)] block mb-1.5 font-semibold">
                    Popular Canadian & Yield ETFs
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularPicks.map((p) => (
                      <button
                        key={p.sym}
                        onClick={() => handlePickSymbol(p.sym)}
                        className="px-2 py-1 bg-[var(--bg-2)] hover:bg-[var(--primary)] hover:text-[var(--bg-0)] border border-[var(--border)] text-xs font-mono text-[var(--fg-1)] transition-colors cursor-pointer"
                      >
                        <strong>{p.sym}</strong> <span className="text-[10px] opacity-80">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg-muted)] block mb-1.5 font-semibold">
                    Analytical Hubs & Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                    <button
                      onClick={() => { onNavigate('indices'); onClose(); }}
                      className="px-2 py-1 bg-[var(--bg-1)] hover:bg-[var(--bg-3)] border border-[var(--border)] text-[var(--fg-1)] cursor-pointer"
                    >
                      Major Indices
                    </button>
                    <button
                      onClick={() => { onNavigate('tax_opt'); onClose(); }}
                      className="px-2 py-1 bg-[var(--bg-1)] hover:bg-[var(--bg-3)] border border-[var(--border)] text-[var(--primary)] font-semibold cursor-pointer"
                    >
                      Tax & Norbert's Gambit
                    </button>
                    <button
                      onClick={() => { onNavigate('coverage'); onClose(); }}
                      className="px-2 py-1 bg-[var(--bg-1)] hover:bg-[var(--bg-3)] border border-[var(--border)] text-[var(--fg-1)] cursor-pointer"
                    >
                      Coverage Matrix
                    </button>
                    <button
                      onClick={() => { onNavigate('new_etfs'); onClose(); }}
                      className="px-2 py-1 bg-[var(--bg-1)] hover:bg-[var(--bg-3)] border border-[var(--border)] text-[var(--fg-1)] cursor-pointer"
                    >
                      New Listings
                    </button>
                    <button
                      onClick={() => { onNavigate('articles'); onClose(); }}
                      className="px-2 py-1 bg-[var(--bg-1)] hover:bg-[var(--bg-3)] border border-[var(--border)] text-[var(--fg-1)] cursor-pointer"
                    >
                      Research Articles
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg-muted)] px-3 py-2 flex items-center justify-between">
              <span>{query.trim() ? `Search Results (${searchResults.length})` : 'Catalog Preview'}</span>
              <span className="text-[var(--primary)]">1,144+ Canadian ETFs Index</span>
            </div>

            <div className="space-y-1">
              {searchResults.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => handlePickSymbol(item.symbol)}
                  className="w-full text-left px-3 py-2.5 hover:bg-[var(--bg-3)] border border-transparent hover:border-[var(--border)] flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[var(--primary)] group-hover:underline">
                      {item.symbol}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[var(--fg-1)] line-clamp-1">{item.name}</span>
                      <span className="text-[10px] font-mono text-[var(--fg-muted)] flex items-center gap-2">
                        {item.isDecoded ? (
                          <span className="text-[var(--primary)] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Full Look-Through Ready
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Live On-Demand Universal Decode
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--fg-muted)] group-hover:text-[var(--primary)]">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[var(--bg-2)] border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--fg-muted)]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-0)] border border-[var(--border)] text-[10px]">Enter</kbd> to inspect
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-0)] border border-[var(--border)] text-[10px]">Esc</kbd> to close
            </span>
          </div>
          <span className="text-[var(--primary)] font-semibold">ThanhETF Look-Through Engine</span>
        </div>
      </div>
    </div>
  );
};
