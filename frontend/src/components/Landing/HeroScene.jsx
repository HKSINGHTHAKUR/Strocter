import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const headlineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.5 }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

function AnimatedHeadline({ text, className }) {
  return (
    <motion.span
      variants={headlineVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {text.split('').map((char, i) => (
        <motion.span key={i} variants={letterVariants} className="inline-block">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExplore = () => {
    navigate('/login');
  };

  const handlePlatform = () => {
    navigate('/login');
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-transparent">
      {/* Background is now handled globally in Index.tsx behind everything */}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full section-padding text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="label-sm mb-8 text-primary"
        >
          Behavioral Finance AI Platform
        </motion.p>

        <h1 className="heading-xl mb-6 max-w-5xl">
          <AnimatedHeadline text="Behavior Is The" />
          <br />
          <span className="text-gradient-primary">
            <AnimatedHeadline text="New Alpha." />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="body-lg max-w-xl mb-12"
        >
          Decode impulse. Engineer stability. Predict behavioral risk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <button onClick={handleExplore} className="group relative px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium tracking-wide text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-5px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]">
            <span className="relative z-10">Explore Intelligence</span>
          </button>
          <button onClick={handlePlatform} className="px-8 py-4 rounded-full border border-border text-foreground font-medium tracking-wide text-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
            View Platform
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="label-sm text-xs">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
      </motion.div>
    </section>
  );
}
