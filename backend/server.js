import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import moviesRouter from './routes/movies.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
} else {
  console.warn('MONGODB_URI is not set; the verified catalog API will be unavailable.');
}

app.use(['/movies', '/api/movies'], moviesRouter);

app.get('/', (req, res) => {
  res.send({ status: 'Movie API is running' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
