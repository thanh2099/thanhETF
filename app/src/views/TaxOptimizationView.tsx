import React, { useState } from 'react';
import { ShieldCheck, DollarSign, ArrowRightLeft, Calculator, FileText, AlertTriangle, CheckCircle2, ChevronRight, Info, HelpCircle } from 'lucide-react';

interface TaxOptimizationViewProps {
  onNavigate?: (tab: string, symbol?: string) => void;
}

export const TaxOptimizationView: React.FC<TaxOptimizationViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'norbert' | 'fwt' | 'location' | 't3_acb'>('norbert');

  // Norbert's Gambit State
  const [conversionCadAmount, setConversionCadAmount] = useState<number>(10000);
  const [brokerFxSpread, setBrokerFxSpread] = useState<number>(1.95); // % typical 1.5 - 2.5%
  const [exchangeRate, setExchangeRate] = useState<number>(1.365); // 1 USD = 1.365 CAD
  const [selectedBroker, setSelectedBroker] = useState<string>('questrade');

  // FWT Drag State
  const [portfolioUsValue, setPortfolioUsValue] = useState<number>(100000);
  const [usDividendYield, setUsDividendYield] = useState<number>(1.40); // 1.4% typical S&P 500

  // Norbert's Gambit calculations
  const bankSpreadCost = (conversionCadAmount * (brokerFxSpread / 100));
  const norbertTradingCost = 14.95; // 2 trades + bid/ask spread
  const netSavings = Math.max(0, bankSpreadCost - norbertTradingCost);
  const usdReceivedBank = (conversionCadAmount - bankSpreadCost) / exchangeRate;
  const usdReceivedNorbert = (conversionCadAmount - norbertTradingCost) / exchangeRate;
  const usdDiff = Math.max(0, usdReceivedNorbert - usdReceivedBank);

  // FWT calculations
  const annualDividendCad = (portfolioUsValue * (usDividendYield / 100));
  const annualFwtDragCad = annualDividendCad * 0.15;
  const compoundedLoss10Y = annualFwtDragCad * ((Math.pow(1 + 0.08, 10) - 1) / 0.08);
  const compoundedLoss25Y = annualFwtDragCad * ((Math.pow(1 + 0.08, 25) - 1) / 0.08);

  const brokerGuides: Record<string, { name: string; cost: string; journalTime: string; steps: string[] }> = {
    questrade: {
      name: 'Questrade',
      cost: 'Free Buy + $4.95 Sell (~$5 total)',
      journalTime: '1 - 2 Business Days',
      steps: [
        'Place a limit buy order for DLR.TO on the TSX using Canadian Dollars in your CAD account.',
        'Wait 1 business day for trade settlement (T+1 rule).',
        'Open a live support chat or submit an online request: "Please journal [X] shares of DLR.TO to DLR.U.TO in my USD account."',
        'Once the shares appear as DLR.U.TO in your USD account (usually 24–48h), place a limit sell order for DLR.U.TO.',
        'You now have clean USD cash without paying the 1.99% currency exchange markup.'
      ]
    },
    wealthsimple: {
      name: 'Wealthsimple Trade',
      cost: 'Requires USD Account subscription ($10/mo or $100k+ balance)',
      journalTime: 'Instant or 1 Day',
      steps: [
        'Ensure you have USD Accounts enabled (included free for Core/Generation tiers >$100k, or $10/mo).',
        'Purchase DLR.TO in your CAD account with a limit order.',
        'Contact Wealthsimple support via in-app chat requesting to journal the shares from DLR.TO to DLR.U.TO.',
        'Once credited to your USD account, sell DLR.U.TO for USD cash.'
      ]
    },
    td: {
      name: 'TD Direct Investing',
      cost: '$9.99 Buy + $9.99 Sell (~$20 total)',
      journalTime: 'Same day via Phone / 1-2 Days WebBroker',
      steps: [
        'Ensure you have linked CAD and USD sub-accounts for your TFSA, RRSP, or Cash account.',
        'Buy DLR.TO on WebBroker in the Canadian side of the account.',
        'Option A (Instant): Call TD Direct Investing at 1-800-465-5463. Ask the agent to journal DLR.TO to the US side as DLR.U.TO and execute the sell order on the spot (phone commission fee is waived for the sell).',
        'Option B (Self-serve): Send a Secure Message through WebBroker requesting the journal transfer. Once completed, sell DLR.U.TO online.'
      ]
    },
    rbc: {
      name: 'RBC Direct Investing',
      cost: '$9.95 Buy + $9.95 Sell (~$20 total)',
      journalTime: 'Automatic online transfer',
      steps: [
        'Ensure both CAD and USD sides of your account are open.',
        'Buy DLR.TO in the CAD side during regular TSX hours.',
        'Navigate to "Transfers" -> "Transfer Securities" on RBC Direct Investing online portal.',
        'Transfer the DLR shares from the CAD account to the USD account (RBC auto-converts the ticker to DLR.U.TO without phoning in!).',
        'Immediately sell DLR.U.TO in your USD account for USD cash.'
      ]
    },
    nbdb: {
      name: 'National Bank Direct Brokerage (NBDB)',
      cost: '$0.00 Commission ($0 Buy / $0 Sell)',
      journalTime: '1 Business Day',
      steps: [
        'NBDB features $0 commissions on all Canadian and US equity/ETF trades.',
        'Buy DLR.TO in your Canadian sub-account for $0.00.',
        'Submit a secure online message: "Please journal [X] shares of DLR.TO to DLR.U.TO in my USD sub-account."',
        'After 1 day, sell DLR.U.TO in the USD sub-account for $0.00. Total friction is solely the tight $0.01 TSX bid-ask spread.'
      ]
    },
    bmo: {
      name: 'BMO InvestorLine',
      cost: '$9.95 Buy + $9.95 Sell (~$20 total)',
      journalTime: 'Same Day via Phone',
      steps: [
        'Buy DLR.TO in your CAD account.',
        'Call BMO InvestorLine (1-888-776-6886) to immediately journal DLR.TO to DLR.U.TO in your USD sub-account.',
        'Sell DLR.U.TO for USD cash.'
      ]
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-[var(--border)] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary)] uppercase tracking-wider font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>INSTITUTIONAL TOOLKIT // CANADIAN TAX ENGINE & ARBITRAGE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--fg-1)]">
          Canadian Tax Optimization & Norbert's Gambit Studio
        </h1>
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] max-w-3xl leading-relaxed">
          Eliminate hidden currency conversion markups (1.5%–2.5%), optimize asset placement across TFSA/RRSP/Non-Reg, compute 15% Foreign Withholding Tax drag, and audit CRA T3 Return of Capital and Phantom Reinvested Distributions.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[var(--border)] gap-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('norbert')}
          className={`px-4 py-2.5 font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'norbert'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--bg-1)]'
              : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Norbert's Gambit FX Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('fwt')}
          className={`px-4 py-2.5 font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'fwt'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--bg-1)]'
              : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>15% US Withholding Tax (FWT) Drag</span>
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`px-4 py-2.5 font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'location'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--bg-1)]'
              : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Asset Location Matrix (TFSA vs RRSP vs Non-Reg)</span>
        </button>
        <button
          onClick={() => setActiveTab('t3_acb')}
          className={`px-4 py-2.5 font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 't3_acb'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--bg-1)]'
              : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-1)]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>CRA T3 Slips & Phantom ACB Engine</span>
        </button>
      </div>

      {/* TAB 1: NORBERT'S GAMBIT SIMULATOR */}
      {activeTab === 'norbert' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-1 bg-[var(--bg-1)] border border-[var(--border)] p-5 space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
                <span className="font-bold text-[var(--fg-1)] uppercase">Conversion Parameters</span>
                <span className="text-[10px] text-[var(--primary)]">TSX DLR &middot; DLR.U</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--fg-muted)] flex justify-between">
                  <span>CAD Conversion Capital:</span>
                  <span className="font-bold text-[var(--fg-1)]">${conversionCadAmount.toLocaleString()} CAD</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={conversionCadAmount}
                  onChange={(e) => setConversionCadAmount(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-[10px] text-[var(--fg-faint)]">
                  <span>$1,000</span>
                  <span>$50,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--fg-muted)] flex justify-between">
                  <span>Broker Standard FX Markup:</span>
                  <span className="font-bold text-amber-400">{brokerFxSpread.toFixed(2)}%</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.05"
                  value={brokerFxSpread}
                  onChange={(e) => setBrokerFxSpread(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <span className="text-[10px] text-[var(--fg-faint)] block">
                  Big-5 Canadian banks charge 1.5% to 2.5% embedded in currency exchange quotes.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--fg-muted)] flex justify-between">
                  <span>Spot USD/CAD Exchange Rate:</span>
                  <span className="font-bold text-[var(--fg-1)]">1 USD = ${exchangeRate.toFixed(4)} CAD</span>
                </label>
                <input
                  type="number"
                  step="0.005"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full bg-[var(--bg-0)] border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--fg-1)]"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-faint)] space-y-2">
                <label className="text-[var(--fg-muted)] block font-semibold">Select Broker Platform:</label>
                <select
                  value={selectedBroker}
                  onChange={(e) => setSelectedBroker(e.target.value)}
                  className="w-full bg-[var(--bg-0)] border border-[var(--border)] px-3 py-2 text-xs text-[var(--fg-1)] font-mono"
                >
                  <option value="questrade">Questrade ($4.95 fee, 1-2 days)</option>
                  <option value="td">TD Direct Investing ($9.99 fee, phone journal)</option>
                  <option value="rbc">RBC Direct Investing ($9.95 fee, online transfer)</option>
                  <option value="nbdb">National Bank Direct Brokerage ($0.00 free)</option>
                  <option value="bmo">BMO InvestorLine ($9.95 fee)</option>
                  <option value="wealthsimple">Wealthsimple Trade (USD account tier)</option>
                </select>
              </div>
            </div>

            {/* Results Comparison Grid */}
            <div className="lg:col-span-2 space-y-6">
              {/* Savings Hero Banner */}
              <div className="bg-[var(--bg-1)] border-2 border-[var(--primary)] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-widest font-bold block">
                    NET CASH ARBITRAGE SAVINGS
                  </span>
                  <div className="font-display text-4xl sm:text-5xl font-extrabold text-[var(--primary)] mt-1">
                    +${netSavings.toFixed(2)} <span className="text-xl font-normal text-[var(--fg-muted)]">CAD</span>
                  </div>
                  <p className="text-xs text-[var(--fg-muted)] font-mono mt-1">
                    Additional USD received: <span className="text-[var(--fg-1)] font-bold">+${usdDiff.toFixed(2)} USD</span>
                  </p>
                </div>

                <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 font-mono text-xs space-y-1.5 w-full sm:w-auto">
                  <div className="text-[10px] text-[var(--fg-muted)] uppercase">Norbert's Gambit ROI</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {((netSavings / norbertTradingCost) * 100).toFixed(0)}% return on friction
                  </div>
                  <div className="text-[10px] text-[var(--fg-faint)]">
                    Takes ~5 mins of effort to save ${netSavings.toFixed(0)}
                  </div>
                </div>
              </div>

              {/* Side by side breakdown table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {/* Traditional Bank Route */}
                <div className="bg-[var(--bg-1)] border border-red-500/30 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-red-500/20 pb-2 text-red-400 font-bold">
                    <span>Broker Auto-Convert</span>
                    <span>Spread: {brokerFxSpread}%</span>
                  </div>
                  <div className="space-y-1.5 text-[var(--fg-muted)]">
                    <div className="flex justify-between">
                      <span>Initial CAD:</span>
                      <span className="text-[var(--fg-1)]">${conversionCadAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-400">
                      <span>Hidden FX Markup:</span>
                      <span>-${bankSpreadCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Broker Trading Fee:</span>
                      <span className="text-[var(--fg-1)]">$0.00</span>
                    </div>
                    <div className="border-t border-[var(--border-faint)] pt-2 flex justify-between font-bold text-[var(--fg-1)] text-sm">
                      <span>USD Received:</span>
                      <span className="text-red-400">${usdReceivedBank.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>

                {/* Norbert's Gambit Route */}
                <div className="bg-[var(--bg-1)] border border-[var(--primary)]/40 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--primary)]/20 pb-2 text-[var(--primary)] font-bold">
                    <span>Norbert's Gambit (DLR)</span>
                    <span>Flat Friction</span>
                  </div>
                  <div className="space-y-1.5 text-[var(--fg-muted)]">
                    <div className="flex justify-between">
                      <span>Initial CAD:</span>
                      <span className="text-[var(--fg-1)]">${conversionCadAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[var(--primary)]">
                      <span>FX Markup Drag:</span>
                      <span>$0.00 (0.00%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Trade Friction:</span>
                      <span className="text-[var(--fg-1)]">-${norbertTradingCost.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[var(--border-faint)] pt-2 flex justify-between font-bold text-[var(--fg-1)] text-sm">
                      <span>USD Received:</span>
                      <span className="text-[var(--primary)]">${usdReceivedNorbert.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Broker Guide Card */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-faint)] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="font-display text-base font-bold text-[var(--fg-1)]">
                  Step-by-Step Journaling Guide for {brokerGuides[selectedBroker].name}
                </h3>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-[var(--fg-muted)]">
                <span>Estimated Cost: <strong className="text-[var(--fg-1)]">{brokerGuides[selectedBroker].cost}</strong></span>
                <span>&bull;</span>
                <span>Settlement: <strong className="text-[var(--fg-1)]">{brokerGuides[selectedBroker].journalTime}</strong></span>
              </div>
            </div>

            <ol className="space-y-3 font-mono text-xs text-[var(--fg-2)]">
              {brokerGuides[selectedBroker].steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-[var(--bg-0)] p-3 border border-[var(--border-faint)]">
                  <span className="w-5 h-5 rounded bg-[var(--bg-2)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed text-[var(--fg-1)]">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* TAB 2: 15% FOREIGN WITHHOLDING TAX (FWT) DRAG */}
      {activeTab === 'fwt' && (
        <div className="space-y-8 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="bg-[var(--bg-1)] border border-[var(--border)] p-5 space-y-5">
              <div className="border-b border-[var(--border-faint)] pb-2 font-bold text-[var(--fg-1)] uppercase">
                US Equity Holding Calculator
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--fg-muted)] flex justify-between">
                  <span>US Equity Portfolio Size:</span>
                  <span className="font-bold text-[var(--fg-1)]">${portfolioUsValue.toLocaleString()} CAD</span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={portfolioUsValue}
                  onChange={(e) => setPortfolioUsValue(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--fg-muted)] flex justify-between">
                  <span>Underlying US Dividend Yield:</span>
                  <span className="font-bold text-[var(--primary)]">{usDividendYield.toFixed(2)}%</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={usDividendYield}
                  onChange={(e) => setUsDividendYield(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <span className="text-[10px] text-[var(--fg-faint)] block">
                  S&P 500 average is ~1.35%–1.50%. High dividend funds (VYM, SCHD) ~3.5%.
                </span>
              </div>

              <div className="bg-[var(--bg-0)] p-3 border border-[var(--border)] space-y-2">
                <div className="text-[10px] uppercase text-[var(--fg-muted)]">Annual Drag Summary</div>
                <div className="text-xl font-bold text-amber-400">
                  -${annualFwtDragCad.toFixed(2)} CAD / year
                </div>
                <p className="text-[10px] text-[var(--fg-muted)] leading-relaxed">
                  Lost silently to the IRS every year if held in an unoptimized vehicle or account.
                </p>
              </div>
            </div>

            {/* Compounding Loss Horizon */}
            <div className="lg:col-span-2 bg-[var(--bg-1)] border border-[var(--border)] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[var(--border-faint)] pb-3">
                <h3 className="font-display text-lg font-bold text-[var(--fg-1)]">
                  Long-Term Cost of Unrecovered Foreign Withholding Tax
                </h3>
                <span className="text-[11px] text-[var(--fg-muted)]">Assuming 8% Annual Compounding</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-1">
                  <span className="text-[10px] text-[var(--fg-muted)] uppercase block">10-Year Compounded Drain</span>
                  <span className="font-display text-3xl font-extrabold text-amber-400">
                    -${compoundedLoss10Y.toFixed(0)} CAD
                  </span>
                  <p className="text-[10px] text-[var(--fg-muted)]">
                    Direct wealth lost from $100k capital.
                  </p>
                </div>

                <div className="bg-[var(--bg-0)] border border-[var(--border)] p-4 space-y-1">
                  <span className="text-[10px] text-[var(--fg-muted)] uppercase block">25-Year Career Horizon</span>
                  <span className="font-display text-3xl font-extrabold text-red-400">
                    -${compoundedLoss25Y.toFixed(0)} CAD
                  </span>
                  <p className="text-[10px] text-[var(--fg-muted)]">
                    Over a quarter-century, FWT drag eats enough capital to buy a new vehicle.
                  </p>
                </div>
              </div>

              {/* Account by Account Rule Matrix */}
              <div className="border border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase">
                      <th className="py-2 px-3">Vehicle Structure</th>
                      <th className="py-2 px-3">RRSP / RRIF</th>
                      <th className="py-2 px-3">TFSA / FHSA</th>
                      <th className="py-2 px-3">Non-Registered (Taxable)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-faint)]">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-[var(--fg-1)]">
                        Canadian Wrapper (e.g. VFV, XUS, ZSP)
                      </td>
                      <td className="py-2 px-3 text-amber-400">15% Drag (Lost)</td>
                      <td className="py-2 px-3 text-amber-400">15% Drag (Lost)</td>
                      <td className="py-2 px-3 text-emerald-400">Claimable (Line 40500 T1)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-[var(--fg-1)]">
                        US-Listed ETF (e.g. VOO, IVV, QQQM)
                      </td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">
                        0% Drag (Treaty Art. XXI Exempt!)
                      </td>
                      <td className="py-2 px-3 text-amber-400">15% Drag (Lost)</td>
                      <td className="py-2 px-3 text-emerald-400">Claimable (Line 40500 T1)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-[var(--fg-1)]">
                        Corporate Class Swap (e.g. HXS, HXQ)
                      </td>
                      <td className="py-2 px-3 text-[var(--fg-muted)]">N/A (Unnecessary)</td>
                      <td className="py-2 px-3 text-[var(--fg-muted)]">N/A (Unnecessary)</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">
                        0% FWT & 0% T3 Annual Slip!
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSET LOCATION MATRIX */}
      {activeTab === 'location' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TFSA Card */}
            <div className="bg-[var(--bg-1)] border-2 border-emerald-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
                <span className="font-bold text-emerald-400 text-sm">TFSA & FHSA</span>
                <span className="text-[10px] text-[var(--fg-muted)]">Tax-Free Compounding</span>
              </div>
              <div className="space-y-2 text-[var(--fg-2)]">
                <p className="font-semibold text-[var(--fg-1)]">Ideal Assets to Hold:</p>
                <ul className="list-disc list-inside space-y-1 text-[var(--fg-muted)]">
                  <li><strong className="text-[var(--fg-1)]">Highest Expected Growth:</strong> High-growth equities, unhedged US tech (`TEC`, `HXQ`).</li>
                  <li><strong className="text-[var(--fg-1)]">All-in-One Global Portfolios:</strong> `XEQT`, `VEQT`, `ZEQT`.</li>
                  <li><strong className="text-[var(--fg-1)]">Canadian Dividend Payers:</strong> `VDY`, `XIC` (100% tax-free capital gain and dividend growth).</li>
                </ul>
              </div>
              <div className="bg-[var(--bg-0)] p-3 border border-[var(--border)] text-[11px] text-amber-300">
                <strong>Warning:</strong> US-listed ETFs (`VOO`, `QQQ`) in a TFSA still suffer 15% FWT because the IRS does not recognize the TFSA as a registered pension.
              </div>
            </div>

            {/* RRSP Card */}
            <div className="bg-[var(--bg-1)] border-2 border-blue-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
                <span className="font-bold text-blue-400 text-sm">RRSP & RRIF</span>
                <span className="text-[10px] text-[var(--fg-muted)]">Tax-Deferred Pension</span>
              </div>
              <div className="space-y-2 text-[var(--fg-2)]">
                <p className="font-semibold text-[var(--fg-1)]">Ideal Assets to Hold:</p>
                <ul className="list-disc list-inside space-y-1 text-[var(--fg-muted)]">
                  <li><strong className="text-[var(--fg-1)]">US-Listed Equities (via DLR):</strong> `VOO`, `ITOT`, `QQQM`, `SCHD`. Avoids 100% of US Foreign Withholding Tax!</li>
                  <li><strong className="text-[var(--fg-1)]">US REITs & High Yielders:</strong> Would normally face 30% IRS penalty or full income tax outside an RRSP.</li>
                  <li><strong className="text-[var(--fg-1)]">Global Fixed Income:</strong> Tax-inefficient bond coupons are shielded from annual taxation.</li>
                </ul>
              </div>
              <div className="bg-[var(--bg-0)] p-3 border border-[var(--border)] text-[11px] text-blue-300">
                <strong>Treaty Alpha:</strong> Article XXI of the Canada-US Tax Treaty completely waives the 15% withholding on US-domiciled funds held inside RRSPs.
              </div>
            </div>

            {/* Non-Registered Card */}
            <div className="bg-[var(--bg-1)] border-2 border-purple-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-2">
                <span className="font-bold text-purple-400 text-sm">Non-Registered (Taxable)</span>
                <span className="text-[10px] text-[var(--fg-muted)]">Tax-Efficient Selection</span>
              </div>
              <div className="space-y-2 text-[var(--fg-2)]">
                <p className="font-semibold text-[var(--fg-1)]">Ideal Assets to Hold:</p>
                <ul className="list-disc list-inside space-y-1 text-[var(--fg-muted)]">
                  <li><strong className="text-[var(--fg-1)]">Canadian Eligible Dividends:</strong> Qualify for the Dividend Tax Credit (DTC). Can yield lower tax rates than capital gains in low brackets.</li>
                  <li><strong className="text-[var(--fg-1)]">Corporate Class / Swap ETFs:</strong> `HXS`, `HXT`, `HULC` pay zero distributions, deferring 100% of tax until sale.</li>
                  <li><strong className="text-[var(--fg-1)]">Discount Bond ETFs:</strong> `ZDB` trades coupon interest for capital gains.</li>
                </ul>
              </div>
              <div className="bg-[var(--bg-0)] p-3 border border-[var(--border)] text-[11px] text-purple-300">
                <strong>ACB Mandate:</strong> Track every Return of Capital (ROC) distribution and Phantom Capital Gain to calculate Adjusted Cost Base accurately.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CRA T3 SLIP BREAKDOWN & PHANTOM DISTRIBUTIONS */}
      {activeTab === 't3_acb' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-6 space-y-6">
            <div className="border-b border-[var(--border-faint)] pb-4 space-y-1">
              <h3 className="font-display text-xl font-bold text-[var(--fg-1)]">
                CRA T3 Tax Slip Anatomy & Phantom Distribution Double-Taxation Trap
              </h3>
              <p className="text-[var(--fg-muted)]">
                How every dollar distributed by Canadian ETFs is categorized for the Canada Revenue Agency.
              </p>
            </div>

            {/* Box Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-0)] p-4 border border-[var(--border)] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[var(--primary)]">Box 49 & 50: Eligible Canadian Dividends</span>
                  <span className="text-[10px] bg-[var(--bg-2)] px-1.5 py-0.5 border border-[var(--border)]">Line 12000</span>
                </div>
                <p className="text-[var(--fg-muted)] leading-relaxed">
                  Grossed up by 38% and eligible for the Federal Dividend Tax Credit (DTC) + Provincial DTC. In Ontario, taxpayers with taxable income below ~$50,000 pay an effective tax rate of <strong>-6.8%</strong> (a net tax credit!).
                </p>
              </div>

              <div className="bg-[var(--bg-0)] p-4 border border-[var(--border)] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-400">Box 25: Foreign Non-Business Income</span>
                  <span className="text-[10px] bg-[var(--bg-2)] px-1.5 py-0.5 border border-[var(--border)]">Line 13000</span>
                </div>
                <p className="text-[var(--fg-muted)] leading-relaxed">
                  Taxed at your 100% full marginal income tax rate (up to 53.53% in Ontario). Zero tax credits apply. Accompanied by Box 34 (Foreign Tax Paid) which is claimed on CRA Form T2209.
                </p>
              </div>

              <div className="bg-[var(--bg-0)] p-4 border border-[var(--border)] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-400">Box 42: Return of Capital (ROC)</span>
                  <span className="text-[10px] bg-[var(--bg-2)] px-1.5 py-0.5 border border-[var(--border)]">ITA 53(2)(h)</span>
                </div>
                <p className="text-[var(--fg-muted)] leading-relaxed">
                  Not taxable in the current calendar year. Instead, you <strong>must subtract Box 42 from your Adjusted Cost Base (ACB)</strong>. If your ACB reaches zero, subsequent ROC is immediately taxed as a capital gain under ITA 40(3).
                </p>
              </div>

              <div className="bg-[var(--bg-0)] p-4 border border-[var(--border)] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-400">Box 21: Capital Gains Dividends</span>
                  <span className="text-[10px] bg-[var(--bg-2)] px-1.5 py-0.5 border border-[var(--border)]">Line 12700</span>
                </div>
                <p className="text-[var(--fg-muted)] leading-relaxed">
                  50% inclusion rate (or 66.7% over $250k under new rules). Only half of the distributed capital gain is added to your net taxable income.
                </p>
              </div>
            </div>

            {/* The Phantom Distribution Warning */}
            <div className="bg-[var(--bg-0)] border-2 border-red-500/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>The Phantom Reinvested Distribution Double-Taxation Trap (ITA 53(1)(b))</span>
              </div>
              <p className="text-[var(--fg-1)] leading-relaxed">
                At year-end, when an ETF manager rebalances and realizes large internal capital gains, they frequently pay out a "notional" or "phantom" reinvested distribution. The fund issues new units and immediately consolidates them back to your original share count. No cash enters your account, but you still receive a T3 slip reporting capital gains.
              </p>
              <div className="p-3 bg-[var(--bg-2)] border border-[var(--border)] space-y-1.5">
                <strong className="text-emerald-400 block">How to Protect Yourself:</strong>
                <p className="text-[var(--fg-muted)]">
                  Under <em>Income Tax Act subsection 53(1)(b)</em>, you must <strong>increase your Adjusted Cost Base (ACB)</strong> by the exact total dollar amount of the reinvested distribution. If you fail to step up your ACB, you will be taxed on that capital gain a second time when you eventually sell the ETF!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
