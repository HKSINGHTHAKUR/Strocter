import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function SecuritySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Rotating cube icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 flex justify-center"
        >
          <div className="relative w-24 h-24">
            <motion.div
              animate={{ rotateY: 360, rotateX: 15 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border border-primary/30 rounded-xl"
              style={{ transformStyle: 'preserve-3d' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            {/* Subtle particle aura */}
            <div className="absolute inset-0 rounded-xl bg-primary/5 blur-xl animate-glow-pulse" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="label-sm mb-6 text-primary"
        >
          Security
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="heading-lg mb-8"
        >
          Institutional-grade encryption.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="body-lg max-w-lg mx-auto"
        >
          Behavioral data protected with military-grade encryption. Zero-knowledge architecture ensures your financial psychology remains yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 flex justify-center gap-12 flex-wrap"
        >
          {['AES-256', 'SOC 2', 'GDPR', 'Zero-Knowledge'].map((badge, i) => (
            <motion.span
              key={badge}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
              className="label-sm text-xs text-muted-foreground/60"
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
