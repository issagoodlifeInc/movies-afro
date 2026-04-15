import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import Movie from '../models/Movie.js';

const router = express.Router();

// Configure UpCloud S3 client
const s3Client = new S3Client({
  region: 'us-east-1', // UpCloud uses us-east-1
  endpoint: process.env.UPCLOUD_ENDPOINT,
  credentials: {
    accessKeyId: process.env.UPCLOUD_ACCESS_KEY,
    secretAccessKey: process.env.UPCLOUD_SECRET_KEY,
  },
  forcePathStyle: true, // Required for UpCloud
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is a video
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
});

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch movies' });
  }
});

router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const { title, description, thumbnailUrl, genre, releaseYear } = req.body;

    // Generate unique filename
    const fileExtension = req.file.originalname.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    // Upload to UpCloud Object Storage
    const uploadParams = {
      Bucket: process.env.UPCLOUD_BUCKET_NAME,
      Key: `videos/${uniqueFilename}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read', // Make the file publicly accessible
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Construct the public URL
    const streamUrl = `${process.env.UPCLOUD_ENDPOINT}/${process.env.UPCLOUD_BUCKET_NAME}/videos/${uniqueFilename}`;

    // Create movie document
    const movie = new Movie({
      title,
      description,
      thumbnailUrl,
      streamUrl,
      genre,
      releaseYear: parseInt(releaseYear),
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Unable to upload movie' });
  }
});

export default router;
