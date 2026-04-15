# Movie Streaming Site

Starter workspace for a movie streaming site using:

- Frontend: React + Vite deployed on Netlify
- Backend: Node.js + Express deployed on Render
- Database: MongoDB Atlas for movie metadata

## Folder structure

- `frontend/` — static React app built and deployed by Netlify
- `backend/` — Express API deployed on Render

## Local development

### Frontend
```bash
cd movie001/frontend
npm install
npm run dev
```

### Backend
```bash
cd movie001/backend
npm install
npm start
```

## Deployment

### Netlify
- Connect your repo to Netlify
- Set the build root to `movie001/frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- (Optional) Add `VITE_API_BASE_URL` if your backend is deployed on Render or another host

### Render
- Create a new Web Service
- Connect the same GitHub repo
- Set the root directory to `movie001/backend`
- Start command: `npm start`
- Add environment variable: `MONGODB_URI`
- Make sure Render has access to the same MongoDB Atlas cluster via network/firewall settings

## Video Upload Setup (UpCloud Object Storage)

This app supports video file uploads to UpCloud Object Storage.

### Prerequisites
1. Create an UpCloud account
2. Set up Object Storage in your UpCloud dashboard
3. Create a bucket and note down your credentials

### Backend Configuration
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your UpCloud credentials:
   ```
   UPCLOUD_ACCESS_KEY="your_access_key"
   UPCLOUD_SECRET_KEY="your_secret_key"
   UPCLOUD_BUCKET_NAME="your_bucket_name"
   UPCLOUD_ENDPOINT="https://your-bucket-name.s3.upcloudobjects.com"
   ```
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

### Frontend Configuration
The frontend is already configured to proxy API requests to the backend during development.

### Usage
1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to `/movies` and use the upload form to add videos
4. Videos are automatically uploaded to UpCloud and streamed from there

### File Limits
- Maximum file size: 500MB
- Supported formats: All video formats (mp4, avi, mkv, etc.)
- Files are stored publicly accessible in UpCloud Object Storage

If you have already accidentally committed a real `.env`, remove it from git history and then add a safe example file like `backend/.env.example`.

## Uploading movies

The backend exposes a simple JSON API at `/movies`:

- `GET /movies` — fetch all movie records
- `POST /movies` — create a new movie record

### Example movie payload

```bash
curl -X POST http://localhost:4000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Example Movie",
    "description": "A sample movie description.",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "streamUrl": "https://example.com/video.mp4",
    "genre": "Drama",
    "releaseYear": 2026
  }'
```

### Backend schema fields

- `title` — required
- `description` — required
- `thumbnailUrl` — required
- `streamUrl` — required
- `genre` — optional
- `releaseYear` — optional

### Notes

- This repo currently stores movie metadata only.
- If you want to upload actual video files, use a storage service like Amazon S3, Cloudinary, or a dedicated streaming host, and store the resulting file URLs in `streamUrl`.

## Frontend / API connection

If your backend is deployed on Render, point the frontend to it with `VITE_API_BASE_URL`.

Example `.env` for the frontend (not committed):

```env
VITE_API_BASE_URL="https://your-backend-service.onrender.com"
```

Then your frontend can use that value to fetch movies from the deployed backend.
