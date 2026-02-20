import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, LogOut, Plus } from 'lucide-react';

interface Photo {
  id: number;
  image: string;
  caption: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function AdminApp() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      if (!response.ok) throw new Error('Failed to fetch photos');
      const data = await response.json();
      setPhotos(data);
    } catch (err) {
      setError('Kon foto\'s niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze foto wilt verwijderen?')) return;

    try {
      const response = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setPhotos(photos.filter(p => p.id !== id));
    } catch (err) {
      alert('Verwijderen mislukt');
    }
  };

  const openUploadWidget = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary is niet geconfigureerd. Voeg VITE_CLOUDINARY_CLOUD_NAME en VITE_CLOUDINARY_UPLOAD_PRESET toe aan je environment variabelen.');
      return;
    }

    window.cloudinary.openUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera'],
        showAdvancedOptions: false,
        cropping: true,
        multiple: false,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#D0021B',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#D0021B',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          },
          fonts: {
            default: null,
            "'Fira Sans', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
              active: true
            }
          }
        }
      },
      async (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          const caption = prompt('Voer een bijschrift in (optioneel):') || '';
          
          try {
            const response = await fetch('/api/photos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: imageUrl, caption })
            });
            if (!response.ok) throw new Error('Save failed');
            fetchPhotos();
          } catch (err) {
            alert('Opslaan in database mislukt');
          }
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b-4 border-kyokushin-red sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4">
              <ImageIcon className="text-kyokushin-red w-8 h-8" />
              <h1 className="text-2xl font-black uppercase italic">CMS <span className="text-kyokushin-red">Dashboard</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm font-bold uppercase tracking-widest hover:text-kyokushin-red transition-colors">Bekijk Site</a>
              <button className="p-2 text-slate-400 hover:text-kyokushin-red transition-colors">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase italic mb-2">Galerij <span className="text-kyokushin-red">Beheer</span></h2>
            <p className="text-slate-500">Beheer de foto's die op de galerij pagina verschijnen.</p>
          </div>
          <button 
            onClick={openUploadWidget}
            className="flex items-center gap-2 bg-kyokushin-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-kyokushin-red transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Foto Toevoegen
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-kyokushin-red rounded-full animate-spin mb-4"></div>
            <p className="font-bold uppercase tracking-widest text-slate-400">Laden...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-8 text-red-700">
            <p className="font-bold uppercase mb-2">Fout</p>
            <p>{error}</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-white border-4 border-dashed border-slate-200 rounded-2xl py-32 text-center">
            <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">Nog geen foto's</p>
            <button 
              onClick={openUploadWidget}
              className="mt-6 text-kyokushin-red font-bold uppercase tracking-widest hover:underline"
            >
              Upload je eerste foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {photos.map((photo) => (
              <div key={photo.id} className="group bg-white border-4 border-kyokushin-black overflow-hidden shadow-xl hover:border-kyokushin-red transition-all">
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img 
                    src={photo.image} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handleDelete(photo.id)}
                      className="p-4 bg-white text-kyokushin-red rounded-full hover:bg-kyokushin-red hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-4 border-t-4 border-kyokushin-black">
                  <p className="font-bold uppercase italic truncate">{photo.caption || 'Geen bijschrift'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
