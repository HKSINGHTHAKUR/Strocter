import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLaunchApp = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (pathname !== '/') {
      navigate('/#' + item.toLowerCase());
    } else {
      const id = item.toLowerCase();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' : ''
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        <Logo />

        <div className="hidden md:flex items-center gap-10">
          {['Platform', 'Intelligence', 'Security', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => handleNavClick(e, item)}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full border border-border text-foreground text-xs uppercase transition-all duration-300 hover:border-accent hover:text-accent font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/login?mode=signup')}
            className="px-6 py-2 rounded-full bg-accent-orange text-white text-xs uppercase transition-all duration-300 hover:opacity-90 font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
