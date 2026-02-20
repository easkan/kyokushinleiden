import React, { useEffect, useState } from 'react';
import { Upload as UploadIcon, CheckCircle, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function Upload() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const tag = import.meta.env.VITE_CLOUDINARY_TAG || 'kyokushin';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openWidget = () => {
    if (!isLoaded || !window.cloudinary) return;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary configuratie ontbreekt. Voeg VITE_CLOUDINARY_CLOUD_NAME en VITE_CLOUDINARY_UPLOAD_PRESET toe aan de omgevingsvariabelen.');
      return;
    }

    window.cloudinary.openUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        tags: [tag],
        sources: ['local', 'url', 'camera'],
        multiple: true,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#121212',
            tabIcon: '#D32F2F',
            menuIcons: '#121212',
            textDark: '#121212',
            textLight: '#FFFFFF',
            link: '#D32F2F',
            action: '#D32F2F',
            inactiveTabIcon: '#121212',
            error: '#D32F2F',
            inProgress: '#D32F2F',
            complete: '#20B832',
            sourceBg: '#F4F4F4'
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Inter',
              active: true
            }
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log('Done! Here is the image info: ', result.info);
          setStatus('success');
          setTimeout(() => setStatus('idle'), 5000);
        } else if (error) {
          console.error('Upload error:', error);
          setStatus('error');
        }
      }
    );
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center py-32 bg-slate-50">
      <div className="max-w-md w-full bg-white border-8 border-kyokushin-black p-12 shadow-2xl text-center">
        <h1 className="text-4xl font-black mb-8 uppercase italic text-kyokushin-black">
          FOTO <span className="text-kyokushin-red">UPLOAD</span>
        </h1>
        
        <p className="text-slate-600 mb-12 font-bold">
          Beheer de galerij door nieuwe foto's te uploaden naar Cloudinary.
        </p>

        <button
          onClick={openWidget}
          disabled={!isLoaded}
          className={`w-full flex items-center justify-center gap-4 px-8 py-6 bg-kyokushin-red text-white font-black uppercase tracking-widest transition-all transform hover:-translate-y-1 shadow-lg ${!isLoaded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
        >
          <UploadIcon className="w-8 h-8" />
          {isLoaded ? 'Open Upload Widget' : 'Laden...'}
        </button>

        {status === 'success' && (
          <div className="mt-8 flex items-center justify-center gap-3 text-green-600 font-bold uppercase tracking-widest animate-bounce">
            <CheckCircle className="w-6 h-6" />
            Upload Geslaagd!
          </div>
        )}

        {status === 'error' && (
          <div className="mt-8 flex items-center justify-center gap-3 text-kyokushin-red font-bold uppercase tracking-widest">
            <AlertCircle className="w-6 h-6" />
            Upload Mislukt
          </div>
        )}

        <div className="mt-12 pt-8 border-t-4 border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-widest">
          Cloudinary CMS Integration
        </div>
      </div>
    </main>
  );
}
