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

### Render
- Create a new Web Service
- Connect the same GitHub repo
- Set the root to `movie001/backend`
- Start command: `npm start`
- Add environment variable: `MONGODB_URI`

## Environment variables

- `MONGODB_URI` — MongoDB Atlas connection string
- `VITE_API_BASE_URL` — optional frontend API URL for Netlify
