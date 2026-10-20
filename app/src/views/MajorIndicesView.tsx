import React, { useState } from 'react';
import { Layers, TrendingUp, ShieldAlert, ArrowRight, ArrowLeftRight, CheckCircle2, AlertTriangle, ExternalLink, Globe, DollarSign, Activity } from 'lucide-react';
import { ETF_DATABASE, ETFSummary } from '../data/etfData';

interface MajorIndicesViewProps {
  onSelectETF: (symbol: string) => void;
  onNavigate: (tab: string, symbol?: string) => void;
}

interface IndexHubCategory {
  id: string;
  name: string;
  benchmark: string;
  desc: string;
  topETFs: {
    symbol: string;
    name: string;
    mer: number;
    aum: string;
    yieldTTM: number;
    return1Y: number;
    currency: string;
    hedged: boolean;
    type: string;
  }[];
  keyInsights: string[];
  watchOutWarning?: string;
}

export const MajorIndicesView: React.FC<MajorIndicesViewProps> = ({ onSelectETF, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('sp500');

  const indexCategories: IndexHubCategory[] = [
    {
      id: 'sp500',
      name: 'U.S. Large Cap (S&P 500)',
      benchmark: 'S&P 500 Index (CAD & USD)',
      desc: 'The world’s most tracked equity benchmark. In Canada, investors choose between unhedged CAD, CAD-hedged, and swap-based corporate class structures.',
      topETFs: [
        { symbol: 'VFV.TO', name: 'Vanguard S&P 500 Index ETF (Unhedged CAD)', mer: 0.09, aum: '$18.9B', yieldTTM: 1.15, return1Y: 28.6, currency: 'CAD', hedged: false, type: 'Physical via VOO' },
        { symbol: 'XUS.TO', name: 'iShares Core S&P 500 Index ETF (Unhedged CAD)', mer: 0.09, aum: '$6.2B', yieldTTM: 1.18, return1Y: 28.4, currency: 'CAD', hedged: false, type: 'Physical Direct' },
        { symbol: 'ZSP.TO', name: 'BMO S&P 500 Index ETF (Unhedged CAD)', mer: 0.09, aum: '$13.5B', yieldTTM: 1.16, return1Y: 28.5, currency: 'CAD', hedged: false, type: 'Physical Direct' },
        { symbol: 'VSP.TO', name: 'Vanguard S&P 500 CAD-Hedged Index ETF', mer: 0.09, aum: '$3.4B', yieldTTM: 1.12, return1Y: 24.1, currency: 'CAD', hedged: true, type: 'CAD Currency Hedged' },
        { symbol: 'HXS.TO', name: 'Global X S&P 500 Index Corporate Class ETF', mer: 0.10, aum: '$2.8B', yieldTTM: 0.00, return1Y: 28.7, currency: 'CAD', hedged: false, type: 'Synthetic Total Return Swap' },
      ],
      keyInsights: [
        'Currency Hedging Drag: CAD-hedged versions (VSP, XSP) incur forward contract rolling costs and cash drag, historically lagging unhedged versions by ~1.5% to 4% annually when USD strengthens.',
        'US Withholding Tax (15%): In TFSAs and Non-Reg accounts, US dividends face an unrecoverable 15% Foreign Withholding Tax (FWT). In RRSPs, holding pure US-listed VOO/SPY eliminates FWT under the tax treaty.',
        'Swap Advantage: HXS does not pay taxable distributions; dividends are automatically rolled into share NAV, eliminating foreign withholding tax drag in non-registered accounts.',
      ],
      watchOutWarning: 'Hedging to CAD is NOT free insurance. When USD appreciates against CAD, unhedged holders gain extra return. Only hedge if you anticipate persistent CAD appreciation.',
    },
    {
      id: 'tsx60',
      name: 'Canadian Equity (S&P/TSX 60 & Composite)',
      benchmark: 'S&P/TSX 60 & S&P/TSX Capped Composite',
      desc: 'The bedrock of Canadian domestic equity investing. Heavily weighted toward Canadian chartered banks, energy producers, pipelines, and rail transportation.',
      topETFs: [
        { symbol: 'XIU.TO', name: 'iShares S&P/TSX 60 Index ETF (Oldest Canadian ETF, 1990)', mer: 0.18, aum: '$14.2B', yieldTTM: 3.12, return1Y: 22.8, currency: 'CAD', hedged: false, type: 'Top 60 Mega Caps' },
        { symbol: 'XIC.TO', name: 'iShares Core S&P/TSX Capped Composite Index ETF', mer: 0.06, aum: '$12.4B', yieldTTM: 2.88, return1Y: 22.5, currency: 'CAD', hedged: false, type: 'Total Canadian Market (220 stocks)' },
        { symbol: 'VCN.TO', name: 'Vanguard FTSE Canada All Cap Index ETF', mer: 0.05, aum: '$6.8B', yieldTTM: 2.85, return1Y: 22.4, currency: 'CAD', hedged: false, type: 'Broad All-Cap (Large/Mid/Small)' },
        { symbol: 'ZCN.TO', name: 'BMO S&P/TSX Capped Composite Index ETF', mer: 0.06, aum: '$8.1B', yieldTTM: 2.86, return1Y: 22.6, currency: 'CAD', hedged: false, type: 'Total Canadian Market' },
        { symbol: 'HXT.TO', name: 'Global X S&P/TSX 60 Corporate Class ETF', mer: 0.04, aum: '$4.2B', yieldTTM: 0.00, return1Y: 23.0, currency: 'CAD', hedged: false, type: 'Swap Total Return (Zero Tax Slips)' },
      ],
      keyInsights: [
        '10% Single Stock Capping: The TSX Capped Composite limits any single company (like Royal Bank or Shopify) to 10% of fund weight during quarterly rebalances to avoid extreme concentration.',
        'Sector Skew: Financials (~32%) and Energy (~18%) make up over 50% of the entire Canadian market. You own negligible domestic healthcare or consumer discretionary.',
        'Tax Efficiency: 100% of dividends paid by physical Canadian equity ETFs qualify for the lucrative Federal and Provincial Canadian Dividend Tax Credit (DTC).',
      ],
    },
    {
      id: 'nasdaq',
      name: 'Technology & Growth (NASDAQ 100)',
      benchmark: 'NASDAQ-100 Index',
      desc: 'Top 100 non-financial companies listed on NASDAQ. The premier vehicle for tech giants, semiconductor leaders, and AI infrastructure.',
      topETFs: [
        { symbol: 'HXQ.TO', name: 'Global X NASDAQ-100 Index Corporate Class ETF', mer: 0.28, aum: '$1.9B', yieldTTM: 0.00, return1Y: 34.2, currency: 'CAD', hedged: false, type: 'Total Return Swap (Low Fee)' },
        { symbol: 'ZQQ.TO', name: 'BMO NASDAQ 100 Equity Hedged to CAD ETF', mer: 0.39, aum: '$1.8B', yieldTTM: 0.45, return1Y: 30.1, currency: 'CAD', hedged: true, type: 'CAD Hedged' },
        { symbol: 'XQQ.TO', name: 'iShares NASDAQ 100 Index ETF (CAD-Hedged)', mer: 0.40, aum: '$1.2B', yieldTTM: 0.42, return1Y: 30.0, currency: 'CAD', hedged: true, type: 'CAD Hedged' },
        { symbol: 'TEC.TO', name: 'TD Global Technology Leaders Index ETF', mer: 0.39, aum: '$2.4B', yieldTTM: 0.42, return1Y: 38.4, currency: 'CAD', hedged: false, type: 'Global Tech (US + Intl)' },
        { symbol: 'XIT.TO', name: 'iShares S&P/TSX Capped Information Technology', mer: 0.61, aum: '$640M', yieldTTM: 0.00, return1Y: 42.1, currency: 'CAD', hedged: false, type: 'Pure Canadian Tech (CGI, CSU)' },
      ],
      keyInsights: [
        'Semiconductor & AI Super-Cycle: NVIDIA, Broadcom, Apple, Microsoft, Amazon, Alphabet, and Meta comprise over 52% of NASDAQ 100 weight.',
        'TEC vs QQQ: TD’s TEC includes global chip champions like TSMC (Taiwan) and ASML (Netherlands) alongside US tech, whereas QQQ/HXQ is strictly NASDAQ-listed.',
      ],
    },
    {
      id: 'allinone',
      name: 'All-in-One Asset Allocation (Global Equity & Balanced)',
      benchmark: 'Global Equity / Aggregate Bond Composites',
      desc: 'Self-rebalancing single-ticket solutions. Holds thousands of underlying stocks across Canada, the US, developed international, and emerging markets.',
      topETFs: [
        { symbol: 'XEQT.TO', name: 'iShares Core Equity ETF Portfolio (100% Equity)', mer: 0.20, aum: '$23.4B', yieldTTM: 1.58, return1Y: 24.8, currency: 'CAD', hedged: false, type: '100% Equity' },
        { symbol: 'VEQT.TO', name: 'Vanguard All-Equity ETF Portfolio (100% Equity)', mer: 0.24, aum: '$6.5B', yieldTTM: 1.48, return1Y: 24.4, currency: 'CAD', hedged: false, type: '100% Equity' },
        { symbol: 'ZEQT.TO', name: 'BMO All-Equity ETF (100% Equity)', mer: 0.20, aum: '$920M', yieldTTM: 1.62, return1Y: 24.6, currency: 'CAD', hedged: false, type: '100% Equity' },
        { symbol: 'XGRO.TO', name: 'iShares Core Growth ETF Portfolio (80/20)', mer: 0.20, aum: '$5.4B', yieldTTM: 2.15, return1Y: 20.4, currency: 'CAD', hedged: false, type: '80% Equity / 20% Bonds' },
        { symbol: 'VGRO.TO', name: 'Vanguard Growth ETF Portfolio (80/20)', mer: 0.24, aum: '$4.9B', yieldTTM: 2.05, return1Y: 20.2, currency: 'CAD', hedged: false, type: '80% Equity / 20% Bonds' },
        { symbol: 'XBAL.TO', name: 'iShares Core Balanced ETF Portfolio (60/40)', mer: 0.20, aum: '$2.8B', yieldTTM: 2.74, return1Y: 16.2, currency: 'CAD', hedged: false, type: '60% Equity / 40% Bonds' },
      ],
      keyInsights: [
        'Home Bias (25% - 30%): Both Vanguard and iShares allocate ~25-30% to Canadian equities to optimize tax efficiency (Dividend Tax Credit) and reduce foreign currency volatility.',
        'Zero Overlap Need: Buying XEQT + VFV creates massive duplicate fee drag. XEQT already holds 45% US equity with full exposure to Apple, Microsoft, NVIDIA, Amazon, and Alphabet.',
      ],
    },
    {
      id: 'bonds',
      name: 'Canadian Fixed Income & Aggregate Bonds',
      benchmark: 'FTSE Canada Universe Bond Index',
      desc: 'Government and corporate investment-grade debt. Crucial for portfolio stability, capital preservation, and predictable monthly coupon distributions.',
      topETFs: [
        { symbol: 'ZAG.TO', name: 'BMO Aggregate Bond Index ETF', mer: 0.09, aum: '$7.8B', yieldTTM: 3.85, return1Y: 6.8, currency: 'CAD', hedged: false, type: 'Canadian Universe Aggregate' },
        { symbol: 'XBB.TO', name: 'iShares Core Canadian Universe Bond Index ETF', mer: 0.10, aum: '$5.6B', yieldTTM: 3.80, return1Y: 6.7, currency: 'CAD', hedged: false, type: 'Canadian Universe Aggregate' },
        { symbol: 'VAB.TO', name: 'Vanguard Canadian Aggregate Bond Index ETF', mer: 0.09, aum: '$4.2B', yieldTTM: 3.75, return1Y: 6.6, currency: 'CAD', hedged: false, type: 'Canadian Universe Aggregate' },
        { symbol: 'XSB.TO', name: 'iShares Core Canadian Short Term Bond Index ETF', mer: 0.10, aum: '$3.1B', yieldTTM: 3.65, return1Y: 5.2, currency: 'CAD', hedged: false, type: 'Short Term (1-5 Yrs)' },
        { symbol: 'XLB.TO', name: 'iShares Core Canadian Long Term Bond Index ETF', mer: 0.20, aum: '$1.4B', yieldTTM: 4.25, return1Y: 8.4, currency: 'CAD', hedged: false, type: 'Long Term (10+ Yrs)' },
      ],
      keyInsights: [
        'Modified Duration Risk: Aggregate bond ETFs have an average duration of ~7.2 years. For every 1% Bank of Canada interest rate hike, fund prices fall by roughly 7.2%.',
        'Credit Quality: Over 70% of Canadian Universe Bond ETFs are backed by sovereign AAA/AA credit (Federal Government of Canada & Provincial Governments).',
      ],
    },
    {
      id: 'cash',
      name: 'High Interest Savings (Cash & Money Market)',
      benchmark: 'Bank of Canada Overnight Target Rate',
      desc: 'Liquid capital preservation vehicles holding institutional deposits at Schedule 1 Canadian chartered banks.',
      topETFs: [
        { symbol: 'CASH.TO', name: 'Global X High Interest Savings ETF', mer: 0.11, aum: '$4.8B', yieldTTM: 4.15, return1Y: 4.6, currency: 'CAD', hedged: false, type: 'High Interest Deposit' },
        { symbol: 'PSA.TO', name: 'Purpose High Interest Savings Fund', mer: 0.16, aum: '$3.9B', yieldTTM: 4.10, return1Y: 4.5, currency: 'CAD', hedged: false, type: 'High Interest Deposit' },
        { symbol: 'CSAV.TO', name: 'CI High Interest Savings ETF', mer: 0.14, aum: '$5.2B', yieldTTM: 4.12, return1Y: 4.5, currency: 'CAD', hedged: false, type: 'High Interest Deposit' },
        { symbol: 'HSAV.TO', name: 'Global X Cash Maximizer Corporate Class ETF', mer: 0.14, aum: '$2.1B', yieldTTM: 0.00, return1Y: 4.8, currency: 'CAD', hedged: false, type: 'Capital Gains Tax Treatment' },
        { symbol: 'CMR.TO', name: 'iShares Premium Money Market ETF', mer: 0.28, aum: '$1.5B', yieldTTM: 4.05, return1Y: 4.4, currency: 'CAD', hedged: false, type: 'Gov Treasury Bills (T-Bills)' },
      ],
      keyInsights: [
        'OSFI Regulatory Rules: Following OSFI guidelines, Canadian cash ETFs must maintain a 30-day liquidity buffer, anchoring net yields to approximately Bank of Canada overnight rate minus ~0.35% - 0.45%.',
        'No CDIC Insurance: Unlike retail GICs, CASH.TO and PSA.TO are not insured by the Canada Deposit Insurance Corporation (CDIC). Assets are held as uninsured institutional deposits at Canadian banks.',
      ],
      watchOutWarning: 'Cash ETFs yield floats automatically with every Bank of Canada rate announcement. When BoC cuts interest rates, cash distribution yields fall immediately.',
    },
    {
      id: 'reits',
      name: 'Canadian Real Estate & REITs',
      benchmark: 'S&P/TSX Capped REIT Index',
      desc: 'Liquid real estate exposure across residential multi-family, industrial logistics, and retail shopping centers.',
      topETFs: [
        { symbol: 'XRE.TO', name: 'iShares S&P/TSX Capped REIT Index ETF', mer: 0.61, aum: '$1.1B', yieldTTM: 4.85, return1Y: 18.2, currency: 'CAD', hedged: false, type: 'Capped Market-Cap (Top Heavy)' },
        { symbol: 'ZRE.TO', name: 'BMO Equal Weight REITs Index ETF', mer: 0.61, aum: '$680M', yieldTTM: 5.20, return1Y: 19.4, currency: 'CAD', hedged: false, type: 'Equal Weight (~4% per REIT)' },
        { symbol: 'VRE.TO', name: 'Vanguard FTSE Canadian Capped REIT Index ETF', mer: 0.38, aum: '$420M', yieldTTM: 4.60, return1Y: 17.8, currency: 'CAD', hedged: false, type: 'Low Fee REITs + Real Estate Cos' },
      ],
      keyInsights: [
        'Equal Weight vs Cap Weight: In XRE, the top 4 REITs make up over 45% of assets. ZRE uses equal-weighting to avoid concentration in single commercial landlords.',
        'Return of Capital (ROC) Tax Shield: Between 40% and 70% of REIT distributions are classified by CRA as Return of Capital, reducing ACB and deferring taxes in non-registered accounts.',
      ],
      watchOutWarning: 'Debt Refinancing Cliff: Watch 5-year mortgage rollover rates as legacy 2.5% debt resets at 5.5%+, impacting Funds From Operations (FFO).',
    },
    {
      id: 'commodities',
      name: 'Commodities, Gold & Precious Metals',
      benchmark: 'LBMA Gold Price (USD) & S&P/TSX Global Gold',
      desc: 'Physical bullion vaulted in Ottawa and London, plus operational mining equity operating leverage.',
      topETFs: [
        { symbol: 'MNT.TO', name: 'Royal Canadian Mint Canadian Gold Reserves ETR', mer: 0.35, aum: '$1.1B', yieldTTM: 0.00, return1Y: 38.5, currency: 'CAD', hedged: false, type: 'Physical Bullion (Ottawa Vault)' },
        { symbol: 'VALT.TO', name: 'CI Gold Bullion ETF (CAD Hedged)', mer: 0.18, aum: '$480M', yieldTTM: 0.00, return1Y: 32.4, currency: 'CAD', hedged: true, type: 'Lowest Fee CAD-Hedged Bullion' },
        { symbol: 'CGL.TO', name: 'iShares Gold Bullion ETF (CAD Hedged)', mer: 0.55, aum: '$980M', yieldTTM: 0.00, return1Y: 32.1, currency: 'CAD', hedged: true, type: 'Physical Bullion (CIBC Vault)' },
        { symbol: 'XGD.TO', name: 'iShares S&P/TSX Global Gold Index ETF', mer: 0.61, aum: '$1.8B', yieldTTM: 1.85, return1Y: 46.2, currency: 'CAD', hedged: false, type: 'Global Mining Equities (2.1x Beta)' },
        { symbol: 'HGY.TO', name: 'Global X Gold Yield ETF', mer: 0.89, aum: '$92M', yieldTTM: 7.85, return1Y: 21.2, currency: 'CAD', hedged: true, type: 'Covered Call Gold Yield' },
      ],
      keyInsights: [
        'MNT.TO Physical Redemption: The Royal Canadian Mint ETR allows direct physical redemption in 1 oz Gold Maple Leaf coins or kilobars for holders of 10,000+ units.',
        'Unhedged USD Safe-Haven: In global crises, the USD strengthens against CAD while gold rises, giving unhedged gold (MNT, VALT.B) an extra 8-12% performance boost over hedged CGL.',
      ],
    },
    {
      id: 'crypto',
      name: 'Canadian Spot Crypto & Bitcoin ETFs',
      benchmark: 'CME CF Bitcoin & Ether Reference Rates',
      desc: 'World’s first exchange-traded spot digital asset wrappers, backed 100% by physical crypto held in air-gapped institutional cold storage.',
      topETFs: [
        { symbol: 'BTCC.TO', name: 'Purpose Bitcoin ETF (World’s 1st Spot Bitcoin ETF)', mer: 1.25, aum: '$2.1B', yieldTTM: 0.00, return1Y: 112.4, currency: 'CAD', hedged: false, type: '100% Cold Storage Bitcoin' },
        { symbol: 'FBTC.TO', name: 'Fidelity Advantage Bitcoin ETF (Lowest Fee Canadian BTC)', mer: 0.35, aum: '$520M', yieldTTM: 0.00, return1Y: 115.8, currency: 'CAD', hedged: false, type: 'Fidelity In-House Cold Custody' },
        { symbol: 'ETHH.TO', name: 'Purpose Ether ETF (Staking-Enabled)', mer: 1.45, aum: '$415M', yieldTTM: 2.80, return1Y: 74.2, currency: 'CAD', hedged: false, type: 'Physical Ether + Staking Yield' },
        { symbol: 'BITI.TO', name: 'Global X BetaPro Inverse Bitcoin ETF (-1x Daily)', mer: 2.05, aum: '$35M', yieldTTM: 0.00, return1Y: -58.4, currency: 'CAD', hedged: false, type: '-1x Daily Inverse Derivative' },
      ],
      keyInsights: [
        'Regulated Staking: ETHH.TO is approved by Canadian regulators to stake Ethereum, generating ~3% annual network yield to offset fund MER inside registered accounts.',
        'TFSA/RRSP Tax Shelter: Spot crypto ETFs allow Canadian investors to shield digital asset gains from Canada’s 50%/66.7% capital gains inclusion rates completely tax-free.',
      ],
      watchOutWarning: 'BITI Volatility Decay: Daily -1x inverse ETFs mathematically decay when held across choppy sideways markets. BITI is for single-day tactical hedging only.',
    },
    {
      id: 'energy',
      name: 'Canadian Energy & Oil Sands',
      benchmark: 'S&P/TSX Capped Energy vs Solactive Equal Weight Oil & Gas',
      desc: 'Canada’s resource engine: Integrated oil sands producers, natural gas exploration, and midstream pipeline networks.',
      topETFs: [
        { symbol: 'XEG.TO', name: 'iShares S&P/TSX Capped Energy Index ETF', mer: 0.61, aum: '$2.4B', yieldTTM: 3.45, return1Y: 26.8, currency: 'CAD', hedged: false, type: '100% Upstream E&P (CNQ + SU: 50%)' },
        { symbol: 'ZEO.TO', name: 'BMO Equal Weight Oil & Gas Index ETF', mer: 0.61, aum: '$460M', yieldTTM: 4.85, return1Y: 24.2, currency: 'CAD', hedged: false, type: 'Equal Weight (Includes Pipelines)' },
        { symbol: 'NNRG.TO', name: 'Ninepoint Energy Fund (Active Series)', mer: 1.95, aum: '$1.0B', yieldTTM: 1.20, return1Y: 31.4, currency: 'CAD', hedged: false, type: 'Active E&P High Torque (Eric Nuttall)' },
      ],
      keyInsights: [
        'The XEG Pipeline Trap: XEG contains 0.0% Enbridge (ENB) and 0.0% TC Energy (TRP) due to index rules excluding transportation. Over 50% is concentrated in just CNQ and Suncor.',
        'ZEO Pipeline Cushion: ZEO holds ~27% in high-yielding pipelines (ENB, TRP, PPL), resulting in a higher monthly dividend yield (4.85%) and lower crude oil shock volatility.',
      ],
      watchOutWarning: 'TMX Pipeline Egress: The Trans Mountain Expansion structurally narrowed Western Canadian Select (WCS) discounts to WTI, expanding heavy oil netbacks.',
    },
  ];

  const currentHub = indexCategories.find((c) => c.id === activeCategory) || indexCategories[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-10">
      {/* Masthead */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">
            INDEX DIRECTORY // MAJOR BENCHMARK HUBS
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--fg-1)]">
          Canadian ETFs by Major Benchmark Index
        </h1>
        <p className="font-mono text-sm text-[var(--fg-muted)] mt-2 max-w-3xl">
          Compare every major Canadian-listed ETF tracking the S&P 500, S&P/TSX 60, NASDAQ 100, Global All-in-One, Aggregate Bonds, and High Interest Cash. 
          Audited for MER fee differences, currency hedging drag, and CRA T3 tax efficiency.
        </p>
      </div>

      {/* Index Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
        {indexCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-2 font-mono text-xs uppercase tracking-wider border transition-colors cursor-pointer ${
              activeCategory === c.id
                ? 'bg-[var(--primary)] text-[var(--bg-0)] border-[var(--primary)] font-bold'
                : 'bg-[var(--bg-1)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-1)] hover:border-[var(--primary)]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Active Index Hub Profile */}
      <div className="space-y-6">
        <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-faint)] pb-4">
            <div>
              <span className="font-mono text-xs px-2 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] text-[var(--primary)] font-bold">
                BENCHMARK: {currentHub.benchmark}
              </span>
              <h2 className="font-display text-2xl font-bold text-[var(--fg-1)] mt-2">{currentHub.name}</h2>
            </div>
            <p className="font-mono text-xs text-[var(--fg-muted)] max-w-xl">{currentHub.desc}</p>
          </div>

          {/* Warning Banner if applicable */}
          {currentHub.watchOutWarning && (
            <div className="p-3 bg-amber-500/10 border-l-4 border-amber-500 border-t border-r border-b border-[var(--border)] text-xs font-mono text-amber-400 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{currentHub.watchOutWarning}</span>
            </div>
          )}

          {/* ETF Table for this Index */}
          <div className="border border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase">
                  <th className="py-3 px-4">Ticker & Fund Name</th>
                  <th className="py-3 px-4">Structure / Replication</th>
                  <th className="py-3 px-4 text-right">MER</th>
                  <th className="py-3 px-4 text-right">AUM</th>
                  <th className="py-3 px-4 text-right">Yield</th>
                  <th className="py-3 px-4 text-right">1Y Return</th>
                  <th className="py-3 px-4 text-center">Currency</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-faint)]">
                {currentHub.topETFs.map((etf) => (
                  <tr key={etf.symbol} className="hover:bg-[var(--bg-1)] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <button
                          onClick={() => onSelectETF(etf.symbol)}
                          className="font-bold text-sm text-[var(--primary)] hover:underline text-left cursor-pointer"
                        >
                          {etf.symbol}
                        </button>
                        <span className="text-[11px] text-[var(--fg-muted)] truncate max-w-xs">{etf.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] text-[10px] text-[var(--fg-1)]">
                        {etf.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--fg-1)]">
                      {etf.mer.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-[var(--fg-muted)]">{etf.aum}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[var(--primary)]">
                      {etf.yieldTTM.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[var(--ret-up-1-fg)]">
                      +{etf.return1Y.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[11px] font-bold text-[var(--fg-1)]">{etf.currency}</span>
                      {etf.hedged && <span className="text-[10px] text-amber-400 block font-normal">Hedged</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectETF(etf.symbol)}
                          className="px-2 py-1 border border-[var(--border)] hover:border-[var(--primary)] text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg-1)] cursor-pointer"
                        >
                          Inspect &rarr;
                        </button>
                        <button
                          onClick={() => onNavigate('compare', etf.symbol)}
                          className="px-2 py-1 bg-[var(--bg-2)] border border-[var(--border)] text-[10px] text-[var(--primary)] hover:underline cursor-pointer"
                        >
                          Compare
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Engineering Insights */}
          <div className="p-4 bg-[var(--bg-2)] border border-[var(--border)] space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--fg-1)] block">
              Look-Through Insights & Structural Rules:
            </span>
            <ul className="space-y-1.5 font-mono text-xs text-[var(--fg-muted)]">
              {currentHub.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[var(--primary)] font-bold">&bull;</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
