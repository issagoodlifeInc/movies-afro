import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({ rightsVerified: true })
      .select('title description genre releaseYear cast type duration rightsVerified')
      .sort({ createdAt: -1 })
      .lean();
    res.json(movies);
  } catch (error) {
    console.error('Unable to fetch the verified catalog:', error);
    res.status(503).json({ error: 'The catalog is temporarily unavailable' });
  }
});

router.all('*', (req, res) => {
  res.set('Allow', 'GET');
  res.status(405).json({ error: 'The catalog is read-only; media uploads are disabled' });
});

export default router;
