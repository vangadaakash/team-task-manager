# Team Task Manager

A full-stack Team Task Manager application built with Node.js, Express, Prisma, SQLite/PostgreSQL, Vite, React, and Vanilla CSS.

## Features
- **Authentication**: Signup/Login with JWT.
- **Role-Based Access**: Admins can create projects and tasks. Members can update their assigned tasks' status.
- **Projects**: Manage projects and assign members.
- **Kanban Board**: Drag-and-drop style Kanban board for tracking task statuses (To Do, In Progress, Done).
- **Dashboard**: Track overall task statistics and overdue tasks.
- **Premium Design**: Vibrant colors, glassmorphism UI, smooth animations.

## Tech Stack
- **Frontend**: Vite + React, React Router, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: Prisma ORM with SQLite (local) / PostgreSQL (production)

## Local Development Setup

1. **Clone the repository**
2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Copy .env.example to .env and set JWT_SECRET
   npx prisma db push
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Railway Deployment Instructions

1. **Create a GitHub Repository** and push this code to it.
2. **Log into Railway.app** and create a new project.
3. **Provision Database**:
   - Click "New" -> "Database" -> "Add PostgreSQL".
4. **Deploy Backend**:
   - Click "New" -> "GitHub Repo" -> Select your repository.
   - In the Root Directory setting (if prompted), type `/backend`.
   - Go to the Backend Service Settings -> **Variables**:
     - Add `JWT_SECRET` (e.g., `supersecretkey`)
     - Add `DATABASE_URL` (Reference it from your PostgreSQL service)
   - Go to Backend Service Settings -> **Build**:
     - Build Command: `npm install && npx prisma generate`
     - Start Command: `npm start`
5. **Deploy Frontend**:
   - Click "New" -> "GitHub Repo" -> Select your repository again.
   - Set Root Directory to `/frontend`.
   - Go to Frontend Service Settings -> **Variables**:
     - Add `VITE_API_URL` pointing to your Backend Service URL.
   - Note: Update `axios` requests in frontend to use `import.meta.env.VITE_API_URL` instead of `http://localhost:5000`.

**Note:** Since you will be using PostgreSQL on Railway, change the `provider` in `backend/prisma/schema.prisma` from `"sqlite"` to `"postgresql"` before pushing to GitHub!

---

## Alternative Deployment (Render + Vercel)

> **⚠️ WARNING:** Your assignment explicitly states **"Deploy using Railway (Mandatory)"**. We highly recommend using Railway to ensure you meet all requirements. However, if you prefer Render and Vercel, follow these steps:

### 1. Deploy Backend to Render
1. Create a GitHub repo and push this code.
2. Go to [Render.com](https://render.com) and create a **PostgreSQL Database**.
3. Create a **Web Service**, connect your GitHub repo.
4. Set the Root Directory to `backend`.
5. Build Command: `npm install && npx prisma generate`
6. Start Command: `npm start`
7. Environment Variables:
   - `JWT_SECRET`: your secret key
   - `DATABASE_URL`: Your Render Internal PostgreSQL URL.
8. Update `backend/prisma/schema.prisma` provider to `"postgresql"`.

### 2. Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) and click **Add New -> Project**.
2. Import your GitHub repository.
3. Edit the Root Directory to `frontend`.
4. Framework Preset: Vite.
5. Environment Variables:
   - `VITE_API_URL`: Your Render Backend Live URL (e.g., `https://your-backend.onrender.com`).
6. Click **Deploy**.
