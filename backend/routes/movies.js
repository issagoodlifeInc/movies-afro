import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import Movie from '../models/Movie.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();
const unlinkAsync = promisify(fs.unlink);

// Configure UpCloud S3 client
const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.UPCLOUD_ENDPOINT,
  credentials: {
    accessKeyId: process.env.UPCLOUD_ACCESS_KEY,
    secretAccessKey: process.env.UPCLOUD_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Configure multer for disk storage (needed for ffmpeg)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
});

// Helper function to extract thumbnail from video
const extractThumbnail = (videoPath) => {
  return new Promise((resolve, reject) => {
    const thumbnailPath = `${videoPath}-thumbnail.png`;
    
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['5%'], // Take screenshot at 5% of video duration
        filename: path.basename(thumbnailPath),
        folder: path.dirname(thumbnailPath),
        size: '1280x720'
      })
      .on('end', () => resolve(thumbnailPath))
      .on('error', (err) => reject(err));
  });
};

// Helper function to upload file to UpCloud
const uploadToUpCloud = async (filePath, key, contentType) => {
  const fileBuffer = fs.readFileSync(filePath);
  
  const uploadParams = {
    Bucket: process.env.UPCLOUD_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);
  
  return `${process.env.UPCLOUD_ENDPOINT}/${process.env.UPCLOUD_BUCKET_NAME}/${key}`;
};

// GET all movies (public route)
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch movies' });
  }
});

// POST new movie (ADMIN ONLY - with auto-thumbnail)
router.post('/', adminAuth, upload.single('video'), async (req, res) => {
  let videoPath = null;
  let thumbnailPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const { title, description, genre, releaseYear } = req.body;
    videoPath = req.file.path;

    console.log('Extracting thumbnail from video...');
    
    // Extract thumbnail from video
    thumbnailPath = await extractThumbnail(videoPath);
    
    console.log('Uploading video to UpCloud...');
    
    // Upload video to UpCloud
    const videoFilename = `${uuidv4()}.${req.file.originalname.split('.').pop()}`;
    const streamUrl = await uploadToUpCloud(
      videoPath,
      `videos/${videoFilename}`,
      req.file.mimetype
    );

    console.log('Uploading thumbnail to UpCloud...');
    
    // Upload thumbnail to UpCloud
    const thumbnailFilename = `${uuidv4()}.png`;
    const thumbnailUrl = await uploadToUpCloud(
      thumbnailPath,
      `thumbnails/${thumbnailFilename}`,
      'image/png'
    );

    // Create movie document
    const movie = new Movie({
      title,
      description,
      thumbnailUrl, // Auto-generated thumbnail
      streamUrl,
      genre,
      releaseYear: parseInt(releaseYear),
    });

    await movie.save();
    
    // Clean up local files
    await unlinkAsync(videoPath);
    await unlinkAsync(thumbnailPath);

    res.status(201).json(movie);
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up files if upload failed
    if (videoPath && fs.existsSync(videoPath)) {
      await unlinkAsync(videoPath);
    }
    if (thumbnailPath && fs.existsSync(thumbnailPath)) {
      await unlinkAsync(thumbnailPath);
    }
    
    res.status(500).json({ error: 'Unable to upload movie: ' + error.message });
  }
});

export default router;