import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

import LandingNavbar from '../components/Landing/Navbar';
import HeroSection from '../components/Landing/HeroScene';
import BackgroundS from '../components/Landing/BackgroundS';
import DNASection from '../components/Landing/DNASection';
import PlatformShowcase from '../components/Landing/PlatformShowcase';
import IntelligenceSection from '../components/Landing/IntelligenceSection';
import SecuritySection from '../components/Landing/SecuritySection';
import PricingSection from '../components/Landing/PricingSection';
import CTASection from '../components/Landing/CTASection';
import Footer from '../components/Landing/Footer';

const Landing = () => {
    const { hash } = useLocation();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    // Handle hash scrolling on load if navigating back to a section
    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash]);

    return (
        <div className="bg-background text-foreground min-h-screen relative">
            <BackgroundS />
            <div className="relative z-10 w-full overflow-hidden">
                <LandingNavbar />
                <HeroSection />
                <DNASection />
                <div id="platform">
                    <PlatformShowcase />
                </div>
                <div id="intelligence">
                    <IntelligenceSection />
                </div>
                <div id="security">
                    <SecuritySection />
                </div>
                <div id="pricing">
                    <PricingSection />
                </div>
                <CTASection />
                <Footer />
            </div>
        </div>
    );
};

export default Landing;
