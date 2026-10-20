# Afro Reel

Afro Reel is a local-first movie and series discovery app with title, cast/actor, and genre search. It includes a small demonstration catalog, responsive discovery UI, and configurable ad placements. The starter catalog is for discovery only: it does not provide movie files or third-party streams.

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend works without MongoDB or the backend; when the optional catalog API is unavailable, it uses the built-in demonstration metadata.

To run the optional API in another terminal:

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Set MONGODB_URI in backend/.env to your own MongoDB connection string.
npm start
```

The API serves only records explicitly marked `rightsVerified: true`, and only returns catalog metadata. Its routes are read-only: video upload and media download endpoints are not provided. Add records directly through a trusted database workflow only after confirming you have distribution rights for the title and territory. Older records default to unverified and are not returned.

## Authorized playback

This project is a discovery demo and intentionally has no playback source configured. Before enabling a title, confirm you have the right to distribute it in each audience territory. Use a licensed streaming provider or your own authorized delivery service and implement its access controls; do not add unverified streams or public file links. Browser player controls can hide a download button but cannot technically prevent viewers from capturing content delivered to their device. This demo avoids that issue by not delivering video at all.

The `movies` API is intentionally metadata-only. Do not add raw video uploads, `streamUrl` values, or download routes to it. A production player must use a rights-cleared provider integration and suitable authentication/access controls.

## Advertising

Ad placements are placeholders until configured. To use Google AdSense, create and configure your own publisher account and provide:

- `VITE_ADSENSE_CLIENT` — your AdSense publisher client ID
- `VITE_ADSENSE_SLOT` — your approved ad unit slot ID

Set these in the frontend environment before building/deploying. No publisher ID or ad credentials are included. Review the ad provider's policies, consent requirements, and privacy disclosures before serving ads. Ad earnings are not guaranteed.

## Deploy

The frontend can be built and hosted as a static site:

```powershell
cd frontend
npm run build
```

Netlify uses the settings in `netlify.toml`. If deploying the optional API separately, configure `MONGODB_URI` in the host's secret environment settings and use HTTPS. Never commit real credentials.
