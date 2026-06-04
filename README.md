# ComparaVision

## Overview

This repository contains two main projects:

- `HackThe6ix_BackEnd`: an Express/Supabase backend with authentication, user sync, and API endpoints.
- `HackThe6ix_FrontEnd`: a Next.js frontend application for the ComparaVision UI.

It also includes a local mock server file at `HackThe6ix_BackEnd/local-server.js` for quick local API testing.

## Repo structure

- `HackThe6ix_BackEnd/`
  - `package.json` - backend dependencies and scripts.
  - `server.js` - Express backend server using Supabase.
  - `local-server.js` - local mock API server.
  - `access-instructions.md` - Supabase environment access instructions.
  - `README-SUPABASE.md`, `README.md`, and other helper docs.
- `HackThe6ix_FrontEnd/`
  - `package.json` - Next.js frontend dependencies and scripts.
  - `src/` - frontend application sources.

## Backend setup

1. Open a terminal and go to the backend folder:

```bash
cd "HackThe6ix_BackEnd"
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `HackThe6ix_BackEnd/` with at least these values:

```env
REACT_APP_SUPABASE_URL=https://xoodnuckjmlmejeyyneg.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

4. Start the backend server:

```bash
npm run server
```

This runs `server.js` on port `3001` by default.

### Backend health checks

- `GET http://localhost:3001/health`
- `GET http://localhost:3001/api/test-connection`

## Frontend setup

1. Open a terminal and go to the frontend folder:

```bash
cd "HackThe6ix_FrontEnd"
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend app:

```bash
npm run dev
```

The Next.js app will typically be available at `http://localhost:3000`.

## Optional local mock API server

If you want to test a simple mock backend without Supabase, use `HackThe6ix_BackEnd/local-server.js`:

```bash
cd "HackThe6ix_BackEnd"
npm install express cors
node local-server.js
```

It starts on `http://localhost:8000` and exposes these endpoints:

- `GET /api`
- `GET /api/organizations`
- `GET /api/public_models`
- `GET /api/proprietary_models`
- `GET /api/comparison_results`

## Notes

- `HackThe6ix_BackEnd/server.js` uses Supabase and requires a valid `REACT_APP_SUPABASE_ANON_KEY`.
- `access-instructions.md` contains the Supabase URL and anon key guidance.
- If the frontend needs to connect to the backend, make sure the frontend fetch URLs point to the correct local host and port.

## Quick start summary

```bash
cd "HackThe6ix_BackEnd"
npm install
# add .env with Supabase values
npm run server
```

```bash
cd "HackThe6ix_FrontEnd"
npm install
npm run dev
```

Once both are running, open the frontend in your browser and verify the backend endpoints are reachable.
