import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Explore behavioral intelligence fundamentals.',
    features: [
      'Basic behavioral scoring',
      'Portfolio risk overview',
      '5 impulse alerts / month',
      'Community access',
    ],
    isPremium: false,
  },
  {
    name: 'Premium',
    price: '₹1',
    period: 'launch offer',
    description: 'Full behavioral AI intelligence suite.',
    features: [
      'Advanced behavioral analytics',
      'Impulse AI Lab access',
      'Wealth Stability Engine',
      'Risk Governance dashboard',
      'Priority support',
      'Unlimited alerts',
    ],
    isPremium: true,
  },
];

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="label-sm mb-4 text-primary">Pricing</p>
          <h2 className="heading-lg">
            Start with <span className="text-gradient-primary">intelligence</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2 + 0.3, duration: 0.7 }}
              className={`relative rounded-2xl p-8 md:p-10 transition-all duration-500 ${
                plan.isPremium
                  ? 'glass-panel-elevated glow-border animate-border-glow'
                  : 'glass-panel hover:border-border/80'
              }`}
            >
              {plan.isPremium && (
                <div className="absolute -top-3 left-8">
                  <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium tracking-wider uppercase">
                    Launch Offer
                  </span>
                </div>
              )}

              <p className="label-sm mb-2">{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl md:text-5xl font-extralight text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">/ {plan.period}</span>
              </div>
              <p className="body-lg text-sm mb-8">{plan.description}</p>

              <ul className="space-y-3 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-secondary-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--emerald))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 ${
                  plan.isPremium
                    ? 'bg-primary text-primary-foreground hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]'
                    : 'border border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                {plan.isPremium ? 'Activate Premium' : 'Get Started Free'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
