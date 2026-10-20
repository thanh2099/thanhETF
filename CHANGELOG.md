# CHANGELOG — ThanhETF (DecodeETF Terminal Clone)

All notable changes, architectural implementations, and reverse-engineered features across the **ThanhETF** platform are documented in this file.

---

## [v2.4.0] — 2026-10-20
### Added
- **Dedicated "ALL HOLDINGS & LOOK-THROUGH WEIGHTS" Section (`ETFAllHoldingsSection.tsx`)**:
  - Full constituent transparency displaying every underlying asset (60+ S&P 500 stocks for `XUS.TO`, 45+ global look-through stocks for `XEQT.TO`, 10 Canadian financial leaders for `HMAX.TO`, and 25 look-through stocks across 9 covered call sleeves with 1.25x leverage for `HYLD.TO`).
  - **Zero Paywalls**: Completely free access without paywalls, email capture gates, or blurred constituent rows.
  - **4-Card KPI Strip**:
    - Total Holdings count with filtered position counter.
    - Top 10 Concentration percentage.
    - Max Single Position weight and constituent company name.
    - Dynamic Filtered Weight percentage with live dollar value calculation.
  - **Dynamic Portfolio Capital Dollar Simulator**:
    - Quick-select buttons for **$5,000**, **$10,000**, **$25,000**, **$50,000**, and **$100,000**.
    - Live recalculation of exact dollar exposure per stock (e.g., at $10,000 in `HMAX.TO`, Royal Bank = $2,460.00; in `XUS.TO`, Nvidia = $850.00, Apple = $730.00).
  - **Real-Time Search & Sector Filtering**:
    - Instant multi-field search across ticker, company name, sector, and country.
    - Dynamic sector dropdown displaying exact constituent count per sector.
    - Multi-column sort: Weight (High → Low, Low → High), Name (A → Z), and Ticker (A → Z).
  - **Dual View Presentation**:
    - Institutional Table View with ticker badge, company name, sector pill, country code/name, look-through sleeve reference (`via ...`), cyan mini proportion bar, and bold weight percentage.
    - Horizontal Proportion Bar View illustrating relative portfolio sizing with direct dollar allocation badges.
  - **One-Click Data Export**:
    - Instant RFC-4180 compliant CSV export (`[SYMBOL]_all_holdings.csv`).
    - Formatted JSON clipboard copy for quantitative workflows.
  - **Navigation Integration**:
    - Registered as Section `04 All holdings & weights` in `DetailView.tsx` sidebar.
    - Deep-linking support via URL hash `#etf/:symbol/all_holdings`.
    - Added high-visibility direct CTA jump button below Top 10 table in Section `03 Holdings summary`.

### Integrated
- **Reverse Engineer Anything (REA) Integration**:
  - Configured official REA MCP server (`rea-agents@6.7.0` from `github.com/morluto/rea`) for Antigravity with verified Node.js `v24.11.0` compatibility.
  - Installed and aligned the `reverse-engineer-anything` skill (207 tools mapped).
  - Deployed REA's `capture_browser_scenario` engine via local Chrome DevTools Protocol (CDP) to inspect `decodeetf.com`.
  - Mapped 156 internal routes, 43 continuous sector pulse tickers, and client bundle chunk graphs.
  - Updated real-time Canadian ETF listings pricing for `AAPP.TO` ($20.49), `AMZP.TO` ($19.98), `GOOP.TO` ($19.42), `NVDP.TO` ($18.59), `TSLP.TO` ($18.91), `SPCP.TO` ($17.59), and `XBAI.TO` ($35.09).

### Created
- **Master Replication Prompt (`promptUsed.html`)**:
  - Standalone, fully responsive, zero-horizontal-scroll HTML specification containing the complete prompt and implementation blueprint for duplicating this application across any LLM model.
  - Built-in Dark / Light theme toggle with `localStorage` persistence.
  - One-click "Copy Prompt to Clipboard" button with visual feedback.
- **Beginner Step-by-Step Deployment Guide (`HowTODeploy.html`)**:
  - Interactive, beginner-friendly deployment guide with visual diagram walkthroughs and directional arrows.
  - Covers Option 1: 60-Second Netlify Drop (zero-code drag-and-drop of compiled `dist/` folder) and Option 2: GitHub + Vercel (professional automated continuous deployment).
  - Built-in Dark / Light theme switcher with persistent local storage.
  - Verified zero horizontal scrolling (`scrollWidth === clientWidth`) across all screen widths.
  - Embedded self-contained base64 graphics, command copy buttons, and preconfigured SPA routing files (`_redirects`, `vercel.json`, `netlify.toml`, `api/quote.ts`).


---

## [v2.3.0] — 2026-10-19
### Added
- **Historical Inception Returns & Backtest Monthly Data**:
  - Populated `etfHistoricalMonthly.json` with historical monthly price series since inception for `HMAX.TO` (Feb 2023 to Oct 2026), `HYLD.TO`, `XUS.TO`, `XEQT.TO`, `VFV.TO`, and `ZEB.TO`.
  - Fixed 1Y, 3Y, 5Y, and Inception return calculations against official TSX and provider benchmarks.

---

## [v2.2.0] — 2026-10-19
### Changed
- **Removed Pricing Sections & Tier Paywalls**:
  - Fully eliminated subscription/pricing tiers.
  - Unlocked 100% of all look-through data, 2025 CRA T3 tax slip characters, secondary sector breakdowns, and portfolio rating tools for free public access.

---

## [v2.1.0] — 2026-10-18
### Added
- **Custom ETF vs ETF Multi-Fund Comparison Engine (`CompareView.tsx`)**:
  - Flexible multi-fund selector allowing comparison of up to 4 arbitrary Canadian or US-listed ETFs.
  - Mathematical weighted overlap engine: $\text{Overlap}(A, B) = \sum \min(w_A, w_B)$.
  - Dumbbell exposure charts, two-sided constituent overlap bars, and fee drag analyzers.

---

## [v2.0.0] — 2026-10-17
### Added
- **Universal Look-Through Dissolution Engine (`etfData.ts`)**:
  - Automatic fund-of-funds dissolution (`XTOT`, `XIC`, `XEF`, `XEC` -> underlying equities).
  - Dynamic on-demand ETF decoder (`resolveOrGenerateETF`) with TSX fallback heuristics.
  - CRA T3 tax slip decomposition (Eligible dividends, Return of Capital, Foreign income, Phantom distributions).
  - Swiss Brutalist terminal design system with Space Grotesk and Geist typography.
