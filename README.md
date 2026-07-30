# AI Quest

AI Quest is a 2D grid based RPG built as the final project for the Full Stack course. Players explore a small kingdom, talk to NPCs powered by OpenAI, collect items, and fight enemies in turn based combat. The project is a full stack application with a React frontend and an Express/PostgreSQL backend.

## Features

- Grid based overworld with layered rendering (ground, objects, player)
- Multiple explorable maps: the kingdom, forest, deep forest, and player/village houses
- NPCs with AI generated dialogue, personality, and quest context via the OpenAI API
- Turn based combat system with enemy and player sprites
- Inventory and quest progress tracking
- User authentication with JWT
- Player profiles and game sessions persisted in PostgreSQL

## Tech Stack

**Frontend**
- React 19
- Vite
- React Router
- Mantine (core, form, hooks)

**Backend**
- Node.js with Express 5
- PostgreSQL with Sequelize ORM
- JSON Web Tokens for authentication
- bcrypt for password hashing
- OpenAI API for NPC dialogue generation
- Cloudinary for media handling

**Deployment**
- Configured for Render via `render.yaml`

## Project Structure

```
ai-quest/
  frontend/          React + Vite client
    src/
      components/    UI and game components (Player, Combat, DialogueModal, Tile, etc.)
      pages/          Route level pages (Menu, Auth, Game)
      context/        React context providers (Auth, Quest, Inventory)
      services/       API client and service calls
      maps/           Map data definitions
      assets/         Sprites and images
      utils/          Helpers and constants
  backend/            Express API server
    controllers/      Route handlers (auth, game, NPC dialogue)
    routes/           Express routers
    services/         External integrations (OpenAI client)
    middleware/        Auth and logging middleware
    db/
      config/          Sequelize configuration
      models/          Sequelize models
      migrations/      Database migrations
      seeders/         Seed data
    server.js          Application entry point
  render.yaml         Render deployment configuration
```

## Prerequisites

- Node.js (LTS recommended)
- npm
- PostgreSQL database
- An OpenAI API key

## Setup

1. Clone the repository and install dependencies for the root, frontend, and backend:

   ```
   npm install
   npm install --prefix frontend
   npm install --prefix backend
   ```

2. Create a `.env` file inside `backend/` with the following variables:

   ```
   DB_HOST=localhost
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=ai_quest_dev
   DB_DATABASE_TEST=postgres_test
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

3. Create and migrate the database:

   ```
   cd backend
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

## Running the App

From the project root, run both the frontend and backend together:

```
npm run dev
```

This starts the Express backend and the Vite dev server concurrently.

To run them separately:

```
npm run backend
npm run frontend
```

The frontend dev server runs through Vite (default `http://localhost:5173`), and the backend runs on port `3000`. In production, the backend also serves the built frontend from `frontend/dist`.

## Building for Production

```
npm run build --prefix frontend
```

The build output is served as static files by the Express server.

## License

ISC
