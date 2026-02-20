import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="py-32 bg-kyokushin-black text-white relative overflow-hidden">
        <div className="absolute inset-0 kanku-bg opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 italic uppercase">NEEM <span className="text-kyokushin-red">CONTACT</span> OP</h1>
          <p className="text-xl text-slate-400 max-w-2xl">Vragen over trainingen of een proefles? We horen graag van je.</p>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24">
            <div>
              <h2 className="text-4xl font-black mb-12 italic uppercase tracking-tighter">LOCATIE & INFO</h2>
              <div className="space-y-12">
                <div className="flex gap-8">
                  <div className="flex-shrink-0 w-16 h-16 bg-kyokushin-red flex items-center justify-center text-white">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic mb-2">Adres</h4>
                    <p className="text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                      Sportschool Ben & Bouk<br/>
                      Cesar Franckstraat 40<br/>
                      2324JN Leiden
                    </p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="flex-shrink-0 w-16 h-16 bg-kyokushin-red flex items-center justify-center text-white">
                    <Phone className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic mb-2">Telefoon</h4>
                    <p className="text-slate-600 font-bold uppercase tracking-widest">
                      06 - 20897508 / 06 - 51758898
                    </p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="flex-shrink-0 w-16 h-16 bg-kyokushin-red flex items-center justify-center text-white">
                    <Mail className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic mb-2">Email</h4>
                    <p className="text-slate-600 font-bold uppercase tracking-widest">
                      INFO@KYOKUSHINLEIDEN.NL
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-kyokushin-black p-12 text-white border-8 border-kyokushin-red">
              <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">STUUR EEN BERICHT</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.3em] mb-4 text-slate-400">Naam</label>
                  <input type="text" className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-kyokushin-red outline-none transition-colors font-bold uppercase tracking-widest" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.3em] mb-4 text-slate-400">Email</label>
                  <input type="email" className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-kyokushin-red outline-none transition-colors font-bold uppercase tracking-widest" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.3em] mb-4 text-slate-400">Bericht</label>
                  <textarea rows={4} className="w-full bg-white/5 border-2 border-white/10 p-4 focus:border-kyokushin-red outline-none transition-colors font-bold uppercase tracking-widest"></textarea>
                </div>
                <button type="button" className="btn-primary w-full">Versturen</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
