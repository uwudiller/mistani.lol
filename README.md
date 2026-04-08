# mistani.lol - Anime Streaming Platform

A modern anime streaming platform built with Next.js, optimized for Vercel deployment. Features user authentication, watch history tracking, and a Netflix-style interface.

## Features

- **User Authentication**: Sign up, login, and secure session management
- **Anime Search & Browse**: Search anime by name with instant results
- **Watch History**: Track viewing progress and resume from where you left off
- **Continue Watching**: Auto-resume playback from last timestamp
- **Responsive Design**: Mobile-first dark theme with smooth animations
- **Video Player**: Custom player with progress tracking and episode navigation

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Vercel Postgres
- **Authentication**: NextAuth.js with credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **Anime Data**: Jikan API (MyAnimeList unofficial)

## Quick Start

### Prerequisites

- Node.js 18+ 
- Vercel account
- PostgreSQL database (Vercel Postgres recommended)

### 1. Clone and Install

```bash
git clone <repository-url>
cd anime-website
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp env-example.txt .env.local
```

Fill in your environment variables:

```env
# Database
POSTGRES_PRISMA_URL="postgresql://username:password@hostname:5432/database?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://username:password@hostname:5432/database?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Anime APIs
JIKAN_API_BASE_URL="https://api.jikan.moe/v4"
ANILIST_API_BASE_URL="https://graphql.anilist.co"
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Vercel Deployment

### 1. Deploy Database

1. Go to your Vercel dashboard
2. Click "Storage" > "Create Database"
3. Select "Postgres" and follow the setup
4. Copy the connection strings to your Vercel environment variables

### 2. Environment Variables

Set these in your Vercel project settings:

- `POSTGRES_PRISMA_URL`: Your Prisma connection string
- `POSTGRES_URL_NON_POOLING`: Direct connection string
- `NEXTAUTH_SECRET`: Generate a random secret (32+ chars)
- `NEXTAUTH_URL`: Your deployed URL
- `JIKAN_API_BASE_URL`: `https://api.jikan.moe/v4`
- `ANILIST_API_BASE_URL`: `https://graphql.anilist.co`

### 3. Deploy to Vercel

```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Database Schema

The application uses the following main tables:

- **users**: User accounts with email/password
- **anime**: Anime metadata from external APIs
- **watch_history**: User viewing progress tracking
- **favorites**: User favorite anime list
- **sessions**: Authentication sessions

## API Routes

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/[...nextauth]` - NextAuth.js handler

### Anime
- `GET /api/anime/search?q=query` - Search anime
- `GET /api/anime/trending` - Get trending anime
- `GET /api/anime/[id]` - Get anime details

### Watch History
- `POST /api/watch/progress` - Update viewing progress
- `GET /api/watch/history` - Get user watch history
- `GET /api/watch/continue` - Get continue watching list

## Project Structure

```
src/
app/
  api/                 # API routes
  auth/               # Authentication pages
  anime/[id]/         # Anime detail pages
  watch/[id]/         # Video player pages
  search/             # Search results
  globals.css         # Global styles
  layout.tsx          # Root layout
  page.tsx            # Dashboard
lib/
  anime.ts            # Anime API utilities
  auth.ts             # NextAuth configuration
  db.ts               # Prisma client
prisma/
  schema.prisma       # Database schema
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints for troubleshooting
