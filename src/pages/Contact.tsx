import React from 'react';

export default function Contact() {
  return (
    <main className="flex-grow overflow-x-hidden">
      <section className="py-32 bg-kyokushin-black text-white relative overflow-hidden">
        <div className="absolute inset-0 kanku-bg opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 italic uppercase">NEEM <span className="text-kyokushin-red">CONTACT</span> OP</h1>
          <p className="text-xl text-slate-400 max-w-2xl">Vragen over trainingen, lidmaatschap of een proefles? Wij staan voor je klaar. Osu!</p>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-24">
            <div>
              <h2 className="text-4xl font-black mb-12 uppercase italic">STUUR EEN BERICHT</h2>
              <form name="contact" method="POST" className="space-y-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Naam</label>
                  <input type="text" name="name" required className="w-full px-6 py-4 border-4 border-kyokushin-black focus:border-kyokushin-red outline-none transition-colors font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">E-mail</label>
                  <input type="email" name="email" required className="w-full px-6 py-4 border-4 border-kyokushin-black focus:border-kyokushin-red outline-none transition-colors font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Onderwerp</label>
                  <select name="subject" className="w-full px-6 py-4 border-4 border-kyokushin-black focus:border-kyokushin-red outline-none transition-colors font-bold appearance-none">
                    <option>Gratis Proefles</option>
                    <option>Lidmaatschap</option>
                    <option>Algemene vraag</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Bericht</label>
                  <textarea name="message" rows={6} required className="w-full px-6 py-4 border-4 border-kyokushin-black focus:border-kyokushin-red outline-none transition-colors font-bold"></textarea>
                </div>
                <button type="submit" className="btn-kyokushin w-full text-xl">Verstuur Bericht</button>
              </form>
            </div>

            <div className="space-y-16">
              <div>
                <h2 className="text-4xl font-black mb-12 uppercase italic">LOCATIE & INFO</h2>
                <div className="space-y-12">
                  <div className="flex gap-8">
                    <div className="text-kyokushin-red">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-2 uppercase">DOJO ADRES</h4>
                      <p className="text-xl text-slate-600 font-bold">SPORTSCHOOL BEN & BOUK<br />CESAR FRANCKSTRAAT 40<br />2324JN LEIDEN</p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-kyokushin-red">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-2 uppercase">TELEFOON</h4>
                      <p className="text-xl text-slate-600 font-bold">06 - 20897508<br />06 - 51758898</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-8 border-kyokushin-black shadow-2xl overflow-hidden h-96 relative">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4896.821211410783!2d4.4662547133876505!3d52.14504207184833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5c656a31b1dc9%3A0xba901800188ef85c!2sCesar%20Franckstraat%2040%2C%202324%20JN%20Leiden!5e0!3m2!1snl!2snl!4v1771563044517!5m2!1snl!2snl" width="100%" height="100%" style={{border:0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
