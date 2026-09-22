-- ===========================================================================
-- GitHub OAuth Integration Migration
-- Placement Practice Portal
-- Run this migration once on your PostgreSQL/Supabase database.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. github_connections
--    One row per portal user. Stores encrypted GitHub access token + repo.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 2. github_oauth_states
--    Short-lived CSRF state tokens generated during OAuth initiation.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 3. github_push_logs
--    Audit log of all pushes made through the portal (no code content stored).
-- ---------------------------------------------------------------------------
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
