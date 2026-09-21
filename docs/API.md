# Placement Practice Portal — Complete REST API Documentation

Base URL: `/api`

---

## 1. Authentication (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register student (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Public | Login with email & password, returns JWT |
| `GET` | `/auth/me` | Authenticated | Retrieve current user profile (password_hash omitted) |
| `POST` | `/auth/logout` | Authenticated | Invalidate session |

---

## 2. Curriculum & Problems (`/`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/subjects` | Public/Optional | List all 4 learning tracks (Java, Python, DSA, Aptitude) |
| `GET` | `/subjects/:slug` | Public/Optional | Get subject roadmap with topics & problem counts |
| `GET` | `/topics/:id` | Public/Optional | Get topic details and problem catalog |
| `GET` | `/problems` | Public/Optional | Filtered problem catalog (`search`, `subject`, `topic`, `difficulty`, `level`, `status`, `language`, `bookmarked`, `page`, `limit`) |
| `GET` | `/problems/:id` | Public/Optional | Detailed problem statement, I/O formats, examples, hints (public test cases only) |
| `POST` | `/problems/:id/bookmark` | Authenticated | Toggle problem bookmark |

---

## 3. Online Compiler & Code Judge (`/problems/:id`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/problems/:id/run` | Authenticated | Run code against public test cases only |
| `POST` | `/problems/:id/submit` | Authenticated | Run code against public AND hidden test cases; updates streak & progress upon `ACCEPTED` |

---

## 4. Progress, Streak & Daily Practice (`/progress`, `/practice`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/progress/dashboard` | Authenticated | Complete user stats, current/longest streaks, accuracy, active days |
| `GET` | `/progress/activity` | Authenticated | 12-month GitHub-style activity heatmap |
| `GET` | `/progress/achievements`| Authenticated | Unlocked & locked achievements with live progress percentages |
| `GET` | `/practice/daily` | Authenticated | Daily practice set (2 Java, 2 DSA, 1 Aptitude, 1 Python) |

---

## 5. Placement Assessment Mode (`/placement`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/placement/generate` | Public/Optional | Generate mixed practice set (`java_count`, `dsa_count`, `aptitude_count`, `python_count`, `difficulty`). Hidden test cases never exposed. |

---

## 6. Notifications (`/notifications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/notifications` | Authenticated | Fetch notifications with unread count and pagination |
| `PATCH` | `/notifications/:id/read` | Authenticated | Mark individual notification as read |
| `POST` | `/notifications/read-all` | Authenticated | Mark all user notifications as read |

---

## 7. Friends & Learning Analytics (`/friends`, `/analytics`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/friends/request` | Authenticated | Send friend request |
| `POST` | `/friends/accept` | Authenticated | Accept pending friend request |
| `POST` | `/friends/reject` | Authenticated | Reject pending friend request |
| `GET` | `/friends` | Authenticated | List accepted friends with factual metrics |
| `GET` | `/friends/requests` | Authenticated | List incoming pending requests |
| `GET` | `/friends/:id/dashboard` | Authenticated (Friend)| View friend's learning stats & side-by-side comparison |
| `DELETE` | `/friends/:id` | Authenticated | Remove friend connection |
| `GET` | `/analytics` | Authenticated | Weak/strong topics, weekly/monthly charts, accuracy breakdown |

---

## 8. GitHub Integration (`/github`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/github/auth-url` | Authenticated | Get GitHub OAuth authorization URL |
| `POST` | `/github/callback` | Authenticated | Exchange authorization code and link repo |
| `GET` | `/github/status` | Authenticated | Check GitHub connection status and last pushed solution |
| `POST` | `/github/disconnect` | Authenticated | Disconnect GitHub integration |

---

## 9. Admin Console (`/admin`) — Strict ADMIN Role Required

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/metrics` | Admin | 10 factual system metrics (Users, Problems, Submissions breakdown) |
| `GET` | `/admin/problems` | Admin | Full problem inventory with filters |
| `POST` | `/admin/problems` | Admin | Create problem with initial test cases |
| `GET` | `/admin/problems/:id` | Admin | Full problem details including hidden test cases |
| `PUT` | `/admin/problems/:id` | Admin | Update problem |
| `DELETE` | `/admin/problems/:id` | Admin | Delete problem |
| `PATCH` | `/admin/problems/:id/publish` | Admin | Toggle published/draft status |
| `POST` | `/admin/problems/:id/test` | Admin | Pre-publish code runner sandbox |
| `GET` | `/admin/problems/:id/test-cases` | Admin | View all test cases (public and hidden) |
| `POST` | `/admin/problems/:id/test-cases` | Admin | Add test case |
| `PUT` | `/admin/test-cases/:testId` | Admin | Edit test case |
| `DELETE` | `/admin/test-cases/:testId` | Admin | Delete test case |
| `POST` | `/admin/problems/bulk-import` | Admin | Atomic bulk import (JSON/CSV) |
| `GET` | `/admin/users` | Admin | User directory with stats (passwords omitted) |
| `PATCH` | `/admin/users/:id/role` | Admin | Update role (`STUDENT` <-> `ADMIN`) |
| `GET` | `/admin/audit-logs` | Admin | Query security audit trail |
| `GET` | `/admin/taxonomy` | Admin | Get all subjects and topics for problem editors |
