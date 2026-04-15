import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  streamUrl: { type: String, required: true },
  genre: String,
  releaseYear: Number,
  createdAt: { type: Date, default: Date.now },
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
