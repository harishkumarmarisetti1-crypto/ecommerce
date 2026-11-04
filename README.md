# ReMarket Ecommerce App

A responsive ecommerce storefront with React, Tailwind CSS, an Express API, and MongoDB authentication.

## Authentication

- Sign-up and login are stored in MongoDB.
- Passwords are hashed with bcrypt and never returned by the API.
- Successful authentication creates a signed JWT session.
- The frontend keeps the session in `localStorage` only when “Keep me signed in” is selected; otherwise it uses `sessionStorage`.
- Unknown login emails are sent to sign-up, while duplicate sign-ups are sent to login.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`. Keep the local MongoDB URL or replace it with a MongoDB Atlas connection string, and replace `JWT_SECRET` with a long random value.

3. Ensure MongoDB is running, then start the React app and API together:

   ```bash
   npm run dev:full
   ```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:5000`.

## Other commands

```bash
npm run dev          # frontend only
npm run server:dev   # backend only, with reload
npm run build        # production frontend build
npm run lint         # lint frontend and backend
```

For production, set `CLIENT_ORIGIN` to the frontend URL and optionally set `VITE_API_URL` to the public API URL before building the frontend.
