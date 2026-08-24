import React from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';

const prizes = [
  { place: '1st Place', value: '$10,000', icon: Trophy, color: 'text-amber-400', desc: 'Grand prize + Incubation interview' },
  { place: '2nd Place', value: '$5,000', icon: Medal, color: 'text-slate-300', desc: 'Runner-up prize + Hardware kits' },
  { place: '3rd Place', value: '$2,500', icon: Award, color: 'text-orange-400', desc: 'Bronze prize + Software licenses' },
];

const specialAwards = [
  { title: 'Best Hardware Project', value: '$1,500', icon: Star },
  { title: 'Best AI Project', value: '$1,500', icon: Star },
  { title: 'Best Beginner Project', value: '$1,000', icon: Star },
];

export const PrizesAndSponsors: React.FC = () => {
  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Prizes Section */}
      <section id="prizes" className="py-24 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
              Prizes & Awards
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
              Over $50,000 in total prizes, credits, and exclusive opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {prizes.map((prize, idx) => {
              const Icon = prize.icon;
              return (
                <div key={idx} className="p-8 rounded-2xl glass-panel text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className={`mx-auto w-16 h-16 mb-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-color)] group-hover:scale-110 transition-transform ${prize.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 font-mono tracking-tight">{prize.value}</h3>
                  <div className="text-lg font-bold text-[var(--text-primary)] mb-2">{prize.place}</div>
                  <p className="text-sm text-[var(--text-secondary)]">{prize.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {specialAwards.map((award, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors">
                <div className="flex items-center gap-3">
                  <award.icon className="w-5 h-5 text-[var(--accent)]" />
                  <span className="font-semibold text-[var(--text-primary)] text-sm">{award.title}</span>
                </div>
                <span className="font-mono font-bold text-[var(--text-primary)]">{award.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
            Backed by Industry Leaders
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-16">
            Partnering with the most innovative companies in tech.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-500">
            {/* Abstract Sponsor Logos */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center justify-center h-20 grayscale hover:grayscale-0 hover:scale-105 transition-all duration-300">
                <div className="w-32 h-10 rounded bg-[var(--border-color)] animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
