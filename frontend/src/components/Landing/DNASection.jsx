import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export default function DNASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const lines = [
    "Strategy without clarity is noise.",
    "Intelligence without structure is risk.",
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* Vertical line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent origin-top"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-16">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.4 + 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="heading-lg text-foreground/80"
          >
            {line}
          </motion.p>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex justify-center"
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
