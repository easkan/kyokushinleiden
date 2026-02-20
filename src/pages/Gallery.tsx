import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CloudinaryImage {
  public_id: string;
  version: number;
  format: string;
  context?: {
    custom?: {
      caption?: string;
    };
  };
}

export default function Gallery() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
  const tag = import.meta.env.VITE_CLOUDINARY_TAG || 'kyokushin';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Note: This URL requires "Resource List" to be enabled in Cloudinary settings
        const response = await axios.get(`https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`);
        setImages(response.data.resources);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching images from Cloudinary:', err);
        setError('Kon de galerij niet laden. Controleer of de Cloudinary instellingen correct zijn.');
        setLoading(false);
      }
    };

    fetchImages();
  }, [cloudName, tag]);

  return (
    <main className="flex-grow overflow-x-hidden">
      <section className="py-32 bg-kyokushin-black text-white relative overflow-hidden">
        <div className="absolute inset-0 kanku-bg opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 italic uppercase">FOTO <span className="text-kyokushin-red">GALERIJ</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl">Actiebeelden uit onze dojo. Kracht, techniek en doorzettingsvermogen.</p>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="col-span-full py-32 text-center">
              <div className="inline-block w-12 h-12 border-8 border-slate-200 border-t-kyokushin-red rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-black uppercase tracking-widest text-slate-400">Laden...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-red-500 mb-4 font-bold">{error}</p>
              <button onClick={() => window.location.reload()} className="px-8 py-4 bg-kyokushin-red text-white font-bold uppercase tracking-widest hover:bg-black transition-all">Opnieuw proberen</button>
            </div>
          ) : images.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
              Nog geen foto's geüpload in de Cloudinary collectie "{tag}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image) => (
                <div key={image.public_id} className="group relative overflow-hidden border-4 border-kyokushin-black aspect-square shadow-xl hover:border-kyokushin-red transition-all duration-300">
                  <img 
                    src={`https://res.cloudinary.com/${cloudName}/image/upload/v${image.version}/${image.public_id}.${image.format}`} 
                    alt="Karate foto" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kyokushin-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <p className="text-white font-black uppercase italic tracking-widest text-lg">
                      {image.context?.custom?.caption || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
