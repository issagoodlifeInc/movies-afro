import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: String,
  releaseYear: Number,
  cast: { type: [String], default: [] },
  type: { type: String, enum: ['Movie', 'Series'], default: 'Movie' },
  duration: String,
  rightsVerified: { type: Boolean, default: false, select: false },
  createdAt: { type: Date, default: Date.now },
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
