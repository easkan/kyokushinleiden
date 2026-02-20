import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-kyokushin-black text-white py-24 border-t-8 border-kyokushin-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <img src="https://6992610d681c79fa0bce099b.imgix.net/Weblogo-v3.jpg" alt="Kyokushin Leiden Logo" className="h-24 w-auto" />
              <span className="text-4xl font-black tracking-tighter">KYOKUSHIN <span className="text-kyokushin-red">LEIDEN</span></span>
            </div>
            <p className="text-slate-400 text-lg max-w-md">De officiële dojo voor Kyokushinkai Karate in Leiden. Sluit je aan bij de sterkste karate familie.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-8 text-kyokushin-red">NAVIGATIE</h4>
            <ul className="space-y-4 text-slate-400 font-bold uppercase tracking-widest text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/lessen" className="hover:text-white transition-colors">Lessen</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Galerij</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-8 text-kyokushin-red">CONTACT</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li>SPORTSCHOOL BEN & BOUK</li>
              <li>CESAR FRANCKSTRAAT 40</li>
              <li>2324JN LEIDEN</li>
              <li>INFO@KYOKUSHINLEIDEN.NL</li>
              <li>06 - 20897508 / 06 - 51758898</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/10 text-slate-500 text-xs font-bold uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} KYOKUSHIN LEIDEN. ALL RIGHTS RESERVED.</p>
          <Link to="/upload" className="mt-4 md:mt-0 hover:text-white">CMS ACCESS</Link>
        </div>
      </div>
    </footer>
  );
}
