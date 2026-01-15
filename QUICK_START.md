# 🚀 Quick Start Guide - InterVista

Get InterVista running locally in 5 minutes!

## ✅ Prerequisites

- Node.js v20 or higher
- npm (comes with Node.js)

## 📝 Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Create Backend Environment File

Create `backend/.env`:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=dev-secret-change-me-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

✅ Backend is now running on **http://localhost:4000**

### 4. Install Frontend Dependencies

Open a **new terminal window**:

```bash
cd web
npm install
```

### 5. Create Frontend Environment File

Create `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 6. Start Frontend Server

```bash
cd web
npm run dev
```

✅ Frontend is now running on **http://localhost:3000**

## 🎉 You're Ready!

1. Open **http://localhost:3000** in your browser
2. Click "Sign Up" to create an account
3. Sign in with your credentials
4. Create your first interview session
5. Start practicing!

## 🐛 Troubleshooting

### Backend won't start
- Check if port 4000 is already in use
- Verify `.env` file exists in `backend/` directory
- Run `npm install` again in `backend/`

### Frontend shows 404 errors
- Verify backend is running on port 4000
- Check `.env.local` file exists in `web/` directory
- Ensure `NEXT_PUBLIC_API_URL=http://localhost:4000` is set

### Sign up/Sign in not working
- Check browser console for errors
- Verify backend is running and accessible
- Check CORS settings in backend `.env`

### Interview pages not loading
- Ensure you're signed in
- Check that session was created successfully
- Verify backend API is responding

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Review [TEST_RESULTS.md](./TEST_RESULTS.md) for test coverage

## 💡 Tips

- Keep both terminal windows open (one for backend, one for frontend)
- Backend must be running before frontend can work
- Check terminal output for any error messages
- Use browser DevTools (F12) to debug frontend issues

---

**Need help?** Check the error messages in your terminal or browser console!
