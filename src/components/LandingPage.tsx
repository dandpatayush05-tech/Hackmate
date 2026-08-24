import React, { useState, useEffect } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { useTheme } from '../context/ThemeProvider';
import { Moon, Sun, Menu, X, Terminal } from 'lucide-react';
import { HeroSection } from './landing/HeroSection';
import { ChallengesSection } from './landing/ChallengesSection';
import { HardwareSection } from './landing/HardwareSection';
import { ScheduleSection } from './landing/ScheduleSection';
import { PrizesAndSponsors } from './landing/PrizesAndSponsors';

export const LandingPage: React.FC = () => {
  const { setViewMode, setCurrentTab } = useHackathon();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegister = () => {
    setViewMode('enroll');
  };

  const handleDashboard = () => {
    setViewMode('dashboard');
    setCurrentTab('overview');
  };

  const navLinks = [
    { name: 'Challenges', href: '#challenges' },
    { name: 'Hardware', href: '#hardware' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Prizes', href: '#prizes' },
    { name: 'Sponsors', href: '#sponsors' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-300">
      
      {/* Sticky Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-panel border-b border-[var(--glass-border)] py-3 shadow-sm' 
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)]">HackVerse</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="hover:text-[var(--accent)] transition-colors">
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-[var(--border-color)] pl-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button 
                onClick={handleDashboard}
                className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Dashboard
              </button>

              <button 
                onClick={handleRegister}
                className="px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-colors shadow-lg shadow-[var(--accent)]/20"
              >
                Register
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[var(--text-secondary)]"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-primary)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glass-panel border-b border-[var(--border-color)] flex flex-col py-4 px-4 gap-4 shadow-xl animate-fade-in-up">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[var(--text-secondary)] font-medium text-lg px-2 py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="h-px w-full bg-[var(--border-color)] my-2" />
            <button onClick={handleDashboard} className="text-left px-2 py-2 text-[var(--text-secondary)] font-medium text-lg">
              Dashboard
            </button>
            <button onClick={handleRegister} className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-semibold text-center mt-2">
              Register Now
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <HeroSection onRegister={handleRegister} onExplore={() => {
          document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' });
        }} />
        <ChallengesSection />
        <HardwareSection />
        <ScheduleSection />
        <PrizesAndSponsors />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-12 bg-[var(--bg-primary)] text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-[var(--text-secondary)]" />
          <span className="font-bold text-[var(--text-secondary)] tracking-tight">HackVerse</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          © 2026 HackVerse. Operated by GIET University.
        </p>
      </footer>
    </div>
  );
};
