import React, { useState, useMemo } from 'react';
import { Layers, PieChart, Globe, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { ETFHolding } from '../data/etfData';

interface LookThroughTreemapProps {
  symbol: string;
  name: string;
  holdings: ETFHolding[];
  sectors?: { name: string; weight: number }[];
  geographies?: { name: string; weight: number }[];
  onSelectStock?: (ticker: string) => void;
  className?: string;
}

export const LookThroughTreemap: React.FC<LookThroughTreemapProps> = ({
  symbol,
  name,
  holdings = [],
  sectors = [],
  geographies = [],
  onSelectStock,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'holdings' | 'sectors' | 'geography'>('holdings');
  const [hoveredItem, setHoveredItem] = useState<{ label: string; weight: number; meta?: string } | null>(null);

  // Separate direct vs wrapped (indirect) holdings
  const { topHoldings, directHoldings, lookThroughHoldings } = useMemo(() => {
    const sorted = [...holdings].sort((a, b) => b.weight - a.weight);
    const direct = sorted.filter(h => !h.viaETF);
    const lookThrough = sorted.filter(h => h.viaETF);
    return {
      topHoldings: sorted.slice(0, 16),
      directHoldings: direct,
      lookThroughHoldings: lookThrough
    };
  }, [holdings]);

  // Color generator for treemap nodes
  const getNodeColor = (idx: number, type: 'holdings' | 'sectors' | 'geography') => {
    if (type === 'sectors') {
      const colors = [
        'bg-emerald-600/20 border-emerald-500/40 text-emerald-400',
        'bg-blue-600/20 border-blue-500/40 text-blue-400',
        'bg-indigo-600/20 border-indigo-500/40 text-indigo-400',
        'bg-purple-600/20 border-purple-500/40 text-purple-400',
        'bg-amber-600/20 border-amber-500/40 text-amber-400',
        'bg-rose-600/20 border-rose-500/40 text-rose-400',
        'bg-teal-600/20 border-teal-500/40 text-teal-400',
        'bg-cyan-600/20 border-cyan-500/40 text-cyan-400',
      ];
      return colors[idx % colors.length];
    }
    if (type === 'geography') {
      const colors = [
        'bg-blue-900/30 border-blue-600/40 text-blue-300',
        'bg-emerald-900/30 border-emerald-600/40 text-emerald-300',
        'bg-amber-900/30 border-amber-600/40 text-amber-300',
        'bg-violet-900/30 border-violet-600/40 text-violet-300',
        'bg-rose-900/30 border-rose-600/40 text-rose-300',
      ];
      return colors[idx % colors.length];
    }
    // Holdings
    const colors = [
      'bg-[var(--bg-2)] border-[var(--primary)] text-[var(--fg-1)]',
      'bg-[var(--bg-2)] border-[var(--border)] text-[var(--fg-1)]',
      'bg-[var(--bg-2)] border-[var(--border)] text-[var(--fg-2)]',
    ];
    return colors[idx < 3 ? 0 : idx < 8 ? 1 : 2];
  };

  const totalCalculatedWeight = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.weight, 0);
  }, [holdings]);

  return (
    <div className={`bg-[var(--bg-1)] border border-[var(--border)] p-4 sm:p-5 font-sans ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase px-2 py-0.5 bg-[var(--primary)] text-white font-bold">
              LOOK-THROUGH VISUALIZER
            </span>
            <span className="text-xs font-mono text-[var(--fg-3)]">
              [DECOMPOSITION OF {symbol}]
            </span>
          </div>
          <p className="text-xs text-[var(--fg-2)] mt-1">
            True proportional exposure dissolved through underlying holding wrappers & fund-of-funds.
          </p>
        </div>

        {/* View Switcher */}
        <div className="inline-flex border border-[var(--border)] bg-[var(--bg-0)] p-0.5">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
              activeTab === 'holdings'
                ? 'bg-[var(--fg-1)] text-[var(--bg-0)] font-bold'
                : 'text-[var(--fg-3)] hover:text-[var(--fg-1)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            True Holdings ({holdings.length})
          </button>
          <button
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
              activeTab === 'sectors'
                ? 'bg-[var(--fg-1)] text-[var(--bg-0)] font-bold'
                : 'text-[var(--fg-3)] hover:text-[var(--fg-1)]'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            Sectors ({sectors.length})
          </button>
          <button
            onClick={() => setActiveTab('geography')}
            className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
              activeTab === 'geography'
                ? 'bg-[var(--fg-1)] text-[var(--bg-0)] font-bold'
                : 'text-[var(--fg-3)] hover:text-[var(--fg-1)]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Geographies ({geographies.length})
          </button>
        </div>
      </div>

      {/* Look-Through Visual Grid / Treemap */}
      <div className="mt-4">
        {activeTab === 'holdings' && (
          <div>
            {/* Treemap Mosaic for Top 16 Holdings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
              {topHoldings.map((h, idx) => {
                const isLarge = idx < 2;
                const isMedium = idx >= 2 && idx < 6;
                const colSpan = isLarge ? 'col-span-2 row-span-2' : isMedium ? 'col-span-2' : 'col-span-1';

                return (
                  <div
                    key={`${h.symbol}-${idx}`}
                    onMouseEnter={() => setHoveredItem({
                      label: `${h.displayName || h.name} (${h.symbol})`,
                      weight: h.weight,
                      meta: h.viaETF ? `Held via ${h.viaETF} · ${h.sector || ''}` : h.sector || 'Direct Holding'
                    })}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => onSelectStock && onSelectStock(h.symbol)}
                    className={`${colSpan} p-2.5 border rounded-none flex flex-col justify-between transition-all cursor-pointer ${
                      getNodeColor(idx, 'holdings')
                    } hover:border-[var(--primary)] hover:scale-[1.01]`}
                    style={{ minHeight: isLarge ? '120px' : '72px' }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs">
                          {h.symbol}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[var(--primary)]">
                          {h.weight.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-[var(--fg-2)] truncate mt-0.5">
                        {h.displayName || h.name}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--fg-3)] mt-2">
                      <span className="truncate max-w-[80px]">{h.sector || 'Equities'}</span>
                      {h.viaETF && (
                        <span className="px-1 py-0.2 bg-[var(--bg-0)] text-[var(--primary)] border border-[var(--border)] text-[9px]">
                          via {h.viaETF}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Look-Through Decomposition Explainer Banner */}
            {lookThroughHoldings.length > 0 && (
              <div className="mt-3 p-3 bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-[var(--fg-2)]">
                    <strong className="text-[var(--fg-1)]">{lookThroughHoldings.length} holdings</strong> dissolved through underlying wrappers (such as {Array.from(new Set(lookThroughHoldings.map(h => h.viaETF).filter(Boolean))).join(', ')}).
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[var(--fg-3)] hidden md:inline">
                  RESOLVED TO PRIMARY ISSUER
                </span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sectors' && (
          <div>
            {/* Stacked Proportional Sector Ribbon */}
            <div className="w-full h-8 flex border border-[var(--border)] overflow-hidden">
              {sectors.map((s, idx) => (
                <div
                  key={s.name}
                  onMouseEnter={() => setHoveredItem({ label: s.name, weight: s.weight, meta: 'Sector Allocation' })}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`h-full border-r border-[var(--bg-0)] flex items-center justify-center transition-all cursor-pointer ${
                    getNodeColor(idx, 'sectors')
                  }`}
                  style={{ width: `${s.weight}%` }}
                  title={`${s.name}: ${s.weight}%`}
                >
                  {s.weight >= 8 && (
                    <span className="font-mono text-[10px] font-bold truncate px-1 text-white">
                      {s.name} ({s.weight}%)
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Sector Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
              {sectors.map((s, idx) => (
                <div
                  key={s.name}
                  className="p-2.5 bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className={`w-2.5 h-2.5 ${getNodeColor(idx, 'sectors')}`} />
                    <span className="text-[var(--fg-2)] truncate">{s.name}</span>
                  </div>
                  <span className="font-mono font-bold text-[var(--fg-1)] ml-2">
                    {s.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'geography' && (
          <div>
            {/* Stacked Proportional Geography Ribbon */}
            <div className="w-full h-8 flex border border-[var(--border)] overflow-hidden">
              {geographies.map((g, idx) => (
                <div
                  key={g.name}
                  onMouseEnter={() => setHoveredItem({ label: g.name, weight: g.weight, meta: 'Geographic Domicile' })}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`h-full border-r border-[var(--bg-0)] flex items-center justify-center transition-all cursor-pointer ${
                    getNodeColor(idx, 'geography')
                  }`}
                  style={{ width: `${g.weight}%` }}
                  title={`${g.name}: ${g.weight}%`}
                >
                  {g.weight >= 8 && (
                    <span className="font-mono text-[10px] font-bold truncate px-1 text-white">
                      {g.name} ({g.weight}%)
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Geography Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
              {geographies.map((g, idx) => (
                <div
                  key={g.name}
                  className="p-2.5 bg-[var(--bg-0)] border border-[var(--border)] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className={`w-2.5 h-2.5 ${getNodeColor(idx, 'geography')}`} />
                    <span className="text-[var(--fg-2)] truncate">{g.name}</span>
                  </div>
                  <span className="font-mono font-bold text-[var(--fg-1)] ml-2">
                    {g.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Hover Status Bar */}
      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono">
        <div className="text-[var(--fg-2)]">
          {hoveredItem ? (
            <span className="flex items-center gap-2">
              <strong className="text-[var(--fg-1)]">{hoveredItem.label}</strong>
              <span className="text-[var(--primary)] font-bold">[{hoveredItem.weight}%]</span>
              {hoveredItem.meta && <span className="text-[var(--fg-3)]">({hoveredItem.meta})</span>}
            </span>
          ) : (
            <span className="text-[var(--fg-3)]">
              Hover over any holding or ribbon segment to inspect dissolved look-through details.
            </span>
          )}
        </div>
        <div className="text-[var(--fg-3)] text-[11px] hidden sm:inline">
          COVERAGE: {totalCalculatedWeight > 0 ? `${totalCalculatedWeight.toFixed(1)}%` : '100.0%'}
        </div>
      </div>
    </div>
  );
};
