# Production Deployment Guide

This guide covers deployment instructions for the **Placement Practice Portal** using Docker Compose or standalone VPS environments.

---

## 1. Quick Production Deployment with Docker Compose

### Prerequisites
- Docker Engine (v20.10+)
- Docker Compose (v2.0+)

### Step-by-step
1. Clone the repository and navigate to the project directory:
   ```bash
   cd "Placement portal"
   ```

2. Configure environment variables in `.env`:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   Ensure you set strong passwords for `DATABASE_URL` and `JWT_SECRET`.

3. Launch the full stack:
   ```bash
   docker compose up -d --build
   ```

4. Verify running containers:
   ```bash
   docker compose ps
   ```

5. Seed curriculum data and roadmaps:
   ```bash
   docker compose exec backend npm run db:seed
   ```

The application is now live:
- **Frontend Web App**: `http://localhost`
- **Backend API**: `http://localhost/api` (proxied via Nginx) or `http://localhost:5000`
- **PostgreSQL Database**: `localhost:5432`

---

## 2. Standalone VPS / Local Setup

### Prerequisites
- Node.js v20+
- PostgreSQL 14+ / 16+
- OpenJDK 17+

### 1. Database Initialization
```bash
cd backend
npm install
npm run db:init
npm run seed:phase2
npm run seed:testcases
```

### 2. Backend Setup
```bash
npm run build
npm run start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run build
npm run preview # or serve dist/ via Nginx
```

---

## 3. Production Health Checks & Logs
- Check backend logs:
  ```bash
  docker compose logs -f backend
  ```
- Check API health:
  ```bash
  curl http://localhost/api/health
  ```
  Expected output:
  ```json
  {
    "success": true,
    "message": "Placement Portal API is operational.",
    "data": { "environment": "production" }
  }
  ```
