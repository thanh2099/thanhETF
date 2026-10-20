import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, X, ChevronDown, Layers, BarChart2, Cpu, BookOpen, Sparkles, Calculator, Database, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenSearch,
  isDark,
  onToggleTheme,
}) => {
  const [toolkitOpen, setToolkitOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'directory', label: 'Browse ETFs' },
    { id: 'indices', label: 'Major Indices' },
    { id: 'compare', label: 'Compare Overlap' },
    { id: 'rate', label: 'Rate My Portfolio' },
    { id: 'yield', label: 'Yield Hub' },
    { id: 'covered_calls', label: 'Covered Calls' },
    { id: 'new_etfs', label: 'New Listings' },
    { id: 'articles', label: 'Research' },
  ];

  const toolkitItems = [
    { id: 'indices', label: 'Major Index Hubs', icon: Layers, desc: 'S&P 500, TSX 60, Nasdaq 100, Bonds' },
    { id: 'tax_opt', label: 'Tax & Norbert’s Gambit', icon: Calculator, desc: 'TFSA vs RRSP, FWT drag & DLR journal' },
    { id: 'coverage', label: 'Look-Through Coverage Matrix', icon: Database, desc: '1,144+ TSX ETFs & replication audit' },
    { id: 'reverse', label: 'Reverse Stock Lookup', icon: Search, desc: 'Find ETFs that hold a stock' },
    { id: 'exposure', label: 'Exposure Builder', icon: Cpu, desc: 'Target allocation optimizer' },
    { id: 'simulation', label: 'Backtest Studio', icon: BarChart2, desc: 'DCA & portfolio backtesting' },
    { id: 'new_etfs', label: 'New Canadian Listings', icon: Sparkles, desc: 'Fresh TSX & Cboe ETF launches' },
    { id: 'articles', label: 'Market Research & News', icon: BookOpen, desc: 'In-depth Canadian ETF studies' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-0)] border-b-2 border-[var(--border)] transition-all">
      {/* Tier 1: Brand & Utilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 flex items-center justify-between py-3 border-b border-[var(--border-faint)]">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('home');
          }}
          className="flex flex-col select-none group"
        >
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-[26px] tracking-tight leading-none">
              <span className="text-[var(--fg-1)]">Thanh</span>
              <span className="text-[var(--primary)]">ETF</span>
            </span>
          </div>
          <span className="h-[2.5px] w-[54px] bg-[var(--primary)] mt-1 transition-all group-hover:w-[72px]"></span>
        </a>

        {/* Global Quick Search & System Stats */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-3 bg-[var(--bg-2)] hover:bg-[var(--bg-3)] border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-1)] transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="font-mono">Search 1,776+ Canadian ETFs (e.g. XEQT, VDY)</span>
            <kbd className="border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--fg-faint)] bg-[var(--bg-1)]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={onToggleTheme}
            className="p-2 border border-[var(--border)] hover:bg-[var(--bg-3)] text-[var(--fg-2)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onTabChange('articles')}
            className={`hidden sm:inline font-mono text-xs px-2.5 py-1 ${
              currentTab === 'articles' ? 'text-[var(--primary)] font-semibold' : 'text-[var(--fg-2)] hover:text-[var(--fg-1)]'
            }`}
          >
            Research
          </button>

          <button
            onClick={onOpenSearch}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 bg-[var(--primary)] text-[var(--bg-0)] hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search ⌘K</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border border-[var(--border)] text-[var(--fg-1)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Tier 2: Sub-Nav Bar */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <nav className="flex items-center gap-6 text-xs tracking-wide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`py-2.5 transition-colors cursor-pointer font-medium border-b-2 -mb-[2px] ${
                currentTab === item.id
                  ? 'text-[var(--fg-1)] font-semibold border-[var(--primary)]'
                  : 'text-[var(--fg-2)] hover:text-[var(--fg-1)] border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* The Toolkit Dropdown */}
          <div
            className="relative py-2.5"
            onMouseEnter={() => setToolkitOpen(true)}
            onMouseLeave={() => setToolkitOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors cursor-pointer"
            >
              <span>The Toolkit</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {toolkitOpen && (
              <div className="absolute left-0 top-full pt-1 z-50 min-w-[260px]">
                <div className="bg-[var(--bg-3)] border border-[var(--border)] shadow-2xl py-1">
                  {toolkitItems.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          onTabChange(t.id);
                          setToolkitOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[var(--bg-4)] flex items-start gap-2.5 transition-colors cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-[var(--primary)] mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-xs text-[var(--fg-1)]">{t.label}</div>
                          <div className="text-[10px] text-[var(--fg-muted)] font-mono">{t.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-1)] border-b border-[var(--border)] px-4 py-4 space-y-3">
          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 bg-[var(--bg-2)] border border-[var(--border)] px-3 py-2 text-xs font-mono text-[var(--fg-muted)]"
          >
            <Search className="w-4 h-4 text-[var(--primary)]" />
            <span>Search 1,776+ Canadian ETFs</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left p-2 border border-[var(--border)] ${
                  currentTab === item.id ? 'bg-[var(--primary-subtle)] text-[var(--primary)] font-bold' : 'text-[var(--fg-2)]'
                }`}
              >
                {item.label}
              </button>
            ))}
            {toolkitItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left p-2 border border-[var(--border)] ${
                  currentTab === item.id ? 'bg-[var(--primary-subtle)] text-[var(--primary)] font-bold' : 'text-[var(--fg-2)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
