-- Placement Practice Portal - PostgreSQL Production Schema
-- Compatible with PostgreSQL 14, 15, 16+, Supabase, and AWS RDS / Aurora

-- ============================================================================
-- 0. EXTENSIONS & HELPER FUNCTIONS
-- ============================================================================

-- Function to handle auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. SUBJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subjects (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Code2',
    color_gradient VARCHAR(100) DEFAULT 'from-brand-600 to-purple-600',
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subjects_slug ON subjects(slug);

DROP TRIGGER IF EXISTS trg_subjects_updated_at ON subjects;
CREATE TRIGGER trg_subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. TOPICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS topics (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_subject_topic_slug UNIQUE (subject_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id, order_index);

DROP TRIGGER IF EXISTS trg_topics_updated_at ON topics;
CREATE TRIGGER trg_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. SUBTOPICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subtopics (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    topic_id INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_topic_subtopic_slug UNIQUE (topic_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_subtopics_topic ON subtopics(topic_id, order_index);

DROP TRIGGER IF EXISTS trg_subtopics_updated_at ON subtopics;
CREATE TRIGGER trg_subtopics_updated_at
    BEFORE UPDATE ON subtopics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. PROBLEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS problems (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT NOT NULL,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    subtopic_id INT REFERENCES subtopics(id) ON DELETE SET NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    level VARCHAR(20) NOT NULL DEFAULT 'BEGINNER' CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PLACEMENT')),
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED')),
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    explanation TEXT,
    starter_code TEXT,
    reference_solution TEXT,
    examples JSONB DEFAULT '[]'::jsonb,
    hints JSONB DEFAULT '[]'::jsonb,
    supported_languages JSONB DEFAULT '["JAVA", "PYTHON"]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_problems_subject ON problems(subject_id);
CREATE INDEX IF NOT EXISTS idx_problems_topic ON problems(topic_id);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_level ON problems(level);
CREATE INDEX IF NOT EXISTS idx_problems_status ON problems(status);

DROP TRIGGER IF EXISTS trg_problems_updated_at ON problems;
CREATE TRIGGER trg_problems_updated_at
    BEFORE UPDATE ON problems
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. USER PROBLEM PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_problem_progress (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'UNSOLVED' CHECK (status IN ('UNSOLVED', 'ATTEMPTED', 'SOLVED')),
    is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
    solved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_problem UNIQUE (user_id, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress ON user_problem_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks ON user_problem_progress(user_id, is_bookmarked);

DROP TRIGGER IF EXISTS trg_user_problem_progress_updated_at ON user_problem_progress;
CREATE TRIGGER trg_user_problem_progress_updated_at
    BEFORE UPDATE ON user_problem_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. TEST CASES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS test_cases (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    validation_type VARCHAR(20) NOT NULL DEFAULT 'TRIMMED' CHECK (validation_type IN ('EXACT', 'TRIMMED', 'NUMERIC')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_testcases_problem ON test_cases(problem_id, is_hidden);

-- ============================================================================
-- 8. SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS submissions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    language VARCHAR(20) NOT NULL CHECK (language IN ('JAVA', 'PYTHON')),
    source_code TEXT NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('ACCEPTED', 'WRONG_ANSWER', 'COMPILATION_ERROR', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED')),
    passed_tests INT NOT NULL DEFAULT 0,
    total_tests INT NOT NULL DEFAULT 0,
    runtime_ms INT NOT NULL DEFAULT 0,
    memory_kb INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_problem ON submissions(problem_id, status);

-- ============================================================================
-- 9. USER PROGRESS AGGREGATE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_progress (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    problems_attempted INT NOT NULL DEFAULT 0,
    problems_solved INT NOT NULL DEFAULT 0,
    accepted_submissions INT NOT NULL DEFAULT 0,
    total_submissions INT NOT NULL DEFAULT 0,
    accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    total_active_days INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS trg_user_progress_updated_at ON user_progress;
CREATE TRIGGER trg_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. DAILY ACTIVITY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_activity (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    problems_solved INT NOT NULL DEFAULT 0,
    problems_attempted INT NOT NULL DEFAULT 0,
    total_submissions INT NOT NULL DEFAULT 0,
    accepted_submissions INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_activity_date UNIQUE (user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activity_user ON daily_activity(user_id, activity_date);

DROP TRIGGER IF EXISTS trg_daily_activity_updated_at ON daily_activity;
CREATE TRIGGER trg_daily_activity_updated_at
    BEFORE UPDATE ON daily_activity
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 11. BOOKMARKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_bookmark UNIQUE (user_id, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id, created_at);

-- ============================================================================
-- 12. ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Trophy',
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_achievement UNIQUE (user_id, achievement_key)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);

-- ============================================================================
-- 13. FRIENDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS friends (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    requester_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_friend_pair UNIQUE (requester_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_friends_requester ON friends(requester_id, status);
CREATE INDEX IF NOT EXISTS idx_friends_receiver ON friends(receiver_id, status);

DROP TRIGGER IF EXISTS trg_friends_updated_at ON friends;
CREATE TRIGGER trg_friends_updated_at
    BEFORE UPDATE ON friends
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 15. AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id INT,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ============================================================================
-- 16. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('PROBLEM_SOLVED', 'ACHIEVEMENT_UNLOCKED', 'STREAK_MILESTONE', 'FRIEND_REQUEST', 'SYSTEM')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at);

-- ============================================================================
-- 17. GITHUB CONNECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS github_connections (
    id                      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                 INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    github_user_id          BIGINT NOT NULL,
    github_username         VARCHAR(255) NOT NULL,
    github_avatar_url       TEXT,
    github_profile_url      TEXT,
    encrypted_access_token  TEXT NOT NULL,
    encryption_iv           VARCHAR(64) NOT NULL,
    token_scope             VARCHAR(500),
    selected_repo_full_name VARCHAR(500),
    selected_repo_owner     VARCHAR(255),
    selected_repo_name      VARCHAR(255),
    selected_branch         VARCHAR(255) DEFAULT 'main',
    is_private_repo         BOOLEAN DEFAULT FALSE,
    auto_push_on_accept     BOOLEAN DEFAULT FALSE,
    connected_at            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_github_connections_user_id ON github_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_github_connections_github_user_id ON github_connections(github_user_id);

DROP TRIGGER IF EXISTS trg_github_connections_updated_at ON github_connections;
CREATE TRIGGER trg_github_connections_updated_at
    BEFORE UPDATE ON github_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 18. GITHUB OAUTH STATES TABLE (CSRF Protection)
-- ============================================================================
CREATE TABLE IF NOT EXISTS github_oauth_states (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    state      VARCHAR(128) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes'),
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_github_oauth_states_state ON github_oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_github_oauth_states_user_id ON github_oauth_states(user_id);
CREATE INDEX IF NOT EXISTS idx_github_oauth_states_expires_at ON github_oauth_states(expires_at);

-- ============================================================================
-- 19. GITHUB PUSH LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS github_push_logs (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id          INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id       INT REFERENCES problems(id) ON DELETE SET NULL,
    repo_full_name   VARCHAR(500) NOT NULL,
    branch           VARCHAR(255) NOT NULL,
    commit_sha       VARCHAR(64),
    commit_url       TEXT,
    file_paths       TEXT[],
    status           VARCHAR(20) NOT NULL DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED')),
    error_message    TEXT,
    pushed_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_github_push_logs_user_id ON github_push_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_github_push_logs_problem_id ON github_push_logs(problem_id);

