import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from './Feature3DCard';
function FeatureCard({ label, title, description, icon, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative z-10"
    >
      <CardContainer>
        <CardBody className="flex flex-col h-full min-h-[300px]">
          <CardItem
            translateZ="40"
            translateY="-4"
            className="mb-8 w-12 h-12 rounded-xl bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center text-accent-orange transition-all duration-300 group-hover:bg-accent-orange/20"
          >
            {icon}
          </CardItem>

          <CardItem translateZ="50" className="mt-auto">
            <p className="text-xs font-semibold tracking-wider text-accent-orange/80 uppercase mb-3">
              {label}
            </p>
          </CardItem>

          <CardItem as="h3" translateZ="60" className="text-xl font-semibold text-white tracking-tight mb-3">
            {title}
          </CardItem>

          <CardItem as="p" translateZ="50" className="text-neutral-400 text-sm leading-relaxed mb-6">
            {description}
          </CardItem>

          <CardItem translateZ="70" className="mt-auto pt-4 border-t border-white/5 relative">
            <span className="text-sm font-medium text-white group-hover:text-accent-orange transition-colors">
              Learn More
            </span>
            {/* Animated underline */}
            <span className="absolute left-0 bottom-0 w-0 h-px bg-accent-orange transition-all duration-300 group-hover:w-full" />
          </CardItem>
        </CardBody>
      </CardContainer>
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
  const headerRef = useRef(null);
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
