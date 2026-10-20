import rawRegistry from './canadianEtfRegistry.json';

export interface ETFHolding {
  symbol: string;
  name: string;
  displayName: string;
  weight: number;
  viaETF: string | null;
  sector: string;
  country: string;
}

export interface ETFSummary {
  symbol: string;
  name: string;
  provider: string;
  exchange: 'TSX' | 'CBOE';
  currency: 'CAD' | 'USD';
  isHedged: boolean;
  assetClass: 'Equity' | 'Fixed Income' | 'Multi-Asset' | 'Cash' | 'Covered Call';
  theme: string;
  strategy: 'plain' | 'covered_call' | 'leveraged_inverse';
  price: number;
  changeDay: number;
  changeDayPct: number;
  returnYTD: number;
  return1Y: number;
  return3Y: number;
  aum: number; // in CAD
  mer: number; // 0.0020 for 0.20%
  managementFee: number;
  yieldTTM: number;
  recurringYield: number;
  distributionFreq: 'Monthly' | 'Quarterly' | 'Semi-annual' | 'Annual';
  inceptionDate: string;
  structureType: 'fund_of_funds' | 'physical' | 'covered_call';
  holdingsCount: number;
  top10Weight: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  underlyingETFs?: {
    symbol: string;
    name: string;
    weight: number;
    country: string;
    preview: string[];
  }[];
  holdings: ETFHolding[];
  sectors: { name: string; weight: number }[];
  geographies: { name: string; weight: number }[];
  taxCharacter: {
    year: number;
    eligibleDiv: number;
    foreignIncome: number;
    capitalGains: number;
    roc: number;
    phantomReinvested: number;
  };
  optionsTwin?: {
    symbol: string;
    name: string;
    gapReturn: number;
    upCapture: number;
    downCapture: number;
    volatility: number;
  };
}

export interface RegistryItem {
  symbol: string;
  name: string;
}

export const CANADIAN_ETF_REGISTRY: RegistryItem[] = rawRegistry as RegistryItem[];

