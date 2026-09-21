# Security Architecture & Policies

The **Placement Practice Portal** implements a defense-in-depth security model across authentication, data integrity, sandbox isolation, and administrative governance.

---

## 1. Authentication & Session Management
- **Stateless JWT Tokens**: Signed with HMAC-SHA256 (`HS256`) using a strong secret key (`JWT_SECRET` min 32 characters).
- **Password Hashing**: `bcryptjs` with salt round cost factor of 10. Plaintext passwords are never persisted.
- **Zero Secret Exposure**: Database queries explicitly omit `password_hash`. User directory and profile responses sanitize sensitive attributes before serialization.

---

## 2. Role-Based Access Control (RBAC)
- Strict middleware enforcement:
  - `authenticateToken`: Validates Authorization Bearer token header.
  - `requireRole('ADMIN')`: Verifies administrative claim. Any student attempt receives `403 Forbidden`.
  - Non-admin student requests to problem catalog are restricted to `is_published = TRUE`. Unpublished drafts are invisible to students.

---

## 3. SQL Injection Prevention
- All PostgreSQL database queries use parameterized prepared statements through `pg` (`$1, $2, $3...`).
- Dynamic query fragments (e.g. search and filter conditions) only append parameterized placeholders `$N` with bound values.

---

## 4. Cross-Site Scripting (XSS) & HTTP Protections
- **Helmet**: Injects security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`).
- **CORS**: Strictly whitelist verified client origins (`ENV.CLIENT_URL`).
- **Payload Limits**: Body parser limits json and urlencoded data to 1MB to mitigate DoS payload attacks.

---

## 5. Code Execution Sandbox & Judge Security
- **Time Limits**: Hard process timeout (`EXECUTION_TIMEOUT_MS = 5000ms`).
- **Memory Limits**: Max memory cap (`MAX_MEMORY_MB = 128MB`).
- **Network Isolation**: When containerized, user code execution containers run without network access (`--network none`).
- **Non-Root Execution**: Runs under unprivileged user permissions.
- **Hidden Test Case Protection**:
  - Code judge evaluates hidden test cases server-side.
  - Only passed/failed counts and verdict are returned for hidden tests.
  - Hidden inputs and expected outputs are never returned to the client.

---

## 6. Audit Trail
- All administrative operations (problem creation, modification, deletion, test case changes, bulk imports, and user role updates) are immutably recorded in the `audit_logs` table with admin user ID, action, target, JSON details, and IP address.
