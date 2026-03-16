# Norheimsposten MERN

A basic MERN stack starter with:

- React + Vite frontend
- Node.js + Express backend
- MongoDB connection via Mongoose

## Tech Stack

- React 18
- Vite
- Node.js
- Express.js
- MongoDB
- Mongoose

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Start client and server together:

```bash
npm run dev
```

Frontend runs on http://localhost:5173 and backend runs on http://localhost:5000.

## Available Scripts

- npm run dev: start backend and frontend concurrently
- npm run dev:client: start only the React frontend
- npm run dev:server: start only the Express backend with nodemon
- npm run start: start backend in production mode
- npm run build: build frontend for production
- npm run preview: preview frontend production build

## Environment Variables

Use .env with the following keys:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/norheimsposten
```

## API Endpoint

- GET /api/health

Returns a small JSON payload to verify backend availability.

## Project Structure

```text
src/
	App.jsx
	main.jsx
server/
	config/
		db.js
	routes/
		healthRoute.js
	server.js
```
