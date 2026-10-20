import React, { useState, useMemo } from 'react';
import { Layers, ShieldCheck, Check, Search, Filter, Database, ArrowRight, ExternalLink, HelpCircle, BarChart2 } from 'lucide-react';

interface CoverageMatrixViewProps {
  onSelectETF: (symbol: string) => void;
  onNavigate: (tab: string, symbol?: string) => void;
}

interface IndexProviderStat {
  name: string;
  etfCount: number;
  sampleTickers: string[];
  rebalancingFreq: string;
  cappingRule: string;
  notes: string;
}

interface ReplicationCategory {
  type: string;
  count: number;
  pct: number;
  description: string;
  pros: string;
  cons: string;
  exampleTickers: string[];
}

export const CoverageMatrixView: React.FC<CoverageMatrixViewProps> = ({ onSelectETF, onNavigate }) => {
  const [filterAssetClass, setFilterAssetClass] = useState<string>('all');
  const [filterReplication, setFilterReplication] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const replicationBreakdown: ReplicationCategory[] = [
    {
      type: 'Physical Direct Replication',
      count: 642,
      pct: 56.1,
      description: 'Fund directly owns all constituent stocks or physical bullion bars in exact index proportions with a custodial trust.',
      pros: 'Zero counterparty credit risk; full voting rights pass-through; transparent daily custody auditing.',
      cons: 'Slightly higher trading turnover during broad index rebalancing.',
      exampleTickers: ['ZSP.TO', 'XIC.TO', 'VCN.TO', 'ZEB.TO', 'MNT.TO']
    },
    {
      type: 'Fund-of-Funds Physical Wrapper',
      count: 284,
      pct: 24.8,
      description: 'Canadian ETF holds shares of another underlying ETF (often US-listed) to achieve immediate liquidity and scale.',
      pros: 'Extremely tight tracking; multi-billion dollar institutional liquidity pool; low operational overhead.',
      cons: 'Nested layer creates Foreign Withholding Tax (FWT) leakage inside RRSPs; hidden second-tier fees.',
      exampleTickers: ['VFV.TO', 'XUS.TO', 'XEQT.TO', 'VEQT.TO', 'XAW.TO']
    },
    {
      type: 'Synthetic Total Return Swap / Corporate Class',
      count: 68,
      pct: 5.9,
      description: 'Fund enters counterparty derivative contracts with Canadian Schedule I chartered banks to swap cash for index total return.',
      pros: 'Virtually 0% tracking error; zero annual taxable dividend distributions (100% capital gain deferral); 0% FWT drag.',
      cons: 'Bank counterparty risk; swap fee margin (typically 0.10%–0.30%); legislative risk under Canadian tax code.',
      exampleTickers: ['HXS.TO', 'HXT.TO', 'HXQ.TO', 'HULC.TO']
    },
    {
      type: 'Active Quantitative & Covered Call Overlay',
      count: 150,
      pct: 13.2,
      description: 'Rule-based quantitative stock selection or automated monthly call option writing against 25%–50% of the portfolio.',
      pros: 'Elevated monthly cash flow distribution yields (7%–12%); cushioned downside volatility in sideways markets.',
      cons: 'Capped upside capture during sharp market bull runs; frequent Return of Capital (ROC) eroding NAV.',
      exampleTickers: ['ZWB.TO', 'HMAX.TO', 'HYLD.TO', 'ENCL.TO']
    }
  ];

  const indexProviders: IndexProviderStat[] = [
    {
      name: 'S&P Dow Jones / TSX',
      etfCount: 385,
      sampleTickers: ['XIU.TO', 'XIC.TO', 'VFV.TO', 'XUS.TO', 'ZSP.TO', 'XRE.TO'],
      rebalancingFreq: 'Quarterly (March, June, Sept, Dec)',
      cappingRule: '10% single-constituent cap on TSX 60; market-cap weighted on S&P 500',
      notes: 'The institutional gold standard for Canadian large-cap equities and US benchmark replication.'
    },
    {
      name: 'MSCI Inc.',
      etfCount: 220,
      sampleTickers: ['XEF.TO', 'VIU.TO', 'XEC.TO', 'VEE.TO', 'XAW.TO'],
      rebalancingFreq: 'Semi-annual (May, Nov) with quarterly reviews',
      cappingRule: 'Free-float adjusted market capitalization',
      notes: 'Dominates international developed (EAFE) and Emerging Markets coverage for Canadian allocators.'
    },
    {
      name: 'Solactive AG',
      etfCount: 195,
      sampleTickers: ['TEC.TO', 'ZEB.TO', 'ZUT.TO', 'HMAX.TO'],
      rebalancingFreq: 'Semi-annual or quarterly',
      cappingRule: 'Equal-weighting (ZEB 16.6%) or customized liquidity tilts',
      notes: 'German index provider widely adopted by BMO, TD, and Hamilton for equal-weight banking and specialized tech baskets.'
    },
    {
      name: 'FTSE Russell',
      etfCount: 165,
      sampleTickers: ['VCN.TO', 'VEQT.TO', 'VAB.TO', 'VGRO.TO'],
      rebalancingFreq: 'Semi-annual (March, September)',
      cappingRule: 'Comprehensive all-cap covering large, mid, and small-caps',
      notes: 'Vanguard Canada’s exclusive index partner across the Canadian all-in-one and equity suites.'
    },
    {
      name: 'Bloomberg Indices',
      etfCount: 110,
      sampleTickers: ['ZAG.TO', 'XBB.TO', 'CBO.TO'],
      rebalancingFreq: 'Monthly bond rebalancing',
      cappingRule: 'Duration and investment-grade liquidity screening',
      notes: 'Universal benchmark for the Canadian Aggregate Bond universe (Federal + Provincial + Corporate).'
    },
    {
      name: 'Royal Canadian Mint / Spot Custody',
      etfCount: 68,
      sampleTickers: ['MNT.TO', 'VALT.TO', 'BTCC.TO', 'ETHH.TO', 'FBTC.TO'],
      rebalancingFreq: 'Continuous allocation (100% physical bullion or cold storage crypto)',
      cappingRule: 'Allocated vault bars / segregated multi-sig institutional keys',
      notes: 'Direct custodial physical asset backing audited on TSX trading books.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-8 font-mono">
      {/* Header Banner */}
      <div className="border-b border-[var(--border)] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-[var(--primary)] uppercase tracking-wider font-bold">
          <Database className="w-4 h-4" />
          <span>TOOLKIT // REPLICATION DEPTH & COVERAGE MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--fg-1)]">
          Canadian Look-Through Coverage Matrix
        </h1>
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] max-w-3xl leading-relaxed">
          Full transparency into 1,144+ Canadian ETF listings across the TSX and Cboe Canada. Auditing physical vs synthetic swap replication, index governance, and multi-tier dissolution depth.
        </p>
      </div>

      {/* Aggregate Coverage Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-1">
          <span className="text-[10px] text-[var(--fg-muted)] uppercase block">Covered TSX/Cboe ETFs</span>
          <span className="font-display text-3xl font-extrabold text-[var(--fg-1)]">1,144</span>
          <span className="text-[10px] text-[var(--primary)] block">100% Look-Through Dissolved</span>
        </div>
        <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-1">
          <span className="text-[10px] text-[var(--fg-muted)] uppercase block">Underlying Constituents</span>
          <span className="font-display text-3xl font-extrabold text-[var(--primary)]">14,820+</span>
          <span className="text-[10px] text-[var(--fg-muted)] block">Global Operating Companies</span>
        </div>
        <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-1">
          <span className="text-[10px] text-[var(--fg-muted)] uppercase block">Index Publishers</span>
          <span className="font-display text-3xl font-extrabold text-[var(--fg-1)]">12</span>
          <span className="text-[10px] text-[var(--fg-muted)] block">S&P, MSCI, FTSE, Solactive</span>
        </div>
        <div className="bg-[var(--bg-1)] border border-[var(--border)] p-4 space-y-1">
          <span className="text-[10px] text-[var(--fg-muted)] uppercase block">T3/T5 Tax Slip Audit</span>
          <span className="font-display text-3xl font-extrabold text-emerald-400">100%</span>
          <span className="text-[10px] text-[var(--fg-muted)] block">ROC & Phantom Tracking</span>
        </div>
      </div>

      {/* SECTION 1: REPLICATION METHODOLOGIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
          <h2 className="font-display text-lg font-bold text-[var(--fg-1)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--primary)]" />
            <span>Fund Structure & Index Replication Methodologies</span>
          </h2>
          <span className="text-xs text-[var(--fg-muted)]">Breakdown across 1,144 Canadian Funds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {replicationBreakdown.map((rep) => (
            <div key={rep.type} className="bg-[var(--bg-1)] border border-[var(--border)] p-5 space-y-3">
              <div className="flex items-baseline justify-between border-b border-[var(--border-faint)] pb-2">
                <span className="font-bold text-sm text-[var(--fg-1)]">{rep.type}</span>
                <span className="text-xs text-[var(--primary)] font-bold">{rep.count} Funds ({rep.pct}%)</span>
              </div>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                {rep.description}
              </p>
              <div className="text-[11px] space-y-1 pt-1">
                <div className="text-emerald-400">
                  <strong>Advantage:</strong> {rep.pros}
                </div>
                <div className="text-amber-400">
                  <strong>Trade-off:</strong> {rep.cons}
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--border-faint)] flex items-center gap-2 text-[11px]">
                <span className="text-[var(--fg-muted)]">Sample Funds:</span>
                <div className="flex flex-wrap gap-1.5">
                  {rep.exampleTickers.map((t) => (
                    <button
                      key={t}
                      onClick={() => onSelectETF(t)}
                      className="px-1.5 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] text-[var(--primary)] hover:border-[var(--primary)] cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: INDEX PROVIDER ECOSYSTEM */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
          <h2 className="font-display text-lg font-bold text-[var(--fg-1)] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[var(--primary)]" />
            <span>Benchmark Index Providers & Rebalancing Rules</span>
          </h2>
          <span className="text-xs text-[var(--fg-muted)]">Governance & Methodology</span>
        </div>

        <div className="border border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase">
                <th className="py-2.5 px-4">Index Publisher</th>
                <th className="py-2.5 px-4">TSX Funds</th>
                <th className="py-2.5 px-4">Rebalancing Frequency</th>
                <th className="py-2.5 px-4">Capping / Weighting Mechanism</th>
                <th className="py-2.5 px-4">Benchmark Focus & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-faint)]">
              {indexProviders.map((idx) => (
                <tr key={idx.name} className="hover:bg-[var(--bg-1)]">
                  <td className="py-3 px-4 font-bold text-[var(--fg-1)]">
                    <div>{idx.name}</div>
                    <div className="flex gap-1.5 mt-1">
                      {idx.sampleTickers.slice(0, 3).map((sym) => (
                        <button
                          key={sym}
                          onClick={() => onSelectETF(sym)}
                          className="text-[10px] text-[var(--primary)] hover:underline cursor-pointer"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--primary)] font-bold">{idx.etfCount}</td>
                  <td className="py-3 px-4 text-[var(--fg-muted)]">{idx.rebalancingFreq}</td>
                  <td className="py-3 px-4 text-[var(--fg-2)]">{idx.cappingRule}</td>
                  <td className="py-3 px-4 text-[var(--fg-muted)] max-w-xs">{idx.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: THREE-TIER LOOK-THROUGH ARCHITECTURE */}
      <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-4">
        <div className="border-b border-[var(--border-faint)] pb-3">
          <h3 className="font-display text-base font-bold text-[var(--fg-1)]">
            How ThanhETF Deconstructs Nested Fund-of-Funds
          </h3>
          <p className="text-xs text-[var(--fg-muted)] mt-1">
            Standard brokerage apps stop at Tier 1, displaying deceptive top holdings like "iShares Core S&P 500 ETF (45%)". ThanhETF dissolves each tier recursively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[var(--bg-0)] p-4 border border-[var(--border)] space-y-2">
            <span className="text-[10px] text-[var(--primary)] uppercase font-bold">Tier 1: TSX Listing</span>
            <p className="font-bold text-[var(--fg-1)]">XEQT.TO / VFV.TO</p>
            <p className="text-[var(--fg-muted)] leading-relaxed text-[11px]">
              The Canadian unitholder purchases units traded on the Toronto Stock Exchange denominated in CAD.
            </p>
          </div>
          <div className="bg-[var(--bg-0)] p-4 border border-[var(--border)] space-y-2">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Tier 2: Intermediate Sleeves</span>
            <p className="font-bold text-[var(--fg-1)]">ITOT (45%) + XIC (25%) + XEF (25%)</p>
            <p className="text-[var(--fg-muted)] leading-relaxed text-[11px]">
              Fund holds US-listed or Canadian-domiciled underlying ETFs to assemble global geographical exposure.
            </p>
          </div>
          <div className="bg-[var(--bg-0)] p-4 border border-[var(--border)] space-y-2">
            <span className="text-[10px] text-emerald-400 uppercase font-bold">Tier 3: True Operating Equities</span>
            <p className="font-bold text-[var(--fg-1)]">Apple, Microsoft, RBC, Nvidia, Shopify</p>
            <p className="text-[var(--fg-muted)] leading-relaxed text-[11px]">
              ThanhETF reveals the true combined weights of actual revenue-generating companies, allowing accurate portfolio overlap analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
