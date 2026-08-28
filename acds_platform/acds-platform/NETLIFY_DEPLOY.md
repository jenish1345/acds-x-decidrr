# 🚀 Deploy to Netlify - Quick Guide

## Option 1: Drag & Drop (Easiest - 2 minutes)

### Step 1: Build Your Project
```bash
cd acds-platform
npm run build
```

### Step 2: Deploy
1. Go to **https://app.netlify.com/drop**
2. Drag the `dist` folder onto the page
3. Done! You'll get a URL like: `https://random-name-123.netlify.app`

---

## Option 2: Netlify CLI (Recommended - 5 minutes)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login
```bash
netlify login
```
(Opens browser to authenticate)

### Step 3: Deploy
```bash
cd acds-platform
netlify deploy --prod
```

Follow prompts:
- Create new site? **Yes**
- Team: Choose your team
- Site name: **acds-platform** (or whatever you want)
- Publish directory: **dist**

Done! You'll get your live URL!

---

## Option 3: GitHub + Netlify (Best for continuous deployment)

### Step 1: Push to GitHub
```bash
cd acds-platform
git init
git add .
git commit -m "Initial commit - ACDS Platform"
git branch -M main
git remote add origin https://github.com/jenish1345/acds-platform.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to **https://app.netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select your **acds-platform** repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

Now every time you push to GitHub, it auto-deploys! 🎉

---

## After Deployment

### Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow DNS instructions

### Environment Variables (For Supabase later)
1. Go to **Site settings** → **Environment variables**
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## Quick Deploy Now

Run these commands:
```bash
cd acds-platform
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**That's it!** 🚀

Your site will be live at: `https://your-site-name.netlify.app`
