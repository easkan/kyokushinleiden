import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-kyokushin-black">
        <div className="absolute inset-0 kanku-bg opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-kyokushin-black/50 to-kyokushin-black"></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 inline-block"
          >
            <span className="bg-kyokushin-red text-white px-6 py-2 text-sm font-black uppercase tracking-[0.3em] italic">Kyokushinkai Karate</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-7xl md:text-9xl font-black text-white mb-8 italic uppercase leading-none tracking-tighter"
          >
            THE STRONGEST <br/>
            <span className="text-kyokushin-red">KARATE</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-slate-300 mb-12 font-bold uppercase tracking-widest max-w-2xl mx-auto"
          >
            Kracht, Discipline en Respect. <br/>
            Train bij de bron in Leiden.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/lessen" className="btn-primary">Bekijk Lessen</Link>
            <Link to="/contact" className="btn-secondary">Gratis Proefles</Link>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-1 h-16 bg-gradient-to-b from-kyokushin-red to-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { id: '01', title: 'Traditie', text: 'Wij onderwijzen het authentieke Kyokushin karate zoals Mas Oyama het bedoeld heeft. Geen shortcuts, alleen hard werken.' },
              { id: '02', title: 'Discipline', text: 'Karate is meer dan vechten. Het is de weg naar zelfbeheersing, focus en een onverwoestbare mentaliteit.' },
              { id: '03', title: 'Gemeenschap', text: 'Bij Kyokushin Leiden trainen we samen. We helpen elkaar groeien, ongeacht je niveau of achtergrond.' }
            ].map((feature) => (
              <div key={feature.id} className="group">
                <div className="text-7xl font-black text-slate-100 group-hover:text-kyokushin-red/10 transition-colors mb-4">{feature.id}</div>
                <h3 className="text-3xl font-black mb-6 italic uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Section */}
      <section className="py-32 bg-kyokushin-black relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-kyokushin-red skew-x-12 translate-x-32 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 italic uppercase tracking-tighter">KLAAR VOOR DE <span className="text-kyokushin-red">UITDAGING?</span></h2>
              <p className="text-xl text-slate-400 mb-12 font-bold uppercase tracking-widest">Kom langs voor een gratis proefles en ervaar de kracht van Kyokushin.</p>
              <Link to="/contact" className="btn-primary">Meld je nu aan</Link>
            </div>
            <div className="relative">
              <div className="w-64 h-64 md:w-96 md:h-96 border-8 border-kyokushin-red rotate-45 flex items-center justify-center">
                <div className="rotate-[-45deg] text-center">
                  <span className="text-6xl md:text-8xl font-black text-white italic">OSU!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
