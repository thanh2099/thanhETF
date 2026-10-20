import React, { useState } from 'react';
import { Check, X, ShieldCheck, Zap, Sparkles, HelpCircle, ArrowRight, Layers, FileText } from 'lucide-react';

interface PricingViewProps {
  onNavigate: (tab: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const tiers = [
    {
      id: 'free',
      name: 'Free Terminal',
      priceMonthly: '$0',
      priceAnnual: '$0',
      period: 'forever',
      desc: 'Essential look-through analytics for individual DIY investors.',
      popular: false,
      features: [
        'Browse 1,200+ Canadian-listed ETFs',
        'Look-Through dissolution down to underlying equities',
        '3 simultaneous fund compares',
        '10 simulation & backtest holdings',
        '4 reverse stock lookups per day',
        'Recent 1-year performance & MER tracking',
      ],
      cta: 'Current Plan',
      buttonVariant: 'outline',
    },
    {
      id: 'research',
      name: 'Research Pro',
      priceMonthly: '$4',
      priceAnnual: '$30',
      period: billingCycle === 'annual' ? '/year' : '/month',
      desc: 'Deep analytical tools for serious Canadian fund pickers and dividend investors.',
      popular: true,
      features: [
        'Everything in Free, plus:',
        'Unlimited fund comparisons (up to 10 funds)',
        'Unlimited Reverse Stock Lookups',
        'Full 10-year CRA T3 tax character history',
        'Covered Call twin comparator & upside capture drag',
        '20 backtest portfolio holdings',
        'Historical crisis stress test presets',
        'CSV raw holdings & breakdown data export',
      ],
      cta: 'Upgrade to Research',
      buttonVariant: 'primary',
    },
    {
      id: 'portfolio',
      name: 'Portfolio Lab',
      priceMonthly: '$9',
      priceAnnual: '$60',
      period: billingCycle === 'annual' ? '/year' : '/month',
      desc: 'Complete portfolio tracking, ACB tax reporting, and multi-account rebalancing.',
      popular: false,
      features: [
        'Everything in Research Pro, plus:',
        'Track up to 5 custom portfolios',
        'Multi-account support (TFSA, RRSP, FHSA, Non-Reg)',
        'Adjusted Cost Basis (ACB) ledger with phantom distributions',
        'Brokerage paste importer & instant overlap diagnosis',
        'Look-Through consolidated home bias & single-stock risk alerts',
        'Rebalance execution assistant with tax-efficient cash allocation',
      ],
      cta: 'Upgrade to Portfolio Lab',
      buttonVariant: 'accent',
    },
  ];

  const featureMatrix = [
    { category: 'Look-Through Dissolution', free: 'Basic (Top 10)', research: 'Full (All holdings)', portfolio: 'Full (All holdings)' },
    { category: 'Compare Engine', free: '3 funds', research: '10 funds', portfolio: '10 funds' },
    { category: 'Reverse Stock Lookups', free: '4 / day', research: 'Unlimited', portfolio: 'Unlimited' },
    { category: 'CRA T3 Tax Breakdown', free: 'Latest year only', research: '10-Year History', portfolio: '10-Year History + ACB' },
    { category: 'Covered Call Metrics', free: 'Basic yield', research: 'Upside drag & twin capture', portfolio: 'Upside drag & twin capture' },
    { category: 'Backtest Studio', free: '10 holdings', research: '20 holdings', portfolio: 'Unlimited' },
    { category: 'Saved Portfolios', free: 'None', research: '1 portfolio', portfolio: '5 portfolios' },
    { category: 'Adjusted Cost Basis (ACB)', free: false, research: false, portfolio: true },
    { category: 'Brokerage Text Paste', free: false, research: false, portfolio: true },
    { category: 'CSV Export', free: false, research: true, portfolio: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-12 space-y-16">
      {/* Masthead */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-wider font-semibold">
          MEMBERSHIP // TRANSPARENT CANADIAN PRICING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--fg-1)]">
          Institutional Look-Through for Individual Investors
        </h1>
        <p className="font-mono text-sm text-[var(--fg-muted)]">
          All prices in Canadian Dollars (CAD). Cancel anytime with one click.
        </p>

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center gap-3 pt-4 font-mono text-xs">
          <span className={billingCycle === 'monthly' ? 'text-[var(--fg-1)] font-bold' : 'text-[var(--fg-muted)]'}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 bg-[var(--bg-2)] border border-[var(--border)] p-0.5 cursor-pointer flex items-center transition-colors"
          >
            <div
              className={`w-4 h-4 bg-[var(--primary)] transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
          <div className="flex items-center gap-1.5">
            <span className={billingCycle === 'annual' ? 'text-[var(--fg-1)] font-bold' : 'text-[var(--fg-muted)]'}>
              Annual
            </span>
            <span className="px-2 py-0.5 bg-[var(--primary)]/15 border border-[var(--primary)]/40 text-[var(--primary)] text-[10px] font-bold">
              Save up to 44%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {tiers.map((t) => (
          <div
            key={t.id}
            className={`p-8 bg-[var(--bg-1)] border-2 flex flex-col justify-between relative transition-all ${
              t.popular
                ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/5'
                : 'border-[var(--border)] hover:border-[var(--border-muted)]'
            }`}
          >
            {t.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[var(--primary)] text-[var(--bg-0)] font-mono text-[10px] uppercase font-bold tracking-wider">
                Most Popular for Research
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-[var(--fg-1)]">{t.name}</h3>
                <p className="font-mono text-xs text-[var(--fg-muted)] mt-2 min-h-[36px]">{t.desc}</p>
              </div>

              <div className="border-t border-b border-[var(--border-faint)] py-4 font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold text-[var(--fg-1)]">
                    {billingCycle === 'annual' ? t.priceAnnual : t.priceMonthly}
                  </span>
                  <span className="text-xs text-[var(--fg-muted)]"> CAD {t.period}</span>
                </div>
                {billingCycle === 'annual' && t.id !== 'free' && (
                  <span className="text-[11px] text-[var(--primary)] font-mono mt-1 block">
                    Billed annually (equivalent to ~{t.id === 'research' ? '$2.50' : '$5.00'}/mo)
                  </span>
                )}
              </div>

              <ul className="space-y-3 font-mono text-xs">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                    <span className="text-[var(--fg-1)]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-[var(--border-faint)]">
              <button
                onClick={() => {
                  if (t.id === 'free') {
                    onNavigate('directory');
                  } else {
                    alert(`Checkout mock: Subscribing to ${t.name} (${billingCycle} CAD).`);
                  }
                }}
                className={`w-full py-3 font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                  t.buttonVariant === 'primary'
                    ? 'bg-[var(--primary)] text-[var(--bg-0)] hover:opacity-90'
                    : t.buttonVariant === 'accent'
                    ? 'bg-[var(--accent-2)] text-[var(--bg-0)] hover:opacity-90'
                    : 'bg-[var(--bg-0)] border border-[var(--border)] text-[var(--fg-1)] hover:border-[var(--primary)]'
                }`}
              >
                {t.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Gating Comparison Matrix */}
      <div className="space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-[var(--fg-1)]">
            Detailed Feature Comparison
          </h2>
          <p className="font-mono text-xs text-[var(--fg-muted)]">
            Every capability across all 3 membership tiers.
          </p>
        </div>

        <div className="border-2 border-[var(--border)] bg-[var(--bg-0)] overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg-2)] border-b border-[var(--border)] text-[var(--fg-muted)] uppercase tracking-wider">
                <th className="py-3 px-4">Feature Capability</th>
                <th className="py-3 px-4 text-center">Free</th>
                <th className="py-3 px-4 text-center text-[var(--primary)]">Research Pro</th>
                <th className="py-3 px-4 text-center text-[var(--accent-2)]">Portfolio Lab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-faint)]">
              {featureMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--bg-1)] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[var(--fg-1)]">{row.category}</td>

                  {/* Free */}
                  <td className="py-3 px-4 text-center text-[var(--fg-muted)]">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <Check className="w-4 h-4 text-[var(--primary)] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-[var(--fg-faint)] mx-auto" />
                      )
                    ) : (
                      row.free
                    )}
                  </td>

                  {/* Research */}
                  <td className="py-3 px-4 text-center text-[var(--fg-1)] font-semibold">
                    {typeof row.research === 'boolean' ? (
                      row.research ? (
                        <Check className="w-4 h-4 text-[var(--primary)] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-[var(--fg-faint)] mx-auto" />
                      )
                    ) : (
                      row.research
                    )}
                  </td>

                  {/* Portfolio */}
                  <td className="py-3 px-4 text-center text-[var(--fg-1)] font-bold">
                    {typeof row.portfolio === 'boolean' ? (
                      row.portfolio ? (
                        <Check className="w-4 h-4 text-[var(--primary)] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-[var(--fg-faint)] mx-auto" />
                      )
                    ) : (
                      row.portfolio
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[var(--bg-1)] border-2 border-[var(--border)] p-8 space-y-6">
        <h3 className="font-display text-xl font-bold text-[var(--fg-1)]">
          Frequently Asked Questions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="space-y-2">
            <strong className="text-[var(--fg-1)] block">How is ThanhETF data sourced?</strong>
            <p className="text-[var(--fg-muted)]">
              We directly ingest daily constituent books and regulatory filings from Canadian fund sponsors (Vanguard, RBC iShares, BMO, Horizons/Global X, CI Financial) and TSX/CBOE market tape.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-[var(--fg-1)] block">What makes the Look-Through different?</strong>
            <p className="text-[var(--fg-muted)]">
              Most screeners treat an ETF holding another ETF as a single opaque line item. ThanhETF recursively decomposes fund-of-funds down to the physical shares, calculating your real single-company exposure.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-[var(--fg-1)] block">Can I deduct Research Pro as an investment expense?</strong>
            <p className="text-[var(--fg-muted)]">
              Under CRA guidelines, investment management or research fees paid for taxable (non-registered) investment accounts may be deductible against income on Line 22100. Consult your Canadian tax advisor.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-[var(--fg-1)] block">How does the 1-click cancel work?</strong>
            <p className="text-[var(--fg-muted)]">
              You can cancel your subscription anytime via Stripe customer portal with no phone calls or lock-in contracts. You will retain access until the end of your billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
