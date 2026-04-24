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
my-mern-app/
├── server/                   # Backend (Node/Express)
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # Logic for each route (authController.js)
│   ├── middleware/           # Auth guards, error handlers
│   ├── models/               # Mongoose schemas (User.js, Product.js)
│   ├── routes/               # API endpoint definitions (userRoutes.js)
│   ├── utils/                # Helper functions (generateToken.js)
│   ├── .env                  # Environment variables (GIT IGNORE THIS)
│   ├── package.json          # Backend dependencies
│   └── server.js             # Entry point
│
├── client/                   # Frontend (React/Vite)
│   ├── public/               # Static files (favicon, etc.)
│   ├── src/
│   │   ├── assets/           # Images, global styles
│   │   ├── components/       # Reusable UI (Navbar, Footer, Card)
│   │   ├── context/          # State management (AuthContext.js)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page-level components (Home.jsx, Login.jsx)
│   │   ├── services/         # API call logic (api.js or axios instance)
│   │   ├── App.jsx           # Main routing and layout
│   │   └── main.jsx          # React DOM render entry
│   ├── .env                  # Frontend env vars (VITE_API_URL)
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
└── .gitignore                # Root gitignore to catch node_modules/ & .env
```
