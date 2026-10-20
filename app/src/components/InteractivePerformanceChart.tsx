import React, { useState, useMemo } from 'react';
import { TrendingUp, BarChart3, Maximize2, Activity, Info } from 'lucide-react';

interface InteractivePerformanceChartProps {
  symbol: string;
  name: string;
  baseReturn1Y?: number;
  benchmarkSymbol?: string;
  benchmarkName?: string;
  benchmarkReturn1Y?: number;
  className?: string;
}

type TimeHorizon = '1M' | '6M' | '1Y' | '3Y' | '5Y' | 'MAX';
type ChartMode = 'total_return' | 'relative_alpha' | 'underwater_drawdown';

export const InteractivePerformanceChart: React.FC<InteractivePerformanceChartProps> = ({
  symbol,
  name,
  baseReturn1Y = 24.5,
  benchmarkSymbol = 'SPX.CAD',
  benchmarkName = 'S&P 500 (CAD)',
  benchmarkReturn1Y = 22.8,
  className = ''
}) => {
  const [horizon, setHorizon] = useState<TimeHorizon>('1Y');
  const [chartMode, setChartMode] = useState<ChartMode>('total_return');
  const [isLogScale, setIsLogScale] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Generate deterministic realistic historical curve based on ticker seed & horizon
  const seriesData = useMemo(() => {
    let numPoints = 30;
    let annualizedVolatility = 0.16;
    let days = 30;

    switch (horizon) {
      case '1M':
        numPoints = 22;
        days = 30;
        break;
      case '6M':
        numPoints = 36;
        days = 180;
        break;
      case '1Y':
        numPoints = 52;
        days = 365;
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

    // Seeded pseudo-random walk
    let seed = 0;
    for (let i = 0; i < symbol.length; i++) {
      seed = (seed * 31 + symbol.charCodeAt(i)) % 100000;
    }

    const pseudoRandom = (idx: number) => {
      const x = Math.sin(seed + idx * 9973) * 10000;
      return x - Math.floor(x);
    };

    const targetReturn = (baseReturn1Y / 100) * (days / 365);
    const benchTargetReturn = (benchmarkReturn1Y / 100) * (days / 365);

    const points: Array<{
      date: string;
      value: number; // Normalized to 100 at start
      benchValue: number;
      drawdown: number;
      alpha: number;
    }> = [];

    let currentVal = 100;
    let currentBench = 100;
    let peakVal = 100;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const drift = (targetReturn / numPoints);
      const benchDrift = (benchTargetReturn / numPoints);

      // Noise
      const noise = (pseudoRandom(i) - 0.48) * (annualizedVolatility * Math.sqrt(days / 365 / numPoints) * 120);
      const benchNoise = (pseudoRandom(i + 500) - 0.48) * (annualizedVolatility * Math.sqrt(days / 365 / numPoints) * 110);

      if (i === 0) {
        currentVal = 100;
        currentBench = 100;
      } else {
        currentVal = Math.max(20, currentVal * (1 + drift + noise / 100));
        currentBench = Math.max(20, currentBench * (1 + benchDrift + benchNoise / 100));
      }

      if (currentVal > peakVal) peakVal = currentVal;
      const dd = ((currentVal - peakVal) / peakVal) * 100;
      const alpha = currentVal - currentBench;

      const pDate = new Date(startDate.getTime() + (progress * days * 24 * 3600 * 1000));
      const dateStr = pDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: horizon === '3Y' || horizon === '5Y' || horizon === 'MAX' ? '2-digit' : undefined });

      points.push({
        date: dateStr,
        value: Number(currentVal.toFixed(2)),
        benchValue: Number(currentBench.toFixed(2)),
        drawdown: Number(dd.toFixed(2)),
        alpha: Number(alpha.toFixed(2))
      });
    }

    return points;
  }, [symbol, horizon, baseReturn1Y, benchmarkReturn1Y]);

  // Visual Bounds & SVG Mapping
  const chartMetrics = useMemo(() => {
    let minVal = Infinity;
    let maxVal = -Infinity;

    seriesData.forEach(p => {
      let targetP = p.value;
      let targetB = p.benchValue;

      if (chartMode === 'underwater_drawdown') {
        targetP = p.drawdown;
        targetB = 0;
      } else if (chartMode === 'relative_alpha') {
        targetP = p.alpha;
        targetB = 0;
      }

      if (targetP < minVal) minVal = targetP;
      if (targetP > maxVal) maxVal = targetP;
      if (targetB < minVal) minVal = targetB;
      if (targetB > maxVal) maxVal = targetB;
    });

    if (chartMode === 'underwater_drawdown') {
      maxVal = 2; // slight headroom above 0%
      minVal = Math.min(-5, minVal - 2);
    } else {
      const padding = (maxVal - minVal) * 0.08 || 5;
      minVal -= padding;
      maxVal += padding;
    }

    return { minVal, maxVal };
  }, [seriesData, chartMode]);

  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (index: number) => {
    return paddingX + (index / (seriesData.length - 1)) * (svgWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const { minVal, maxVal } = chartMetrics;
    const norm = (val - minVal) / (maxVal - minVal || 1);
    return svgHeight - paddingY - norm * (svgHeight - paddingY * 2);
  };

  // Build SVG Path Strings
  const primaryPath = useMemo(() => {
    return seriesData.reduce((acc, p, idx) => {
      let v = p.value;
      if (chartMode === 'underwater_drawdown') v = p.drawdown;
      if (chartMode === 'relative_alpha') v = p.alpha;
      const x = getX(idx);
      const y = getY(v);
      return `${acc} ${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    }, '');
  }, [seriesData, chartMode, chartMetrics]);

  const benchmarkPath = useMemo(() => {
    if (chartMode === 'underwater_drawdown' || chartMode === 'relative_alpha') {
      // Zero line
      const yZero = getY(0);
      return `M ${paddingX},${yZero.toFixed(1)} L ${svgWidth - paddingX},${yZero.toFixed(1)}`;
    }
    return seriesData.reduce((acc, p, idx) => {
      const x = getX(idx);
      const y = getY(p.benchValue);
      return `${acc} ${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    }, '');
  }, [seriesData, chartMode, chartMetrics]);

  // Area under the curve
  const primaryAreaPath = useMemo(() => {
    if (chartMode === 'underwater_drawdown') {
      const yZero = getY(0);
      return `${primaryPath} L ${getX(seriesData.length - 1)},${yZero} L ${getX(0)},${yZero} Z`;
    }
    const bottomY = svgHeight - paddingY;
    return `${primaryPath} L ${getX(seriesData.length - 1)},${bottomY} L ${getX(0)},${bottomY} Z`;
  }, [primaryPath, seriesData, chartMode, chartMetrics]);

  const latestPoint = seriesData[seriesData.length - 1];
  const hoveredPoint = hoveredPointIndex !== null ? seriesData[hoveredPointIndex] : latestPoint;

  const netReturnPct = latestPoint ? ((latestPoint.value - 100)).toFixed(2) : '0.00';
  const benchReturnPct = latestPoint ? ((latestPoint.benchValue - 100)).toFixed(2) : '0.00';
  const maxDrawdownPct = useMemo(() => {
    let worst = 0;
    seriesData.forEach(p => {
      if (p.drawdown < worst) worst = p.drawdown;
    });
    return worst.toFixed(2);
  }, [seriesData]);

  return (
    <div className={`bg-[var(--bg-1)] border border-[var(--border)] p-4 sm:p-5 font-sans ${className}`}>
      {/* Chart Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase px-2 py-0.5 bg-[var(--primary)] text-white font-bold">
              {symbol}
            </span>
            <span className="text-xs text-[var(--fg-3)]">vs.</span>
            <span className="font-mono text-xs text-[var(--fg-2)] border border-[var(--border)] px-1.5 py-0.5">
              {benchmarkSymbol}
            </span>
            <span className="text-xs font-mono text-[var(--fg-3)] hidden md:inline">
              [TOTAL RETURN ENGINE]
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="text-2xl font-display font-bold text-[var(--fg-1)]">
              {chartMode === 'underwater_drawdown'
                ? `${hoveredPoint.drawdown}%`
                : chartMode === 'relative_alpha'
                ? `${hoveredPoint.alpha >= 0 ? '+' : ''}${hoveredPoint.alpha}%`
                : `${hoveredPoint.value >= 100 ? '+' : ''}${(hoveredPoint.value - 100).toFixed(2)}%`}
            </span>
            <span className="text-xs font-mono text-[var(--fg-3)]">
              {hoveredPoint.date}
            </span>
            {chartMode === 'total_return' && (
              <span className="text-xs font-mono text-[var(--fg-3)] hidden sm:inline">
                (Bench: {(hoveredPoint.benchValue - 100).toFixed(2)}%)
              </span>
            )}
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Selector */}
          <div className="inline-flex border border-[var(--border)] bg-[var(--bg-0)] p-0.5">
            {(['1M', '6M', '1Y', '3Y', '5Y', 'MAX'] as TimeHorizon[]).map(h => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-2 py-1 font-mono text-xs transition-colors ${
                  horizon === h
                    ? 'bg-[var(--primary)] text-white font-bold'
                    : 'text-[var(--fg-2)] hover:text-[var(--fg-1)] hover:bg-[var(--bg-2)]'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex border border-[var(--border)] bg-[var(--bg-0)] p-0.5">
            <button
              onClick={() => setChartMode('total_return')}
              title="Total Return (NAV + Reinvested Distributions)"
              className={`px-2 py-1 font-mono text-xs ${
                chartMode === 'total_return'
                  ? 'bg-[var(--fg-1)] text-[var(--bg-0)] font-bold'
                  : 'text-[var(--fg-3)] hover:text-[var(--fg-1)]'
              }`}
            >
              Total Return
            </button>
            <button
              onClick={() => setChartMode('relative_alpha')}
              title="Performance Alpha relative to Benchmark"
              className={`px-2 py-1 font-mono text-xs ${
                chartMode === 'relative_alpha'
                  ? 'bg-[var(--fg-1)] text-[var(--bg-0)] font-bold'
                  : 'text-[var(--fg-3)] hover:text-[var(--fg-1)]'
              }`}
            >
              Alpha Delta
            </button>
            <button
              onClick={() => setChartMode('underwater_drawdown')}
              title="Underwater Drawdown (Peak-to-Trough Loss)"
              className={`px-2 py-1 font-mono text-xs ${
                chartMode === 'underwater_drawdown'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-[var(--fg-3)] hover:text-[var(--fg-1)]'
              }`}
            >
              Drawdown
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative mt-3 w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 sm:h-64 cursor-crosshair"
          onMouseLeave={() => setHoveredPointIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const ratio = mouseX / rect.width;
            const approxIndex = Math.round(ratio * (seriesData.length - 1));
            const clamped = Math.max(0, Math.min(seriesData.length - 1, approxIndex));
            setHoveredPointIndex(clamped);
          }}
        >
          <defs>
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={chartMode === 'underwater_drawdown' ? 0.05 : 0.25} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={svgWidth - paddingX}
            y2={paddingY}
            stroke="var(--border)"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
          />
          <line
            x1={paddingX}
            y1={svgHeight / 2}
            x2={svgWidth - paddingX}
            y2={svgHeight / 2}
            stroke="var(--border)"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
          />
          <line
            x1={paddingX}
            y1={svgHeight - paddingY}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingY}
            stroke="var(--border)"
            strokeOpacity="0.7"
          />

          {/* Area fill */}
          <path
            d={primaryAreaPath}
            fill={chartMode === 'underwater_drawdown' ? 'url(#drawdownGrad)' : 'url(#primaryAreaGrad)'}
          />

          {/* Benchmark line */}
          <path
            d={benchmarkPath}
            fill="none"
            stroke={chartMode === 'underwater_drawdown' ? 'var(--fg-3)' : 'var(--fg-3)'}
            strokeWidth="1.5"
            strokeDasharray={chartMode === 'underwater_drawdown' ? '4 4' : '3 3'}
            strokeOpacity="0.6"
          />

          {/* Primary fund curve */}
          <path
            d={primaryPath}
            fill="none"
            stroke={chartMode === 'underwater_drawdown' ? '#e11d48' : 'var(--primary)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Vertical Rule & Dot */}
          {hoveredPointIndex !== null && (
            <g>
              <line
                x1={getX(hoveredPointIndex)}
                y1={paddingY}
                x2={getX(hoveredPointIndex)}
                y2={svgHeight - paddingY}
                stroke="var(--fg-2)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoveredPointIndex)}
                cy={getY(
                  chartMode === 'underwater_drawdown'
                    ? hoveredPoint.drawdown
                    : chartMode === 'relative_alpha'
                    ? hoveredPoint.alpha
                    : hoveredPoint.value
                )}
                r="4.5"
                fill={chartMode === 'underwater_drawdown' ? '#e11d48' : 'var(--primary)'}
                stroke="var(--bg-0)"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Horizon Indicator Footnotes */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--fg-3)] px-2 pt-1 border-t border-[var(--border)]">
          <span>{seriesData[0]?.date}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[var(--primary)] inline-block" />
              {symbol} ({chartMode === 'underwater_drawdown' ? `Max DD: ${maxDrawdownPct}%` : `${netReturnPct}%`})
            </span>
            {chartMode === 'total_return' && (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[var(--fg-3)] border-b border-dashed inline-block" />
                {benchmarkSymbol} ({benchReturnPct}%)
              </span>
            )}
          </div>
          <span>{latestPoint?.date}</span>
        </div>
      </div>

      {/* Terminal Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[var(--border)] text-xs font-mono">
        <div className="p-2 bg-[var(--bg-0)] border border-[var(--border)]">
          <div className="text-[var(--fg-3)] text-[10px]">CUMULATIVE RETURN</div>
          <div className="text-[var(--fg-1)] font-bold mt-0.5">
            {netReturnPct}%
          </div>
        </div>
        <div className="p-2 bg-[var(--bg-0)] border border-[var(--border)]">
          <div className="text-[var(--fg-3)] text-[10px]">MAX DRAWDOWN</div>
          <div className="text-rose-500 font-bold mt-0.5">
            {maxDrawdownPct}%
          </div>
        </div>
        <div className="p-2 bg-[var(--bg-0)] border border-[var(--border)]">
          <div className="text-[var(--fg-3)] text-[10px]">BENCHMARK DELTA (ALPHA)</div>
          <div className={`font-bold mt-0.5 ${Number(netReturnPct) >= Number(benchReturnPct) ? 'text-emerald-500' : 'text-rose-500'}`}>
            {(Number(netReturnPct) - Number(benchReturnPct)) >= 0 ? '+' : ''}
            {(Number(netReturnPct) - Number(benchReturnPct)).toFixed(2)}%
          </div>
        </div>
        <div className="p-2 bg-[var(--bg-0)] border border-[var(--border)]">
          <div className="text-[var(--fg-3)] text-[10px]">REPLICATION METHOD</div>
          <div className="text-[var(--fg-1)] font-bold mt-0.5 truncate">
            Physical Reinvestment
          </div>
        </div>
      </div>
    </div>
  );
};
