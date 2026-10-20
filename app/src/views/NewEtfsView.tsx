import React, { useState, useMemo } from 'react';
import { Sparkles, Calendar, Tag, ShieldCheck, ArrowUpRight, Search, Filter, Layers, DollarSign } from 'lucide-react';

interface NewEtfsViewProps {
  onSelectETF: (symbol: string) => void;
  onNavigate: (tab: string, symbol?: string) => void;
}

interface NewCanadianETF {
  symbol: string;
  name: string;
  exchange: 'TSX' | 'Cboe Canada';
  issuer: string;
  category: string;
  geography: string;
  price: number | null;
  priceDate: string;
  feeType: 'Management Fee' | 'Fee';
  feeDisplay: string;
  style: string;
  thematicCluster: 'Single-Stock' | 'Liquid Alt' | 'AI & Tech' | 'US Growth' | 'Space Frontier';
  alsoInUSD?: string;
  description: string;
  highlights: string[];
}

const NEW_ETFS_DATA: NewCanadianETF[] = [
  {
    symbol: 'AAPP.TO',
    name: 'Global X Apple PowerStock ETF',
    exchange: 'TSX',
    issuer: 'Global X Canada',
    category: 'Broad Technology',
    geography: 'United States',
    price: 20.49,
    priceDate: 'Oct 19',
    feeType: 'Management Fee',
    feeDisplay: '0.15% a year',
    style: 'Single-Stock Tech Exposure',
    thematicCluster: 'Single-Stock',
    description: 'Direct TSX Canadian dollar access to Apple Inc. (AAPL) without cross-border FX exchange conversion fees.',
    highlights: ['0.15% management fee', 'TFSA & RRSP eligible', 'CAD denominated', '100% physical AAPL exposure']
  },
  {
    symbol: 'AMZP.TO',
    name: 'Global X Amazon PowerStock ETF',
    exchange: 'TSX',
    issuer: 'Global X Canada',
    category: 'Consumer & Cloud',
    geography: 'United States',
    price: 19.98,
    priceDate: 'Oct 19',
    feeType: 'Management Fee',
    feeDisplay: '0.15% a year',
    style: 'Single-Stock Consumer & Cloud',
    thematicCluster: 'Single-Stock',
    description: 'Canadian dollar single-stock exposure to Amazon.com Inc. (AMZN) and AWS cloud computing infrastructure.',
    highlights: ['0.15% management fee', 'No FX spread drag', 'Registered accounts eligible', 'Direct unhedged equity']
  },
  {
    symbol: 'GOOP.TO',
    name: 'Global X Alphabet PowerStock ETF',
    exchange: 'TSX',
    issuer: 'Global X Canada',
    category: 'Broad Technology',
    geography: 'United States',
    price: 19.42,
    priceDate: 'Oct 19',
    feeType: 'Management Fee',
    feeDisplay: '0.15% a year',
    style: 'Single-Stock Alphabet Tech',
    thematicCluster: 'Single-Stock',
    description: 'Pure-play TSX listing for Alphabet Inc. (Google Search, YouTube, Google Cloud, DeepMind AI research).',
    highlights: ['0.15% management fee', 'CAD currency access', 'Eligible for all Canadian registered plans']
  },
  {
    symbol: 'NVDP.TO',
    name: 'Global X NVIDIA PowerStock ETF',
    exchange: 'TSX',
    issuer: 'Global X Canada',
    category: 'Artificial Intelligence',
    geography: 'United States',
    price: 18.59,
    priceDate: 'Oct 19',
    feeType: 'Management Fee',
    feeDisplay: '0.15% a year',
    style: 'Single-Stock AI Hardware',
    thematicCluster: 'Single-Stock',
    description: 'Direct Canadian dollar wrapper tracking NVIDIA Corporation (NVDA) GPU compute infrastructure and datacenter AI chips.',
    highlights: ['0.15% management fee', 'Deep AI hardware proxy', 'Trade in Canadian dollars on TSX']
  },
  {
    symbol: 'TSLP.TO',
    name: 'Global X Tesla PowerStock ETF',
    exchange: 'TSX',
    issuer: 'Global X Canada',
    category: 'Consumer & Autonomous',
    geography: 'United States',
    price: 18.91,
    priceDate: 'Oct 19',
    feeType: 'Management Fee',
    feeDisplay: '0.15% a year',
    style: 'Single-Stock Clean Auto & Robotics',
    thematicCluster: 'Single-Stock',
    description: 'Canadian dollar single-stock ETF holding Tesla Inc. (TSLA) electric vehicles, energy storage, and humanoid robotics.',
    highlights: ['0.15% management fee', 'TSX liquidity', 'Full TFSA & RRSP tax-sheltered access']
  },
  {
    symbol: 'SPCP.TO',
    name: 'Global X SpaceX PowerStock ETF',
    exchange: 'TSX',
    issuer: 'Global X Canada',
    category: 'Space & Frontier',
    geography: 'United States',
    price: 17.59,
    priceDate: 'Oct 19',
    feeType: 'Management Fee',
    feeDisplay: '0.15% a year',
    style: 'Frontier Space Commercialization',
    thematicCluster: 'Space Frontier',
    description: 'Breakthrough Canadian wrapper providing retail access to SpaceX (Starlink, Starship, Falcon 9 launch services).',
    highlights: ['0.15% management fee', 'Pioneering private frontier exposure on TSX', 'CAD denominated']
  },
  {
    symbol: 'CCAF.TO',
    name: 'CI Forge First Conservative Alternative Fund',
    exchange: 'TSX',
    issuer: 'CI Global / Forge First',
    category: 'Liquid Alternative',
    geography: 'North America',
    price: null,
    priceDate: 'Oct 16',
    feeType: 'Fee',
    feeDisplay: 'Alternative/Hedge',
    style: 'Long and short positions',
    alsoInUSD: 'CCAF.U.TO in US dollars',
    thematicCluster: 'Liquid Alt',
    description: 'Canadian liquid alternative hedge strategy focused on capital preservation, low equity correlation, and downside management.',
    highlights: ['Long & short positions', 'Dual-currency (CAD & USD)', 'Daily TSX liquidity', 'NI 81-102 liquid alt framework']
  },
  {
    symbol: 'CLSF.TO',
    name: 'CI Forge First Long Short Alternative Fund',
    exchange: 'TSX',
    issuer: 'CI Global / Forge First',
    category: 'Liquid Alternative',
    geography: 'North America',
    price: null,
    priceDate: 'Oct 16',
    feeType: 'Fee',
    feeDisplay: 'Alternative/Hedge',
    style: 'Long and short positions',
    alsoInUSD: 'CLSF.U.TO in US dollars',
    thematicCluster: 'Liquid Alt',
    description: 'Unconstrained equity long/short alternative fund designed to generate absolute return across North American equities.',
    highlights: ['Absolute return focus', 'Pairs trading & shorting', 'Also available as CLSF.U.TO in USD']
  },
  {
    symbol: 'NAGF.TO',
    name: 'Ninepoint American Growth Fund',
    exchange: 'TSX',
    issuer: 'Ninepoint Partners',
    category: 'Broad Market Growth',
    geography: 'United States',
    price: 10.00,
    priceDate: 'Oct 16',
    feeType: 'Fee',
    feeDisplay: 'Active Mandate',
    style: 'Actively managed US Growth',
    thematicCluster: 'US Growth',
    description: 'Active fundamental US growth equity strategy targeting structural compounders, technology moats, and healthcare innovators.',
    highlights: ['$10.00 initial issuance par', 'Concentrated active stock picking', 'Ninepoint investment team']
  },
  {
    symbol: 'XBAI.TO',
    name: 'iShares A.I. Innovation and Tech ETF',
    exchange: 'TSX',
    issuer: 'RBC iShares',
    category: 'Artificial Intelligence',
    geography: 'Global / World',
    price: 35.09,
    priceDate: 'Oct 19',
    feeType: 'Fee',
    feeDisplay: 'Active Thematic',
    style: 'Actively managed thematic portfolio',
    thematicCluster: 'AI & Tech',
    description: 'BlackRock’s flagship Canadian-listed active artificial intelligence innovation ETF, allocating across semiconductors, LLMs, and infrastructure.',
    highlights: ['Global thematic scope', 'Active AI portfolio reconstitution', 'Backed by BlackRock institutional execution']
  }
];

