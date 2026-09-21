# 🐘 PostgreSQL Migration & Setup Guide

This document provides step-by-step instructions for configuring and running the **Placement Practice Portal** on PostgreSQL (Local PostgreSQL 14+, Supabase, Docker, or Cloud Managed PostgreSQL).

---

## 📋 Prerequisites

- **Node.js**: v18+ or v20+
- **PostgreSQL**: v14, v15, or v16
- **Database Client** (Optional): `psql`, pgAdmin, or DBeaver

---

## 🚀 1. Quick Start with Docker (Recommended)

The easiest way to spin up a fully configured PostgreSQL 16 instance with schema initialization:

```bash
docker-compose up -d postgres
```

This starts PostgreSQL on port `5432` and automatically executes:
1. `database/postgresql_schema.sql` (Creates tables, triggers, indexes)
2. `database/postgresql_seed.sql` (Seeds default admin, student, and subjects)

---

## 💻 2. Local PostgreSQL Installation

### Windows
1. Download installer from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/).
2. Run installer, set a superuser password (e.g. `postgres`), and keep the default port `5432`.
3. Open **SQL Shell (psql)** or **pgAdmin 4** and create the database:

```sql
CREATE DATABASE placement_portal;
CREATE USER placement_user WITH ENCRYPTED PASSWORD 'placement_secure_password';
GRANT ALL PRIVILEGES ON DATABASE placement_portal TO placement_user;
GRANT ALL ON SCHEMA public TO placement_user;
```

### macOS (Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
createdb placement_portal
```

### Ubuntu / Debian Linux
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE DATABASE placement_portal;"
sudo -u postgres psql -c "CREATE USER placement_user WITH PASSWORD 'placement_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE placement_portal TO placement_user;"
```

---

## ☁️ 3. Using Supabase / Managed PostgreSQL

If using [Supabase](https://supabase.com) or Neon / AWS RDS:

1. Create a new project in your Supabase dashboard.
2. Go to **Project Settings** $\to$ **Database** $\to$ **Connection string** $\to$ **URI** (Transaction pooler or Direct connection).
3. Copy the URI and configure in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

4. Run the schema directly in Supabase SQL Editor by pasting `database/postgresql_schema.sql` and `database/postgresql_seed.sql`.

---

## ⚙️ 4. Environment Configuration (`backend/.env`)

Configure the Supabase connection string in `backend/.env`:

```env
# Supabase PostgreSQL Connection String (Direct or Session Pooler)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Enable SSL for Supabase PostgreSQL
DATABASE_SSL=true
```

---

## 🗄️ 5. Database Initialization & Seeding

Run the automated npm scripts from the `backend/` directory:

```bash
cd backend

# Initialize database tables and seed default users (Admin + Students)
npm run init:db

# Seed curriculum subjects, 26 topics, and starter problems
npm run seed:phase2

# Seed test cases for code execution validation
npm run seed:testcases
```

### Direct `psql` Execution (Alternative)

```bash
# Apply schema
psql -U placement_user -d placement_portal -f ../database/postgresql_schema.sql

# Apply initial seed
psql -U placement_user -d placement_portal -f ../database/postgresql_seed.sql
```

---

## 🩺 6. Verification & Health Check

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify Database Health Check**:
   ```bash
   curl http://localhost:5000/health
   ```
   **Expected Response:**
   ```json
   {
     "status": "healthy",
     "timestamp": "2026-09-21T09:40:00.000Z",
     "service": "Placement Practice Portal Backend",
     "database": {
       "status": "connected",
       "type": "PostgreSQL",
       "pool": {
         "total": 1,
         "idle": 1,
         "waiting": 0
       }
     }
   }
   ```

3. **Run Automated Tests**:
   ```bash
   cd backend
   npm run test:phase1
   npm run test:phase2
   ```

---

## 📂 7. Backup & Migration Archive

All original schema and seed files have been converted to PostgreSQL and archived under:
- `database/postgresql_backup/schema.sql`
- `database/postgresql_backup/seed.sql`
- `database/postgresql_backup/seed_roadmap.sql`
