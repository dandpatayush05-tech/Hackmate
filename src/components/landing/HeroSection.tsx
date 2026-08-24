import React from 'react';
import { Sparkles, ArrowRight, Calendar, MapPin, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onRegister: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onRegister, onExplore }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-transparent">
      {/* Subtle Futuristic Grid & Glow Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-indigo-500 dark:text-indigo-400 text-xs font-semibold tracking-wide mb-8 animate-fade-in-up">
          <Cpu className="w-3.5 h-3.5" />
          <span>The Next Generation of Developer Innovation</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6">
          Build the Future.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
            HackVerse 2026.
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
          A premium 36-hour hackathon where software meets hardware. Innovate, collaborate, and push the boundaries of modern technology.
        </p>

        {/* Event Details */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-[var(--text-secondary)] font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>August 21-23, 2026</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-color)]" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>Grand Tech Pavilion, SF & Virtual</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRegister}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-sm shadow-xl flex items-center justify-center gap-2 group"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-[var(--text-primary)] hover:bg-[var(--border-color)] hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-sm flex items-center justify-center"
          >
            Explore Hackathon
          </button>
        </div>
      </div>
    </section>
  );
};