export const NewEtfsView: React.FC<NewEtfsViewProps> = ({ onSelectETF, onNavigate }) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const clusters = ['All', 'Single-Stock', 'Liquid Alt', 'AI & Tech', 'US Growth', 'Space Frontier'];
  const issuers = ['All', 'Global X Canada', 'CI Global / Forge First', 'RBC iShares', 'Ninepoint Partners'];

  const filteredEtfs = useMemo(() => {
    return NEW_ETFS_DATA.filter((etf) => {
      const matchesCluster = selectedCluster === 'All' || etf.thematicCluster === selectedCluster;
      const matchesIssuer = selectedIssuer === 'All' || etf.issuer.includes(selectedIssuer) || selectedIssuer.includes(etf.issuer);
      const matchesSearch =
        etf.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.style.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCluster && matchesIssuer && matchesSearch;
    });
  }, [selectedCluster, selectedIssuer, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs uppercase px-2 py-0.5 bg-[var(--primary)] text-white font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            FRESH CANADIAN LISTINGS · TSX & CBOE
          </span>
          <span className="font-mono text-xs text-[var(--fg-3)]">
            WEEKLY INTAKE: OCT 16, 2026
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[var(--fg-1)]">
          New Canadian-Listed ETFs
        </h1>
        <p className="text-sm text-[var(--fg-2)] mt-2 max-w-3xl leading-relaxed">
          Real-time intelligence on the latest exchange-traded funds launching on the Toronto Stock Exchange (TSX) and Cboe Canada. Explore single-stock PowerStock wrappers, liquid alternative hedge strategies, and active artificial intelligence portfolios.
        </p>
      </div>

      {/* Incubation Notice Banner */}
      <div className="p-4 bg-[var(--bg-1)] border-l-4 border-[var(--primary)] border border-[var(--border)] text-xs font-mono space-y-1">
        <div className="flex items-center gap-2 font-bold text-[var(--primary)]">
          <ShieldCheck className="w-4 h-4" />
          <span>CANADIAN INCUBATION & SEED CAPITAL ARCHITECTURE</span>
        </div>
        <p className="text-[var(--fg-2)] leading-relaxed">
          Newly minted Canadian ETFs launch with nominal seed capital (typically $1M–$5M CAD) subscribed by the Designated Broker (DB). Initial AUM is intentionally suppressed in fresh listings to prevent misleading retail liquidity assessments—market makers provide continuous two-sided liquidity around NAV. Official MERs are confirmed following the first annual Management Report of Fund Performance (MRFP).
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-[var(--bg-1)] border border-[var(--border)]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-3)]" />
          <input
            type="text"
            placeholder="Search by symbol, company, or theme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[var(--bg-0)] border border-[var(--border)] text-xs font-mono text-[var(--fg-1)] placeholder-[var(--fg-3)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        {/* Cluster Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-[var(--fg-3)] mr-1 uppercase">Cluster:</span>
          {clusters.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCluster(c)}
              className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                selectedCluster === c
                  ? 'bg-[var(--primary)] text-white font-bold'
                  : 'bg-[var(--bg-0)] text-[var(--fg-2)] border border-[var(--border)] hover:text-[var(--fg-1)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of New Canadian ETFs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEtfs.map((etf) => (
          <div
            key={etf.symbol}
            onClick={() => onSelectETF(etf.symbol)}
            className="bg-[var(--bg-1)] border border-[var(--border)] hover:border-[var(--primary)] p-5 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[var(--primary)] group-hover:underline">
                      {etf.symbol}
                    </span>
                    <span className="px-1.5 py-0.5 bg-[var(--bg-0)] border border-[var(--border)] text-[10px] font-mono text-[var(--fg-3)]">
                      {etf.exchange}
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      NEW
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-[var(--fg-1)] mt-1.5 line-clamp-1">
                    {etf.name}
                  </h3>
                </div>

                <ArrowUpRight className="w-4 h-4 text-[var(--fg-3)] group-hover:text-[var(--primary)] transition-colors shrink-0" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] font-mono text-[var(--fg-3)]">
                <span>{etf.category}</span>
                <span>·</span>
                <span>{etf.geography}</span>
                <span>·</span>
                <span className="text-[var(--fg-2)] font-medium">{etf.issuer}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--fg-2)] mt-3 line-clamp-2 leading-relaxed">
                {etf.description}
              </p>
            </div>

            {/* Metrics & Highlights */}
            <div className="pt-3 border-t border-[var(--border)] space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-[var(--bg-0)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--fg-3)]">LAUNCH PRICE</div>
                  <div className="font-bold text-[var(--fg-1)] mt-0.5">
                    {etf.price !== null ? `$${etf.price.toFixed(2)}` : 'At NAV'}
                  </div>
                </div>

                <div className="p-2 bg-[var(--bg-0)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--fg-3)] uppercase">{etf.feeType}</div>
                  <div className="font-bold text-[var(--primary)] mt-0.5 truncate">
                    {etf.feeDisplay}
                  </div>
                </div>
              </div>

              {etf.alsoInUSD && (
                <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-800/30 px-2 py-1">
                  Also available: {etf.alsoInUSD}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--fg-3)] pt-1">
                <span>Style: {etf.style}</span>
                <span className="text-[var(--primary)] font-bold group-hover:underline">
                  Inspect ETF →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEtfs.length === 0 && (
        <div className="text-center py-16 bg-[var(--bg-1)] border border-[var(--border)] text-xs font-mono text-[var(--fg-3)]">
          No new ETFs found matching "{searchQuery}" in category "{selectedCluster}".
        </div>
      )}
    </div>
  );
};
