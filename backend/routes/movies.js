import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch movies' });
  }
});

router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create movie' });
  }
});

export default router;
