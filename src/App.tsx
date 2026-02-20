import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Lessen from './pages/Lessen';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Upload from './pages/Upload';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessen" element={<Lessen />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/upload" element={<Upload />} />
          {/* Fallback for legacy .html paths */}
          <Route path="/lessen.html" element={<Lessen />} />
          <Route path="/gallery.html" element={<Gallery />} />
          <Route path="/contact.html" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
