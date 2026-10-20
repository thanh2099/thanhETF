import React from 'react';
import { MARKET_SECTORS } from '../data/etfData';

export const MarketTicker: React.FC = () => {
  return (
    <div className="w-full bg-[var(--bg-1)] border-b border-[var(--border)]">
      {/* Date Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-1.5 flex items-center justify-between text-[11px] font-mono text-[var(--fg-faint)] border-b border-[var(--border-faint)]">
        <div>
          <span>Monday, October 19, 2026 · ET · Canadian Market Close</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse"></span>
            <span className="text-[var(--primary)] font-semibold">TSX & Cboe Active</span>
          </span>
          <span className="hidden sm:inline">1,776 ETFs Tracked</span>
        </div>
      </div>

      {/* Marquee Strip */}
      <div className="relative overflow-hidden bg-[var(--bg-2)] py-1.5 border-b border-[var(--border)]">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[var(--bg-2)] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[var(--bg-2)] to-transparent pointer-events-none"></div>

        <div className="animate-marquee flex gap-6 text-xs font-mono whitespace-nowrap">
          {/* Double array for seamless loop */}
          {[...MARKET_SECTORS, ...MARKET_SECTORS].map((s, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 border-r border-[var(--border-faint)]">
              <span className="text-[var(--fg-2)]">{s.name}</span>
              <span
                className={`font-semibold ${
                  s.isPositive ? 'text-[var(--ret-up-1-fg)]' : 'text-[var(--ret-down-1-fg)]'
                }`}
              >
                {s.isPositive ? `+${s.change}%` : `${s.change}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
