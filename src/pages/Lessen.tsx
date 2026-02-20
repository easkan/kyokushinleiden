import React from 'react';
import { motion } from 'motion/react';

export default function Lessen() {
  const schedule = [
    { day: 'Maandag', time: '19:00 - 20:30', type: 'Senioren' },
    { day: 'Woensdag', time: '18:00 - 19:00', type: 'Jeugd' },
    { day: 'Woensdag', time: '19:00 - 20:30', type: 'Senioren' },
    { day: 'Vrijdag', time: '19:00 - 20:30', type: 'Senioren' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="py-32 bg-kyokushin-black text-white relative overflow-hidden">
        <div className="absolute inset-0 kanku-bg opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 italic uppercase">ONZE <span className="text-kyokushin-red">LESSEN</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl">Trainingen voor alle niveaus. Van beginners tot gevorderden, van jeugd tot senioren.</p>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black mb-12 italic uppercase tracking-tighter">LESROOSTER</h2>
            <div className="space-y-4">
              {schedule.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-8 border-4 border-kyokushin-black hover:border-kyokushin-red transition-colors group">
                  <div>
                    <h4 className="text-xl font-black uppercase italic group-hover:text-kyokushin-red transition-colors">{slot.day}</h4>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{slot.type}</p>
                  </div>
                  <div className="text-2xl font-black italic">{slot.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
