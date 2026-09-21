# Placement Practice Portal

A full-stack, production-grade engineering placement preparation and coding assessment platform. Built with real code execution sandboxes (Java & Python), automated curriculum management, real-time analytics, GitHub sync, peer comparison, and comprehensive administrative oversight.

---

## 🚀 Key Features by Phase

- **Phase 1 — Foundation & Authentication**:
  - Secure registration & login with bcrypt password hashing and JWT.
  - Role-Based Access Control (`STUDENT` vs `ADMIN`).
- **Phase 2 — Roadmaps & Problem Catalog**:
  - 4 Learning Tracks: Java, Python, Data Structures & Algorithms (DSA), and Placement Aptitude.
  - 73+ curated topics with dynamic completion percentages and level classifications.
- **Phase 3 — Real Online Compiler & Code Judge**:
  - Real execution engine for Java & Python (local & containerized sandbox).
  - Public test cases validation with input/output comparison, runtime, and memory stats.
  - Hidden test cases validation on submit with strict protection against test case leakage.
- **Phase 4 — Progress, Streak & Daily Practice**:
  - Factual streak tracking (current streak, longest streak, active days).
  - 12-month GitHub-style activity contribution heatmap.
  - 6-problem daily practice generator with balanced quotas.
  - Milestone achievements with live progress percentages.
- **Phase 5 — GitHub Sync Integration**:
  - GitHub OAuth connection and automatic repo creation (`placement-practice`).
  - Automatic push of accepted solutions with structured directories (e.g. `Java/Arrays/TwoSum.java`).
- **Phase 6 — Peer Collaboration & Learning Analytics**:
  - Friend request system (request, accept, reject, remove).
  - Factual side-by-side comparison without toxic competitive rankings.
  - Learning analytics identifying factual weak & strong topics.
- **Phase 7 — Admin Console & Problem Management**:
  - 10 real-time administrative metrics.
  - Full problem lifecycle CRUD, draft mode, and publish toggle.
  - Public & hidden test case management suite.
  - Pre-publish sandbox verification tester.
  - Atomic bulk import (JSON/CSV) with schema validation.
  - User directory & role governance.
  - Immutable security audit trail (`audit_logs`).
- **Phase 8 — Placement Mode, Polish & Production Readiness**:
  - `/placement` multi-track assessment simulation (Java, DSA, Aptitude, Python).
  - Optional stopwatch timer (never forces submission or countdown).
  - Global multi-field search (title, topic, subject, difficulty).
  - Advanced filters (subject, difficulty, level, status, language, bookmark) with pagination.
  - In-app notification center with anti-spam deduplication.
  - Custom 404, 403, and 500 error pages.
  - Multi-stage Docker containerization and complete documentation.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Monaco Editor, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, pg (PostgreSQL connection pool), Zod, Helmet, CORS, JWT, Bcryptjs.
- **Database**: PostgreSQL 14+ (Local, Docker, or Supabase).
- **Sandbox**: Local process execution & isolated Docker containers with hard execution timeouts and memory limits.

---

## 📦 Getting Started

### Local Development Setup

1. **Install Dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Initialize Database**:
   Configure `.env` in `backend/.env` with your PostgreSQL `DATABASE_URL`, then run:
   ```bash
   cd backend
   npm run db:schema
   npm run db:seed
   npm run seed:testcases
   ```

3. **Start Development Servers**:
   - Backend API:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend Client:
     ```bash
     cd frontend
     npm run dev
     ```

### Docker Compose (One-Click Production Launch)

```bash
docker compose up -d --build
```

Access the application at `http://localhost`.

---

## 🧪 Automated Testing

The repository contains automated test suites for every phase:

```bash
cd backend
npm run test:phase1   # Authentication & Foundation Tests (15 tests)
npm run test:phase2   # Roadmaps & Catalog Tests (18 tests)
npm run test:phase3   # Real Compiler & Judge Tests
npm run test:phase4   # Progress, Streak & Daily Practice Tests (9 tests)
npm run test:phase5   # GitHub OAuth & Push Tests (7 tests)
npm run test:phase6   # Friends & Analytics Tests (9 tests)
npm run test:phase7   # Admin Panel & Problem Management Tests (10 tests)
npm run test:phase8   # Placement Mode, Notifications & Security Tests (9 tests)
```

---

## 📖 Documentation Links

- [Complete REST API Documentation](docs/API.md)
- [Security Architecture & Sandboxing](docs/SECURITY.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
