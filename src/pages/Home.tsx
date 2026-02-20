import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="flex-grow relative overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative h-[90vh] flex items-center overflow-hidden bg-black">
        <img 
          src="https://picsum.photos/seed/kyokushin_hero/1920/1080" 
          alt="Kyokushin training" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-kyokushin-red px-4 py-1 mb-6 font-display font-bold uppercase tracking-widest">The Strongest Karate</div>
            <h1 className="text-6xl md:text-9xl font-black mb-8 leading-none uppercase italic">KYOKUSHIN<br /><span className="text-kyokushin-red">LEIDEN</span></h1>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl text-slate-300 font-medium">Betreed de weg van de uiterste waarheid. Harde training, discipline en onverzettelijkheid in het hart van Leiden.</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/contact" className="btn-kyokushin">Start je proefles</Link>
              <Link to="/lessen" className="px-8 py-4 border-4 border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all text-center">Onze Dojo</Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Philosophy Section */}
      <main className="relative">
        <div className="absolute inset-0 kanku-bg pointer-events-none"></div>
        
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-5xl font-black text-kyokushin-red uppercase mb-8">
                HET KYOKUSHINKAI KARATE STAAT VOOR:<br />
                DISCIPLINE, DOORZETTEN, RESPECT, ZELFVERTROUWEN EN WEERBAARHEID.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 mb-24">
              <div className="border-t-4 border-kyokushin-red pt-8">
                <h3 className="text-2xl font-black mb-4 text-kyokushin-red">KYOKU BETEKENT<br />HET UITERSTE.</h3>
                <p className="text-slate-600 leading-relaxed">Dit betekent dat je het maximale uit elke situatie wilt halen door door te zetten en je geheel te geven om zo tot het uiterste te gaan voor dat wat je wilt bereiken.</p>
              </div>
              <div className="border-t-4 border-kyokushin-red pt-8">
                <h3 className="text-2xl font-black mb-4 text-kyokushin-red">SHIN BETEKENT<br />DE WAARHEID.</h3>
                <p className="text-slate-600 leading-relaxed">Dit betekent dat je alleen met een ijzeren discipline en juiste mentaliteit dit kan bereiken. Je zal zonder protesteren de realiteit tegemoet moeten treden en wanneer je dit kunt opbrengen, sterkt dit je in je zelfvertrouwen.</p>
              </div>
              <div className="border-t-4 border-kyokushin-red pt-8">
                <h3 className="text-2xl font-black mb-4 text-kyokushin-red">KAI BETEKENT<br />SAMENWERKEN.</h3>
                <p className="text-slate-600 leading-relaxed">Dit staat voor het samenwerken met elkaar in de juiste verhouding en altijd met het nodige respect naar elkaar toe.</p>
              </div>
            </div>

            <div className="text-center mb-32">
              <h3 className="text-2xl md:text-3xl font-black text-kyokushin-red uppercase">
                AL DEZE PUNTEN ZIJN IN MIJN OGEN KARAKTERVORMEND EN VAN GROOT OPVOEDKUNDIG BELANG.
              </h3>
            </div>

            <div className="mb-32">
              <img src="https://6992610d681c79fa0bce099b.imgix.net/1.jpg" alt="Kyokushin Groep" className="w-full shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 border-8 border-kyokushin-black" />
            </div>

            <div className="grid md:grid-cols-2 gap-24 items-start">
              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl font-black text-kyokushin-red mb-6 uppercase">DE STIJL KYOKUSHINKAI STAAT BEKEND OM ZIJN HARDE MAAR EERLIJKE VORM VAN KARATE.</h3>
                  <p className="text-slate-600 leading-relaxed">Door de zware trainingen word je fysiek en mentaal erg sterk, je leert je beheersen met als gevolg: meer zelfvertrouwen en meer verantwoordelijkheidsgevoel. Ik ben er dan ook van overtuigd dat 'Kyokushinkai Karate' een positieve bijdrage kan leveren aan de verdere ontwikkeling in je persoonlijk leven, je school en je werk.</p>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-kyokushin-red mb-6 uppercase">VAAK VRAGEN OUDERS: "IS KARATE NIET AGRESSIEF OF IS KARATE NIET GEVAARLIJK?"</h3>
                  <p className="text-slate-600 leading-relaxed">Nee, de praktijk wijst uit dat mensen die Karate beoefenen juist rustiger, beheerster en gedisciplineerder worden en zodoende een gevecht uit de weg zullen gaan. Mensen die Karate gaan leren met de bedoeling om dit te misbruiken missen vaak ook de mentaliteit en het doorzettingsvermogen om de zware trainingsdiscipline vol te houden. Het één sluit dus automatisch het andere uit.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full border-8 border-kyokushin-red z-0"></div>
                <img src="https://6992610d681c79fa0bce099b.imgix.net/IMG_5471-768x1024.jpeg" alt="Kyokushin Training" className="relative z-10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-kyokushin-black text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-8xl font-black uppercase italic mb-4">WAAROM <span className="text-kyokushin-red">ONS?</span></h2>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="group">
                <div className="text-8xl font-black text-white/10 group-hover:text-kyokushin-red/20 transition-colors mb-[-40px]">01</div>
                <h3 className="text-3xl font-bold mb-6 relative z-10">FULL CONTACT</h3>
                <p className="text-slate-400 leading-relaxed">Wij trainen op de traditionele manier. Full-contact sparring voor wie de uitdaging aan durft.</p>
              </div>
              <div className="group">
                <div className="text-8xl font-black text-white/10 group-hover:text-kyokushin-red/20 transition-colors mb-[-40px]">02</div>
                <h3 className="text-3xl font-bold mb-6 relative z-10">DISCIPLINE</h3>
                <p className="text-slate-400 leading-relaxed">Geen excuses. Wij verleggen grenzen en bouwen aan een onverwoestbaar karakter.</p>
              </div>
              <div className="group">
                <div className="text-8xl font-black text-white/10 group-hover:text-kyokushin-red/20 transition-colors mb-[-40px]">03</div>
                <h3 className="text-3xl font-bold mb-6 relative z-10">TRADITIE</h3>
                <p className="text-slate-400 leading-relaxed">Wij volgen de weg van Sosai Mas Oyama. Eerlijkheid, nederigheid en kracht.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
