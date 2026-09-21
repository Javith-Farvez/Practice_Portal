# Placement Practice Portal — Architecture Document
**Phase 1 & Phase 2: Learning Roadmap & Problem Database Foundation**

## 1. System Overview

The **Placement Practice Portal** is a high-performance, developer-centric SaaS application designed for students preparing for campus recruitment and technical interviews across **Java**, **Python**, **DSA**, and **Aptitude**.

Phase 2 builds the core learning hierarchy:
```
Subject (Java, Python, DSA, Aptitude)
   └── Topic (73 Sequential Placement Topics)
         └── Subtopic (Modular Concept Units)
               └── Problem (EASY, MEDIUM, HARD | BEGINNER to PLACEMENT)
                     └── User Progress (SOLVED, ATTEMPTED, UNSOLVED & Bookmarks)
```

```
+-------------------------------------------------------------------------------+
|                            Frontend (Vite + React)                            |
|  - Tailwind CSS (Light / Dark Mode with persistent state)                     |
|  - Dynamic Subject Roadmaps (/java, /python, /dsa, /aptitude)                 |
|  - Multi-Criteria Problem Catalog with instant search & filter (/problems)     |
|  - Problem Detail View with Test Cases, Constraints, & Collapsible Hints      |
|  - Dynamic Dashboard tracking real progress percentages & streaks             |
+---------------------------------------+---------------------------------------+
                                        |
                                 HTTP / REST (JSON)
                                        |
+---------------------------------------v---------------------------------------+
|                         Backend (Express + TypeScript)                        |
|  - Modular Controllers: Auth, Admin, Learning & Problems                      |
|  - Middleware: JWT Authenticate, Optional Auth, Role Guard, Rate Limiter       |
|  - Real Progress Calculation Engine (zero fake percentages)                   |
|  - bcrypt Password Hashing (10 rounds)                                        |
+---------------------------------------+---------------------------------------+
                                        |
                                  pg Connection Pool
                                        |
+---------------------------------------v---------------------------------------+
|                          Database (PostgreSQL 16)                             |
|  - subjects (4 core subjects)                                                 |
|  - topics (73 sequential topics)                                              |
|  - subtopics (modular curriculum subunits)                                    |
|  - problems (multi-difficulty placement practice questions)                   |
|  - user_problem_progress (real student solved states & bookmarks)             |
|  - users (student & admin accounts with bcrypt hashes)                        |
+-------------------------------------------------------------------------------+
```

---

## 2. Database Schema

### Database: `placement_portal`

#### 1. `subjects` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Unique subject ID |
| `slug` | VARCHAR(50) | NOT NULL UNIQUE | URL-friendly identifier (`java`, `python`, `dsa`, `aptitude`) |
| `name` | VARCHAR(100) | NOT NULL | Display name |
| `description` | TEXT | NULL | Track synopsis |
| `icon` | VARCHAR(50) | DEFAULT 'Code2' | Lucide icon name |
| `color_gradient`| VARCHAR(100)| DEFAULT 'from-brand-600 to-purple-600' | Gradient styling |
| `order_index` | INT | NOT NULL DEFAULT 0 | Display sequence |

#### 2. `topics` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Unique topic ID |
| `subject_id` | INT | FOREIGN KEY (`subjects.id`) ON DELETE CASCADE | Parent subject |
| `name` | VARCHAR(150)| NOT NULL | Topic title (e.g. `Arrays`, `OOP`) |
| `slug` | VARCHAR(150)| NOT NULL | URL-safe slug |
| `order_index` | INT | NOT NULL DEFAULT 0 | Sequential roadmap position |
| `description` | TEXT | NULL | Topic curriculum overview |

#### 3. `subtopics` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Unique subtopic ID |
| `topic_id` | INT | FOREIGN KEY (`topics.id`) ON DELETE CASCADE | Parent topic |
| `name` | VARCHAR(150)| NOT NULL | Subtopic title |
| `slug` | VARCHAR(150)| NOT NULL | Slug |
| `order_index` | INT | NOT NULL DEFAULT 0 | Ordering |

