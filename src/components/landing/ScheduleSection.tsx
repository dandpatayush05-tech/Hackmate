import React from 'react';

const scheduleEvents = [
  { time: 'Friday, 18:00', title: 'Check-in & Registration', desc: 'Get your badge, swag, and hardware kits.' },
  { time: 'Friday, 19:30', title: 'Opening Ceremony', desc: 'Keynotes, track announcements, and API demos.' },
  { time: 'Friday, 21:00', title: 'Team Formation', desc: 'Find teammates and finalize your project ideas.' },
  { time: 'Friday, 22:00', title: 'Hacking Begins', desc: 'The 36-hour sprint starts now.' },
  { time: 'Saturday, 10:00', title: 'Technical Workshops', desc: 'Deep dives into AI, Web3, and embedded systems.' },
  { time: 'Saturday, 14:00', title: 'Mentoring Sessions', desc: '1-on-1 architecture reviews and debugging help.' },
  { time: 'Sunday, 10:00', title: 'Submission Deadline', desc: 'Code freeze. Submit projects and video demos.' },
  { time: 'Sunday, 11:30', title: 'Judging & Demos', desc: 'Science-fair style judging across the pavilion.' },
  { time: 'Sunday, 15:00', title: 'Final Presentations', desc: 'Top 10 teams pitch on the main stage.' },
  { time: 'Sunday, 17:00', title: 'Winner Announcement', desc: 'Awards ceremony and closing remarks.' },
];

export const ScheduleSection: React.FC = () => {
  return (
    <section id="schedule" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
            Event Schedule
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            36 hours of intense building, learning, and collaborating.
          </p>
        </div>

        <div className="relative border-l-2 border-[var(--border-color)] ml-3 md:ml-0 md:pl-0 md:border-none space-y-12">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[var(--border-color)] -translate-x-1/2" />
          
          {scheduleEvents.map((event, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={idx} className="relative pl-8 md:pl-0 flex flex-col md:flex-row items-center justify-between w-full group">
                
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-[var(--accent)] outline outline-4 outline-[var(--bg-primary)] group-hover:scale-150 transition-transform z-10" />
                
                {/* Content Block */}
                <div className={`md:w-5/12 ${isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12 md:order-last'}`}>
                  <div className="inline-block px-3 py-1 mb-2 rounded-full text-[10px] font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent)]">
                    {event.time}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{event.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {event.desc}
                  </p>
                </div>
                
                {/* Empty block for spacing on desktop */}
                <div className="hidden md:block w-5/12" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
