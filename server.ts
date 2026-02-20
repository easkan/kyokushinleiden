import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('database.sqlite');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/photos', (req, res) => {
    try {
      const photos = db.prepare('SELECT * FROM photos ORDER BY created_at DESC').all();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch photos' });
    }
  });

  app.post('/api/photos', (req, res) => {
    const { image, caption } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
      const info = db.prepare('INSERT INTO photos (image, caption) VALUES (?, ?)').run(image, caption);
      
      // Also update the JSON file for compatibility with existing static pages if needed
      // But it's better to just have the API.
      // For now, let's sync to JSON so the existing gallery.js works without changes if it still points to the file
      // Actually, we should update gallery.js to use the API.
      
      const allPhotos = db.prepare('SELECT image, caption FROM photos ORDER BY created_at DESC').all();
      fs.writeFileSync(path.resolve(__dirname, 'public/data/photos.json'), JSON.stringify({ items: allPhotos }, null, 2));

      res.json({ id: info.lastInsertRowid, image, caption });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save photo' });
    }
  });

  app.delete('/api/photos/:id', (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM photos WHERE id = ?').run(id);
      
      // Sync to JSON
      const allPhotos = db.prepare('SELECT image, caption FROM photos ORDER BY created_at DESC').all();
      fs.writeFileSync(path.resolve(__dirname, 'public/data/photos.json'), JSON.stringify({ items: allPhotos }, null, 2));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete photo' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
