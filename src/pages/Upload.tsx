import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload as UploadIcon, Lock, CheckCircle, AlertCircle, Save } from 'lucide-react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function Upload() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check for UI, server will verify properly
    if (password.length > 0) {
      setIsAuthorized(true);
    }
  };

  const openWidget = () => {
    if (!window.cloudinary) {
      alert('Cloudinary widget not loaded yet');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'camera'],
        multiple: false,
        cropping: true,
        showSkipCropButton: false,
        croppingAspectRatio: 1,
        styles: {
          palette: {
            window: '#1A1A1A',
            windowBorder: '#E31E24',
            tabIcon: '#E31E24',
            menuIcons: '#FFFFFF',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#E31E24',
            action: '#E31E24',
            inactiveTabIcon: '#8E8E8E',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#1A1A1A'
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setImageUrl(result.info.secure_url);
          setStatus('idle');
        }
      }
    );
    widget.open();
  };

  const handleSave = async () => {
    if (!imageUrl) return;
    
    setStatus('saving');
    try {
      const response = await fetch('/.netlify/functions/gallery-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, caption, password }),
      });

      if (response.ok) {
        setStatus('success');
        setImageUrl('');
        setCaption('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        const err = await response.text();
        throw new Error(err || 'Fout bij opslaan');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-kyokushin-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white p-12 border-8 border-kyokushin-red"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-kyokushin-red flex items-center justify-center text-white">
              <Lock className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-center mb-8 italic uppercase tracking-tighter">BEVEILIGDE TOEGANG</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.3em] mb-4 text-slate-400">Wachtwoord</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 border-2 border-slate-200 p-4 focus:border-kyokushin-red outline-none transition-colors font-bold text-center tracking-[0.5em]" 
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">Inloggen</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white border-4 border-kyokushin-black p-8 md:p-12 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">FOTO <span className="text-kyokushin-red">UPLOAD</span></h1>
            <button 
              onClick={() => setIsAuthorized(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-kyokushin-red transition-colors"
            >
              Uitloggen
            </button>
          </div>

          {!imageUrl ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={openWidget}
              className="w-full aspect-square border-4 border-dashed border-slate-200 hover:border-kyokushin-red hover:bg-slate-50 transition-all flex flex-col items-center justify-center group"
            >
              <div className="w-24 h-24 bg-slate-100 group-hover:bg-kyokushin-red group-hover:text-white transition-colors flex items-center justify-center mb-6">
                <UploadIcon className="w-10 h-10" />
              </div>
              <span className="text-xl font-black uppercase italic tracking-widest text-slate-400 group-hover:text-kyokushin-black transition-colors">Foto Selecteren</span>
            </motion.button>
          ) : (
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-square border-4 border-kyokushin-black overflow-hidden"
              >
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImageUrl('')}
                  className="absolute top-4 right-4 bg-kyokushin-black text-white p-2 hover:bg-kyokushin-red transition-colors"
                >
                  <AlertCircle className="w-6 h-6" />
                </button>
              </motion.div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.3em] mb-4 text-slate-400">Onderschrift (Optioneel)</label>
                <input 
                  type="text" 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Bijv. Training Leiden 2024"
                  className="w-full bg-slate-50 border-2 border-slate-200 p-4 focus:border-kyokushin-red outline-none transition-colors font-bold uppercase tracking-widest"
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={status === 'saving'}
                className="btn-primary w-full flex items-center justify-center gap-4"
              >
                {status === 'saving' ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-6 h-6" />
                )}
                <span>{status === 'saving' ? 'Opslaan...' : 'Opslaan in Galerij'}</span>
              </button>
            </div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-green-50 border-2 border-green-500 text-green-700 flex items-center gap-4"
            >
              <CheckCircle className="w-8 h-8" />
              <span className="font-black uppercase italic tracking-widest">Succesvol toegevoegd!</span>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-red-50 border-2 border-red-500 text-red-700 flex items-center gap-4"
            >
              <AlertCircle className="w-8 h-8" />
              <span className="font-black uppercase italic tracking-widest">{errorMessage || 'Er is iets misgegaan.'}</span>
            </motion.div>
          )}
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
          Kyokushin Leiden Digital Asset Management
        </p>
      </div>
    </div>
  );
}
