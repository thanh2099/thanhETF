import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, ArrowLeft, Tag, Layers, Share2, AlertTriangle, CheckCircle2, Bookmark } from 'lucide-react';

interface ArticlesViewProps {
  onSelectETF: (symbol: string) => void;
  onNavigate: (tab: string, symbol?: string) => void;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  readTime: string;
  publishDate: string;
  category: string;
  summary: string;
  tags: string[];
  content: string[];
  mentionedETFs: string[];
  keyTakeaway: string;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ onSelectETF, onNavigate }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const articles: Article[] = [
    {
      id: 'xeqt-sp500',
      slug: 'you-own-xeqt-and-want-to-add-an-s-p-500-fund-don-t',
      title: "You Own XEQT and Want to Add an S&P 500 Fund? Don't.",
      readTime: '6 min read',
      publishDate: 'October 12, 2026',
      category: 'Asset Allocation',
      summary: 'Why holding both an All-Equity asset allocation ETF (XEQT/VEQT) and an S&P 500 fund (VFV/XUS) creates severe US mega-cap tech concentration while defeating global diversification.',
      tags: ['xeqt', 'veqt', 'sp500', 'assetallocation', 'diversification'],
      mentionedETFs: ['XEQT.TO', 'VFV.TO', 'XUS.TO', 'VEQT.TO'],
      keyTakeaway: 'XEQT already holds ~45% US equities through ITOT/XTOT. Adding VFV concentrates over 65% of your total net worth in the US and inflates Apple, Microsoft, and NVIDIA exposure beyond 15% of your portfolio.',
      content: [
        'A very common inclination among Canadian retail investors is to buy an all-in-one portfolio ETF like iShares XEQT or Vanguard VEQT for safety, but then think: "Wait, the S&P 500 has performed so well, let me add 20% or 30% of VFV to juice my returns."',
        'While intuitively appealing, look-through constituent analysis reveals this is almost always a mistake that directly undermines why you bought an all-in-one ETF in the first place.',
        '1. You Already Own Massive U.S. Equity: XEQT is NOT a Canadian-only fund. In fact, 45% of XEQT is already allocated to the total US stock market. When you buy XEQT, your single largest geographical exposure is already the United States.',
        '2. Severe Tech Concentration: If you add 30% VFV to 70% XEQT, your effective US exposure surges to nearly 65%. Your top 5 holdings (Apple, Microsoft, NVIDIA, Amazon, Alphabet) now represent nearly 20% of your entire wealth. You have essentially dismantled the deliberate global diversification created by RBC iShares.',
        '3. Fee Leakage with Zero Added Diversification: VFV and XEQT share 100% of VFV’s holdings. You are paying management fees on two funds to own the exact same underlying companies twice.',
        'The Conclusion: If your objective is a globally balanced, passive investment strategy, trust the all-in-one asset allocation. If you intentionally want a heavy US tech tilt, own pure S&P 500 or Nasdaq funds directly rather than blending them into an asset allocation ETF.',
      ],
    },
    {
      id: 'covered-calls-vs-traditional',
      slug: 'covered-call-etfs-vs-traditional-etfs-why-higher-yield-often-means-lower-returns',
      title: 'Covered Call ETFs vs Traditional ETFs: Why Higher Yield Often Means Lower Returns',
      readTime: '8 min read',
      publishDate: 'September 28, 2026',
      category: 'Covered Calls',
      summary: 'Deconstructing the 12% to 14% distribution yields on Canadian covered call ETFs. How written calls cap your upside during rallies while leaving downside risk almost completely unprotected.',
      tags: ['coveredcall', 'yieldinvesting', 'options', 'zwb', 'hmax'],
      mentionedETFs: ['ZWB.TO', 'ZEB.TO', 'HMAX.TO', 'HYLD.TO'],
      keyTakeaway: 'Over 5-year and 10-year holding periods, plain vanilla ETFs routinely outperform their covered call counterparts in total return. High yield is financed by selling future capital upside.',
      content: [
        'With Canadian covered call funds like HMAX and HYLD advertising monthly distributions annualized at 12% to 14%, self-directed income investors have poured billions into options-based ETFs.',
        'However, yield is NOT return. A fund can yield 14% while delivering only 5% total return if the net asset value (NAV) steadily erodes.',
        '1. The Asymmetric Payoff Trap: When an ETF writes call options on its holdings (e.g., 33% to 50% call writing), it trades upside capital growth for upfront option premium. When the market surges, the stocks get called away at the strike price, capping gains.',
        '2. Full Downside Participation: When the market crashes (such as in 2020 or 2022), the modest option premium provides only a tiny cushion (typically 1-2%). The fund drops almost dollar-for-dollar with the broader market.',
        '3. The Empiric Evidence: Comparing BMO Equal Weight Banks (ZEB) to BMO Covered Call Canadian Banks (ZWB) over the past decade proves this phenomenon: ZEB produced +18.4% 1-year total return vs ZWB’s +12.4%, despite ZWB paying a significantly higher monthly distribution.',
        'Recommendation: Covered call ETFs are viable tools for retirees who prioritize immediate cash flow over long-term capital preservation. For accumulators and growth investors, they are a mathematical headwind.',
      ],
    },
    {
      id: 'do-bonds-protect',
      slug: 'do-bonds-still-protect-you-looking-inside-canadian-asset-allocation-etfs',
      title: 'Do Bonds Still Protect You? Looking Inside Canadian Asset Allocation ETFs',
      readTime: '7 min read',
      publishDate: 'September 14, 2026',
      category: 'Fixed Income',
      summary: 'Examining the 2022 bond crash and whether traditional 80/20 and 60/40 balanced portfolios (XGRO, XBAL, VGRO) can still safeguard capital against modern inflation shocks.',
      tags: ['bonds', 'assetallocation', 'zag', 'xbal', 'vgro'],
      mentionedETFs: ['ZAG.TO', 'XBB.TO', 'XBAL.TO', 'XGRO.TO'],
      keyTakeaway: 'Bonds suffered unprecedented duration drawdowns in 2022 when central banks rapidly hiked rates. Today, with starting yields around 4%, bonds once again provide meaningful income cushions.',
      content: [
        'The year 2022 was historic for fixed income: as the Bank of Canada and the Federal Reserve aggressively hiked benchmark interest rates to combat inflation, bond prices plummeted, failing to buffer equity losses.',
        'Many DIY investors declared the classic 60/40 portfolio dead. But look-through analysis of Canadian Aggregate Bond funds (ZAG, XBB, VAB) shows why the math has fundamentally changed.',
        '1. Starting Yield is Destiny: In 2021, Canadian bond ETFs yielded barely 1.5%. There was virtually zero yield cushion to absorb interest rate increases. Today, starting yields to maturity (YTM) stand near 4.0% to 4.5%.',
        '2. The Duration Equation: With an average modified duration of 7.2 years, every rate cut by the Bank of Canada now delivers both monthly income and capital price appreciation.',
        'Conclusion: Fixed income has regained its role as a volatility dampener and income generator for Canadian balanced portfolios.',
      ],
    },
    {
      id: 'bond-etfs-interest-rates',
      slug: 'which-canadian-bond-etf-fits-your-view-on-interest-rates',
      title: 'Which Canadian Bond ETF Fits Your View on Interest Rates?',
      readTime: '5 min read',
      publishDate: 'August 22, 2026',
      category: 'Fixed Income',
      summary: 'Positioning your fixed income sleeve: Short-term bonds (XSB), aggregate universe (ZAG), long-term bonds (XLB), or cash savings (CASH.TO).',
      tags: ['bonds', 'interestrates', 'duration', 'zag', 'xsb'],
      mentionedETFs: ['XSB.TO', 'ZAG.TO', 'XLB.TO', 'CASH.TO'],
      keyTakeaway: 'If you expect aggressive Bank of Canada rate cuts, long-term bonds (XLB) offer maximum capital upside. If you expect sticky rates, short-term bonds (XSB) or CASH minimize volatility.',
      content: [
        'Interest rate cycles dictate bond ETF returns. By adjusting the duration profile of your fixed income sleeve, you can align with macroeconomic forecasts.',
        '1. Short Duration (XSB): 1-5 year maturity. Negligible sensitivity to rate shifts. Ideal for money needed in 1 to 3 years.',
        '2. Core Aggregate (ZAG / XBB): 7-year duration. The standard benchmark for balanced long-term portfolios.',
        '3. Long Duration (XLB): 15+ year duration. High volatility, but explosive capital gains when benchmark rates drop.',
      ],
    },
    {
      id: 'gold-role-canadian-portfolio',
      slug: 'is-there-still-a-role-for-gold-in-a-portfolio',
      title: 'Is There Still a Role for Gold in a Canadian Portfolio?',
      readTime: '6 min read',
      publishDate: 'August 05, 2026',
      category: 'Commodities',
      summary: 'Evaluating gold priced in Canadian Dollars. Analyzing physical gold trusts (CGL, MNT) versus gold mining equities (XGD).',
      tags: ['gold', 'commodities', 'inflation', 'cgl', 'mnt'],
      mentionedETFs: ['CGL.TO', 'MNT.TO', 'XGD.TO'],
      keyTakeaway: 'Physical bullion (MNT / CGL) acts as a reliable non-correlated monetary hedge. Gold mining stocks (XGD) act as leveraged operational equities and have historically lagged physical gold.',
      content: [
        'As geopolitical tensions rise and central banks diversify reserves away from fiat currencies, gold reached new all-time highs in Canadian dollar terms.',
        'Physical Gold Bullion vs Mining Stocks: Many investors mistake gold miners (XGD) for gold itself. Mining companies carry operational, geological, labor, and balance-sheet risks. For true wealth preservation, physical bullion ETFs (CGL) or Royal Canadian Mint ETRs (MNT) offer superior preservation characteristics.',
      ],
    },
    {
      id: 'target-maturity-vs-buffer',
      slug: 'target-maturity-vs-buffer-etfs-short-term-cash',
      title: 'Target Maturity vs Buffer ETFs for Short-Term Cash',
      readTime: '6 min read',
      publishDate: 'July 18, 2026',
      category: 'Specialty Tools',
      summary: 'Understanding modern defensive structures: Defined-outcome equity buffer ETFs versus target-maturity corporate bond sleeves.',
      tags: ['defensive', 'equitybufferetf', 'targetmaturityetf', 'cash'],
      mentionedETFs: ['CASH.TO', 'PSA.TO', 'ZAG.TO'],
      keyTakeaway: 'Buffer ETFs provide options-based downside protection (e.g. 10% or 15% buffer) in exchange for capped upside. Target-maturity bonds hold bonds to maturity, locking in exact yields.',
      content: [
        'Recent Canadian product launches have introduced complex defensive strategies including equity buffer ETFs and target-maturity bond funds.',
        'Understand the mechanics: Buffer ETFs use flex options to absorb the first 10-15% of market drops over a 12-month outcome period, but cap your potential gains. Evaluate whether paying higher MERs for artificial downside insurance beats simply holding a disciplined stock/cash allocation.',
      ],
    },
  ];

  const allTags = ['All', 'xeqt', 'sp500', 'coveredcall', 'bonds', 'assetallocation', 'yieldinvesting', 'gold'];

  const filteredArticles = selectedTag === 'All'
    ? articles
    : articles.filter((a) => a.tags.includes(selectedTag));

  const activeArticle = articles.find((a) => a.id === activeArticleId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">
            EDITORIAL // MARKET RESEARCH & INSIGHTS
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--fg-1)]">
          Canadian ETF Research & Editorial Insights
        </h1>
        <p className="font-mono text-sm text-[var(--fg-muted)] mt-2 max-w-3xl">
          Deep structural analyses, holding overlap warnings, CRA tax guides, and empirical studies written specifically for Canadian DIY investors.
        </p>
      </div>

      {/* ARTICLE READER MODAL / VIEW */}
      {activeArticle ? (
        <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 md:p-8 space-y-6">
          <button
            onClick={() => setActiveArticleId(null)}
            className="flex items-center gap-1.5 font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Research Directory
          </button>

          <div className="space-y-3 border-b border-[var(--border-faint)] pb-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--fg-muted)]">
              <span className="px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 font-semibold">
                {activeArticle.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {activeArticle.publishDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--fg-1)]">
              {activeArticle.title}
            </h2>

            {/* Key Takeaway Box */}
            <div className="p-4 bg-[var(--bg-0)] border-l-4 border-[var(--primary)] border-t border-r border-b border-[var(--border)] space-y-1">
              <span className="font-mono text-xs font-bold text-[var(--primary)] uppercase">
                CORE EDITORIAL TAKEAWAY
              </span>
              <p className="font-mono text-xs text-[var(--fg-1)] leading-relaxed">
                {activeArticle.keyTakeaway}
              </p>
            </div>
          </div>

          {/* Article Body */}
          <div className="space-y-4 font-sans text-sm md:text-base leading-relaxed text-[var(--fg-1)] max-w-4xl">
            {activeArticle.content.map((paragraph, idx) => (
              <p key={idx} className="font-mono text-xs md:text-sm text-[var(--fg-muted)] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Mentioned ETFs Quick Action Dock */}
          <div className="pt-6 border-t border-[var(--border-faint)] space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--fg-1)] block">
              Analyzed ETFs in This Article:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeArticle.mentionedETFs.map((sym) => (
                <button
                  key={sym}
                  onClick={() => onSelectETF(sym)}
                  className="px-3 py-1.5 bg-[var(--bg-0)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-mono text-[var(--fg-1)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <strong className="text-[var(--primary)]">{sym}</strong>
                  <span className="text-[10px] text-[var(--fg-muted)]">Inspect Look-Through &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ARTICLES DIRECTORY GRID */
        <div className="space-y-8">
          {/* Tag Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 text-xs font-mono border transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[var(--primary)] text-[var(--bg-0)] border-[var(--primary)] font-bold'
                    : 'bg-[var(--bg-1)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticleId(art.id)}
                className="bg-[var(--bg-1)] border-2 border-[var(--border)] hover:border-[var(--primary)] p-6 flex flex-col justify-between transition-colors cursor-pointer space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--fg-muted)]">
                    <span className="text-[10px] uppercase font-bold text-[var(--primary)]">
                      {art.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[var(--fg-1)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="font-mono text-xs text-[var(--fg-muted)] line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-faint)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--fg-muted)] text-[11px]">{art.publishDate}</span>
                  <span className="text-[var(--primary)] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Study &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
