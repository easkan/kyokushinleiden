import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Lessen from './pages/Lessen';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Upload from './pages/Upload';

export default function App() {
  const location = useLocation();
  const isUploadPage = location.pathname === '/upload';

  return (
    <div className="flex flex-col min-h-screen">
      {!isUploadPage && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/lessen" element={<Lessen />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isUploadPage && <Footer />}
    </div>
  );
}