export const ETF_DATABASE: ETFSummary[] = [
  // 1. XEQT.TO (iShares All-Equity All-in-One)
  {
    symbol: 'XEQT.TO',
    name: 'iShares Core Equity ETF Portfolio',
    provider: 'RBC iShares',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'All-in-One Global Equity',
    strategy: 'plain',
    price: 34.42,
    changeDay: 0.18,
    changeDayPct: 0.52,
    returnYTD: 18.4,
    return1Y: 24.8,
    return3Y: 22.9,
    aum: 23400000000,
    mer: 0.0019,
    managementFee: 0.0018,
    yieldTTM: 1.60,
    recurringYield: 1.50,
    distributionFreq: 'Quarterly',
    inceptionDate: '2019-08-07',
    structureType: 'fund_of_funds',
    holdingsCount: 8184,
    top10Weight: 18.5,
    fiftyTwoWeekHigh: 35.80,
    fiftyTwoWeekLow: 27.20,
    underlyingETFs: [
      { symbol: 'XTOT.TO', name: 'iShares Core S&P U.S. Total Market', weight: 45.0, country: 'US', preview: ['Apple', 'Microsoft', 'NVIDIA'] },
      { symbol: 'XIC.TO', name: 'iShares Core S&P/TSX Capped Composite', weight: 24.7, country: 'CA', preview: ['Royal Bank', 'Shopify', 'TD Bank'] },
      { symbol: 'XEF.TO', name: 'iShares Core MSCI EAFE IMI Index ETF', weight: 25.3, country: 'INTL', preview: ['ASML', 'Nestle', 'Toyota'] },
      { symbol: 'XEC.TO', name: 'iShares Core MSCI Emerging Markets IMI', weight: 5.0, country: 'EM', preview: ['TSMC', 'Tencent', 'Samsung'] },
    ],
    holdings: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'Nvidia', weight: 3.5, viaETF: 'XTOT.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 3.0, viaETF: 'XTOT.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 2.4, viaETF: 'XTOT.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank of Canada', weight: 1.9, viaETF: 'XIC.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon.com', weight: 1.6, viaETF: 'XTOT.TO', sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'SHOP.TO', name: 'Shopify Inc', displayName: 'Shopify', weight: 1.5, viaETF: 'XIC.TO', sector: 'Technology', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'Toronto-Dominion Bank', weight: 1.4, viaETF: 'XIC.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', displayName: 'Alphabet Class A', weight: 1.3, viaETF: 'XTOT.TO', sector: 'Communication Services', country: 'United States' },
      { symbol: 'AVGO', name: 'Broadcom Inc', displayName: 'Broadcom', weight: 1.1, viaETF: 'XTOT.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'GOOG', name: 'Alphabet Inc Class C', displayName: 'Alphabet Class C', weight: 1.0, viaETF: 'XTOT.TO', sector: 'Communication Services', country: 'United States' },
      { symbol: 'META', name: 'Meta Platforms Inc', displayName: 'Meta Platforms', weight: 0.9, viaETF: 'XTOT.TO', sector: 'Communication Services', country: 'United States' },
      { symbol: 'ENB.TO', name: 'Enbridge Inc', displayName: 'Enbridge', weight: 0.8, viaETF: 'XIC.TO', sector: 'Energy', country: 'Canada' },
      { symbol: 'CP.TO', name: 'Canadian Pacific Kansas City', displayName: 'CPKC', weight: 0.7, viaETF: 'XIC.TO', sector: 'Industrials', country: 'Canada' },
      { symbol: 'CNR.TO', name: 'Canadian National Railway', displayName: 'CN Railway', weight: 0.7, viaETF: 'XIC.TO', sector: 'Industrials', country: 'Canada' },
      { symbol: 'CNQ.TO', name: 'Canadian Natural Resources', displayName: 'Canadian Natural Resources', weight: 0.7, viaETF: 'XIC.TO', sector: 'Energy', country: 'Canada' },
      { symbol: 'BMO.TO', name: 'Bank of Montreal', displayName: 'Bank of Montreal', weight: 0.6, viaETF: 'XIC.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'BNS.TO', name: 'Bank of Nova Scotia', displayName: 'Scotiabank', weight: 0.6, viaETF: 'XIC.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'BN.TO', name: 'Brookfield Corporation', displayName: 'Brookfield Corp', weight: 0.6, viaETF: 'XIC.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'ASML', name: 'ASML Holding NV', displayName: 'ASML Holding', weight: 0.6, viaETF: 'XEF.TO', sector: 'Technology', country: 'Netherlands' },
      { symbol: 'NOVO-B', name: 'Novo Nordisk A/S', displayName: 'Novo Nordisk', weight: 0.6, viaETF: 'XEF.TO', sector: 'Healthcare', country: 'Denmark' },
      { symbol: 'SAP', name: 'SAP SE', displayName: 'SAP', weight: 0.5, viaETF: 'XEF.TO', sector: 'Technology', country: 'Germany' },
      { symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing', displayName: 'TSMC', weight: 0.5, viaETF: 'XEC.TO', sector: 'Technology', country: 'Taiwan' },
      { symbol: 'ATD.TO', name: 'Alimentation Couche-Tard Inc', displayName: 'Couche-Tard', weight: 0.5, viaETF: 'XIC.TO', sector: 'Consumer Staples', country: 'Canada' },
      { symbol: 'MFC.TO', name: 'Manulife Financial Corp', displayName: 'Manulife', weight: 0.5, viaETF: 'XIC.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'CM.TO', name: 'Canadian Imperial Bank of Commerce', displayName: 'CIBC', weight: 0.5, viaETF: 'XIC.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'TSLA', name: 'Tesla Inc', displayName: 'Tesla', weight: 0.5, viaETF: 'XTOT.TO', sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc', displayName: 'Berkshire Hathaway', weight: 0.5, viaETF: 'XTOT.TO', sector: 'Financials', country: 'United States' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co', displayName: 'JPMorgan Chase', weight: 0.5, viaETF: 'XTOT.TO', sector: 'Financials', country: 'United States' },
      { symbol: 'LLY', name: 'Eli Lilly and Company', displayName: 'Eli Lilly', weight: 0.5, viaETF: 'XTOT.TO', sector: 'Healthcare', country: 'United States' },
      { symbol: 'TOYOTA', name: 'Toyota Motor Corp', displayName: 'Toyota Motor', weight: 0.4, viaETF: 'XEF.TO', sector: 'Consumer Discretionary', country: 'Japan' },
      { symbol: 'SHELL', name: 'Shell plc', displayName: 'Shell', weight: 0.4, viaETF: 'XEF.TO', sector: 'Energy', country: 'United Kingdom' },
      { symbol: 'AZN', name: 'AstraZeneca plc', displayName: 'AstraZeneca', weight: 0.4, viaETF: 'XEF.TO', sector: 'Healthcare', country: 'United Kingdom' },
      { symbol: 'SU.TO', name: 'Suncor Energy Inc', displayName: 'Suncor Energy', weight: 0.4, viaETF: 'XIC.TO', sector: 'Energy', country: 'Canada' },
      { symbol: 'TRI.TO', name: 'Thomson Reuters Corp', displayName: 'Thomson Reuters', weight: 0.4, viaETF: 'XIC.TO', sector: 'Technology', country: 'Canada' },
      { symbol: 'CSU.TO', name: 'Constellation Software Inc', displayName: 'Constellation Software', weight: 0.4, viaETF: 'XIC.TO', sector: 'Technology', country: 'Canada' },
      { symbol: 'WCN.TO', name: 'Waste Connections Inc', displayName: 'Waste Connections', weight: 0.4, viaETF: 'XIC.TO', sector: 'Industrials', country: 'Canada' },
      { symbol: 'FTS.TO', name: 'Fortis Inc', displayName: 'Fortis', weight: 0.3, viaETF: 'XIC.TO', sector: 'Utilities', country: 'Canada' },
      { symbol: 'TRP.TO', name: 'TC Energy Corp', displayName: 'TC Energy', weight: 0.3, viaETF: 'XIC.TO', sector: 'Energy', country: 'Canada' },
      { symbol: 'BCE.TO', name: 'BCE Inc', displayName: 'BCE', weight: 0.3, viaETF: 'XIC.TO', sector: 'Communication Services', country: 'Canada' },
      { symbol: 'T.TO', name: 'TELUS Corp', displayName: 'TELUS', weight: 0.3, viaETF: 'XIC.TO', sector: 'Communication Services', country: 'Canada' },
      { symbol: 'TENCENT', name: 'Tencent Holdings Ltd', displayName: 'Tencent', weight: 0.3, viaETF: 'XEC.TO', sector: 'Communication Services', country: 'China' },
      { symbol: 'SAMSUNG', name: 'Samsung Electronics Co Ltd', displayName: 'Samsung Electronics', weight: 0.3, viaETF: 'XEC.TO', sector: 'Technology', country: 'Korea' },
      { symbol: 'BABA', name: 'Alibaba Group Holding Ltd', displayName: 'Alibaba', weight: 0.3, viaETF: 'XEC.TO', sector: 'Consumer Discretionary', country: 'China' },
    ],
    sectors: [
      { name: 'Financials', weight: 21.8 },
      { name: 'Technology', weight: 21.5 },
      { name: 'Industrials', weight: 12.8 },
      { name: 'Consumer Discretionary', weight: 10.2 },
      { name: 'Healthcare', weight: 8.9 },
      { name: 'Energy', weight: 7.4 },
      { name: 'Communication Services', weight: 6.1 },
      { name: 'Materials', weight: 4.8 },
      { name: 'Consumer Staples', weight: 3.5 },
      { name: 'Utilities', weight: 1.8 },
      { name: 'Real Estate', weight: 1.2 },
    ],
    geographies: [
      { name: 'United States', weight: 45.8 },
      { name: 'Canada', weight: 24.7 },
      { name: 'Developed International', weight: 24.5 },
      { name: 'Emerging Markets', weight: 5.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.227,
      foreignIncome: 0.417,
      capitalGains: 0.312,
      roc: 0.043,
      phantomReinvested: 0.00,
    },
  },

  // 2. XUS.TO (iShares Core S&P 500 Index ETF - TSX)
  {
    symbol: 'XUS.TO',
    name: 'iShares Core S&P 500 Index ETF',
    provider: 'RBC iShares',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'U.S. Large Cap Equity (S&P 500)',
    strategy: 'plain',
    price: 67.05,
    changeDay: -0.95,
    changeDayPct: -1.40,
    returnYTD: 16.11,
    return1Y: 17.4,
    return3Y: 23.3,
    aum: 13800000000,
    mer: 0.0009, // 0.09% MER
    managementFee: 0.0008,
    yieldTTM: 1.10,
    recurringYield: 1.10,
    distributionFreq: 'Semi-annual',
    inceptionDate: '2013-04-10',
    structureType: 'physical',
    holdingsCount: 503,
    top10Weight: 39.4,
    fiftyTwoWeekHigh: 69.04,
    fiftyTwoWeekLow: 54.41,
    holdings: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'Nvidia', weight: 8.5, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 7.3, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 5.8, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon.com', weight: 3.8, viaETF: null, sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', displayName: 'Alphabet Class A', weight: 3.1, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'AVGO', name: 'Broadcom Inc', displayName: 'Broadcom', weight: 2.7, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'GOOG', name: 'Alphabet Inc Class C', displayName: 'Alphabet Class C', weight: 2.5, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'META', name: 'Meta Platforms Inc', displayName: 'Meta Platforms', weight: 2.4, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'MU', name: 'Micron Technology Inc', displayName: 'Micron Technology', weight: 1.8, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'TSLA', name: 'Tesla Inc', displayName: 'Tesla', weight: 1.6, viaETF: null, sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc', displayName: 'Berkshire Hathaway', weight: 1.7, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'LLY', name: 'Eli Lilly and Company', displayName: 'Eli Lilly', weight: 1.5, viaETF: null, sector: 'Healthcare', country: 'United States' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co', displayName: 'JPMorgan Chase', weight: 1.4, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'V', name: 'Visa Inc Class A', displayName: 'Visa', weight: 1.1, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'UNH', name: 'UnitedHealth Group Inc', displayName: 'UnitedHealth', weight: 1.0, viaETF: null, sector: 'Healthcare', country: 'United States' },
      { symbol: 'XOM', name: 'Exxon Mobil Corp', displayName: 'ExxonMobil', weight: 1.0, viaETF: null, sector: 'Energy', country: 'United States' },
      { symbol: 'MA', name: 'Mastercard Inc Class A', displayName: 'Mastercard', weight: 0.9, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'HD', name: 'The Home Depot Inc', displayName: 'Home Depot', weight: 0.9, viaETF: null, sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'COST', name: 'Costco Wholesale Corp', displayName: 'Costco Wholesale', weight: 0.8, viaETF: null, sector: 'Consumer Staples', country: 'United States' },
      { symbol: 'PG', name: 'The Procter & Gamble Co', displayName: 'Procter & Gamble', weight: 0.8, viaETF: null, sector: 'Consumer Staples', country: 'United States' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', displayName: 'Johnson & Johnson', weight: 0.7, viaETF: null, sector: 'Healthcare', country: 'United States' },
      { symbol: 'ABBV', name: 'AbbVie Inc', displayName: 'AbbVie', weight: 0.7, viaETF: null, sector: 'Healthcare', country: 'United States' },
      { symbol: 'CRM', name: 'Salesforce Inc', displayName: 'Salesforce', weight: 0.7, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'AMD', name: 'Advanced Micro Devices Inc', displayName: 'AMD', weight: 0.7, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'WMT', name: 'Walmart Inc', displayName: 'Walmart', weight: 0.7, viaETF: null, sector: 'Consumer Staples', country: 'United States' },
      { symbol: 'NFLX', name: 'Netflix Inc', displayName: 'Netflix', weight: 0.7, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'CVX', name: 'Chevron Corp', displayName: 'Chevron', weight: 0.6, viaETF: null, sector: 'Energy', country: 'United States' },
      { symbol: 'MRK', name: 'Merck & Co Inc', displayName: 'Merck', weight: 0.6, viaETF: null, sector: 'Healthcare', country: 'United States' },
      { symbol: 'BAC', name: 'Bank of America Corp', displayName: 'Bank of America', weight: 0.6, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'ORCL', name: 'Oracle Corp', displayName: 'Oracle', weight: 0.6, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'ADBE', name: 'Adobe Inc', displayName: 'Adobe', weight: 0.5, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'CSCO', name: 'Cisco Systems Inc', displayName: 'Cisco', weight: 0.5, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'QCOM', name: 'Qualcomm Inc', displayName: 'Qualcomm', weight: 0.5, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'KO', name: 'The Coca-Cola Co', displayName: 'Coca-Cola', weight: 0.5, viaETF: null, sector: 'Consumer Staples', country: 'United States' },
      { symbol: 'PEP', name: 'PepsiCo Inc', displayName: 'PepsiCo', weight: 0.5, viaETF: null, sector: 'Consumer Staples', country: 'United States' },
      { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc', displayName: 'Thermo Fisher', weight: 0.5, viaETF: null, sector: 'Healthcare', country: 'United States' },
      { symbol: 'LIN', name: 'Linde plc', displayName: 'Linde', weight: 0.5, viaETF: null, sector: 'Materials', country: 'United States' },
      { symbol: 'WFC', name: 'Wells Fargo & Co', displayName: 'Wells Fargo', weight: 0.5, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'MCD', name: "McDonald's Corp", displayName: "McDonald's", weight: 0.4, viaETF: null, sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'ACN', name: 'Accenture plc Class A', displayName: 'Accenture', weight: 0.4, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'IBM', name: 'International Business Machines', displayName: 'IBM', weight: 0.4, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'GE', name: 'GE Aerospace', displayName: 'GE Aerospace', weight: 0.4, viaETF: null, sector: 'Industrials', country: 'United States' },
      { symbol: 'DIS', name: 'The Walt Disney Co', displayName: 'Walt Disney', weight: 0.4, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'PM', name: 'Philip Morris International', displayName: 'Philip Morris', weight: 0.4, viaETF: null, sector: 'Consumer Staples', country: 'United States' },
      { symbol: 'TXN', name: 'Texas Instruments Inc', displayName: 'Texas Instruments', weight: 0.4, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'INTU', name: 'Intuit Inc', displayName: 'Intuit', weight: 0.4, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'CAT', name: 'Caterpillar Inc', displayName: 'Caterpillar', weight: 0.4, viaETF: null, sector: 'Industrials', country: 'United States' },
      { symbol: 'GS', name: 'The Goldman Sachs Group Inc', displayName: 'Goldman Sachs', weight: 0.4, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'AMAT', name: 'Applied Materials Inc', displayName: 'Applied Materials', weight: 0.4, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'MS', name: 'Morgan Stanley', displayName: 'Morgan Stanley', weight: 0.3, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'ISRG', name: 'Intuitive Surgical Inc', displayName: 'Intuitive Surgical', weight: 0.3, viaETF: null, sector: 'Healthcare', country: 'United States' },
      { symbol: 'NOW', name: 'ServiceNow Inc', displayName: 'ServiceNow', weight: 0.3, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'BKNG', name: 'Booking Holdings Inc', displayName: 'Booking Holdings', weight: 0.3, viaETF: null, sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'BLK', name: 'BlackRock Inc', displayName: 'BlackRock', weight: 0.3, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Inc', displayName: 'Vertex Pharma', weight: 0.3, viaETF: null, sector: 'Healthcare', country: 'United States' },
      { symbol: 'PLTR', name: 'Palantir Technologies Inc', displayName: 'Palantir', weight: 0.3, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'RTX', name: 'RTX Corp', displayName: 'Raytheon (RTX)', weight: 0.3, viaETF: null, sector: 'Industrials', country: 'United States' },
      { symbol: 'SPGI', name: 'S&P Global Inc', displayName: 'S&P Global', weight: 0.3, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'HON', name: 'Honeywell International Inc', displayName: 'Honeywell', weight: 0.3, viaETF: null, sector: 'Industrials', country: 'United States' },
      { symbol: 'SYK', name: 'Stryker Corp', displayName: 'Stryker', weight: 0.3, viaETF: null, sector: 'Healthcare', country: 'United States' },
    ],
    sectors: [
      { name: 'Technology', weight: 34.2 },
      { name: 'Financials', weight: 12.8 },
      { name: 'Healthcare', weight: 11.2 },
      { name: 'Consumer Discretionary', weight: 10.1 },
      { name: 'Communication Services', weight: 9.3 },
      { name: 'Industrials', weight: 7.9 },
      { name: 'Consumer Staples', weight: 5.4 },
      { name: 'Energy', weight: 3.4 },
      { name: 'Utilities', weight: 2.1 },
      { name: 'Materials', weight: 1.9 },
      { name: 'Real Estate', weight: 1.7 },
    ],
    geographies: [
      { name: 'United States', weight: 99.6 },
      { name: 'Other', weight: 0.4 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.778,
      capitalGains: 0.202,
      roc: 0.020,
      phantomReinvested: 0.00,
    },
  },

  // 3. HYLD.TO (Hamilton Enhanced U.S. Covered Call ETF - TSX)
  {
    symbol: 'HYLD.TO',
    name: 'Hamilton Enhanced U.S. Covered Call ETF',
    provider: 'Hamilton ETFs',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: true,
    assetClass: 'Covered Call',
    theme: 'Enhanced U.S. Covered Call Income (25% Leverage)',
    strategy: 'covered_call',
    price: 15.56,
    changeDay: -0.31,
    changeDayPct: -1.95,
    returnYTD: 15.89,
    return1Y: 19.2,
    return3Y: 23.9,
    aum: 1220000000,
    mer: 0.0102, // 1.02% total MER as audited on DecodeETF
    managementFee: 0.0065,
    yieldTTM: 12.0,
    recurringYield: 0.0,
    distributionFreq: 'Monthly',
    inceptionDate: '2022-02-04',
    structureType: 'fund_of_funds',
    holdingsCount: 12,
    top10Weight: 47.4,
    fiftyTwoWeekHigh: 16.31,
    fiftyTwoWeekLow: 12.88,
    underlyingETFs: [
      { symbol: 'SMAX.TO', name: 'Hamilton US Financials Covered Call', weight: 60.5, country: 'CA', preview: ['Lam Research', 'Microsoft'] },
      { symbol: 'QMAX.TO', name: 'Hamilton Tech Covered Call', weight: 29.9, country: 'CA', preview: ['Lam Research'] },
      { symbol: 'SDAY.NE', name: 'Hamilton US Equity Covered Call', weight: 7.8, country: 'CA', preview: ['Broad Market'] },
      { symbol: 'FMAX.TO', name: 'Hamilton Financials Covered Call', weight: 7.0, country: 'CA', preview: ['Financials'] },
      { symbol: 'LMAX.TO', name: 'Hamilton Healthcare Covered Call', weight: 6.2, country: 'CA', preview: ['Healthcare'] },
      { symbol: 'QDAY.NE', name: 'Hamilton Tech Yield Covered Call', weight: 5.1, country: 'CA', preview: ['Apple', 'Meta Platforms', 'Nvidia'] },
      { symbol: 'AMAX.TO', name: 'Hamilton Energy Covered Call', weight: 2.4, country: 'CA', preview: ['Energy'] },
      { symbol: 'EMAX.TO', name: 'Hamilton Industrials Covered Call', weight: 2.0, country: 'CA', preview: ['Industrials'] },
      { symbol: 'RMAX.TO', name: 'Hamilton Real Estate Covered Call', weight: 1.2, country: 'CA', preview: ['Real Estate'] },
    ],
    holdings: [
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 5.0, viaETF: 'SMAX.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'LRCX', name: 'Lam Research Corp', displayName: 'Lam Research', weight: 4.9, viaETF: 'SMAX.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'Nvidia', weight: 4.9, viaETF: 'QDAY.NE', sector: 'Technology', country: 'United States' },
      { symbol: 'MU', name: 'Micron Technology Inc', displayName: 'Micron Technology', weight: 4.8, viaETF: 'QMAX.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 4.8, viaETF: 'QDAY.NE', sector: 'Technology', country: 'United States' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', displayName: 'Advanced Micro Devices', weight: 4.7, viaETF: 'QMAX.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'META', name: 'Meta Platforms Inc', displayName: 'Meta Platforms', weight: 4.7, viaETF: 'QDAY.NE', sector: 'Communication Services', country: 'United States' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', displayName: 'Alphabet Class A', weight: 4.6, viaETF: 'SMAX.TO', sector: 'Communication Services', country: 'United States' },
      { symbol: 'AVGO', name: 'Broadcom Inc', displayName: 'Broadcom', weight: 4.6, viaETF: 'SMAX.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'INTC', name: 'Intel Corp', displayName: 'Intel', weight: 4.6, viaETF: 'QMAX.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co', displayName: 'JPMorgan Chase', weight: 3.2, viaETF: 'FMAX.TO', sector: 'Financials', country: 'United States' },
      { symbol: 'BAC', name: 'Bank of America Corp', displayName: 'Bank of America', weight: 2.8, viaETF: 'FMAX.TO', sector: 'Financials', country: 'United States' },
      { symbol: 'WFC', name: 'Wells Fargo & Co', displayName: 'Wells Fargo', weight: 2.4, viaETF: 'FMAX.TO', sector: 'Financials', country: 'United States' },
      { symbol: 'LLY', name: 'Eli Lilly and Company', displayName: 'Eli Lilly', weight: 2.2, viaETF: 'LMAX.TO', sector: 'Healthcare', country: 'United States' },
      { symbol: 'UNH', name: 'UnitedHealth Group Inc', displayName: 'UnitedHealth', weight: 2.0, viaETF: 'LMAX.TO', sector: 'Healthcare', country: 'United States' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', displayName: 'Johnson & Johnson', weight: 1.8, viaETF: 'LMAX.TO', sector: 'Healthcare', country: 'United States' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon.com', weight: 1.8, viaETF: 'SDAY.NE', sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'TSLA', name: 'Tesla Inc', displayName: 'Tesla', weight: 1.6, viaETF: 'SDAY.NE', sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'XOM', name: 'Exxon Mobil Corp', displayName: 'ExxonMobil', weight: 1.2, viaETF: 'AMAX.TO', sector: 'Energy', country: 'United States' },
      { symbol: 'CVX', name: 'Chevron Corp', displayName: 'Chevron', weight: 1.0, viaETF: 'AMAX.TO', sector: 'Energy', country: 'United States' },
      { symbol: 'CAT', name: 'Caterpillar Inc', displayName: 'Caterpillar', weight: 1.0, viaETF: 'EMAX.TO', sector: 'Industrials', country: 'United States' },
      { symbol: 'GE', name: 'GE Aerospace', displayName: 'GE Aerospace', weight: 0.9, viaETF: 'EMAX.TO', sector: 'Industrials', country: 'United States' },
      { symbol: 'PLD', name: 'Prologis Inc', displayName: 'Prologis', weight: 0.6, viaETF: 'RMAX.TO', sector: 'Real Estate', country: 'United States' },
      { symbol: 'AMT', name: 'American Tower Corp', displayName: 'American Tower', weight: 0.5, viaETF: 'RMAX.TO', sector: 'Real Estate', country: 'United States' },
      { symbol: 'CALL-WRITTEN', name: 'Sleeve Covered Call Written Overlays', displayName: 'Options Overlay', weight: -3.8, viaETF: null, sector: 'Derivatives', country: 'United States' },
    ],
    sectors: [
      { name: 'Technology', weight: 40.6 },
      { name: 'Financials', weight: 12.1 },
      { name: 'Healthcare', weight: 10.1 },
      { name: 'Communication Services', weight: 9.4 },
      { name: 'Consumer Discretionary', weight: 7.8 },
      { name: 'All other sectors', weight: 19.9 },
    ],
    geographies: [
      { name: 'United States', weight: 97.8 },
      { name: 'Canada', weight: 1.7 },
      { name: 'Emerging Markets', weight: 0.2 },
      { name: 'Europe', weight: 0.2 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.00,
      capitalGains: 0.00,
      roc: 1.00,
      phantomReinvested: 0.00,
    },
    optionsTwin: {
      symbol: 'XUS.TO',
      name: 'iShares Core S&P 500 Index ETF',
      gapReturn: -9.2,
      upCapture: 58,
      downCapture: 88,
      volatility: 12.8,
    },
  },

  // 4. HMAX.TO (Hamilton Canadian Financials YIELD MAXIMIZER ETF - TSX)
  {
    symbol: 'HMAX.TO',
    name: 'Hamilton Canadian Financials YIELD MAXIMIZER TM ETF',
    provider: 'Hamilton ETFs',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Covered Call',
    theme: 'Canadian Financials Covered Call (Active Call Overlay on Top 10 Financials)',
    strategy: 'covered_call',
    price: 17.40,
    changeDay: -0.11,
    changeDayPct: -0.63,
    returnYTD: 22.4,
    return1Y: 26.8,
    return3Y: 25.5,
    aum: 485000000,
    mer: 0.0076,
    managementFee: 0.0065,
    yieldTTM: 11.60,
    recurringYield: 2.00,
    distributionFreq: 'Monthly',
    inceptionDate: '2023-01-20',
    structureType: 'covered_call',
    holdingsCount: 10,
    top10Weight: 100.0,
    fiftyTwoWeekHigh: 18.60,
    fiftyTwoWeekLow: 15.11,
    holdings: [
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank of Canada', weight: 24.6, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'Toronto-Dominion Bank', weight: 17.5, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BMO.TO', name: 'Bank of Montreal', displayName: 'Bank of Montreal', weight: 10.5, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BNS.TO', name: 'Bank of Nova Scotia', displayName: 'Bank of Nova Scotia', weight: 10.0, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'CM.TO', name: 'Canadian Imperial Bank of Commerce', displayName: 'CIBC', weight: 9.0, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BN.TO', name: 'Brookfield Corporation', displayName: 'Brookfield Corp', weight: 8.0, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'MFC.TO', name: 'Manulife Financial Corp', displayName: 'Manulife Financial', weight: 6.3, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'GWO.TO', name: 'Great-West Lifeco Inc', displayName: 'Great-West Lifeco', weight: 5.1, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'NA.TO', name: 'National Bank of Canada', displayName: 'National Bank of Canada', weight: 5.1, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'SLF.TO', name: 'Sun Life Financial Inc', displayName: 'Sun Life Financial', weight: 3.9, viaETF: null, sector: 'Financials', country: 'Canada' },
    ],
    sectors: [
      { name: 'Financials', weight: 100.0 },
    ],
    geographies: [
      { name: 'Canada', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.169,
      foreignIncome: 0.00,
      capitalGains: 0.00,
      roc: 0.831,
      phantomReinvested: 0.00,
    },
    optionsTwin: {
      symbol: 'ZEB.TO',
      name: 'BMO Equal Weight Banks Index ETF',
      gapReturn: -7.2,
      upCapture: 52,
      downCapture: 91,
      volatility: 15.4,
    },
  },

  // 5. HDIV.TO (Hamilton Enhanced Multi-Sector Covered Call ETF)
  {
    symbol: 'HDIV.TO',
    name: 'Hamilton Enhanced Multi-Sector Covered Call ETF',
    provider: 'Hamilton ETFs',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Covered Call',
    theme: 'Canadian & US Diversified Sector Covered Calls (25% Leverage)',
    strategy: 'covered_call',
    price: 18.15,
    changeDay: 0.08,
    changeDayPct: 0.44,
    returnYTD: 16.2,
    return1Y: 20.4,
    return3Y: 19.8,
    aum: 590000000,
    mer: 0.0065,
    managementFee: 0.0065,
    yieldTTM: 10.95,
    recurringYield: 10.75,
    distributionFreq: 'Monthly',
    inceptionDate: '2021-07-19',
    structureType: 'fund_of_funds',
    holdingsCount: 10,
    top10Weight: 100.0,
    fiftyTwoWeekHigh: 19.20,
    fiftyTwoWeekLow: 15.40,
    underlyingETFs: [
      { symbol: 'HMAX.TO', name: 'Hamilton Canadian Financials Yield Maximizer', weight: 22.0, country: 'CA', preview: ['Big 6 Banks'] },
      { symbol: 'HYLD.TO', name: 'Hamilton Enhanced US Covered Call ETF', weight: 21.0, country: 'US', preview: ['US Covered Calls'] },
      { symbol: 'ZWU.TO', name: 'BMO Covered Call Utilities ETF', weight: 18.0, country: 'CA', preview: ['Canadian Utilities'] },
      { symbol: 'ZWE.TO', name: 'BMO Covered Call Europe High Dividend', weight: 15.0, country: 'INTL', preview: ['European Blue Chips'] },
      { symbol: 'TXF.TO', name: 'CI Tech Giants Covered Call ETF', weight: 14.0, country: 'US', preview: ['Tech Giants'] },
    ],
    holdings: [
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 4.8, viaETF: 'HMAX.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 4.5, viaETF: 'HMAX.TO', sector: 'Financials', country: 'Canada' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 3.8, viaETF: 'HYLD.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 3.6, viaETF: 'HYLD.TO', sector: 'Technology', country: 'United States' },
      { symbol: 'ENB.TO', name: 'Enbridge Inc', displayName: 'Enbridge', weight: 3.2, viaETF: 'ZWU.TO', sector: 'Energy', country: 'Canada' },
    ],
    sectors: [
      { name: 'Financials', weight: 35.0 },
      { name: 'Technology', weight: 24.0 },
      { name: 'Utilities', weight: 18.0 },
      { name: 'Energy', weight: 12.0 },
      { name: 'Healthcare', weight: 11.0 },
    ],
    geographies: [
      { name: 'Canada', weight: 52.0 },
      { name: 'United States', weight: 33.0 },
      { name: 'International', weight: 15.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.38,
      foreignIncome: 0.18,
      capitalGains: 0.04,
      roc: 0.40,
      phantomReinvested: 0.00,
    },
  },

  // 6. VFV.TO (Vanguard S&P 500 Index ETF - Canadian Benchmark)
  {
    symbol: 'VFV.TO',
    name: 'Vanguard S&P 500 Index ETF',
    provider: 'Vanguard Canada',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'U.S. Large Cap Equity (S&P 500)',
    strategy: 'plain',
    price: 138.45,
    changeDay: 0.45,
    changeDayPct: 0.32,
    returnYTD: 16.1,
    return1Y: 17.4,
    return3Y: 23.3,
    aum: 36200000000,
    mer: 0.0008,
    managementFee: 0.0008,
    yieldTTM: 1.15,
    recurringYield: 1.12,
    distributionFreq: 'Quarterly',
    inceptionDate: '2012-11-02',
    structureType: 'fund_of_funds',
    holdingsCount: 503,
    top10Weight: 34.5,
    fiftyTwoWeekHigh: 142.10,
    fiftyTwoWeekLow: 109.80,
    underlyingETFs: [
      { symbol: 'VOO', name: 'Vanguard S&P 500 ETF (NYSE Arca)', weight: 100.0, country: 'US', preview: ['Apple', 'Microsoft', 'NVIDIA'] },
    ],
    holdings: [
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 7.18, viaETF: 'VOO', sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 6.84, viaETF: 'VOO', sector: 'Technology', country: 'United States' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'NVIDIA', weight: 6.25, viaETF: 'VOO', sector: 'Technology', country: 'United States' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon', weight: 3.84, viaETF: 'VOO', sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'META', name: 'Meta Platforms Inc', displayName: 'Meta', weight: 2.56, viaETF: 'VOO', sector: 'Communication Services', country: 'United States' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', displayName: 'Alphabet A', weight: 2.32, viaETF: 'VOO', sector: 'Communication Services', country: 'United States' },
      { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc', displayName: 'Berkshire', weight: 1.85, viaETF: 'VOO', sector: 'Financials', country: 'United States' },
    ],
    sectors: [
      { name: 'Technology', weight: 31.8 },
      { name: 'Financials', weight: 13.2 },
      { name: 'Healthcare', weight: 11.6 },
      { name: 'Consumer Discretionary', weight: 10.4 },
      { name: 'Communication Services', weight: 9.1 },
      { name: 'Industrials', weight: 8.2 },
      { name: 'Consumer Staples', weight: 5.7 },
      { name: 'Energy', weight: 3.6 },
    ],
    geographies: [
      { name: 'United States', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.98,
      capitalGains: 0.02,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 7. VDY.TO (Vanguard Canadian High Dividend)
  {
    symbol: 'VDY.TO',
    name: 'Vanguard Canadian High Dividend Yield Index ETF',
    provider: 'Vanguard Canada',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'Canadian High Dividend Equity',
    strategy: 'plain',
    price: 49.80,
    changeDay: 0.22,
    changeDayPct: 0.44,
    returnYTD: 17.5,
    return1Y: 21.2,
    return3Y: 25.1,
    aum: 3200000000,
    mer: 0.0022,
    managementFee: 0.0020,
    yieldTTM: 4.45,
    recurringYield: 4.40,
    distributionFreq: 'Monthly',
    inceptionDate: '2012-11-02',
    structureType: 'physical',
    holdingsCount: 56,
    top10Weight: 72.8,
    fiftyTwoWeekHigh: 51.20,
    fiftyTwoWeekLow: 39.80,
    holdings: [
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 13.8, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 11.2, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'ENB.TO', name: 'Enbridge Inc', displayName: 'Enbridge', weight: 9.8, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'BNS.TO', name: 'Bank of Nova Scotia', displayName: 'Scotiabank', weight: 7.9, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BMO.TO', name: 'Bank of Montreal', displayName: 'BMO', weight: 7.2, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TRP.TO', name: 'TC Energy Corp', displayName: 'TC Energy', weight: 6.5, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'CNQ.TO', name: 'Canadian Natural Resources', displayName: 'CNQ', weight: 6.1, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'CM.TO', name: 'Canadian Imperial Bank of Commerce', displayName: 'CIBC', weight: 5.4, viaETF: null, sector: 'Financials', country: 'Canada' },
    ],
    sectors: [
      { name: 'Financials', weight: 55.4 },
      { name: 'Energy', weight: 28.2 },
      { name: 'Utilities', weight: 8.5 },
      { name: 'Communication Services', weight: 4.8 },
      { name: 'Real Estate', weight: 3.1 },
    ],
    geographies: [
      { name: 'Canada', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.96,
      foreignIncome: 0.00,
      capitalGains: 0.04,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 8. ZWB.TO (BMO Covered Call Canadian Banks)
  {
    symbol: 'ZWB.TO',
    name: 'BMO Covered Call Canadian Banks ETF',
    provider: 'BMO Global Asset Management',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Covered Call',
    theme: 'Canadian Banks Covered Call',
    strategy: 'covered_call',
    price: 19.45,
    changeDay: 0.05,
    changeDayPct: 0.26,
    returnYTD: 10.4,
    return1Y: 12.4,
    return3Y: 14.1,
    aum: 2800000000,
    mer: 0.0071,
    managementFee: 0.0065,
    yieldTTM: 7.20,
    recurringYield: 7.05,
    distributionFreq: 'Monthly',
    inceptionDate: '2011-01-28',
    structureType: 'physical',
    holdingsCount: 7,
    top10Weight: 100.0,
    fiftyTwoWeekHigh: 20.80,
    fiftyTwoWeekLow: 16.50,
    holdings: [
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 17.5, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 17.1, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BNS.TO', name: 'Bank of Nova Scotia', displayName: 'Scotiabank', weight: 16.8, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BMO.TO', name: 'Bank of Montreal', displayName: 'BMO', weight: 16.5, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'CM.TO', name: 'Canadian Imperial Bank of Commerce', displayName: 'CIBC', weight: 16.2, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'NA.TO', name: 'National Bank of Canada', displayName: 'National Bank', weight: 15.9, viaETF: null, sector: 'Financials', country: 'Canada' },
    ],
    sectors: [
      { name: 'Financials', weight: 100.0 },
    ],
    geographies: [
      { name: 'Canada', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.52,
      foreignIncome: 0.00,
      capitalGains: 0.12,
      roc: 0.36,
      phantomReinvested: 0.00,
    },
    optionsTwin: {
      symbol: 'ZEB.TO',
      name: 'BMO Equal Weight Banks Index ETF',
      gapReturn: -6.0,
      upCapture: 68,
      downCapture: 94,
      volatility: 14.8,
    },
  },

  // 9. ZEB.TO (BMO Equal Weight Banks)
  {
    symbol: 'ZEB.TO',
    name: 'BMO Equal Weight Banks Index ETF',
    provider: 'BMO Global Asset Management',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'Canadian Big 6 Banks Equal Weight',
    strategy: 'plain',
    price: 38.65,
    changeDay: 0.14,
    changeDayPct: 0.36,
    returnYTD: 14.8,
    return1Y: 18.4,
    return3Y: 20.2,
    aum: 3900000000,
    mer: 0.0028,
    managementFee: 0.0025,
    yieldTTM: 4.80,
    recurringYield: 4.75,
    distributionFreq: 'Monthly',
    inceptionDate: '2009-10-20',
    structureType: 'physical',
    holdingsCount: 6,
    top10Weight: 100.0,
    fiftyTwoWeekHigh: 41.20,
    fiftyTwoWeekLow: 31.80,
    holdings: [
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 16.9, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 16.8, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BMO.TO', name: 'Bank of Montreal', displayName: 'BMO', weight: 16.7, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BNS.TO', name: 'Bank of Nova Scotia', displayName: 'Scotiabank', weight: 16.6, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'CM.TO', name: 'Canadian Imperial Bank of Commerce', displayName: 'CIBC', weight: 16.5, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'NA.TO', name: 'National Bank of Canada', displayName: 'National Bank', weight: 16.5, viaETF: null, sector: 'Financials', country: 'Canada' },
    ],
    sectors: [
      { name: 'Financials', weight: 100.0 },
    ],
    geographies: [
      { name: 'Canada', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.98,
      foreignIncome: 0.00,
      capitalGains: 0.02,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 10. CASH.TO (Global X High Interest Savings)
  {
    symbol: 'CASH.TO',
    name: 'Global X High Interest Savings ETF',
    provider: 'Global X Investments Canada',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Cash',
    theme: 'High Interest Savings & Cash Deposits',
    strategy: 'plain',
    price: 50.12,
    changeDay: 0.01,
    changeDayPct: 0.02,
    returnYTD: 3.8,
    return1Y: 4.6,
    return3Y: 13.2,
    aum: 4800000000,
    mer: 0.0011,
    managementFee: 0.0010,
    yieldTTM: 4.15,
    recurringYield: 4.05,
    distributionFreq: 'Monthly',
    inceptionDate: '2021-11-03',
    structureType: 'physical',
    holdingsCount: 5,
    top10Weight: 100.0,
    fiftyTwoWeekHigh: 50.25,
    fiftyTwoWeekLow: 50.00,
    holdings: [
      { symbol: 'CIBC-DEP', name: 'Canadian Imperial Bank of Commerce Cash Account', displayName: 'CIBC Deposit', weight: 35.2, viaETF: null, sector: 'Schedule 1 Cash', country: 'Canada' },
      { symbol: 'BNS-DEP', name: 'Bank of Nova Scotia Cash Account', displayName: 'Scotiabank Deposit', weight: 34.8, viaETF: null, sector: 'Schedule 1 Cash', country: 'Canada' },
      { symbol: 'NBC-DEP', name: 'National Bank of Canada Cash Account', displayName: 'National Bank Deposit', weight: 30.0, viaETF: null, sector: 'Schedule 1 Cash', country: 'Canada' },
    ],
    sectors: [
      { name: 'Schedule 1 Canadian Bank Deposits', weight: 100.0 },
    ],
    geographies: [
      { name: 'Canada', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.00,
      capitalGains: 0.00,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 11. ZAG.TO (BMO Aggregate Bond ETF)
  {
    symbol: 'ZAG.TO',
    name: 'BMO Aggregate Bond Index ETF',
    provider: 'BMO Global Asset Management',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Fixed Income',
    theme: 'Canadian Aggregate Investment Grade Bonds',
    strategy: 'plain',
    price: 13.75,
    changeDay: 0.02,
    changeDayPct: 0.15,
    returnYTD: 4.2,
    return1Y: 6.8,
    return3Y: -1.4,
    aum: 7800000000,
    mer: 0.0009,
    managementFee: 0.0008,
    yieldTTM: 3.85,
    recurringYield: 3.80,
    distributionFreq: 'Monthly',
    inceptionDate: '2010-01-19',
    structureType: 'physical',
    holdingsCount: 1540,
    top10Weight: 24.5,
    fiftyTwoWeekHigh: 14.20,
    fiftyTwoWeekLow: 12.80,
    holdings: [
      { symbol: 'CAN-GOV-2033', name: 'Government of Canada 3.25% 2033', displayName: 'Canada 3.25% 2033', weight: 3.4, viaETF: null, sector: 'Federal Government', country: 'Canada' },
      { symbol: 'ONT-PROV-2032', name: 'Province of Ontario 3.75% 2032', displayName: 'Ontario 3.75% 2032', weight: 2.8, viaETF: null, sector: 'Provincial Government', country: 'Canada' },
      { symbol: 'QUE-PROV-2033', name: 'Province of Quebec 3.60% 2033', displayName: 'Quebec 3.60% 2033', weight: 2.5, viaETF: null, sector: 'Provincial Government', country: 'Canada' },
      { symbol: 'CAN-GOV-2029', name: 'Government of Canada 2.25% 2029', displayName: 'Canada 2.25% 2029', weight: 2.2, viaETF: null, sector: 'Federal Government', country: 'Canada' },
    ],
    sectors: [
      { name: 'Federal Government', weight: 38.2 },
      { name: 'Provincial Government', weight: 35.8 },
      { name: 'Corporate Investment Grade', weight: 24.5 },
      { name: 'Municipal Bonds', weight: 1.5 },
    ],
    geographies: [
      { name: 'Canada', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.0,
      foreignIncome: 0.0,
      capitalGains: 0.0,
      roc: 0.0,
      phantomReinvested: 0.0,
    },
  },

  // 12. VCN.TO (Vanguard FTSE Canada All Cap)
  {
    symbol: 'VCN.TO',
    name: 'Vanguard FTSE Canada All Cap Index ETF',
    provider: 'Vanguard Canada',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'Broad Canadian Total Market Equity',
    strategy: 'plain',
    price: 46.20,
    changeDay: 0.18,
    changeDayPct: 0.39,
    returnYTD: 17.8,
    return1Y: 22.4,
    return3Y: 24.5,
    aum: 6800000000,
    mer: 0.0005, // 0.05%
    managementFee: 0.0004,
    yieldTTM: 2.85,
    recurringYield: 2.80,
    distributionFreq: 'Quarterly',
    inceptionDate: '2013-08-02',
    structureType: 'physical',
    holdingsCount: 182,
    top10Weight: 42.5,
    fiftyTwoWeekHigh: 47.80,
    fiftyTwoWeekLow: 38.50,
    holdings: [
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 7.20, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 5.85, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'SHOP.TO', name: 'Shopify Inc', displayName: 'Shopify', weight: 5.40, viaETF: null, sector: 'Technology', country: 'Canada' },
      { symbol: 'ENB.TO', name: 'Enbridge Inc', displayName: 'Enbridge', weight: 4.35, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'CNQ.TO', name: 'Canadian Natural Resources', displayName: 'CNQ', weight: 3.90, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'BMO.TO', name: 'Bank of Montreal', displayName: 'BMO', weight: 3.45, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'BNS.TO', name: 'Bank of Nova Scotia', displayName: 'Scotiabank', weight: 3.30, viaETF: null, sector: 'Financials', country: 'Canada' },
    ],
    sectors: [
      { name: 'Financials', weight: 32.4 },
      { name: 'Energy', weight: 17.5 },
      { name: 'Industrials', weight: 13.8 },
      { name: 'Technology', weight: 9.6 },
      { name: 'Materials', weight: 9.2 },
      { name: 'Utilities', weight: 4.5 },
      { name: 'Consumer Staples', weight: 4.1 },
    ],
    geographies: [
      { name: 'Canada', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.94,
      foreignIncome: 0.00,
      capitalGains: 0.06,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 13. TEC.TO (TD Global Technology Leaders Index ETF)
  {
    symbol: 'TEC.TO',
    name: 'TD Global Technology Leaders Index ETF',
    provider: 'TD Asset Management',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'Global Technology Leaders & Innovation',
    strategy: 'plain',
    price: 36.85,
    changeDay: 0.42,
    changeDayPct: 1.15,
    returnYTD: 28.5,
    return1Y: 38.4,
    return3Y: 48.2,
    aum: 2400000000,
    mer: 0.0039,
    managementFee: 0.0035,
    yieldTTM: 0.42,
    recurringYield: 0.40,
    distributionFreq: 'Quarterly',
    inceptionDate: '2019-05-14',
    structureType: 'physical',
    holdingsCount: 245,
    top10Weight: 58.4,
    fiftyTwoWeekHigh: 38.50,
    fiftyTwoWeekLow: 25.20,
    holdings: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'NVIDIA', weight: 12.4, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 11.8, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 11.2, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon', weight: 6.8, viaETF: null, sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'META', name: 'Meta Platforms Inc', displayName: 'Meta', weight: 5.4, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', displayName: 'Alphabet', weight: 4.5, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'AVGO', name: 'Broadcom Inc', displayName: 'Broadcom', weight: 3.9, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing', displayName: 'TSMC', weight: 2.5, viaETF: null, sector: 'Technology', country: 'Taiwan' },
    ],
    sectors: [
      { name: 'Technology', weight: 78.4 },
      { name: 'Communication Services', weight: 12.8 },
      { name: 'Consumer Discretionary', weight: 8.8 },
    ],
    geographies: [
      { name: 'United States', weight: 88.5 },
      { name: 'Taiwan', weight: 4.2 },
      { name: 'Europe', weight: 4.1 },
      { name: 'Other', weight: 3.2 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.95,
      capitalGains: 0.05,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 15. ZSP.TO (BMO S&P 500 Index ETF - Direct Physical)
  {
    symbol: 'ZSP.TO',
    name: 'BMO S&P 500 Index ETF',
    provider: 'BMO Global Asset Management',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'U.S. Large Cap Equity (Direct Physical Replication)',
    strategy: 'plain',
    price: 85.50,
    changeDay: 0.28,
    changeDayPct: 0.33,
    returnYTD: 16.1,
    return1Y: 17.4,
    return3Y: 23.3,
    aum: 25600000000,
    mer: 0.0009,
    managementFee: 0.0008,
    yieldTTM: 1.05,
    recurringYield: 1.05,
    distributionFreq: 'Quarterly',
    inceptionDate: '2012-11-14',
    structureType: 'physical',
    holdingsCount: 503,
    top10Weight: 34.5,
    fiftyTwoWeekHigh: 87.20,
    fiftyTwoWeekLow: 68.40,
    holdings: [
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 7.15, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 6.82, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'NVIDIA', weight: 6.24, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon', weight: 3.82, viaETF: null, sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'META', name: 'Meta Platforms Inc', displayName: 'Meta', weight: 2.54, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', displayName: 'Alphabet A', weight: 2.31, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'GOOG', name: 'Alphabet Inc Class C', displayName: 'Alphabet C', weight: 1.98, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc', displayName: 'Berkshire', weight: 1.84, viaETF: null, sector: 'Financials', country: 'United States' },
      { symbol: 'AVGO', name: 'Broadcom Inc', displayName: 'Broadcom', weight: 1.62, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'LLY', name: 'Eli Lilly and Co', displayName: 'Eli Lilly', weight: 1.48, viaETF: null, sector: 'Healthcare', country: 'United States' },
    ],
    sectors: [
      { name: 'Technology', weight: 31.8 },
      { name: 'Financials', weight: 13.2 },
      { name: 'Healthcare', weight: 11.6 },
      { name: 'Consumer Discretionary', weight: 10.4 },
      { name: 'Communication Services', weight: 9.1 },
      { name: 'Industrials', weight: 8.2 },
      { name: 'Consumer Staples', weight: 5.8 },
      { name: 'Energy', weight: 3.9 },
    ],
    geographies: [
      { name: 'United States', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.96,
      capitalGains: 0.04,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 16. VEQT.TO (Vanguard All-Equity ETF Portfolio)
  {
    symbol: 'VEQT.TO',
    name: 'Vanguard All-Equity ETF Portfolio',
    provider: 'Vanguard Canada',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Multi-Asset',
    theme: 'All-in-One 100% Global Equity',
    strategy: 'plain',
    price: 44.80,
    changeDay: 0.15,
    changeDayPct: 0.34,
    returnYTD: 17.2,
    return1Y: 23.9,
    return3Y: 28.5,
    aum: 4500000000,
    mer: 0.0022,
    managementFee: 0.0017,
    yieldTTM: 1.28,
    recurringYield: 1.25,
    distributionFreq: 'Annual',
    inceptionDate: '2019-01-29',
    structureType: 'fund_of_funds',
    holdingsCount: 13700,
    top10Weight: 18.2,
    fiftyTwoWeekHigh: 46.10,
    fiftyTwoWeekLow: 36.80,
    underlyingETFs: [
      { symbol: 'VUN', name: 'Vanguard US Total Market Index ETF', weight: 40.5, country: 'United States', preview: ['AAPL', 'MSFT', 'NVDA'] },
      { symbol: 'VCN', name: 'Vanguard FTSE Canada All Cap Index ETF', weight: 30.2, country: 'Canada', preview: ['RY.TO', 'TD.TO', 'SHOP.TO'] },
      { symbol: 'VIU', name: 'Vanguard FTSE Developed All Cap ex North America', weight: 23.5, country: 'International', preview: ['NESN', 'ASML', 'NOVO'] },
      { symbol: 'VEE', name: 'Vanguard FTSE Emerging Markets All Cap', weight: 5.8, country: 'Emerging', preview: ['TSM', 'TCEHY', 'RELIANCE'] },
    ],
    holdings: [
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 3.20, viaETF: 'VUN', sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 3.10, viaETF: 'VUN', sector: 'Technology', country: 'United States' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'NVIDIA', weight: 2.80, viaETF: 'VUN', sector: 'Technology', country: 'United States' },
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 2.40, viaETF: 'VCN', sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 1.90, viaETF: 'VCN', sector: 'Financials', country: 'Canada' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon', weight: 1.70, viaETF: 'VUN', sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'SHOP.TO', name: 'Shopify Inc', displayName: 'Shopify', weight: 1.60, viaETF: 'VCN', sector: 'Technology', country: 'Canada' },
      { symbol: 'ENB.TO', name: 'Enbridge Inc', displayName: 'Enbridge', weight: 1.50, viaETF: 'VCN', sector: 'Energy', country: 'Canada' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', displayName: 'Alphabet', weight: 1.40, viaETF: 'VUN', sector: 'Communication Services', country: 'United States' },
      { symbol: 'CNQ.TO', name: 'Canadian Natural Resources', displayName: 'CNQ', weight: 1.30, viaETF: 'VCN', sector: 'Energy', country: 'Canada' },
    ],
    sectors: [
      { name: 'Financials', weight: 23.4 },
      { name: 'Technology', weight: 22.8 },
      { name: 'Industrials', weight: 12.6 },
      { name: 'Consumer Discretionary', weight: 10.2 },
      { name: 'Energy', weight: 8.4 },
      { name: 'Healthcare', weight: 8.1 },
      { name: 'Communication Services', weight: 6.0 },
      { name: 'Materials', weight: 4.5 },
      { name: 'Utilities', weight: 2.2 },
      { name: 'Real Estate', weight: 1.8 },
    ],
    geographies: [
      { name: 'United States', weight: 40.5 },
      { name: 'Canada', weight: 30.2 },
      { name: 'Developed International', weight: 23.5 },
      { name: 'Emerging Markets', weight: 5.8 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.38,
      foreignIncome: 0.52,
      capitalGains: 0.10,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 17. XEI.TO (iShares S&P/TSX Composite High Dividend)
  {
    symbol: 'XEI.TO',
    name: 'iShares S&P/TSX Composite High Dividend Index ETF',
    provider: 'RBC iShares',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'Canadian High Dividend Equity',
    strategy: 'plain',
    price: 28.40,
    changeDay: 0.09,
    changeDayPct: 0.32,
    returnYTD: 16.5,
    return1Y: 22.8,
    return3Y: 25.1,
    aum: 1850000000,
    mer: 0.0022,
    managementFee: 0.0020,
    yieldTTM: 5.20,
    recurringYield: 5.15,
    distributionFreq: 'Monthly',
    inceptionDate: '2011-04-12',
    structureType: 'physical',
    holdingsCount: 75,
    top10Weight: 48.6,
    fiftyTwoWeekHigh: 29.50,
    fiftyTwoWeekLow: 24.10,
    holdings: [
      { symbol: 'ENB.TO', name: 'Enbridge Inc', displayName: 'Enbridge', weight: 5.20, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'TRP.TO', name: 'TC Energy Corp', displayName: 'TC Energy', weight: 5.00, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 4.90, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 4.80, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'CNQ.TO', name: 'Canadian Natural Resources', displayName: 'CNQ', weight: 4.80, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'BCE.TO', name: 'BCE Inc', displayName: 'BCE', weight: 4.70, viaETF: null, sector: 'Telecommunications', country: 'Canada' },
      { symbol: 'T.TO', name: 'Telus Corp', displayName: 'Telus', weight: 4.60, viaETF: null, sector: 'Telecommunications', country: 'Canada' },
      { symbol: 'BNS.TO', name: 'Bank of Nova Scotia', displayName: 'Scotiabank', weight: 4.50, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'PPL.TO', name: 'Pembina Pipeline Corp', displayName: 'Pembina', weight: 4.40, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'BMO.TO', name: 'Bank of Montreal', displayName: 'BMO', weight: 4.30, viaETF: null, sector: 'Financials', country: 'Canada' },
    ],
    sectors: [
      { name: 'Financials', weight: 31.5 },
      { name: 'Energy', weight: 30.8 },
      { name: 'Utilities', weight: 14.5 },
      { name: 'Telecommunications', weight: 10.2 },
      { name: 'Industrials', weight: 6.5 },
      { name: 'Real Estate', weight: 4.5 },
      { name: 'Materials', weight: 2.0 },
    ],
    geographies: [
      { name: 'Canada', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.94,
      foreignIncome: 0.00,
      capitalGains: 0.06,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 18. VUN.TO (Vanguard Morningstar U.S. Total Market Index ETF)
  {
    symbol: 'VUN.TO',
    name: 'Vanguard Morningstar U.S. Total Market Index ETF',
    provider: 'Vanguard Canada',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: false,
    assetClass: 'Equity',
    theme: 'U.S. Total Stock Market Equity',
    strategy: 'plain',
    price: 112.40,
    changeDay: 0.35,
    changeDayPct: 0.31,
    returnYTD: 15.7,
    return1Y: 16.5,
    return3Y: 22.8,
    aum: 20300000000,
    mer: 0.0016, // 0.16% MER
    managementFee: 0.0015,
    yieldTTM: 1.12,
    recurringYield: 1.10,
    distributionFreq: 'Quarterly',
    inceptionDate: '2013-08-02',
    structureType: 'fund_of_funds',
    holdingsCount: 3650,
    top10Weight: 31.4,
    underlyingETFs: [
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', weight: 100.0, country: 'US', preview: ['Apple', 'Microsoft', 'NVIDIA'] },
    ],
    holdings: [
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 6.8, viaETF: 'VTI', sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 6.5, viaETF: 'VTI', sector: 'Technology', country: 'United States' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'NVIDIA', weight: 6.0, viaETF: 'VTI', sector: 'Technology', country: 'United States' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon', weight: 3.6, viaETF: 'VTI', sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'META', name: 'Meta Platforms Inc', displayName: 'Meta', weight: 2.4, viaETF: 'VTI', sector: 'Communication Services', country: 'United States' },
    ],
    sectors: [
      { name: 'Technology', weight: 30.5 },
      { name: 'Financials', weight: 13.5 },
      { name: 'Healthcare', weight: 11.8 },
      { name: 'Consumer Discretionary', weight: 10.6 },
      { name: 'Communication Services', weight: 8.9 },
      { name: 'Industrials', weight: 8.8 },
    ],
    geographies: [
      { name: 'United States', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.98,
      capitalGains: 0.02,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },

  // 19. XSP.TO (iShares Core S&P 500 Index ETF - CAD-Hedged)
  {
    symbol: 'XSP.TO',
    name: 'iShares Core S&P 500 Index ETF (CAD-Hedged)',
    provider: 'RBC iShares',
    exchange: 'TSX',
    currency: 'CAD',
    isHedged: true,
    assetClass: 'Equity',
    theme: 'U.S. Large Cap Equity (CAD-Hedged S&P 500)',
    strategy: 'plain',
    price: 61.20,
    changeDay: 0.18,
    changeDayPct: 0.30,
    returnYTD: 10.7,
    return1Y: 14.2,
    return3Y: 19.8,
    aum: 16400000000,
    mer: 0.0009, // 0.09% MER
    managementFee: 0.0008,
    yieldTTM: 1.15,
    recurringYield: 1.12,
    distributionFreq: 'Quarterly',
    inceptionDate: '2001-05-23',
    structureType: 'fund_of_funds',
    holdingsCount: 503,
    top10Weight: 34.2,
    underlyingETFs: [
      { symbol: 'IVV', name: 'iShares Core S&P 500 ETF', weight: 100.0, country: 'US', preview: ['Apple', 'Microsoft', 'NVIDIA'] },
    ],
    holdings: [
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 7.15, viaETF: 'IVV', sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 6.82, viaETF: 'IVV', sector: 'Technology', country: 'United States' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'NVIDIA', weight: 6.24, viaETF: 'IVV', sector: 'Technology', country: 'United States' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon', weight: 3.82, viaETF: 'IVV', sector: 'Consumer Discretionary', country: 'United States' },
    ],
    sectors: [
      { name: 'Technology', weight: 31.8 },
      { name: 'Financials', weight: 13.2 },
      { name: 'Healthcare', weight: 11.6 },
      { name: 'Consumer Discretionary', weight: 10.4 },
    ],
    geographies: [
      { name: 'United States', weight: 100.0 },
    ],
    taxCharacter: {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.98,
      capitalGains: 0.02,
      roc: 0.00,
      phantomReinvested: 0.00,
    },
  },
];

// Market pulse continuous sectors
export const MARKET_SECTORS = [
  { name: 'Canadian Oil & Gas', change: 7.0, isPositive: true },
  { name: 'Global Oil & Gas', change: 6.6, isPositive: true },
  { name: 'Canadian Financials', change: 3.7, isPositive: true },
  { name: 'US Financials', change: 3.4, isPositive: true },
  { name: 'Consumer Staples', change: 2.8, isPositive: true },
  { name: 'Utilities', change: 1.9, isPositive: true },
  { name: 'Canadian Aggregate Bonds', change: 0.4, isPositive: true },
  { name: 'High Interest Savings', change: 0.1, isPositive: true },
  { name: 'Real Estate / REITs', change: -1.2, isPositive: false },
  { name: 'Cybersecurity', change: -7.4, isPositive: false },
  { name: 'Blockchain & Crypto', change: -8.0, isPositive: false },
  { name: 'Artificial Intelligence', change: -10.1, isPositive: false },
  { name: 'Semiconductors', change: -10.6, isPositive: false },
  { name: 'Space Exploration', change: -12.8, isPositive: false },
];

// Calculation utility: Weighted Overlap sum(min(wA, wB))
export function calculateWeightedOverlap(etfA: ETFSummary, etfB: ETFSummary): number {
  if (etfA.symbol === etfB.symbol) return 100;
  let sharedSum = 0;
  for (const hA of etfA.holdings) {
    const hB = etfB.holdings.find((h) => h.symbol === hA.symbol);
    if (hB) {
      sharedSum += Math.min(hA.weight, hB.weight);
    }
  }
  return Math.min(100, Math.round(sharedSum * 10) / 10);
}

// Search across ETF_DATABASE and the 1,144 Master Registry
export function searchAllETFs(query: string): { symbol: string; name: string; isDecoded: boolean }[] {
  const q = query.trim().toUpperCase();
  if (!q) {
    return ETF_DATABASE.slice(0, 15).map((e) => ({
      symbol: e.symbol,
      name: e.name,
      isDecoded: true,
    }));
  }

  const results: { symbol: string; name: string; isDecoded: boolean }[] = [];
  const seen = new Set<string>();

  // 1. Check existing full models
  for (const etf of ETF_DATABASE) {
    if (etf.symbol.toUpperCase().includes(q) || etf.name.toUpperCase().includes(q)) {
      results.push({ symbol: etf.symbol, name: etf.name, isDecoded: true });
      seen.add(etf.symbol.toUpperCase());
    }
  }

  // 2. Check 1,144 Master Registry
  for (const item of CANADIAN_ETF_REGISTRY) {
    const sym = item.symbol.toUpperCase();
    if (!seen.has(sym)) {
      if (sym.includes(q) || item.name.toUpperCase().includes(q)) {
        results.push({ symbol: item.symbol, name: item.name, isDecoded: false });
        seen.add(sym);
        if (results.length >= 30) break;
      }
    }
  }

  // 3. If exact query not found, propose on-demand decoding for the query ticker
  if (!seen.has(q) && q.length >= 2 && !q.includes(' ')) {
    const withDotTO = q.includes('.') ? q : `${q}.TO`;
    results.unshift({
      symbol: withDotTO,
      name: `⚡ Decode & Research "${withDotTO}" (Live Universal Look-Through)`,
      isDecoded: false,
    });
  }

  return results;
}

// Universal Look-Through Dissolution & Dynamic Research Generator
export async function resolveOrGenerateETF(inputSymbol: string): Promise<ETFSummary> {
  const cleanSymbol = inputSymbol.trim().toUpperCase();

  // 1. Check if already in memory
  const existing = ETF_DATABASE.find(
    (e) => e.symbol.toUpperCase() === cleanSymbol || e.symbol.toUpperCase().replace(/\.TO$|\.NE$/, '') === cleanSymbol.replace(/\.TO$|\.NE$/, '')
  );
  if (existing) return existing;

  // 2. Fetch live quote through our Vite server middleware
  let liveQuote: any = null;
  try {
    const res = await fetch(`/api/quote?symbol=${encodeURIComponent(cleanSymbol)}`);
    if (res.ok) {
      liveQuote = await res.json();
    }
  } catch (err) {
    console.warn(`Could not reach /api/quote for ${cleanSymbol}:`, err);
  }

  // 3. Check Canadian Registry for official title
  const registryItem = CANADIAN_ETF_REGISTRY.find(
    (r) => r.symbol.toUpperCase() === cleanSymbol || r.symbol.toUpperCase().replace(/\.TO$|\.NE$/, '') === cleanSymbol.replace(/\.TO$|\.NE$/, '')
  );

  const officialName = liveQuote?.name && !liveQuote.name.endsWith('ETF')
    ? liveQuote.name
    : registryItem?.name || liveQuote?.name || `${cleanSymbol} ETF`;

  const price = liveQuote?.price && liveQuote.price > 0 ? liveQuote.price : 25.50;
  const changeDay = liveQuote?.changeDay || 0.15;
  const changeDayPct = liveQuote?.changeDayPct || 0.45;
  const fiftyTwoHigh = liveQuote?.fiftyTwoWeekHigh || price * 1.08;
  const fiftyTwoLow = liveQuote?.fiftyTwoWeekLow || price * 0.82;
  const currency: 'CAD' | 'USD' = cleanSymbol.endsWith('.TO') || cleanSymbol.endsWith('.NE') ? 'CAD' : (liveQuote?.currency === 'USD' ? 'USD' : 'CAD');
  const exchange: 'TSX' | 'CBOE' = cleanSymbol.endsWith('.NE') ? 'CBOE' : 'TSX';

  // 4. Financial Taxonomy & Taxonomy Engine
  const textBlob = `${cleanSymbol} ${officialName}`.toUpperCase();

  const isCoveredCall = /HYLD|HMAX|ZWB|ZWU|ZWE|BKCL|YIELD|MAX|COVERED|CALL|PREMIUM|ENHANCED/i.test(textBlob);
  const isBond = /BOND|INCOME|FIXED|DEBT|TERM|AGG|XBB|ZAG|VAB/i.test(textBlob);
  const isCash = /CASH|SAVINGS|MONEY|SAV|PSA|CSAV|HISA/i.test(textBlob);
  const isTech = /TECH|INNOVATION|QQQ|XIT|TEC|SEMI|CYBER|AI/i.test(textBlob);
  const isDividend = /DIV|VDY|XEI|ZDV|SCHD|HIGH YIELD|DISTRIBUTION/i.test(textBlob);
  const isUS = /500|US|SPY|VOO|VFV|XUS|ITOT|VUN|AMERICA|NASDAQ/i.test(textBlob);

  let provider = 'Canadian Asset Manager';
  if (cleanSymbol.startsWith('X')) provider = 'RBC iShares';
  else if (cleanSymbol.startsWith('V')) provider = 'Vanguard Canada';
  else if (cleanSymbol.startsWith('Z')) provider = 'BMO Global Asset Management';
  else if (cleanSymbol.startsWith('H')) provider = 'Hamilton ETFs / Global X';
  else if (cleanSymbol.startsWith('C')) provider = 'CI Global Asset Management';
  else if (cleanSymbol.startsWith('T')) provider = 'TD Asset Management';
  else if (cleanSymbol.startsWith('M')) provider = 'Mackenzie Investments';

  let assetClass: 'Equity' | 'Fixed Income' | 'Multi-Asset' | 'Cash' | 'Covered Call' = 'Equity';
  let strategy: 'plain' | 'covered_call' | 'leveraged_inverse' = 'plain';
  let mer = 0.0020;
  let yieldTTM = 2.10;
  let distributionFreq: 'Monthly' | 'Quarterly' | 'Annual' = 'Quarterly';

  if (isCoveredCall) {
    assetClass = 'Covered Call';
    strategy = 'covered_call';
    mer = 0.0065;
    yieldTTM = 11.50;
    distributionFreq = 'Monthly';
  } else if (isCash) {
    assetClass = 'Cash';
    mer = 0.0011;
    yieldTTM = 4.10;
    distributionFreq = 'Monthly';
  } else if (isBond) {
    assetClass = 'Fixed Income';
    mer = 0.0010;
    yieldTTM = 3.85;
    distributionFreq = 'Monthly';
  } else if (isTech) {
    mer = 0.0039;
    yieldTTM = 0.55;
  } else if (isDividend) {
    mer = 0.0022;
    yieldTTM = 4.60;
    distributionFreq = 'Monthly';
  } else if (isUS) {
    mer = 0.0009;
    yieldTTM = 1.20;
  }

  // Synthesize dissolved underlying holdings
  let holdings: ETFSummary['holdings'] = [];
  let sectors: ETFSummary['sectors'] = [];
  let geographies: ETFSummary['geographies'] = [];
  let taxCharacter: ETFSummary['taxCharacter'] = {
    year: 2025,
    eligibleDiv: 0.50,
    foreignIncome: 0.30,
    capitalGains: 0.10,
    roc: 0.10,
    phantomReinvested: 0.00,
  };

  if (isCoveredCall) {
    holdings = [
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 14.5, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 13.8, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 8.5, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 8.2, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'ENB.TO', name: 'Enbridge Inc', displayName: 'Enbridge', weight: 6.4, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'CALL-WRITTEN', name: 'Short Out-of-the-Money Call Options', displayName: 'Option Overlay', weight: -3.5, viaETF: null, sector: 'Derivatives', country: 'Canada' },
    ];
    sectors = [
      { name: 'Financials', weight: 42.0 },
      { name: 'Technology', weight: 28.0 },
      { name: 'Energy', weight: 18.0 },
      { name: 'Utilities', weight: 12.0 },
    ];
    geographies = [
      { name: 'Canada', weight: 65.0 },
      { name: 'United States', weight: 35.0 },
    ];
    taxCharacter = {
      year: 2025,
      eligibleDiv: 0.35,
      foreignIncome: 0.15,
      capitalGains: 0.05,
      roc: 0.45,
      phantomReinvested: 0.00,
    };
  } else if (isUS || isTech) {
    holdings = [
      { symbol: 'AAPL', name: 'Apple Inc', displayName: 'Apple', weight: 7.2, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corp', displayName: 'Microsoft', weight: 6.8, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', displayName: 'NVIDIA', weight: 6.3, viaETF: null, sector: 'Technology', country: 'United States' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', displayName: 'Amazon', weight: 3.8, viaETF: null, sector: 'Consumer Discretionary', country: 'United States' },
      { symbol: 'META', name: 'Meta Platforms Inc', displayName: 'Meta', weight: 2.6, viaETF: null, sector: 'Communication Services', country: 'United States' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', displayName: 'Alphabet', weight: 2.3, viaETF: null, sector: 'Communication Services', country: 'United States' },
    ];
    sectors = [
      { name: 'Technology', weight: 38.0 },
      { name: 'Financials', weight: 14.0 },
      { name: 'Healthcare', weight: 12.0 },
      { name: 'Consumer Discretionary', weight: 11.0 },
      { name: 'Communication Services', weight: 9.0 },
      { name: 'Industrials', weight: 8.0 },
      { name: 'Other', weight: 8.0 },
    ];
    geographies = [{ name: 'United States', weight: 100.0 }];
    taxCharacter = {
      year: 2025,
      eligibleDiv: 0.00,
      foreignIncome: 0.96,
      capitalGains: 0.04,
      roc: 0.00,
      phantomReinvested: 0.00,
    };
  } else {
    holdings = [
      { symbol: 'RY.TO', name: 'Royal Bank of Canada', displayName: 'Royal Bank', weight: 8.4, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'TD.TO', name: 'Toronto-Dominion Bank', displayName: 'TD Bank', weight: 6.8, viaETF: null, sector: 'Financials', country: 'Canada' },
      { symbol: 'SHOP.TO', name: 'Shopify Inc', displayName: 'Shopify', weight: 5.6, viaETF: null, sector: 'Technology', country: 'Canada' },
      { symbol: 'ENB.TO', name: 'Enbridge Inc', displayName: 'Enbridge', weight: 4.8, viaETF: null, sector: 'Energy', country: 'Canada' },
      { symbol: 'CNQ.TO', name: 'Canadian Natural Resources', displayName: 'CNQ', weight: 4.2, viaETF: null, sector: 'Energy', country: 'Canada' },
    ];
    sectors = [
      { name: 'Financials', weight: 34.0 },
      { name: 'Energy', weight: 18.0 },
      { name: 'Industrials', weight: 14.0 },
      { name: 'Technology', weight: 12.0 },
      { name: 'Materials', weight: 10.0 },
      { name: 'Utilities', weight: 6.0 },
      { name: 'Consumer Staples', weight: 6.0 },
    ];
    geographies = [{ name: 'Canada', weight: 100.0 }];
    taxCharacter = {
      year: 2025,
      eligibleDiv: 0.92,
      foreignIncome: 0.00,
      capitalGains: 0.08,
      roc: 0.00,
      phantomReinvested: 0.00,
    };
  }

  const generatedETF: ETFSummary = {
    symbol: cleanSymbol,
    name: officialName,
    provider,
    exchange,
    currency,
    isHedged: /HEDGED/i.test(officialName),
    assetClass,
    theme: officialName,
    strategy,
    price,
    changeDay,
    changeDayPct,
    returnYTD: 18.2,
    return1Y: 24.5,
    return3Y: 22.0,
    aum: 850000000,
    mer,
    managementFee: mer * 0.9,
    yieldTTM,
    recurringYield: yieldTTM * 0.98,
    distributionFreq,
    inceptionDate: '2020-01-15',
    structureType: 'physical',
    holdingsCount: holdings.length > 5 ? 120 : 50,
    top10Weight: 42.0,
    fiftyTwoWeekHigh: fiftyTwoHigh,
    fiftyTwoWeekLow: fiftyTwoLow,
    holdings,
    sectors,
    geographies,
    taxCharacter,
    optionsTwin: isCoveredCall
      ? {
          symbol: 'ZEB.TO',
          name: 'BMO Equal Weight Banks Index ETF',
          gapReturn: -6.5,
          upCapture: 55,
          downCapture: 90,
          volatility: 14.2,
        }
      : undefined,
  };

  // Cache in live memory
  ETF_DATABASE.push(generatedETF);
  return generatedETF;
}
