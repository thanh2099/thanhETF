import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarketTicker } from './components/MarketTicker';
import { SearchModal } from './components/SearchModal';
import { HomeView } from './views/HomeView';
import { DetailView } from './views/DetailView';
import { CompareView } from './views/CompareView';
import { DirectoryView } from './views/DirectoryView';
import { RatePortfolioView } from './views/RatePortfolioView';
import { SimulationView } from './views/SimulationView';
import { ReverseLookupView } from './views/ReverseLookupView';
import { DividendHubView } from './views/DividendHubView';
import { ExposureBuilderView } from './views/ExposureBuilderView';
import { MajorIndicesView } from './views/MajorIndicesView';
import { ArticlesView } from './views/ArticlesView';
import { NewEtfsView } from './views/NewEtfsView';
import { TaxOptimizationView } from './views/TaxOptimizationView';
import { CoverageMatrixView } from './views/CoverageMatrixView';
import { resolveOrGenerateETF } from './data/etfData';
import { ArrowUp, ShieldCheck, Terminal, Layers, ExternalLink, BookOpen } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('XEQT.TO');
  const [compareSymbols, setCompareSymbols] = useState<string[]>([]);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [historyStack, setHistoryStack] = useState<string[]>(['home']);

  // Synchronize dark mode class with root html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens quick search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [selectedSection, setSelectedSection] = useState<string>('performance');

  // Hash-based URL deep-linking support (e.g. #etf/HYLD.TO, #compare)
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('etf/')) {
        const raw = decodeURIComponent(hash.slice(4));
        const parts = raw.split('/');
        const sym = parts[0];
        const sec = parts[1];
        if (sym) {
          setSelectedSymbol(sym.toUpperCase());
          if (sec) {
            setSelectedSection(sec);
          }
          setCurrentTab('detail');
        }
      } else if (hash.startsWith('compare')) {
        setCurrentTab('compare');
      }
    };
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const handleNavigate = async (tab: string, symbol?: string) => {
    if (symbol) {
      try {
        const etf = await resolveOrGenerateETF(symbol);
        setSelectedSymbol(etf.symbol);
      } catch {
        setSelectedSymbol(symbol);
      }
    }
    setHistoryStack((prev) => [...prev, tab]);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectETF = async (symbol: string) => {
    try {
      const etf = await resolveOrGenerateETF(symbol);
      setSelectedSymbol(etf.symbol);
    } catch {
      setSelectedSymbol(symbol);
    }
    setHistoryStack((prev) => [...prev, 'detail']);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompareSelected = (symbols: string[]) => {
    if (symbols.length > 0) {
      setCompareSymbols(symbols);
    }
    setCurrentTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      const prevTab = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentTab(prevTab);
    } else {
      setCurrentTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--fg-1)] flex flex-col font-sans transition-colors selection:bg-[var(--primary)] selection:text-[var(--bg-0)]">
      {/* 43-Sector Continuous Marquee Bar */}
      <MarketTicker />

      {/* Sticky 2-Tier Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => handleNavigate(tab)}
        onOpenSearch={() => setSearchModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView onNavigate={handleNavigate} />
        )}

        {currentTab === 'detail' && (
          <DetailView
            symbol={selectedSymbol}
            initialSection={selectedSection as any}
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        )}

        {currentTab === 'directory' && (
          <DirectoryView
            onSelectETF={handleSelectETF}
            onCompareSelected={handleCompareSelected}
          />
        )}

        {currentTab === 'compare' && (
          <CompareView
            onSelectETF={handleSelectETF}
            initialSymbols={compareSymbols}
          />
        )}

        {currentTab === 'rate' && (
          <RatePortfolioView />
        )}

        {currentTab === 'simulation' && (
          <SimulationView />
        )}

        {currentTab === 'reverse' && (
          <ReverseLookupView
            onSelectETF={handleSelectETF}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'yield' && (
          <DividendHubView
            onSelectETF={handleSelectETF}
            onNavigate={handleNavigate}
            initialSubTab="yield"
          />
        )}

        {currentTab === 'covered_calls' && (
          <DividendHubView
            onSelectETF={handleSelectETF}
            onNavigate={handleNavigate}
            initialSubTab="covered_calls"
          />
        )}

        {currentTab === 'exposure' && (
          <ExposureBuilderView
            onSelectETF={handleSelectETF}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'indices' && (
          <MajorIndicesView
            onSelectETF={handleSelectETF}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'articles' && (
          <ArticlesView
            onSelectETF={handleSelectETF}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'new_etfs' && (
          <NewEtfsView
            onSelectETF={handleSelectETF}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'tax_opt' && (
          <TaxOptimizationView onNavigate={handleNavigate} />
        )}

        {currentTab === 'coverage' && (
          <CoverageMatrixView
            onSelectETF={handleSelectETF}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Command Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectETF={(sym) => {
          setSearchModalOpen(false);
          handleSelectETF(sym);
        }}
        onNavigate={(tab) => {
          setSearchModalOpen(false);
          handleNavigate(tab);
        }}
      />

      {/* System Status Footer Bar */}
      <footer className="bg-[var(--bg-1)] border-t-2 border-[var(--border)] pt-12 pb-8 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 space-y-10">
          {/* Main Footer Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Col */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl tracking-tight">
                  <span className="text-[var(--fg-1)]">Thanh</span>
                  <span className="text-[var(--primary)]">ETF</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] text-[var(--primary)] font-mono">
                  v2.4 TERMINAL
                </span>
              </div>
              <p className="text-[var(--fg-muted)] leading-relaxed">
                The institutional look-through analytics terminal for Canadian-listed ETFs. Dissolving fund-of-funds, measuring real overlap, and auditing true after-tax CRA character.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[var(--fg-faint)]">
                <Terminal className="w-4 h-4 text-[var(--primary)]" />
                <span>Engine status: Operational (14ms latency)</span>
              </div>
            </div>

            {/* Quick Directory */}
            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-[var(--fg-1)]">
                ETF Categories
              </span>
              <ul className="space-y-2 text-[var(--fg-muted)]">
                <li>
                  <button onClick={() => handleNavigate('directory')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    All Canadian ETFs (Directory)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('yield')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    High Dividend Canadian Stocks
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('covered_calls')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Covered Call & Option Overlay
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('yield')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    High Interest Savings (Cash)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('directory')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Canadian Fixed Income & Bonds
                  </button>
                </li>
              </ul>
            </div>

            {/* Analytical Engines */}
            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-[var(--fg-1)]">
                Analytical Toolkit
              </span>
              <ul className="space-y-2 text-[var(--fg-muted)]">
                <li>
                  <button onClick={() => handleNavigate('reverse')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Reverse Stock Lookup Engine
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('compare')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Weighted Overlap Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('exposure')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Exposure Builder & Solver
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('rate')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Rate My Portfolio (Audit)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('simulation')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Backtest Studio (DCA & Crisis)
                  </button>
                </li>
              </ul>
            </div>

            {/* Research & Compliance */}
            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-[var(--fg-1)]">
                Research & Coverage
              </span>
              <ul className="space-y-2 text-[var(--fg-muted)]">
                <li>
                  <button onClick={() => handleNavigate('tax_opt')} className="hover:text-[var(--primary)] transition-colors cursor-pointer text-[var(--primary)] font-bold">
                    Tax Location & Norbert's Gambit
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('coverage')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Look-Through Coverage Matrix
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('new_etfs')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    New Canadian ETF Listings
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('articles')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Market Research Articles
                  </button>
                </li>
                <li>
                  <button onClick={() => setSearchModalOpen(true)} className="hover:text-[var(--primary)] transition-colors cursor-pointer flex items-center gap-1.5">
                    Search Terminal <kbd className="px-1 bg-[var(--bg-2)] border border-[var(--border)] text-[10px]">Cmd+K</kbd>
                  </button>
                </li>
                <li>
                  <a href="https://decodeetf.com" target="_blank" rel="noreferrer" className="hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1">
                    Inspired by DecodeETF <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Regulatory & CRA T3 Disclaimer */}
          <div className="pt-8 border-t border-[var(--border-faint)] text-[11px] text-[var(--fg-faint)] space-y-2 leading-relaxed">
            <p>
              <strong>Regulatory Notice & Disclaimer:</strong> ThanhETF is an independent analytical software platform for Canadian self-directed investors. 
              The information presented across all modules is compiled directly from public regulatory filings (Vanguard Investments Canada, RBC Global Asset Management / iShares, 
              BMO Global Asset Management, Global X Investments Canada, CI Global Asset Management) and market feeds. This platform does not provide investment, financial, 
              legal, accounting, or tax advice. Past returns, distributions, and simulated portfolios do not guarantee future performance.
            </p>
            <p>
              <strong>Taxation (CRA T3):</strong> Distribution classifications (Eligible Dividends, Capital Gains, Return of Capital, Foreign Income) are reported based on historical CDS T3 factors. 
              Actual annual tax slips may vary. Canadian cash ETFs (e.g. CASH.TO) are not insured by the Canada Deposit Insurance Corporation (CDIC).
            </p>
          </div>

          {/* Bottom Copyright & Back-to-Top Bar */}
          <div className="pt-4 border-t border-[var(--border-faint)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--fg-muted)]">
            <div>
              &copy; 2026 ThanhETF Analytics Inc. All rights reserved. Built with precision for Canadian DIY investors.
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
