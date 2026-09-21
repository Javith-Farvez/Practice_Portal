# Placement Practice Portal — Phase 2 Run & Testing Guide

This guide details commands to seed the learning hierarchy, start backend and frontend services, and execute the automated test suites for Phase 2.

---

## 1. Quick Setup & Execution Commands

### Step A: Database Schema & Roadmap Seeding
In the `backend/` directory:
```powershell
npm run seed:phase2
```
*Creates all Phase 2 tables, seeds the 4 core subjects (Java, Python, DSA, Aptitude), all 73 curriculum topics, subtopics, and curated multi-difficulty problems.*

---

### Step B: Start Backend API Server
In the `backend/` directory:
```powershell
npm run dev
```
*Starts Express API on `http://localhost:5000` with hot-reloading.*

---

### Step C: Start Frontend Application
In the `frontend/` directory:
```powershell
npm run dev
```
*Starts Vite React development server on `http://localhost:5173`.*

---

### Step D: Run Phase 2 Automated Tests
In the `backend/` directory:
```powershell
npm run test:phase2
```
*Runs all 18 automated learning roadmap, filtering, problem detail, bookmark, and progress calculation tests.*

---

### Step E: Run Phase 1 Regression Tests (Verify Auth Intact)
In the `backend/` directory:
```powershell
npm run test:phase1
```
*Ensures Phase 1 authentication, JWT verification, and role security remain 100% operational.*

---

## 2. Test Scenario Coverage Checklist

| # | Test Scenario | Verified Endpoint / Mechanism | Status |
|---|---|---|---|
| 1 | Database & Schema Validation | `subjects`, `topics`, `subtopics`, `problems`, `user_problem_progress` | ✅ PASS |
| 2 | Load 4 Core Subjects | `GET /api/subjects` (Java, Python, DSA, Aptitude) | ✅ PASS |
| 3 | Java 19 Topics Roadmap | `GET /api/subjects/java` (All 19 sequential topics loaded) | ✅ PASS |
| 4 | Python 20 Topics Roadmap | `GET /api/subjects/python` (All 20 sequential topics loaded) | ✅ PASS |
| 5 | DSA 17 Topics Roadmap | `GET /api/subjects/dsa` (All 17 sequential topics loaded) | ✅ PASS |
| 6 | Aptitude 17 Topics Roadmap | `GET /api/subjects/aptitude` (All 17 sequential topics loaded) | ✅ PASS |
| 7 | Problem Catalog | `GET /api/problems` (Full catalog with pagination) | ✅ PASS |
| 8 | Difficulty Filter | `GET /api/problems?difficulty=EASY` | ✅ PASS |
| 9 | Level Filter | `GET /api/problems?level=BEGINNER` | ✅ PASS |
| 10 | Subject Filter | `GET /api/problems?subject=java` | ✅ PASS |
| 11 | Search Keyword Filter | `GET /api/problems?search=Kadane` | ✅ PASS |
| 12 | Problem Detail View | `GET /api/problems/:id` (I/O format, constraints, hints) | ✅ PASS |
| 13 | Auth Protection on Solve | `POST /api/problems/:id/toggle-solve` (401 without token) | ✅ PASS |
| 14 | Real Database Progress Update | `POST /api/problems/:id/toggle-solve` with student JWT | ✅ PASS |
| 15 | Dynamic Progress Calculation | `GET /api/user/progress` (Real calculated %, zero fake stats) | ✅ PASS |
| 16 | Bookmark Toggle | `POST /api/problems/:id/toggle-bookmark` with student JWT | ✅ PASS |
| 17 | Student Admin Block | `GET /api/admin/metrics` (403 Forbidden for STUDENT role) | ✅ PASS |
| 18 | Regression-Free Auth | `npm run test:phase1` (15/15 auth tests passing) | ✅ PASS |
