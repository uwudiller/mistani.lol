# Environment Variables - Where to Get Each Value

This guide shows you exactly where to find and copy each environment variable value for mistani.lol.

## Quick Copy-Paste Values

### Already Provided:
- `KOFI_WEBHOOK_SECRET`: `dfd5ffd6-3c5c-478e-ab6b-183c99756216`
- `KOFI_USERNAME`: `mistlol`

### API URLs (Copy these):
- `JIKAN_API_BASE_URL`: `https://api.jikan.moe/v4`
- `ANILIST_API_BASE_URL`: `https://graphql.anilist.co`

---

## Step-by-Step Guide for Each Variable

### 1. Database Variables (Neon Database)

#### Step 1: Create Neon Database
1. Go to [Neon Console](https://console.neon.tech)
2. Click **Sign Up** (or **Sign In** if you have an account)
3. Complete the signup process
4. Click **Create a project**
5. Project name: `mistani-db`
6. Choose your region (closest to your users)
7. PostgreSQL version: 15 (default)
8. Click **Create Project**

#### Step 2: Get Connection Strings
After creation, you'll see your project dashboard. Copy these:

```
POSTGRES_PRISMA_URL: postgresql://[username]:[password]@[host]/[dbname]?sslmode=require
POSTGRES_URL_NON_POOLING: postgresql://[username]:[password]@[host]/[dbname]?sslmode=require
```

**Where to find:**
- In your Neon project dashboard
- Click **Connection Details** tab
- Copy the **Connection string** (both are the same for Neon)
- The URL looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`

---

### 2. Authentication Variables

#### NEXTAUTH_SECRET
**Method 1: Generate with OpenSSL (Recommended)**
```bash
# Open terminal/command prompt
openssl rand -base64 32
```
**Copy the output** - it will look like: `aBcDeFgHiJkLmNoPqRsTuVwXyZ123456+7890/`

**Method 2: Online Generator**
1. Go to [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
2. Copy the generated secret

#### NEXTAUTH_URL
**Before deployment:** `http://localhost:3000`
**After deployment:** `https://your-domain.vercel.app`

**Where to get:**
- Your Vercel project URL after deployment
- Or your custom domain if you set one up

---

### 3. API Variables (Already Provided - Just Copy)

#### JIKAN_API_BASE_URL
```
https://api.jikan.moe/v4
```
**Source:** Jikan API documentation - this is the official endpoint

#### ANILIST_API_BASE_URL
```
https://graphql.anilist.co
```
**Source:** AniList API documentation - this is the official GraphQL endpoint

---

### 4. Ko-fi Variables (Already Provided)

#### KOFI_WEBHOOK_SECRET
```
dfd5ffd6-3c5c-478e-ab6b-183c99756216
```
**Source:** You provided this verification token

#### KOFI_USERNAME
```
mistlol
```
**Source:** Your Ko-fi page URL: https://ko-fi.com/mistlol

---

### 5. Email Variables (Optional - For Password Reset)

#### Step 1: Set up Resend Account
1. Go to [Resend Dashboard](https://resend.com)
2. Click **Sign Up** (or **Sign In** if you have an account)
3. Verify your email address
4. Complete the onboarding process

#### Step 2: Get API Key
1. In Resend dashboard, click **API Keys**
2. Click **Create API Key**
3. Give it a name: `mistani.lol`
4. Click **Create**
5. **Copy the API key** (it starts with `re_`)

#### Step 3: Get Email Settings
```
RESEND_API_KEY="re_[your-api-key-here]"
FROM_EMAIL="noreply@your-domain.vercel.app"
FROM_NAME="mistani.lol"
```

#### Step 4: Verify Your Domain (Optional but Recommended)
1. In Resend dashboard, click **Domains**
2. Add your domain: `your-domain.vercel.app`
3. Follow the DNS instructions (usually just adding a TXT record)
4. This improves email deliverability

---

## Complete Environment Variables Template

Copy this and replace the bracketed values:

```env
# Database (get from Neon Database)
POSTGRES_PRISMA_URL="postgresql://[username]:[password]@[host]/[dbname]?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://[username]:[password]@[host]/[dbname]?sslmode=require"

# Authentication (generate secret, use your domain)
NEXTAUTH_SECRET="[your-32-character-secret]"
NEXTAUTH_URL="https://your-domain.vercel.app"

# APIs (copy these exactly)
JIKAN_API_BASE_URL="https://api.jikan.moe/v4"
ANILIST_API_BASE_URL="https://graphql.anilist.co"

# Ko-fi (copy these exactly)
KOFI_WEBHOOK_SECRET="dfd5ffd6-3c5c-478e-ab6b-183c99756216"
KOFI_USERNAME="mistlol"

# Email (optional - get from Resend)
RESEND_API_KEY="re_[your-api-key-here]"
FROM_EMAIL="noreply@your-domain.vercel.app"
FROM_NAME="mistani.lol"
```

---

## Visual Guide - Where to Click

### Neon Database Setup
1. **Neon Console** 
   ```
   console.neon.tech > Create Project > mistani-db
   ```

2. **Database Details**
   ```
   Look for: "Connection Details" tab
   Copy: Connection string (both URLs are the same)
   ```

### Vercel Environment Variables Setup
1. **Project Settings**
   ```
   Your Project > Settings > Environment Variables
   ```

2. **Add Variables**
   ```
   Click "Add New" for each variable
   Set Environment: Production, Preview, Development
   Click "Save"
   ```

### Gmail App Password Setup
1. **Google Account**
   ```
   myaccount.google.com > Security > 2-Step Verification > App Passwords
   ```

2. **Generate Password**
   ```
   Select: Mail > Other (Custom name) > mistani.lol > Generate
   Copy the 16-character password
   ```

---

## Quick Setup Checklist

### Must-Have Variables (Required for basic functionality)
- [ ] `POSTGRES_PRISMA_URL` (from Neon Database)
- [ ] `POSTGRES_URL_NON_POOLING` (from Neon Database)
- [ ] `NEXTAUTH_SECRET` (generate with OpenSSL)
- [ ] `NEXTAUTH_URL` (your Vercel domain)
- [ ] `JIKAN_API_BASE_URL` (copy: `https://api.jikan.moe/v4`)
- [ ] `ANILIST_API_BASE_URL` (copy: `https://graphql.anilist.co`)
- [ ] `KOFI_WEBHOOK_SECRET` (copy: `dfd5ffd6-3c5c-478e-ab6b-183c99756216`)
- [ ] `KOFI_USERNAME` (copy: `mistlol`)

### Optional Variables (For email features)
- [ ] `RESEND_API_KEY` (from Resend dashboard, starts with `re_`)
- [ ] `FROM_EMAIL` (your Vercel domain: `noreply@your-domain.vercel.app`)
- [ ] `FROM_NAME` (copy: `mistani.lol`)

---

## Testing Your Variables

### 1. Database Connection Test
```bash
# Test locally first
npm run dev
# If it starts without database errors, your DB variables work
```

### 2. Authentication Test
```bash
# Try to create an account
# If it works, NEXTAUTH_SECRET and URL are correct
```

### 3. API Test
```bash
# Try searching for anime
# If it works, API variables are correct
```

### 4. Premium Test
```bash
# Visit /premium page
# Click Ko-fi link
# If it goes to https://ko-fi.com/mistlol, Ko-fi variables work
```

---

## Common Issues and Solutions

### Issue: "Database connection failed"
**Solution:** Double-check your POSTGRES URLs - make sure you copied the exact strings from Neon and they use `postgresql://` not `postgres://`

### Issue: "NEXTAUTH_SECRET not set"
**Solution:** Generate a new secret with `openssl rand -base64 32` and ensure it's exactly 32+ characters

### Issue: "Email not working"
**Solution:** Verify your Resend API key is correct and your domain is verified in Resend dashboard

### Issue: "Ko-fi webhook not working"
**Solution:** Verify the webhook URL in Ko-fi matches your deployed domain exactly

---

## Final Verification

Before deploying, verify you have:

1. **Database URLs** from Vercel Postgres dashboard
2. **NEXTAUTH_SECRET** generated with OpenSSL
3. **NEXTAUTH_URL** set to your Vercel domain
4. **API URLs** copied exactly as shown
5. **Ko-fi variables** copied exactly as provided
6. **Email variables** (if using email features)

Once all variables are set in Vercel, your mistani.lol platform should work perfectly with premium features, user authentication, and all the functionality we built!