#### 4. `problems` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Unique problem ID |
| `title` | VARCHAR(255)| NOT NULL | Problem headline |
| `description` | MEDIUMTEXT | NOT NULL | Detailed problem statement |
| `subject_id` | INT | FOREIGN KEY (`subjects.id`) | Foreign key to subject |
| `topic_id` | INT | FOREIGN KEY (`topics.id`) | Foreign key to topic |
| `subtopic_id` | INT | FOREIGN KEY (`subtopics.id`) ON DELETE SET NULL | Optional subtopic |
| `difficulty` | ENUM | `'EASY'`, `'MEDIUM'`, `'HARD'` | Problem difficulty |
| `level` | ENUM | `'BEGINNER'`, `'INTERMEDIATE'`, `'ADVANCED'`, `'PLACEMENT'` | Target audience |
| `input_format` | TEXT | NULL | Specification of inputs |
| `output_format`| TEXT | NULL | Specification of outputs |
| `constraints` | TEXT | NULL | Input limits and edge conditions |
| `explanation` | MEDIUMTEXT | NULL | Worked example & explanation |
| `hints` | JSON | NULL | Array of progressive hints |
| `supported_languages` | JSON | NULL | e.g. `['Java', 'Python', 'C++']` |

#### 5. `user_problem_progress` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Progress record ID |
| `user_id` | INT | FOREIGN KEY (`users.id`) ON DELETE CASCADE | Student ID |
| `problem_id` | INT | FOREIGN KEY (`problems.id`) ON DELETE CASCADE | Problem ID |
| `status` | ENUM | `'UNSOLVED'`, `'ATTEMPTED'`, `'SOLVED'` | Real progress state |
| `is_bookmarked`| BOOLEAN | NOT NULL DEFAULT FALSE | Bookmark flag |
| `solved_at` | TIMESTAMP | NULL | Timestamp when marked solved |

---

## 3. API Endpoints Reference

### Learning & Roadmap APIs

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/subjects` | Optional | List all 4 subjects with topic counts, problem counts, and user completion % |
| `GET` | `/api/subjects/:slug` | Optional | Subject roadmap with all topics, difficulty breakdown, and user progress |
| `GET` | `/api/topics/:id` | Optional | Topic details, subtopics, and list of problems in this topic |
| `GET` | `/api/problems` | Optional | Problem catalog with multi-criteria filtering (`subject`, `topic`, `difficulty`, `level`, `status`, `bookmarked`, `search`, `page`, `limit`) |
| `GET` | `/api/problems/:id` | Optional | Full problem detail with sample test cases, constraints, and hints |
| `POST` | `/api/problems/:id/toggle-solve` | Required | Mark problem as SOLVED or UNSOLVED for logged-in student |
| `POST` | `/api/problems/:id/toggle-bookmark` | Required | Toggle problem bookmark state for logged-in student |
| `GET` | `/api/user/progress` | Required | Dynamic progress calculation: Total Solved, Streak Days, Overall %, Per-Subject % |

### Authentication APIs (`/api/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Registers student/admin with bcrypt hash (10 rounds) |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT token |
| `GET` | `/api/auth/me` | Required | Returns logged-in user profile |
| `POST` | `/api/auth/logout` | Public | Client token invalidation acknowledgement |
| `GET` | `/api/admin/metrics` | Admin | Role-protected admin metrics endpoint |

---

## 4. Real Progress Engine

Progress is **never hardcoded or faked**:
- **Subject Progress**: `(COUNT(distinct solved problems in subject) / COUNT(total problems in subject)) * 100`
- **Topic Progress**: `(COUNT(solved problems in topic) / COUNT(total problems in topic)) * 100`
- **Overall Progress**: `(COUNT(total solved by user) / COUNT(total problems)) * 100`
- **Daily Streak**: Calculated by examining consecutive distinct calendar dates in `user_problem_progress.solved_at`.
