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
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
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
            <div className="bg-slate-50 p-12 border-4 border-kyokushin-black relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-kyokushin-red/5 -m-4 rotate-12"></div>
              <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">TARIEVEN</h2>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-black uppercase italic mb-2">Jeugd (t/m 15 jaar)</h4>
                  <p className="text-4xl font-black text-kyokushin-red">€ 25,00 <span className="text-sm text-slate-400 uppercase tracking-widest">/ maand</span></p>
                </div>
                <div className="w-full h-1 bg-slate-200"></div>
                <div>
                  <h4 className="text-xl font-black uppercase italic mb-2">Senioren (vanaf 16 jaar)</h4>
                  <p className="text-4xl font-black text-kyokushin-red">€ 35,00 <span className="text-sm text-slate-400 uppercase tracking-widest">/ maand</span></p>
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase italic">* Inschrijfgeld eenmalig € 10,00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
