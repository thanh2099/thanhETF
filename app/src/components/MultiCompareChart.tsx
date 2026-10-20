import React, { useState, useMemo } from 'react';
import { TrendingUp, Activity, BarChart2, Info, Check, Eye, EyeOff } from 'lucide-react';

export interface CompareFundItem {
  symbol: string;
  name: string;
  return1Y: number;
  return3Y?: number;
  price: number;
  mer: number;
  yieldTTM: number;
  color: string;
}

interface MultiCompareChartProps {
  funds: CompareFundItem[];
  className?: string;
}

type TimeHorizon = '1M' | '3M' | '6M' | '1Y' | '2Y' | '3Y' | '5Y' | 'MAX';
type ChartMode = 'total_return' | 'price_cash' | 'underwater_drawdown';

export const MultiCompareChart: React.FC<MultiCompareChartProps> = ({
  funds,
  className = '',
}) => {
  const [horizon, setHorizon] = useState<TimeHorizon>('1Y');
  const [chartMode, setChartMode] = useState<ChartMode>('total_return');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hiddenSymbols, setHiddenSymbols] = useState<Record<string, boolean>>({});

  const toggleSymbol = (sym: string) => {
    setHiddenSymbols((prev) => ({ ...prev, [sym]: !prev[sym] }));
  };

  // Generate synchronized multi-fund deterministic daily time-series
  const { points, fundStats } = useMemo(() => {
    if (!funds || funds.length === 0) return { points: [], fundStats: {} };

    let numPoints = 52;
    let days = 365;
    switch (horizon) {
      case '1M':
        numPoints = 22;
        days = 30;
        break;
      case '3M':
        numPoints = 30;
        days = 90;
        break;
      case '6M':
        numPoints = 36;
        days = 180;
        break;
      case '1Y':
        numPoints = 52;
        days = 365;
        break;
      case '2Y':
        numPoints = 64;
        days = 730;
        break;
      case '3Y':
        numPoints = 75;
        days = 1095;
        break;
      case '5Y':
        numPoints = 100;
        days = 1825;
        break;
      case 'MAX':
        numPoints = 120;
        days = 3650;
        break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Initialize trackers for each fund
    const currentValues: Record<string, number> = {};
    const peakValues: Record<string, number> = {};
    const maxDrawdowns: Record<string, number> = {};

    funds.forEach((f) => {
      currentValues[f.symbol] = 10000;
      peakValues[f.symbol] = 10000;
      maxDrawdowns[f.symbol] = 0;
    });

    const seriesPoints: Array<{
      date: string;
      values: Record<string, number>;
      drawdowns: Record<string, number>;
      returns: Record<string, number>;
    }> = [];

    // Common macro market wave
    const macroSeed = 42;
    const macroNoise = (step: number) => {
      const x = Math.sin(macroSeed + step * 9973) * 10000;
      return x - Math.floor(x) - 0.48;
    };

    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const stepDate = new Date(startDate.getTime() + progress * days * 24 * 3600 * 1000);
      const dateStr = stepDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: horizon === '3Y' || horizon === '5Y' || horizon === 'MAX' ? '2-digit' : undefined,
      });

      const pointValues: Record<string, number> = {};
      const pointDrawdowns: Record<string, number> = {};
      const pointReturns: Record<string, number> = {};

      const macroShock = macroNoise(i) * 0.015;

      funds.forEach((f) => {
        if (i === 0) {
          currentValues[f.symbol] = 10000;
          peakValues[f.symbol] = 10000;
          pointValues[f.symbol] = 10000;
          pointDrawdowns[f.symbol] = 0;
          pointReturns[f.symbol] = 0;
        } else {
          // Fund seed
          let seed = 0;
          for (let c = 0; c < f.symbol.length; c++) {
            seed = (seed * 31 + f.symbol.charCodeAt(c)) % 100000;
          }
          const idiosyncratic = (Math.sin(seed + i * 8831) * 10000 - Math.floor(Math.sin(seed + i * 8831) * 10000) - 0.48) * 0.012;

          // Target return drift
          const targetTotalReturn = (f.return1Y / 100) * (days / 365);
          const drift = targetTotalReturn / numPoints;

          const stepReturn = drift + macroShock + idiosyncratic;
          currentValues[f.symbol] = Math.max(1000, currentValues[f.symbol] * (1 + stepReturn));

          if (currentValues[f.symbol] > peakValues[f.symbol]) {
            peakValues[f.symbol] = currentValues[f.symbol];
          }

          const dd = ((currentValues[f.symbol] - peakValues[f.symbol]) / peakValues[f.symbol]) * 100;
          if (dd < maxDrawdowns[f.symbol]) {
            maxDrawdowns[f.symbol] = dd;
          }

          pointValues[f.symbol] = Number(currentValues[f.symbol].toFixed(2));
          pointDrawdowns[f.symbol] = Number(dd.toFixed(2));
          pointReturns[f.symbol] = Number((((currentValues[f.symbol] - 10000) / 10000) * 100).toFixed(2));
        }
      });

      seriesPoints.push({
        date: dateStr,
        values: pointValues,
        drawdowns: pointDrawdowns,
        returns: pointReturns,
      });
    }

    const calculatedStats: Record<string, { totalReturn: number; maxDrawdown: number; finalValue: number }> = {};
    funds.forEach((f) => {
      const finalVal = currentValues[f.symbol] || 10000;
      calculatedStats[f.symbol] = {
        totalReturn: Number((((finalVal - 10000) / 10000) * 100).toFixed(2)),
        maxDrawdown: Number(maxDrawdowns[f.symbol].toFixed(2)),
        finalValue: Number(finalVal.toFixed(2)),
      };
    });

    return { points: seriesPoints, fundStats: calculatedStats };
  }, [funds, horizon]);

  // Chart Dimensions & SVG Scaling
  const viewBoxWidth = 840;
  const viewBoxHeight = 340;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };
  const graphWidth = viewBoxWidth - padding.left - padding.right;
  const graphHeight = viewBoxHeight - padding.top - padding.bottom;

  const { minVal, maxVal, getY, getX } = useMemo(() => {
    if (!points || points.length === 0) {
      return { minVal: 0, maxVal: 100, getY: () => 0, getX: () => 0 };
    }

    const activeFunds = funds.filter((f) => !hiddenSymbols[f.symbol]);
    let localMin = Infinity;
    let localMax = -Infinity;

    points.forEach((p) => {
      activeFunds.forEach((f) => {
        const val = chartMode === 'total_return' ? p.values[f.symbol] : p.drawdowns[f.symbol];
        if (val !== undefined) {
          if (val < localMin) localMin = val;
          if (val > localMax) localMax = val;
        }
      });
    });

    if (localMin === Infinity) {
      localMin = chartMode === 'total_return' ? 10000 : -20;
      localMax = chartMode === 'total_return' ? 12000 : 0;
    }

    if (chartMode === 'underwater_drawdown') {
      localMax = 0; // Peak is always 0%
      localMin = Math.min(localMin, -5);
    } else {
      // Add breathing room
      const pad = (localMax - localMin) * 0.08 || 500;
      localMin = Math.floor(localMin - pad);
      localMax = Math.ceil(localMax + pad);
    }

    const valRange = localMax - localMin || 1;

    const getY = (val: number) => {
      return padding.top + graphHeight - ((val - localMin) / valRange) * graphHeight;
    };

    const getX = (idx: number) => {
      return padding.left + (idx / (points.length - 1)) * graphWidth;
    };

    return { minVal: localMin, maxVal: localMax, getY, getX };
  }, [points, funds, hiddenSymbols, chartMode, graphHeight, graphWidth]);

  // Generate SVG path for a fund
  const buildPath = (symbol: string) => {
    if (!points || points.length === 0) return '';
    const fundYield = funds.find((f) => f.symbol === symbol)?.yieldTTM || 0;
    return points
      .map((p, idx) => {
        const rawVal = p.values[symbol] || 10000;
        const progress = idx / (points.length - 1 || 1);
        // In price_cash mode, strip reinvested distribution compounding from NAV to show price trajectory
        const priceVal = chartMode === 'price_cash'
          ? 10000 + (rawVal - 10000) * Math.max(0.2, 1 - (fundYield / 100) * 0.75 * progress)
          : rawVal;

        const val = chartMode === 'underwater_drawdown' ? p.drawdowns[symbol] : priceVal;
        const x = getX(idx);
        const y = getY(val || (chartMode === 'underwater_drawdown' ? 0 : 10000));
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const hoveredData = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  if (!funds || funds.length === 0) {
    return (
      <div className="bg-[var(--bg-1)] border border-[var(--border)] p-8 text-center font-mono text-xs text-[var(--fg-muted)]">
        No funds selected to chart. Add ETF tickers above to render performance comparisons.
      </div>
    );
  }

  return (
    <div className={`bg-[var(--bg-1)] border-2 border-[var(--border)] p-5 space-y-5 font-mono ${className}`}>
      {/* Chart Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-faint)] pb-4">
        {/* Chart View Mode: Total Return vs Price + Cash vs Underwater Drawdown */}
        <div className="flex items-center gap-1.5 bg-[var(--bg-0)] p-1 border border-[var(--border)] text-xs">
          <button
            onClick={() => setChartMode('total_return')}
            className={`px-3 py-1 font-bold transition-all cursor-pointer ${
              chartMode === 'total_return'
                ? 'bg-[var(--primary)] text-[var(--bg-0)]'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
            }`}
          >
            Total return
          </button>
          <button
            onClick={() => setChartMode('price_cash')}
            className={`px-3 py-1 font-bold transition-all cursor-pointer ${
              chartMode === 'price_cash'
                ? 'bg-[var(--primary)] text-[var(--bg-0)]'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
            }`}
          >
            Price + cash
          </button>
          <button
            onClick={() => setChartMode('underwater_drawdown')}
            className={`px-3 py-1 font-bold transition-all cursor-pointer ${
              chartMode === 'underwater_drawdown'
                ? 'bg-[var(--primary)] text-[var(--bg-0)]'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
            }`}
          >
            Drawdown
          </button>
        </div>

        {/* Time Horizon Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {(['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', 'MAX'] as TimeHorizon[]).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs border transition-colors cursor-pointer ${
                horizon === h
                  ? 'bg-[var(--primary)] text-[var(--bg-0)] border-[var(--primary)] font-bold'
                  : 'bg-[var(--bg-0)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Legend Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider mr-1">Series:</span>
        {funds.map((f) => {
          const isHidden = hiddenSymbols[f.symbol];
          return (
            <button
              key={f.symbol}
              onClick={() => toggleSymbol(f.symbol)}
              style={{ borderColor: f.color }}
              className={`flex items-center gap-2 px-2.5 py-1 border transition-opacity cursor-pointer ${
                isHidden ? 'opacity-40 bg-[var(--bg-0)]' : 'bg-[var(--bg-0)]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
              <span className="font-bold text-[var(--fg-1)]">{f.symbol}</span>
              <span className="text-[10px] text-[var(--fg-muted)] hidden md:inline">({f.name})</span>
              {isHidden ? <EyeOff className="w-3 h-3 text-[var(--fg-faint)]" /> : <Eye className="w-3 h-3 text-[var(--primary)]" />}
            </button>
          );
        })}
      </div>

      {/* SVG Multi-Line Chart Canvas */}
      <div className="relative bg-[var(--bg-0)] border border-[var(--border)] overflow-hidden">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto block select-none"
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * viewBoxWidth;
            const boundedX = Math.max(padding.left, Math.min(padding.left + graphWidth, mouseX));
            const progress = (boundedX - padding.left) / graphWidth;
            const idx = Math.round(progress * (points.length - 1));
            setHoveredIndex(idx);
          }}
        >
          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, i) => {
            const yVal = minVal + frac * (maxVal - minVal);
            const yPos = getY(yVal);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={padding.left + graphWidth}
                  y2={yPos}
                  stroke="var(--border-faint)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={yPos + 4}
                  fill="var(--fg-muted)"
                  fontSize="10"
                  fontFamily="'Geist Mono', monospace"
                  textAnchor="end"
                >
                  {chartMode === 'total_return' ? `$${Math.round(yVal).toLocaleString()}` : `${yVal.toFixed(1)}%`}
                </text>
              </g>
            );
          })}

          {/* Zero Line for Drawdown */}
          {chartMode === 'underwater_drawdown' && (
            <line
              x1={padding.left}
              y1={getY(0)}
              x2={padding.left + graphWidth}
              y2={getY(0)}
              stroke="var(--fg-faint)"
              strokeWidth="1.5"
            />
          )}

          {/* Plot Lines for Each Active Fund */}
          {funds.map((f) => {
            if (hiddenSymbols[f.symbol]) return null;
            const pathData = buildPath(f.symbol);
            return (
              <g key={f.symbol}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={f.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {/* Vertical Hover Crosshair */}
          {hoveredIndex !== null && (
            <g>
              <line
                x1={getX(hoveredIndex)}
                y1={padding.top}
                x2={getX(hoveredIndex)}
                y2={padding.top + graphHeight}
                stroke="var(--fg-1)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {funds.map((f) => {
                if (hiddenSymbols[f.symbol] || !hoveredData) return null;
                const val = chartMode === 'total_return' ? hoveredData.values[f.symbol] : hoveredData.drawdowns[f.symbol];
                const cy = getY(val || (chartMode === 'total_return' ? 10000 : 0));
                return (
                  <circle
                    key={f.symbol}
                    cx={getX(hoveredIndex)}
                    cy={cy}
                    r="4.5"
                    fill={f.color}
                    stroke="var(--bg-0)"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          )}

          {/* X-Axis Date Labels */}
          {points.length > 0 && (
            <g>
              <text
                x={padding.left}
                y={viewBoxHeight - 10}
                fill="var(--fg-muted)"
                fontSize="10"
                fontFamily="'Geist Mono', monospace"
              >
                {points[0].date}
              </text>
              <text
                x={padding.left + graphWidth / 2}
                y={viewBoxHeight - 10}
                fill="var(--fg-muted)"
                fontSize="10"
                fontFamily="'Geist Mono', monospace"
                textAnchor="middle"
              >
                {points[Math.floor(points.length / 2)].date}
              </text>
              <text
                x={padding.left + graphWidth}
                y={viewBoxHeight - 10}
                fill="var(--fg-muted)"
                fontSize="10"
                fontFamily="'Geist Mono', monospace"
                textAnchor="end"
              >
                {points[points.length - 1].date}
              </text>
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredData && hoveredIndex !== null && (
          <div
            className="absolute top-3 right-3 bg-[var(--bg-1)] border-2 border-[var(--border)] p-3 shadow-2xl space-y-1.5 text-xs font-mono pointer-events-none"
            style={{ minWidth: '180px' }}
          >
            <div className="text-[10px] text-[var(--fg-muted)] border-b border-[var(--border-faint)] pb-1 flex justify-between font-bold">
              <span>DATE</span>
              <span className="text-[var(--fg-1)]">{hoveredData.date}</span>
            </div>
            {funds.map((f) => {
              if (hiddenSymbols[f.symbol]) return null;
              const val = hoveredData.values[f.symbol];
              const dd = hoveredData.drawdowns[f.symbol];
              const ret = hoveredData.returns[f.symbol];
              return (
                <div key={f.symbol} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="font-bold text-[var(--fg-1)]">{f.symbol}</span>
                  </div>
                  <div className="text-right">
                    {chartMode === 'total_return' ? (
                      <>
                        <span className="font-bold text-[var(--fg-1)]">${Math.round(val).toLocaleString()}</span>
                        <span className="text-[10px] ml-1.5" style={{ color: ret >= 0 ? 'var(--primary)' : 'var(--accent-2)' }}>
                          {ret >= 0 ? `+${ret}%` : `${ret}%`}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-amber-400">{dd}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Telemetry Metrics Across All Active Funds */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        {funds.map((f) => {
          const stats = fundStats[f.symbol];
          if (!stats) return null;
          return (
            <div
              key={f.symbol}
              className="bg-[var(--bg-0)] border p-3 space-y-1"
              style={{ borderLeftColor: f.color, borderLeftWidth: '3px' }}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[var(--fg-1)]">{f.symbol}</span>
                <span className="text-[10px] text-[var(--fg-muted)] font-mono">MER: {(f.mer * 100).toFixed(2)}%</span>
              </div>
              <div className="text-base font-bold font-display" style={{ color: f.color }}>
                {stats.totalReturn >= 0 ? `+${stats.totalReturn}%` : `${stats.totalReturn}%`}
              </div>
              <div className="flex justify-between text-[10px] text-[var(--fg-muted)]">
                <span>Max Drawdown:</span>
                <span className="text-amber-400 font-bold">{stats.maxDrawdown}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
