import React from 'react';
import { Bot, Code2, Shield, Wifi, Cpu, Wrench, Leaf, ArrowRight } from 'lucide-react';

const challenges = [
  {
    title: 'AI & Machine Learning',
    icon: Bot,
    difficulty: 'Advanced',
    desc: 'Build autonomous agents, predictive models, or generative AI tools solving real-world problems.',
    tech: ['Python', 'TensorFlow', 'PyTorch', 'LLMs'],
    color: 'text-indigo-500',
  },
  {
    title: 'Hardware & IoT',
    icon: Wifi,
    difficulty: 'Intermediate',
    desc: 'Connect the physical and digital worlds. Build smart devices, sensor networks, or edge computing solutions.',
    tech: ['Arduino', 'Raspberry Pi', 'C++', 'MQTT'],
    color: 'text-cyan-500',
  },
  {
    title: 'Web & App Dev',
    icon: Code2,
    difficulty: 'Beginner to Advanced',
    desc: 'Create impactful, accessible, and highly performant web or mobile applications.',
    tech: ['React', 'Next.js', 'React Native', 'Node.js'],
    color: 'text-blue-500',
  },
  {
    title: 'Cybersecurity',
    icon: Shield,
    difficulty: 'Advanced',
    desc: 'Develop secure systems, zero-trust architectures, or innovative cryptographic solutions.',
    tech: ['Rust', 'Go', 'Cryptography', 'Networking'],
    color: 'text-emerald-500',
  },
  {
    title: 'Robotics',
    icon: Cpu,
    difficulty: 'Advanced',
    desc: 'Program autonomous robots, drones, or automated mechanical systems.',
    tech: ['ROS', 'Python', 'C++', 'Computer Vision'],
    color: 'text-rose-500',
  },
  {
    title: 'Sustainability',
    icon: Leaf,
    difficulty: 'All Levels',
    desc: 'Use technology to tackle climate change, optimize resource usage, or promote green energy.',
    tech: ['Data Analysis', 'IoT', 'Web Apps'],
    color: 'text-teal-500',
  },
];

export const ChallengesSection: React.FC = () => {
  return (
    <section id="challenges" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
              Hackathon Tracks
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Choose your domain. Build solutions that push the boundaries of modern engineering and design.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, idx) => {
            const Icon = challenge.icon;
            return (
              <div 
                key={idx} 
                className="group p-8 rounded-2xl glass-panel hover:border-[var(--accent)] hover:shadow-2xl hover:shadow-[var(--accent)]/10 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] group-hover:scale-110 transition-transform ${challenge.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)]">
                    {challenge.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{challenge.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 flex-1 leading-relaxed">
                  {challenge.desc}
                </p>

                <div className="space-y-4 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {challenge.tech.map((t, i) => (
                      <span key={i} className="text-[11px] font-medium px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-md border border-[var(--border-color)]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <button className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors mt-4">
                    <span>View Track Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
