import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// TEMPORARY: FREE FOR ALL — single card, all features free

const features = [
  'Full behavioral analytics',
  'Impulse AI Lab access',
  'Wealth Stability Engine',
  'Risk Governance dashboard',
  'AI Reports & Export',
  'Unlimited alerts',
  'Priority support',
];

export default function PricingSection() {
  const ref = useRef(null);
  const navigate = useNavigate();
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
            Everything is <span className="text-gradient-primary">free</span> right now
          </h2>
        </motion.div>

        {/* Single card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="max-w-md mx-auto"
        >
          <div className="relative rounded-2xl p-8 md:p-10 glass-panel-elevated glow-border animate-border-glow">
            {/* Badge */}
            <div className="absolute -top-3 left-8">
              <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium tracking-wider uppercase">
                Limited Time Free
              </span>
            </div>

            <p className="label-sm mb-2">Full Suite</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl md:text-5xl font-extralight text-foreground">₹0</span>
              <span className="text-muted-foreground text-sm line-through">₹499/mo</span>
            </div>
            <p className="body-lg text-sm mb-8">
              All premium features — completely free during early access.
            </p>

            <ul className="space-y-3 mb-10">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-secondary-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 bg-primary text-primary-foreground hover:shadow-[0_0_30px_-5px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]"
            >
              Get Started — It's Free
            </button>

            <p className="text-center text-muted-foreground text-xs mt-4">
              No credit card required. Paid plans coming soon.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
