import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Photo {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/.netlify/functions/gallery-list')
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="py-32 bg-kyokushin-black text-white relative overflow-hidden">
        <div className="absolute inset-0 kanku-bg opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 italic uppercase">FOTO <span className="text-kyokushin-red">GALERIJ</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl">Actiebeelden uit onze dojo. Kracht, techniek en doorzettingsvermogen.</p>
        </div>
      </section>

      <section className="py-32 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-16 h-16 border-8 border-slate-200 border-t-kyokushin-red rounded-full animate-spin mb-8"></div>
              <p className="text-2xl font-black uppercase tracking-widest text-slate-400">Laden...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-2xl font-black uppercase tracking-widest text-slate-400 italic">Nog geen foto's geüpload.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden border-4 border-kyokushin-black aspect-square shadow-xl hover:border-kyokushin-red transition-all duration-300"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kyokushin-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <p className="text-white font-black uppercase italic tracking-widest text-lg">{photo.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
