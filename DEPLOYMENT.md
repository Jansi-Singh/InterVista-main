# 🚀 Deployment Guide - InterVista

Complete step-by-step guide to deploy InterVista to production.

## 📋 Prerequisites

- Node.js v20+ installed
- Git repository access
- Accounts for hosting services (recommended: Vercel for frontend, Render/Railway for backend)
- Domain name (optional but recommended)

---

## 🎯 Quick Start (Local Development)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
```

Start backend:
```bash
npm run dev
```
Backend runs on: `http://localhost:4000`

### 2. Frontend Setup

```bash
cd web
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start frontend:
```bash
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## 🌐 Production Deployment

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

#### Backend Deployment on Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder

3. **Configure Build Settings**
   - **Name**: `intervista-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<generate-strong-secret-here>
   JWT_EXPIRES_IN=7d
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://intervista-backend.onrender.com`)

#### Frontend Deployment on Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `web` folder

3. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://intervista-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Your app will be live at `https://your-project.vercel.app`

6. **Update Backend CORS**
   - Go back to Render dashboard
   - Update `CORS_ORIGINS` to include your Vercel URL
   - Redeploy backend

---

### Option 2: Railway (Full Stack)

#### Deploy Backend

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service**
   - Add service → "GitHub Repo"
   - Select `backend` folder
   - Railway auto-detects Node.js

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=7d
   CORS_ORIGINS=https://your-frontend-domain.railway.app
   ```

5. **Generate Domain**
   - Click on service → Settings → Generate Domain
   - Copy the domain (e.g., `intervista-backend.up.railway.app`)

#### Deploy Frontend

1. **Add Frontend Service**
   - In same Railway project, click "New" → "GitHub Repo"
   - Select `web` folder

2. **Configure Build**
   - Railway auto-detects Next.js
   - Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://intervista-backend.up.railway.app
   ```

3. **Generate Domain**
   - Generate domain for frontend service
   - Update backend `CORS_ORIGINS` with frontend domain

---

### Option 3: AWS/DigitalOcean (Advanced)

#### Backend on AWS EC2 or DigitalOcean Droplet

1. **Create Server**
   - Launch Ubuntu 22.04 instance
   - SSH into server

2. **Install Dependencies**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd InterVista-main/backend
   npm install
   npm run build
   ```

4. **Create `.env`**
   ```env
   NODE_ENV=production
   PORT=4000
   JWT_SECRET=<strong-secret>
   JWT_EXPIRES_IN=7d
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

5. **Start with PM2**
   ```bash
   pm2 start dist/server.js --name intervista-backend
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Frontend on Vercel (Recommended)

Follow Vercel deployment steps above, or use AWS Amplify/S3+CloudFront.

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string (use `openssl rand -base64 32`)
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS to only allow your frontend domain
- [ ] Use HTTPS (automatic on Vercel/Render/Railway)
- [ ] Enable rate limiting (consider adding express-rate-limit)
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Regular security updates

---

## 📊 Monitoring & Logs

### Render
- View logs in dashboard → Service → Logs
- Set up alerts for crashes

### Vercel
- View logs in dashboard → Project → Functions → Logs
- Set up analytics

### Railway
- View logs in dashboard → Service → Logs
- Set up metrics

---

## 🔄 CI/CD Setup

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd backend && npm install && npm run build
      # Add deployment steps for your hosting service
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find process
lsof -i :4000
# Kill process
kill -9 <PID>
```

**Build fails:**
```bash
cd backend
rm -rf node_modules dist
npm install
npm run build
```

**Environment variables not loading:**
- Ensure `.env` file exists in `backend/` directory
- Check variable names match exactly
- Restart server after changes

### Frontend Issues

**API calls failing:**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is running and accessible
- Check browser console for CORS errors
- Ensure backend CORS_ORIGINS includes frontend URL

**Build fails:**
```bash
cd web
rm -rf node_modules .next
npm install
npm run build
```

**404 errors:**
- Ensure dynamic routes are properly configured
- Check Next.js routing structure
- Verify API endpoints match frontend calls

---

## 📝 Post-Deployment

1. **Test Authentication**
   - Sign up new user
   - Sign in
   - Create interview session
   - Complete interview flow

2. **Verify API Endpoints**
   ```bash
   # Health check
   curl https://your-backend-url.com/health
   
   # Test signup
   curl -X POST https://your-backend-url.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"test1234"}'
   ```

3. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Review logs regularly

---

## 🎉 Success!

Your InterVista platform is now live! Share your deployment URL and start practicing interviews.

---

## 📞 Support

For issues or questions:
- Check logs in your hosting dashboard
- Review error messages in browser console
- Verify environment variables are set correctly
- Ensure both frontend and backend are deployed and running
