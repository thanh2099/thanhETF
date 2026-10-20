o

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

report_path = r"C:\Users\Thanh\.gemini\antigravity\brain\77cd9115-b93b-4bea-b7b7-f82943b198cd\scout_report_etf_profile.md"

report_content = r"""# Scout Report 2: ETF Detail & Look-Through Profile Engine

**Target Source Analysis**: `etf_xeqt.html` (Fund-of-Funds Asset Allocation ETF) & `etf_vdy.html` (Direct Physical Canadian Dividend ETF)  
**Date**: October 2026  
**Status**: Comprehensive Reverse-Engineered Blueprint for Clone Implementation

---

## Executive Summary & Architecture Overview

DecodeETF's individual ETF detail profile (`/etf/[symbol]`) is a high-performance, data-dense Next.js React Server Components application that delivers institutional-grade analytics for Canadian investors. 

The profile engine bifurcates funds into two distinct architectural archetypes:
1. **Fund-of-Funds / All-in-One ETFs** (e.g. `XEQT.TO`, `VEQT.TO`, `VGRO.TO`): DecodeETF dissolves the wrapper funds (e.g., holding `XTOT.TO`, `XIC.TO`, `XEF.TO`, `ITOT`, `XEC.TO`) down to **8,184 actual underlying equity shares** (Apple, NVIDIA, Microsoft, RBC, TD, Shopify) with mathematically normalized weightings and visualizes the complete construction hierarchy.
2. **Direct / Physical Holding ETFs** (e.g. `VDY.TO`, `XIU.TO`): Directly tracks the underlying basket of stocks (e.g., 58 Canadian dividend stocks) without intermediate look-through dissolution.

Both profile types deliver:
- Real-time TSX/NEO quote badges and performance delta.
- Multi-tier quick metrics strip (Yield, Recurring Yield, Fee/MER, AUM, Frequency).
- Look-Through Construction Tree with expandable hierarchy and asset mix breakdown.
- Top holdings with underlying source attribution (`via_etf`).
- CSS OKLCH-tinted segmented allocation bars (Sector & Geography).
- Complete Canadian CRA Tax Character distribution decomposition (T3 slip categories).
- Interactive multi-horizon Total Return chart (1M to Max) with benchmark comparison.

---

## 1. Header Banner & Quick Metrics Engine

### 1.1 Header Structure & Navigation Toolbar
The ETF detail page is capped with a dual sticky navigation layer:
- **Mobile Pin Header** (`report-card-module__Hfewaq__mobilePin`):
  - Back navigation button: `← Back to Canadian ETFs. [SYMBOL]`
  - Scrollable anchor rail: `Overview`, `Performance`, `Holdings`, `Income`, `Similar ETFs`, `Fund facts`.
  - Progress indicator: `1 of 6 ›` with smooth scrolling to sections.
- **Desktop Toolbar** (`report-card-module__Hfewaq__topBar`):
  - Breadcrumb: `← Canadian ETFs` (linked to `/etfs?asset_class=...&geography=...`)
  - Identity: Ticker symbol (e.g. `XEQT.TO`, `VDY.TO`) with exchange suffix:
    - `.TO`: Toronto Stock Exchange (TSX)
    - `.NE`: Cboe Canada (formerly NEO Exchange)
  - Quick Action Buttons:
    - `Compare ↗` (links to `/compare?etfs=[SYMBOL]`)
    - `Save` (toggles watchlist storage)
    - `Backtest ↗` (links to `/tools/simulation?etfs=[SYMBOL]`)

### 1.2 Title & Headline Block
- **H1 Header**: Full legal fund name (e.g., `iShares Core Equity ETF Portfolio` or `Vanguard FTSE Canadian High Dividend Yield Index ETF`).
- **Provider / Fund Family**: Sub-badge (e.g., `RBC iShares`, `Vanguard Canada`, `BMO Global Asset Management`, `Horizons/Global X`).
- **Category Badge**: e.g., `Global / World` (Asset Class: Equity-oriented Balanced) or `Dividend & Income` (Asset Class: Canadian Equity).
- **Live Price Display**:
  - Currency-formatted close: `CA$45.46` (XEQT) or `CA$77.71` (VDY).
  - Price change: Signed dollar change and percentage:
    - Negative: `−CA$0.39 (−0.85%)` in muted/red tone.
    - Positive: `+CA$0.57 (+0.74%)` in green accent (`var(--primary)`).
  - Metadata kicker: `Last close · CAD · [YYYY-MM-DD]`.

### 1.3 Quick Metric Strip (`ReportMetricStrip`)
Positioned directly beneath the snapshot header, this responsive 4-column card grid highlights vital decision metrics:

| Metric Label | Short Label | Example (XEQT) | Example (VDY) | Data Source / Calculation |
|---|---|---|---|---|
| **3-Year Return** | `3Y return` | `+22.9%` | `+30.3%` | Annualized compound total return over 36 months |
| **Distribution Yield** | `Yield` | `1.6%` (1.58%) | `3.0%` (3.03%) | Trailing 12-Month cash payouts divided by last close |
| **Fund Size** | `Size` | `$23.4B` (`23,395,624,038`) | `$9.0B` (`8,959,021,907`) | Total Net Assets / AUM in CAD |
| **MER** | `MER` | `0.19%` | `0.22%` | Management Expense Ratio (includes mgmt fee + operating costs + taxes) |
| **Management Fee** | `Fee` | `0.17%` | `0.20%` | Base sponsor fee paid to BlackRock/Vanguard |
| **Inception Date** | `Inception` | `2019-08-07` | `2012-11-02` | Fund launch date on exchange |
| **Distribution Frequency** | `Frequency` | `Quarterly` (91-day median) | `Monthly` (30-day median) | Calculated from `payment_facts.median_gap_days` |

---

## 2. The Core "Look-Through" Fund-of-Funds Profile Engine

### 2.1 The Problem It Solves
When an investor buys an asset allocation ETF like `XEQT.TO`, BlackRock reports holdings as 5 ETF tickets:
- `XTOT.TO` (31.1%)
- `XIC.TO` (25.3%)
- `XEF.TO` (23.9%)
- `ITOT` (14.7%)
- `XEC.TO` (4.7%)

Standard financial portals stop at this level, showing a useless holdings list of other ETF tickers. **DecodeETF dissolves these fund-of-funds layers down to 8,184 actual operating company stocks**, aggregating multi-fund exposures into unified global weights.

### 2.2 Mathematical Dissolution Mechanics
Let:
- $F$ be the parent ETF (e.g. `XEQT.TO`).
- $E_i$ be each underlying ETF component held by $F$, with weight $W(E_i, F) \in [0, 1]$.
- $S_j$ be an individual stock holding (e.g. Microsoft `MSFT`), held inside one or more $E_i$ funds with weight $W(S_j, E_i)$.

The dissolved look-through weight $W_{LT}(S_j, F)$ is calculated as:
$$W_{LT}(S_j, F) = \sum_{i} \Big( W(E_i, F) \times W(S_j, E_i) \Big)$$

For example, Microsoft is held via both `XTOT.TO` and `ITOT`. The engine combines both exposures into a unified `2.3904%` weight in `XEQT.TO`.

### 2.3 Fund Construction Tree Component (`ConstructionTree`)
The Construction Section (`#construction`) visualizes fund mechanics with two distinct layouts based on `structure_type`:

#### A. Fund-of-Funds Tree View (e.g. XEQT.TO):
```
[XEQT.TO] (Badge: Holds several ETFs)
 │
 ├── [XTOT.TO] (CA, 31.2%) — Holdings listed for 31.1% of the fund
 │    └── Underlying samples: Nvidia, Apple, Microsoft, …
 │
 ├── [XIC.TO] (CA, 25.4%) — Holdings listed for 25.3% of the fund
 │    └── Underlying samples: Royal Bank of Canada, Shopify, Toronto-Dominion Bank, …
 │
 ├── [XEF.TO] (CA, 23.9%)
 │    └── International Developed stocks (Europe, Australasia, Far East)
 │
 ├── [ITOT] (US, 14.7%) — iShares Core S&P Total U.S. Stock Market ETF
 │    └── Underlying samples: Nvidia, Apple, Microsoft, …
 │
 └── [XEC.TO] (CA, 4.7%)
      └── Emerging Markets equity
```
**UI Implementation Details**:
- Connecting tree lines: Absolute-positioned vertical line (`style="position:absolute;left:8px;top:0;bottom:14px;width:1px;background:var(--border)"`) and horizontal connector branch (`width:12px;height:1px`).
- Fund ticker links: Monospace bold link `a.font-mono.font-semibold.underline` (e.g. `/etf/XTOT.TO`).
- Country pill: `span.font-mono.text-[10px].uppercase.tracking-wide` (e.g. `CA`, `US`).
- Underlying stock preview tags: Horizontal pill list with truncated names (`Nvidia`, `Apple`, `Microsoft`, `…`).

#### B. Direct Physical Holding View (e.g. VDY.TO):
```
[VDY.TO] (Badge: Direct — 58 holdings)
 └── Directly held basket: Royal Bank of Canada, Toronto-Dominion Bank, Bank of Montreal, …
```

---

## 3. Holdings Table & Detail Views

### 3.1 Data Schema for Individual Holdings
In the client props payload (`etf.top_holdings_detail`), each resolved stock holding adheres to the following interface:

```typescript
interface EtfHoldingDetail {
  ticker: string;              // e.g. "NVDA", "AAPL", "RY.TO", "SHOP.TO"
  name: string;                // Legal issuer name: "SHOPIFY SUBORDINATE VOTING CLASS A"
  display_name: string;        // Clean display name: "Shopify"
  weight_pct: number;          // Resolved weighted % (e.g. 3.4923)
  via_etf: string | null;      // Underlying vehicle: "XTOT.TO", "XIC.TO", or null for direct
}
```

### 3.2 Direct vs Underlying Indicator
- When `via_etf` is `null` (Physical holding): Displayed as a direct equity holding of the fund.
- When `via_etf` contains an ETF ticker (e.g. `"XTOT.TO"`): The UI displays an attribution tag indicating the holding was dissolved look-through from the specified constituent ETF.

### 3.3 Holdings Concentration Summary
At the top of the Holdings Section (`#holdings`), an analytical concentration widget displays:
- **Top 10 Holdings Weight**: `18.5%` for XEQT (broadly diversified across 8,189 holdings) vs `69.6%` for VDY (heavily concentrated in Canadian banks & energy).
- **Proportional Stack Bar**:
  - `Top 10 holdings`: `18.5%`
  - `Top 50 holdings`: `32.0%`
  - `Remaining 8,134 stocks`: `49.2%`
  - `Sleeve / Cash / Net`: `<0.5%`
- **Total Stock Rows**: `8,184` (stocks) + `5` (underlying funds) = `8,189` total rows.

---

## 4. Asset Class, Sector & Geographic Allocation Visualizations

### 4.1 Segmented Progress Bar (`CompositionStrip`)
Instead of standard clunky pie charts, DecodeETF uses a sleek, responsive horizontal segmented bar (`h-[17px]` with `border` and rounded frame) paired with a responsive dual-view legend.

#### Color System (OKLCH Tints):
- **Sectors Palette**: Primary theme green (`var(--primary)`: `#4ebe7d`) blended with background (`var(--bg-1)`: `#0d1910`) via OKLCH color-mix:
  1. Rank 1: `var(--primary)` (100%)
  2. Rank 2: `color-mix(in oklch, var(--primary) 80%, var(--bg-1))`
  3. Rank 3: `color-mix(in oklch, var(--primary) 62%, var(--bg-1))`
  4. Rank 4: `color-mix(in oklch, var(--primary) 46%, var(--bg-1))`
  5. Rank 5: `color-mix(in oklch, var(--primary) 32%, var(--bg-1))`
  6. All other / Unclassified: `color-mix(in oklch, var(--primary) 20%, var(--bg-1))`
  7. Gated / Research items: `var(--bg-5)` with padlock icon.
- **Geographies Palette**: Chart blue (`var(--chart-1)`: `#3b82f6` or cyan-blue) stepped similarly:
  1. United States: 46.4% (`var(--chart-1)`)
  2. Canada: 24.7% (`80% mix`)
  3. Europe: 14.8% (`62% mix`)
  4. Japan: 6.3% (`46% mix`)
  5. Emerging Markets: 5.8% (`32% mix`)
  6. Other: 1.7%

### 4.2 Responsive Legends
- **Desktop (`hidden md:block`)**: Inline text row with `8x8px` colored square glyphs separated by middle dots (`·`):
  `■ United States 46.4% · ■ Canada 24.7% · ■ Europe 14.8% · ■ Japan 6.3% · ■ Emerging Markets 5.8%`
- **Mobile (`md:hidden`)**: Clean vertical list with tabular numbers aligned to the right.

### 4.3 Look-Through Sector & Geographic Aggregation
For all-in-one ETFs, the engine aggregates country exposures across all underlying funds:
- `top_countries`: Array of 57 countries (United States 46.4%, Canada 24.7%, Japan 6.3%, UK 3.4%, Switzerland 2.3%, France 2.0%, Germany 1.9%, etc.).
- `top_sectors`: 11 GICS sectors (Technology 24.5%, Financials 20.5%, Industrials 11.5%, Consumer Discretionary 7.2%, Energy 7.1%, Healthcare 6.4%, etc.).

---

## 5. Dividend & Distribution Analysis Engine

### 5.1 Income & Payout Facts Strip
In Section `#income` ("What it pays, and what you keep"), a specialized 4-metric strip details recurring cash flows:
1. **Distribution Yield (TTM)**: Cash paid in trailing 12 months divided by share price (e.g. `1.6%` for XEQT, `3.0%` for VDY).
2. **Recurring Yield**: The portion of the yield derived purely from recurring dividend/interest income, stripping out capital gains and return of capital (e.g. `1.5%` for XEQT).
3. **Latest Cash / Unit**: Exact dollar amount distributed per unit (e.g. `$0.1020` for XEQT on ex-date `2026-09-24`, `$0.1862` for VDY).
4. **Payment Frequency**: Deduced from `payment_facts.median_gap_days`:
   - 30 days: Monthly (VDY)
   - 91 days: Quarterly (XEQT)
   - 182 days: Semi-Annual
   - 365 days: Annual

### 5.2 CRA Tax Characterization Breakdown Table
Canadian mutual fund trusts and ETFs distribute income with distinct tax treatments under the Canada Revenue Agency (CRA). DecodeETF extracts the official year-end T3 tax breakdown:

#### XEQT 2025 Tax Character Breakdown:
| Character (2025) | % of Taxable Distribution | Cash Amount / Unit | Tax Implication (Non-Registered) |
|---|---|---|---|
| **Eligible Canadian Dividends** | 22.7% | $0.2346 | Eligible for Dividend Tax Credit (grossed up 138%) |
| **Foreign Non-Business Income** | 41.7% | $0.4312 | Fully taxed at marginal rate; eligible for Foreign Tax Credit |
| **Capital Gains** | 31.2% | $0.3222 | 50% taxable inclusion rate |
| **Return of Capital (ROC)** | 4.3% | $0.0449 | Non-taxable; reduces Adjusted Cost Base (ACB) |
| **Total / Net** | 100.0% | $0.9845 | Reinvested capital gains + cash payouts |

#### VDY 2025 Tax Character Breakdown:
| Character (2025) | % of Taxable Distribution | Cash Amount / Unit | Tax Implication (Non-Registered) |
|---|---|---|---|
| **Eligible Canadian Dividends** | 74.2% | $2.1984 | Heavily favored for Canadian taxable accounts |
| **Capital Gains** | 25.8% | $0.7646 | 50% capital gains inclusion |
| **Return of Capital (ROC)** | <0.1% | $0.0015 | Minor ACB adjustment |

### 5.3 Phantom / Reinvested Distribution Warning
DecodeETF explicitly flags reinvested capital gains distributions:
> *"The CRA taxes each distribution dollar by its character. These shares are measured against the full taxable distribution, including any portion the fund reinvested as units rather than paying in cash."*

### 5.4 Dividend Growth Tracking (`GrowthChartGated`)
- **Full-History Annualized Dividend Growth**: `9.6%` (XEQT over 6 years) vs `9.3%` (VDY over 13 years).
- **3-Year Annualized Dividend Growth**: `6.8%` (XEQT) vs `6.5%` (VDY).
- Filters out non-recurring capital gains distributions to evaluate true organic dividend growth.

### 5.5 Estimated After-Tax Yield Calculator (`AfterTaxCard`)
Interactive card allowing users to select their province (e.g., Ontario, BC, Alberta, Quebec) and marginal tax bracket:
- Applies exact provincial dividend tax credits and foreign tax offsets.
- Calculates after-tax retention: After-Tax Yield = sum(Yield Component * (1 - Tax Rate)).

---

## 6. Historical Performance & Interactive Chart Engine

### 6.1 Chart Controls & Horizon Selectors
Located in Section `#performance`:
- **Horizon Toggles**:
  - `1M` (1 Month)
  - `3M` (3 Months)
  - `6M` (6 Months)
  - `1Y` (1 Year — default)
  - `2Y` (2 Years)
  - `3Y` (3 Years)
  - `5Y` (5 Years)
  - `Max` (Since Inception)
- **Calculation Mode Toggle**:
  - `Total Return` (Price appreciation + reinvested distributions) — Default.
  - `Price Return` (Price changes only).
- **Benchmark Toggle**:
  - Compares the ETF's curve against its verified category index benchmark (e.g. S&P/TSX Composite for Canadian equities, S&P 500 for US equities, MSCI World for Global).

### 6.2 Performance API Specification
DecodeETF fetches asynchronous performance time series on-demand:
- **Endpoint**: `GET /api/performance?tickers={symbol}&period={period}&in_cad=1&anchor_latest=1`
- **Query Parameters**:
  - `tickers`: Ticker symbol(s), e.g. `XEQT.TO` or `XEQT.TO,SPY`
  - `period`: Horizon string (`1m`, `3m`, `6m`, `1y`, `2y`, `3y`, `5y`, `max`)
  - `in_cad`: Currency normalization flag (`1` converts USD tickers to CAD)
  - `anchor_latest`: Anchors series to latest completed market session
- **Response Schema**:
```json
{
  "XEQT.TO": {
    "dates": ["2025-10-16", "2025-10-17"],
    "prices": [38.72, 38.85],
    "cumulative_return": 17.41,
    "volatility_pct": 11.2,
    "sharpe_ratio": 1.45,
    "info": {
      "as_of": "2026-10-16",
      "currency": "CAD"
    },
    "error": null
  }
}
```

### 6.3 Risk & Resilience Analytics (`RiskResilience`)
- **Cumulative Return**: Total percentage gain/loss over the window.
- **Annualized Return (CAGR)**: When window > 360 days: CAGR = (1 + Cumulative Return / 100)^(365.25 / Days) - 1.
- **Max Drawdown (`worstFall`)**: Maximum peak-to-trough decline over the period.
- **Volatility %**: Annualized standard deviation of daily logarithmic returns.
- **Sharpe Ratio**: Risk-adjusted excess return over risk-free rate (Bank of Canada overnight rate).

---

## 7. Complete TypeScript Data Contract for Cloning

Below is the definitive TypeScript interface contract required to power the complete ETF Detail profile engine:

```typescript
export interface EtfProfileData {
  symbol: string;                       // e.g. "XEQT.TO"
  name: string;                         // e.g. "iShares Core Equity ETF Portfolio"
  fund_family: string;                  // e.g. "RBC iShares"
  currency: string;                     // "CAD" | "USD"
  asset_class: "equity" | "fixed_income" | "balanced" | "crypto" | "commodity";
  category: string;                     // "broad_market" | "dividend_income" | ...
  geography: "global" | "canada" | "us" | "international" | "emerging";
  structure_type: "fund_of_funds" | "physical" | "synthetic";
  
  // Pricing & Quote
  price: number;                        // Last close price (e.g. 45.46)
  quote: {
    close: number;
    change: number;                     // e.g. -0.39
    changePct: number;                  // e.g. -0.85
    asOf: string;                       // "2026-10-16"
  };
  aum: number;                          // Assets under management (e.g. 23395624038)
  inception_date: string;               // "2019-08-07"
  
  // Fees
  management_fee: number;               // 0.0017 (0.17%)
  mer: number;                          // 0.0019 (0.19%)
  fee_basis: {
    value: number;
    basis: "mer" | "management_fee";
    as_of: string | null;
  };
  
  // Look-Through Engine
  top_holdings_lookthrough: boolean;    // true for XEQT, false for VDY
  top_holdings_total_rows: number;      // 8189
  top_holdings_stock_rows: number;      // 8184
  top_holdings_total_weight_pct: number;// 99.67
  top_holdings_via_etfs: string[];      // ["ITOT", "XEC.TO", "XEF.TO", "XIC.TO", "XTOT.TO"]
  top_holdings_via_etf_weights: Record<string, number>; // {"XTOT.TO": 31.06, ...}
  top_holdings_detail: Array<{
    ticker: string;
    name: string;
    display_name: string;
    weight_pct: number;
    via_etf: string | null;
  }>;
  
  // Allocations
  top_sectors: Array<{ name: string; percent: number }>;
  top_regions: Array<{ name: string; percent: number }>;
  top_countries: Array<{ name: string; percent: number; region: string }>;
  
  // Dividends & Tax
  distribution_yield: number;           // 1.58 (%)
  payment_facts: {
    cash_per_unit: number;              // 0.102
    currency: string;                   // "CAD"
    last_ex_date: string;               // "2026-09-24"
    median_gap_days: number;            // 91 (quarterly) or 30 (monthly)
    since: string;
  };
  recent_distributions: Array<{
    ex_date: string;
    cash: number;
    distribution_type: string;
    currency: string;
  }>;
  tax_character: {
    tax_year: number;
    eligible_div_pct: number;
    foreign_income_pct: number;
    capital_gains_pct: number;
    roc_pct: number;
    reinvested_per_unit: number;
    cash_per_unit: number;
  };
  div_growth: {
    full_history_cagr: number;          // 9.6 (%)
    three_year_cagr: number;            // 6.8 (%)
    years_available: number;            // 6
  };
  
  // Historical Returns
  return_1d: number;
  return_1w: number;
  return_ytd: number;
  return_1y: number;
  return_3y: number;
}
```

---

## 8. Frontend Implementation Checklist for Clone

1. **Header & Sticky Pin Bar**:
   - [ ] Implement mobile horizontal scrollable tab rail with active section highlight.
   - [ ] Build desktop breadcrumbs, action pills (`Compare`, `Save`, `Backtest`), and TSX/NEO badges.
2. **Look-Through Dissolution Component**:
   - [ ] Implement `ConstructionTree` with CSS border connectors.
   - [ ] Render constituent ETF weight pills (`CA`/`US`) and nested sample holdings.
   - [ ] Toggle between direct physical basket and multi-tier dissolved look-through mode.
3. **Holdings Concentration & Table**:
   - [ ] Render Top 10 holdings bar with `via_etf` attribution badges.
   - [ ] Display total stock count (`8,184 stocks`) vs wrapper count (`5 funds`).
   - [ ] Add client-side search filtering by company name or ticker.
4. **Allocation Visualizations**:
   - [ ] Build `CompositionStrip` using OKLCH tinted segments.
   - [ ] Implement dual-view legend (desktop dot-separated row vs mobile vertical list).
5. **Dividend & CRA Tax Engine**:
   - [ ] Build 4-item payout metric strip with frequency calculation.
   - [ ] Render T3 Tax Character decomposition table with eligible dividend and ROC callouts.
   - [ ] Create provincial after-tax yield simulator card (`AfterTaxCard`).
6. **Interactive Total Return Chart**:
   - [ ] Connect time horizons (`1M`, `3M`, `6M`, `1Y`, `2Y`, `3Y`, `5Y`, `Max`).
   - [ ] Implement benchmark toggle mapping against verified Canadian market indices.
   - [ ] Compute Sharpe, Volatility, and Max Drawdown stats dynamically.
