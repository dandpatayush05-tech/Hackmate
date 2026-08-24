import React from 'react';
import { Cpu, Server, Wifi, HardDrive, MonitorSpeaker, Box } from 'lucide-react';

const hardwareEcosystem = [
  { name: 'Microcontrollers', icon: Cpu, desc: 'STM32, ESP32, & Teensy boards for low-level embedded control.' },
  { name: 'Edge AI Compute', icon: Server, desc: 'NVIDIA Jetson Nanos & Coral TPUs for on-device inference.' },
  { name: 'Sensors & Actuators', icon: Wifi, desc: 'LIDAR, IMUs, environmental sensors, and precision servos.' },
  { name: 'Storage & Memory', icon: HardDrive, desc: 'High-speed NVMe drives and reliable SD cards for data logging.' },
  { name: 'Prototyping Kits', icon: Box, desc: 'Breadboards, jumper wires, resistors, and soldering stations.' },
  { name: 'Audio/Vision', icon: MonitorSpeaker, desc: 'Stereo cameras, mic arrays, and high-res displays.' },
];

export const HardwareSection: React.FC = () => {
  return (
    <section id="hardware" className="py-24 border-y border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden relative">
      <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none opacity-5">
        {/* Abstract circuitry pattern */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10,10 L30,10 L40,20 L60,20" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="10" cy="10" r="3" fill="currentColor" />
              <circle cx="60" cy="20" r="3" fill="currentColor" />
              <path d="M20,50 L40,50 L50,40 L80,40" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="20" cy="50" r="3" fill="currentColor" />
              <circle cx="80" cy="40" r="3" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-6">
            <Cpu className="w-4 h-4" />
            <span>Hardware Lab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
            The Ultimate Hardware Ecosystem
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Access thousands of dollars worth of premium engineering hardware. Build physical prototypes that interact with the real world.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {hardwareEcosystem.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="group p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-colors cursor-default"
              >
                <div className="mb-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{item.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
