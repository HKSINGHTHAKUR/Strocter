import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { value: 98.7, suffix: '%', label: 'Behavioral Accuracy' },
  { value: 2400, suffix: '+', label: 'Patterns Detected' },
  { value: 150, suffix: 'ms', label: 'Response Time' },
  { value: 99.9, suffix: '%', label: 'Uptime SLA' },
];

export default function IntelligenceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="label-sm mb-4 text-emerald">Intelligence</p>
          <h2 className="heading-lg max-w-3xl mx-auto">
            Precision-engineered for
            <span className="text-gradient-primary"> institutional performance</span>
          </h2>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
              className="glass-panel p-6 md:p-8 text-center group hover:border-primary/20 transition-all duration-500"
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="label-sm text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="glass-panel-elevated p-1 md:p-2"
        >
          <div className="rounded-xl bg-background/80 p-6 md:p-10 space-y-6">
            {/* Mock dashboard header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="label-sm mb-1">Portfolio Overview</p>
                <p className="text-2xl md:text-3xl font-light text-foreground">₹24,85,400</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-full bg-emerald/10 text-emerald text-xs font-medium">+12.4%</div>
                <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Low Risk</div>
              </div>
            </div>
            {/* Mock chart bars */}
            <div className="flex items-end gap-1.5 h-32 md:h-48">
              {Array.from({ length: 30 }).map((_, i) => {
                const h = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 40;
                return (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ delay: 1 + i * 0.03, duration: 0.4 }}
                    className="flex-1 rounded-sm origin-bottom"
                    style={{
                      height: `${h}%`,
                      background: h > 60
                        ? 'hsl(var(--primary) / 0.6)'
                        : h > 40
                        ? 'hsl(var(--accent) / 0.4)'
                        : 'hsl(var(--muted-foreground) / 0.2)',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
