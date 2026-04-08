# Complete Vercel Setup Guide for mistani.lol

This guide will walk you through setting up mistani.lol on Vercel with all necessary environment variables and configurations.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Vercel Account Setup](#vercel-account-setup)
3. [Database Setup (Vercel Postgres)](#database-setup-vercel-postgres)
4. [Environment Variables Configuration](#environment-variables-configuration)
5. [Deploy to Vercel](#deploy-to-vercel)
6. [Post-Deployment Setup](#post-deployment-setup)
7. [Testing Everything](#testing-everything)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- **Vercel Account**: [Sign up at vercel.com](https://vercel.com)
- **GitHub Account**: [Sign up at github.com](https://github.com)
- **Ko-fi Account**: [Set up at ko-fi.com/mistlol](https://ko-fi.com/mistlol)

### Required Tools
- **Git**: Install on your local machine
- **Node.js**: Version 18 or higher
- **Code Editor**: VS Code recommended

---

## Vercel Account Setup

### 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (recommended)
4. Authorize Vercel to access your GitHub account
5. Choose the free plan (Hobby)

### 2. Connect GitHub Repository
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - mistani.lol anime platform"
   git branch -M main
   git remote add origin https://github.com/yourusername/mistani.lol.git
   git push -u origin main
   ```

2. In Vercel dashboard:
   - Click "New Project"
   - Import your GitHub repository
   - Select the `mistani.lol` repository

---

## Database Setup (Vercel Postgres)

### 1. Create Vercel Postgres Database
1. In Vercel dashboard, click **Storage** in the sidebar
2. Click **Create Database**
3. Select **Postgres**
4. Choose your region (closest to your users)
5. Database name: `mistani-db`
6. Click **Create Database**

### 2. Get Database Connection Strings
After creation, you'll see your database details. Copy these:

**Connection Strings:**
```
POSTGRES_PRISMA_URL=postgres://default:[password]@[host]:[port]/[database]?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://default:[password]@[host]:[port]/[database]?sslmode=require
```

**Save these somewhere secure - you'll need them for environment variables.**

---

## Environment Variables Configuration

### 1. Go to Project Settings
1. In your Vercel project, click **Settings**
2. Click **Environment Variables**
3. Add each variable below

### 2. Add All Environment Variables

#### Database Variables
```
Variable Name: POSTGRES_PRISMA_URL
Value: postgres://default:[password]@[host]:[port]/[database]?sslmode=require
Environment: Production, Preview, Development

Variable Name: POSTGRES_URL_NON_POOLING
Value: postgres://default:[password]@[host]:[port]/[database]?sslmode=require
Environment: Production, Preview, Development
```

#### Authentication Variables
```
Variable Name: NEXTAUTH_SECRET
Value: [Generate a random 32+ character string]
Environment: Production, Preview, Development

Variable Name: NEXTAUTH_URL
Value: https://your-domain.vercel.app
Environment: Production, Preview, Development
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### Anime API Variables
```
Variable Name: JIKAN_API_BASE_URL
Value: https://api.jikan.moe/v4
Environment: Production, Preview, Development

Variable Name: ANILIST_API_BASE_URL
Value: https://graphql.anilist.co
Environment: Production, Preview, Development
```

#### Ko-fi Integration Variables
```
Variable Name: KOFI_WEBHOOK_SECRET
Value: dfd5ffd6-3c5c-478e-ab6b-183c99756216
Environment: Production, Preview, Development

Variable Name: KOFI_USERNAME
Value: mistlol
Environment: Production, Preview, Development
```

#### Email Variables (Optional - for password reset)
```
Variable Name: SMTP_HOST
Value: smtp.gmail.com
Environment: Production, Preview, Development

Variable Name: SMTP_PORT
Value: 587
Environment: Production, Preview, Development

Variable Name: SMTP_USER
Value: your-email@gmail.com
Environment: Production, Preview, Development

Variable Name: SMTP_PASS
Value: your-app-password
Environment: Production, Preview, Development

Variable Name: FROM_EMAIL
Value: noreply@mistani.lol
Environment: Production, Preview, Development
```

### 3. Save Environment Variables
1. Click **Save** after adding each variable
2. Wait for Vercel to process the changes

---

## Deploy to Vercel

### 1. Configure Build Settings
1. In your project, go to **Settings** > **Build & Development Settings**
2. Verify these settings:
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2. Trigger Deployment
1. Go to your project dashboard
2. Click **Deployments**
3. Click **Redeploy** or push a new commit to trigger deployment

### 3. Monitor Deployment
Watch the deployment logs for any errors:
- Database connection issues
- Missing environment variables
- Build errors

---

## Post-Deployment Setup

### 1. Initialize Database Schema
After successful deployment, you need to create the database tables:

#### Option A: Through Vercel Postgres UI
1. Go to **Storage** > your database
2. Click **Query**
3. Run this command:
   ```sql
   -- Tables will be created automatically on first API call
   -- You can verify by running: SELECT * FROM users;
   ```

#### Option B: Through API (Recommended)
1. Visit your deployed site
2. Create a test account
3. Tables will be created automatically

### 2. Configure Ko-fi Webhook
1. Log in to your Ko-fi account
2. Go to **Settings** > **Webhooks**
3. Add webhook URL: `https://your-domain.vercel.app/api/webhooks/kofi`
4. Set webhook secret: `dfd5ffd6-3c5c-478e-ab6b-183c99756216`
5. Enable webhook notifications

### 3. Set Custom Domain (Optional)
1. In Vercel project, go to **Settings** > **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

---

## Testing Everything

### 1. Basic Functionality Test
- [ ] Visit your site: `https://your-domain.vercel.app`
- [ ] Create a test account
- [ ] Sign in and sign out
- [ ] Search for anime
- [ ] Browse trending anime

### 2. Premium System Test
- [ ] Visit `/premium` page
- [ ] Click Ko-fi donation link
- [ ] Make a test donation ($5 minimum)
- [ ] Check if premium activates automatically

### 3. Database Test
- [ ] Check if user data is saved
- [ ] Test watch history tracking
- [ ] Verify premium status updates

### 4. Webhook Test
1. After donating, check Vercel function logs:
   - Go to **Functions** tab
   - Look for `/api/webhooks/kofi` logs
   - Verify successful webhook processing

---

## Complete Environment Variables Checklist

Copy this checklist and verify each variable is set:

### Database
- [ ] `POSTGRES_PRISMA_URL`
- [ ] `POSTGRES_URL_NON_POOLING`

### Authentication
- [ ] `NEXTAUTH_SECRET` (32+ random characters)
- [ ] `NEXTAUTH_URL` (your deployed URL)

### APIs
- [ ] `JIKAN_API_BASE_URL`
- [ ] `ANILIST_API_BASE_URL`

### Ko-fi
- [ ] `KOFI_WEBHOOK_SECRET` = `dfd5ffd6-3c5c-478e-ab6b-183c99756216`
- [ ] `KOFI_USERNAME` = `mistlol`

### Email (Optional)
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`
- [ ] `FROM_EMAIL`

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Errors
**Error**: `Can't reach database server`
**Solution**:
- Verify `POSTGRES_PRISMA_URL` is correct
- Check if database is created in Vercel
- Ensure SSL is enabled in connection string

#### 2. Build Failures
**Error**: `PrismaClient is not initialized`
**Solution**:
- Check if `POSTGRES_PRISMA_URL` is set
- Run `npx prisma generate` locally
- Redeploy after fixing environment variables

#### 3. Authentication Issues
**Error**: `NEXTAUTH_SECRET not set`
**Solution**:
- Generate a new secret: `openssl rand -base64 32`
- Add to environment variables
- Redeploy the application

#### 4. Premium Not Activating
**Error**: Donation doesn't activate premium
**Solution**:
- Check Ko-fi webhook URL is correct
- Verify webhook secret matches
- Check Vercel function logs for webhook errors
- Ensure user email matches donation email

#### 5. Slow Loading
**Issue**: Site loads slowly
**Solution**:
- Check if user is premium (free users have delays)
- Verify database connection is fast
- Check Vercel region settings

#### 6. CORS Errors
**Error**: API calls blocked by CORS
**Solution**:
- Check if API routes are properly configured
- Verify environment variables are set for all environments

### Debugging Tools

#### Vercel Logs
1. Go to your project dashboard
2. Click **Logs** tab
3. Filter by function or time period
4. Look for error messages

#### Database Query
1. Go to **Storage** > your database
2. Click **Query**
3. Run SQL queries to debug data

#### Local Testing
1. Set up local environment variables
2. Run `npm run dev`
3. Test functionality locally

---

## Production Optimization

### 1. Enable Analytics
- Go to **Analytics** tab in Vercel
- Enable Vercel Analytics
- Monitor performance and usage

### 2. Set Up Monitoring
- Configure error tracking
- Monitor database usage
- Set up alerts for high traffic

### 3. Custom Domain Setup
- Add custom domain for branding
- Set up SSL certificate (automatic with Vercel)
- Update all environment variables with new domain

### 4. Backup Strategy
- Vercel Postgres includes automatic backups
- Set up regular export of user data
- Monitor database storage limits

---

## Security Considerations

### 1. Environment Variables Security
- Never commit secrets to Git
- Use Vercel's encrypted environment variables
- Rotate secrets periodically

### 2. Database Security
- Use connection pooling
- Enable SSL for all connections
- Monitor for unusual activity

### 3. API Security
- Rate limiting is implemented
- Webhook verification is enabled
- User authentication is required for sensitive operations

---

## Final Checklist Before Going Live

- [ ] All environment variables are set
- [ ] Database is created and accessible
- [ ] Ko-fi webhook is configured
- [ ] Test user registration and login
- [ ] Test premium activation with real donation
- [ ] Test all major features
- [ ] Check mobile responsiveness
- [ ] Verify legal pages are accessible
- [ ] Set up custom domain (if desired)
- [ ] Enable analytics and monitoring

---

## Support and Maintenance

### Regular Tasks
- Monitor Vercel logs for errors
- Check database storage usage
- Update dependencies regularly
- Review Ko-fi donations and premium activations

### When Things Go Wrong
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connection
4. Review recent changes
5. Check Ko-fi webhook status

### Getting Help
- Check Vercel documentation
- Review this guide
- Check GitHub issues
- Contact Vercel support if needed

---

## Congratulations! 

Your mistani.lol anime streaming platform is now live on Vercel with:
- User authentication system
- Premium tier with Ko-fi integration
- Speed control for free vs premium users
- Complete legal compliance
- Database persistence
- Modern responsive design

Users can now sign up, browse anime, and upgrade to premium for faster speeds through your Ko-fi donation page at `https://ko-fi.com/mistlol`.

**Next Steps:**
- Promote your platform
- Monitor user activity
- Consider adding more features
- Scale up as needed

Good luck with your anime streaming platform!
