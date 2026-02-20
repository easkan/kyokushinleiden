import React from 'react';

export default function Lessen() {
  return (
    <main className="flex-grow overflow-x-hidden">
      <section className="py-32 bg-kyokushin-black text-white relative overflow-hidden">
        <div className="absolute inset-0 kanku-bg opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 italic uppercase">TRAININGS<span className="text-kyokushin-red">SCHEMA</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl">Wij trainen hard, met respect voor elkaar en de traditie. Bekijk hieronder wanneer je terecht kunt in onze dojo.</p>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-16">
            {/* Junioren Leiden */}
            <div className="space-y-12">
              <h2 className="text-4xl font-black text-kyokushin-red uppercase italic border-b-4 border-kyokushin-black pb-4">JUNIOREN LEIDEN</h2>
              
              <div className="space-y-6">
                <h4 className="text-xl font-black uppercase underline">Cesar Franckstraat 40 (Zuid-West)</h4>
                <ul className="space-y-2 font-bold text-slate-700">
                  <li>Maandag van 18:30 tot 19:30 uur</li>
                  <li>Woensdag van 18:00 tot 19:00 uur</li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-xl font-black uppercase underline">Valkenpad 38 (merenwijk)</h4>
                <ul className="space-y-2 font-bold text-slate-700">
                  <li>Donderdag van 18:30 tot 19:30 uur (Groep I)</li>
                  <li>Donderdag van 19:30 tot 20:30 uur (Groep II)</li>
                  <li>Zondag van 15:00 tot 16:00 uur (Groep I)</li>
                  <li>Zondag van 16:00 tot 17:00 uur (Groep II)</li>
                </ul>
              </div>
            </div>

            {/* Senioren Leiden */}
            <div className="space-y-12">
              <h2 className="text-4xl font-black text-kyokushin-red uppercase italic border-b-4 border-kyokushin-black pb-4">SENIOREN LEIDEN</h2>
              
              <div className="space-y-6">
                <h4 className="text-xl font-black uppercase underline">Cesar Franckstraat 40 (Zuid-West)</h4>
                <ul className="space-y-2 font-bold text-slate-700">
                  <li>Maandag van 19:30 tot 20:30 uur</li>
                  <li>Woensdag van 19:00 tot 20:00 uur</li>
                </ul>
              </div>
            </div>

            {/* Alphen a/d Rijn */}
            <div className="space-y-12">
              <h2 className="text-4xl font-black text-kyokushin-red uppercase italic border-b-4 border-kyokushin-black pb-4">ALPHEN A/D RIJN MIX</h2>
              
              <div className="space-y-6">
                <h4 className="text-xl font-black uppercase underline">Polluxstraat 2</h4>
                <ul className="space-y-2 font-bold text-slate-700">
                  <li>Dinsdag van 19:00 tot 20:00 uur</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
