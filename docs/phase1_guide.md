# Placement Practice Portal — Phase 1 Run & Testing Guide

This guide details exact commands to initialize the database, start the backend, start the frontend, and run the automated test suite.

---

## 1. Prerequisites

- **Node.js**: v18+ (tested on Node v24.11)
- **PostgreSQL**: 14+ / 16+ running on `localhost:5432`

---

## 2. Environment Setup

### Backend `.env`
Located at `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Farvez@0011
DB_NAME=placement_portal
JWT_SECRET=placement_portal_jwt_secret_dev_key_2026_super_secure!
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
Located at `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Exact Commands to Run

### Step A: Database Initialization & Seeding
In the `backend/` directory:
```powershell
npm run db:init
```
*Creates the database `placement_portal`, creates the `users` table, and seeds demo accounts:*
- **Admin 1**: `mohammedjavithfarvezsk07@gmail.com` | `Farvez@0011`
- **Admin 2**: `yskamalika09@gmail.com` | `Kamalika@2006`
- **Student**: `rahul@student.com` | `Student@123456`

---

### Step B: Start Backend Server
In the `backend/` directory:
```powershell
npm run dev
```
*Starts Express API on `http://localhost:5000` with hot reloading.*

---

### Step C: Start Frontend Application
In the `frontend/` directory:
```powershell
npm run dev
```
*Starts Vite React development server on `http://localhost:5173`.*

---

### Step D: Run Phase 1 Automated Tests
In the `backend/` directory:
```powershell
npm run test:phase1
```
*Runs all 15 automated validation, authentication, and role security tests.*

---

## 4. Test Scenario Coverage Checklist

| # | Test Scenario | Expected Result | Automated Test Status |
|---|---|---|---|
| 1 | MySQL Connection & Schema | Connected, table verified | ✅ PASS |
| 2 | Backend API Server | Responds on port 5000 | ✅ PASS |
| 3 | Health Check (`/api/health`) | Returns `200 OK` | ✅ PASS |
| 4 | Student Registration (`/api/auth/register`) | `201 Created`, JWT issued | ✅ PASS |
| 5 | Student Login (`/api/auth/login`) | `200 OK`, JWT issued | ✅ PASS |
| 6 | Get Profile (`/api/auth/me`) with JWT | `200 OK`, password omitted | ✅ PASS |
| 7 | Protected Route Missing Token | `401 Unauthorized` | ✅ PASS |
| 8 | Protected Route Malformed Token | `401 Unauthorized` | ✅ PASS |
| 9 | Invalid Login (Non-existent email) | `401 Unauthorized` | ✅ PASS |
| 10 | Duplicate Email Registration | `409 Conflict` | ✅ PASS |
| 11 | Incorrect Password | `401 Unauthorized` | ✅ PASS |
| 12 | Short Password (<8 chars) | `400 Bad Request` | ✅ PASS |
| 13 | Student accessing Admin route | `403 Forbidden` | ✅ PASS |
| 14 | Admin accessing Admin route | `200 OK` with metrics | ✅ PASS |
| 15 | Logout (`/api/auth/logout`) | `200 OK` | ✅ PASS |
