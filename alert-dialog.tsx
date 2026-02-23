import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FeatureCardProps {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

function FeatureCard({ label, title, description, icon, index }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group glass-panel p-8 md:p-10 transition-all duration-500 hover:bg-card/60 hover:border-primary/20"
    >
      <div className="mb-6 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]">
        {icon}
      </div>
      <p className="label-sm mb-3 text-primary/70">{label}</p>
      <h3 className="heading-md mb-4 text-foreground">{title}</h3>
      <p className="body-lg">{description}</p>
    </motion.div>
  );
}

const features = [
  {
    label: "Analytics",
    title: "Behavioral Analytics",
    description: "Map cognitive biases in real time. Understand the hidden patterns driving financial decisions across portfolios.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 5-9" />
      </svg>
    ),
  },
  {
    label: "AI Lab",
    title: "Impulse AI Lab",
    description: "Detect and neutralize impulsive trading patterns before they cascade into portfolio damage.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" /><path d="M8 6a4 4 0 0 1 6.65-3" /><path d="M12 18v4" /><path d="M8 22h8" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Stability",
    title: "Wealth Stability Engine",
    description: "Dynamic risk calibration that adapts to behavioral volatility, maintaining equilibrium across market conditions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    label: "Governance",
    title: "Risk Governance",
    description: "Institutional-grade governance framework that shields portfolios from systematic behavioral threats.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function PlatformShowcase() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="label-sm mb-4 text-primary">Platform</p>
          <h2 className="heading-lg max-w-3xl mx-auto">
            Four pillars of
            <span className="text-gradient-primary"> behavioral intelligence</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
