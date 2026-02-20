import React, { useEffect, useState } from 'react';

interface GalleryItem {
  image: string;
  caption?: string;
}

interface GalleryData {
  items: GalleryItem[];
}

const Gallery: React.FC = () => {
  const [data, setData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/photos.json', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Netwerkrespons was niet ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 text-center text-red-600 font-bold">
        Fout bij het laden van de galerij: {error}
      </div>
    );
  }

  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="py-32 text-center text-slate-400 font-bold uppercase tracking-widest">
        Geen foto's gevonden in de galerij.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.items.map((item, index) => (
        <div 
          key={index} 
          className="group relative aspect-square overflow-hidden bg-slate-100 border-4 border-black hover:border-red-600 transition-colors duration-300"
        >
          <img
            src={item.image}
            alt={item.caption || `Galerij afbeelding ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {item.caption && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-bold uppercase tracking-wider text-sm border-l-4 border-red-600 pl-3">
                {item.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
