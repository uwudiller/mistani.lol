# Deployment Guide for mistani.lol

This guide will help you deploy mistani.lol to Vercel with all necessary configurations.

## Prerequisites

- Vercel account
- GitHub repository (optional but recommended)
- PostgreSQL database (Vercel Postgres recommended)

## Step 1: Database Setup

### Using Vercel Postgres (Recommended)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** in the sidebar
3. Click **Create Database**
4. Select **Postgres** and choose your region
5. Give your database a name (e.g., `mistani-db`)
6. Click **Create**

Once created, you'll see your database connection strings. Copy these for the next step.

### Using External PostgreSQL

If you prefer using an external PostgreSQL database, make sure you have:
- Connection string with SSL enabled
- Database name and credentials

## Step 2: Environment Variables

### In Vercel Dashboard

1. Go to your project settings in Vercel
2. Click **Environment Variables**
3. Add the following variables:

```env
POSTGRES_PRISMA_URL=your_prisma_connection_string
POSTGRES_URL_NON_POOLING=your_direct_connection_string
NEXTAUTH_SECRET=your_random_secret_32_chars
NEXTAUTH_URL=https://your-domain.vercel.app
JIKAN_API_BASE_URL=https://api.jikan.moe/v4
ANILIST_API_BASE_URL=https://graphql.anilist.co
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Step 3: Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to Vercel Dashboard
3. Click **New Project**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Configure environment variables (from Step 2)
7. Click **Deploy**

## Step 4: Database Migration

After deployment, you need to initialize your database schema:

1. Go to your Vercel project
2. Click **Storage** > your database
3. Click **Query**
4. Run this SQL to create tables (or use Prisma migrations):

```sql
-- The tables will be created automatically by Prisma when the app starts
-- You can verify by running: npx prisma db push
```

## Step 5: Verify Deployment

1. Visit your deployed URL
2. Try signing up for a new account
3. Test anime search functionality
4. Verify watch history tracking

## Common Issues & Solutions

### Database Connection Issues

**Error**: `Can't reach database server`

**Solution**: 
- Verify your connection strings are correct
- Ensure SSL is enabled
- Check if your database allows connections from Vercel

### Build Failures

**Error**: `PrismaClient is not initialized`

**Solution**:
- Run `npx prisma generate` locally before deploying
- Ensure `POSTGRES_PRISMA_URL` is set correctly

### Authentication Issues

**Error**: `NEXTAUTH_SECRET not set`

**Solution**:
- Generate a new secret with `openssl rand -base64 32`
- Add it to your Vercel environment variables
- Redeploy the application

## Production Optimizations

### Enable Caching

Add these environment variables for better performance:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Custom Domain

1. Go to project settings in Vercel
2. Click **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain

## Monitoring

Monitor your deployment with:

- **Vercel Analytics**: Built-in performance monitoring
- **Vercel Logs**: Real-time error tracking
- **Database Metrics**: Monitor query performance

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Database uses SSL connections
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] No hardcoded secrets in the codebase
- [ ] HTTPS is enforced (automatic on Vercel)

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connection
4. Review the main README.md for troubleshooting

## Estimated Costs

- **Vercel Pro**: $20/month (for enhanced features)
- **Vercel Postgres**: Starts at $20/month
- **Total**: ~$40/month for a production setup

The free tier includes:
- 100GB bandwidth/month
- 100k invocations/month
- Basic Postgres database

## Next Steps

After successful deployment:

1. Set up custom domain
2. Configure analytics
3. Set up monitoring alerts
4. Consider CDN for video streaming
5. Implement backup strategy for database

Your mistani.lol anime streaming platform is now live!
