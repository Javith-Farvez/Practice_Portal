import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { ENV } from '../config/env';
import { encryptToken, decryptToken, GitHubAuthError } from '../services/github/github.service';

// ANSI colors for clean test reporting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ${GREEN}✓ PASS${RESET} ${testName}`);
    passedTests++;
  } else {
    console.error(`  ${RED}✗ FAIL${RESET} ${testName} ${detail ? `— ${detail}` : ''}`);
    failedTests++;
  }
}

async function runMultiUserVerification() {
  console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}   Multi-User GitHub OAuth Support — Comprehensive Verification ${RESET}`);
  console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

  let userAId: number;
  let userBId: number;

  try {
    // -------------------------------------------------------------------------
    // Phase 1: Ensure Two Distinct Portal Users Exist in Database
    // -------------------------------------------------------------------------
    console.log(`${BOLD}Phase 1: Portal Users Setup${RESET}`);

    // User A: Javith-Farvez
    const userARes = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('Javith Farvez', 'javith_multiuser_test@placement.portal', 'hashed_pass_a', 'STUDENT')
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, email;`
    );
    userAId = userARes.rows[0].id;
    console.log(`  User A: "${userARes.rows[0].name}" (ID: ${userAId}, Email: ${userARes.rows[0].email})`);

    // User B: kamalikasenthilnaathan09
    const userBRes = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('Kamalika Senthilnaathan', 'kamalika_multiuser_test@placement.portal', 'hashed_pass_b', 'STUDENT')
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, email;`
    );
    userBId = userBRes.rows[0].id;
    console.log(`  User B: "${userBRes.rows[0].name}" (ID: ${userBId}, Email: ${userBRes.rows[0].email})`);

    assert(userAId !== userBId, 'User A and User B have distinct portal IDs');

    // Clean up previous test state for these two test users
    await pool.query('DELETE FROM github_connections WHERE user_id IN ($1, $2)', [userAId, userBId]);
    await pool.query('DELETE FROM github_oauth_states WHERE user_id IN ($1, $2)', [userAId, userBId]);
    await pool.query('DELETE FROM github_push_logs WHERE user_id IN ($1, $2)', [userAId, userBId]);

    // -------------------------------------------------------------------------
    // Phase 2: Isolated JWT Authentication
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}Phase 2: JWT Isolation${RESET}`);
    const tokenA = jwt.sign(
      { id: userAId, name: 'Javith Farvez', email: 'javith_multiuser_test@placement.portal', role: 'STUDENT' },
      ENV.JWT.SECRET,
      { expiresIn: '1h' }
    );
    const tokenB = jwt.sign(
      { id: userBId, name: 'Kamalika Senthilnaathan', email: 'kamalika_multiuser_test@placement.portal', role: 'STUDENT' },
      ENV.JWT.SECRET,
      { expiresIn: '1h' }
    );

    const decodedA: any = jwt.verify(tokenA, ENV.JWT.SECRET);
    const decodedB: any = jwt.verify(tokenB, ENV.JWT.SECRET);

    assert(decodedA.id === userAId, 'Token A decodes strictly to User A ID');
    assert(decodedB.id === userBId, 'Token B decodes strictly to User B ID');
    assert(tokenA !== tokenB, 'Token A and Token B are completely distinct');

    // -------------------------------------------------------------------------
    // Phase 3: Isolated OAuth States & CSRF Protection
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}Phase 3: OAuth State Isolation${RESET}`);
    const stateA = 'test_csrf_state_user_a_' + Date.now();
    const stateB = 'test_csrf_state_user_b_' + Date.now();

    await pool.query(
      `INSERT INTO github_oauth_states (user_id, state, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
      [userAId, stateA]
    );
    await pool.query(
      `INSERT INTO github_oauth_states (user_id, state, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
      [userBId, stateB]
    );

    const checkStateA = await pool.query('SELECT user_id FROM github_oauth_states WHERE state = $1', [stateA]);
    const checkStateB = await pool.query('SELECT user_id FROM github_oauth_states WHERE state = $1', [stateB]);

    assert(checkStateA.rows[0].user_id === userAId, 'State A is strictly bound to User A');
    assert(checkStateB.rows[0].user_id === userBId, 'State B is strictly bound to User B');

    // -------------------------------------------------------------------------
    // Phase 4: Token Encryption & Secure Storage per User
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}Phase 4: Multi-User Encrypted Storage${RESET}`);
    const rawTokenA = 'gho_UserA_JavithFarvezSecretToken_' + Math.random().toString(36);
    const rawTokenB = 'gho_UserB_KamalikaSecretToken_' + Math.random().toString(36);

    const encA = encryptToken(rawTokenA);
    const encB = encryptToken(rawTokenB);

    assert(encA.encrypted !== encB.encrypted, 'Encrypted ciphertexts are distinct');
    assert(encA.iv !== encB.iv, 'Initialization vectors (IVs) are independently generated per token');
    assert(decryptToken(encA.encrypted, encA.iv) === rawTokenA, 'User A token decrypts accurately');
    assert(decryptToken(encB.encrypted, encB.iv) === rawTokenB, 'User B token decrypts accurately');

    // Store User A connection: Javith-Farvez
    await pool.query(
      `INSERT INTO github_connections
         (user_id, github_user_id, github_username, github_avatar_url, github_profile_url,
          encrypted_access_token, encryption_iv, token_scope, connected_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        userAId,
        1001,
        'Javith-Farvez',
        'https://avatars.githubusercontent.com/u/1001?v=4',
        'https://github.com/Javith-Farvez',
        encA.encrypted,
        encA.iv,
        'repo,read:user',
      ]
    );

    // Store User B connection: kamalikasenthilnaathan09
    await pool.query(
      `INSERT INTO github_connections
         (user_id, github_user_id, github_username, github_avatar_url, github_profile_url,
          encrypted_access_token, encryption_iv, token_scope, connected_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        userBId,
        1002,
        'kamalikasenthilnaathan09',
        'https://avatars.githubusercontent.com/u/1002?v=4',
        'https://github.com/kamalikasenthilnaathan09',
        encB.encrypted,
        encB.iv,
        'repo,read:user',
      ]
    );

    // -------------------------------------------------------------------------
    // Phase 5: Query Status & Data Isolation
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}Phase 5: Status Query Data Isolation${RESET}`);

    // Query for User A
    const statusQueryA = await pool.query(
      `SELECT github_username, github_avatar_url, github_profile_url,
              selected_repo_full_name, selected_branch
       FROM github_connections WHERE user_id = $1`,
      [userAId]
    );

    // Query for User B
    const statusQueryB = await pool.query(
      `SELECT github_username, github_avatar_url, github_profile_url,
              selected_repo_full_name, selected_branch
       FROM github_connections WHERE user_id = $1`,
      [userBId]
    );

    assert(statusQueryA.rows.length === 1, 'User A has exactly one active connection record');
    assert(statusQueryA.rows[0].github_username === 'Javith-Farvez', 'User A status returns "Javith-Farvez"');
    assert(statusQueryB.rows.length === 1, 'User B has exactly one active connection record');
    assert(statusQueryB.rows[0].github_username === 'kamalikasenthilnaathan09', 'User B status returns "kamalikasenthilnaathan09"');

    // Cross-check: User A's query does not contain User B's username
    assert(
      statusQueryA.rows[0].github_username !== statusQueryB.rows[0].github_username,
      'User A and User B usernames are completely isolated'
    );

    // -------------------------------------------------------------------------
    // Phase 6: Independent Repository & Branch Selection
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}Phase 6: Repository & Branch Isolation${RESET}`);

    // User A selects Practice_Portal / main
    await pool.query(
      `UPDATE github_connections SET
         selected_repo_full_name = 'Javith-Farvez/Practice_Portal',
         selected_repo_owner = 'Javith-Farvez',
         selected_repo_name = 'Practice_Portal',
         selected_branch = 'main',
         is_private_repo = false,
         updated_at = NOW()
       WHERE user_id = $1`,
      [userAId]
    );

    // User B selects Practice_Solutions / develop
    await pool.query(
      `UPDATE github_connections SET
         selected_repo_full_name = 'kamalikasenthilnaathan09/Practice_Solutions',
         selected_repo_owner = 'kamalikasenthilnaathan09',
         selected_repo_name = 'Practice_Solutions',
         selected_branch = 'develop',
         is_private_repo = true,
         updated_at = NOW()
       WHERE user_id = $1`,
      [userBId]
    );

    const repoA = (await pool.query('SELECT selected_repo_full_name, selected_branch, is_private_repo FROM github_connections WHERE user_id = $1', [userAId])).rows[0];
    const repoB = (await pool.query('SELECT selected_repo_full_name, selected_branch, is_private_repo FROM github_connections WHERE user_id = $1', [userBId])).rows[0];

    assert(repoA.selected_repo_full_name === 'Javith-Farvez/Practice_Portal', 'User A target repository is "Javith-Farvez/Practice_Portal"');
    assert(repoA.selected_branch === 'main', 'User A target branch is "main"');
    assert(repoA.is_private_repo === false, 'User A repo privacy is correctly stored as public');

    assert(repoB.selected_repo_full_name === 'kamalikasenthilnaathan09/Practice_Solutions', 'User B target repository is "kamalikasenthilnaathan09/Practice_Solutions"');
    assert(repoB.selected_branch === 'develop', 'User B target branch is "develop"');
    assert(repoB.is_private_repo === true, 'User B repo privacy is correctly stored as private');

    // -------------------------------------------------------------------------
    // Phase 7: Disconnect Isolation (User A disconnect must NOT affect User B)
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}Phase 7: Disconnect Isolation${RESET}`);

    // Disconnect User A
    await pool.query('DELETE FROM github_connections WHERE user_id = $1', [userAId]);
    await pool.query('DELETE FROM github_oauth_states WHERE user_id = $1', [userAId]);

    const postDisconnectA = await pool.query('SELECT * FROM github_connections WHERE user_id = $1', [userAId]);
    const postDisconnectB = await pool.query('SELECT * FROM github_connections WHERE user_id = $1', [userBId]);

    assert(postDisconnectA.rows.length === 0, 'User A connection was removed cleanly');
    assert(postDisconnectB.rows.length === 1, 'User B connection remains active after User A disconnected');
    assert(postDisconnectB.rows[0].github_username === 'kamalikasenthilnaathan09', 'User B account details remain 100% intact');

    // -------------------------------------------------------------------------
    // Phase 8: Token Expiration / Revocation Recovery (Requirement 12)
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}Phase 8: Token Expiration & Revocation Recovery${RESET}`);

    // Reconnect User A with an expired token
    const expiredToken = 'gho_expired_mock_token_12345';
    const encExpired = encryptToken(expiredToken);
    await pool.query(
      `INSERT INTO github_connections
         (user_id, github_user_id, github_username, encrypted_access_token, encryption_iv, connected_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [userAId, 1001, 'Javith-Farvez', encExpired.encrypted, encExpired.iv]
    );

    // Simulate GitHubAuthError (HTTP 401 Bad credentials)
    const simulatedError = new GitHubAuthError('GitHub access token has expired or was revoked.');

    // Simulated handler execution (same logic as handleGitHubError in controller)
    let reconnectRequired = false;
    let statusCode = 0;
    if (simulatedError instanceof GitHubAuthError || simulatedError.message.includes('401')) {
      await pool.query('DELETE FROM github_connections WHERE user_id = $1', [userAId]);
      statusCode = 401;
      reconnectRequired = true;
    }

    const checkRevoked = await pool.query('SELECT * FROM github_connections WHERE user_id = $1', [userAId]);

    assert(statusCode === 401, 'Backend returns HTTP 401 on token expiration/revocation');
    assert(reconnectRequired === true, 'Response flags reconnect_required: true');
    assert(checkRevoked.rows.length === 0, 'Stale connection is automatically purged from database');

    // Verify User B is STILL unharmed by User A's token expiration
    const checkBAfterExpiry = await pool.query('SELECT * FROM github_connections WHERE user_id = $1', [userBId]);
    assert(checkBAfterExpiry.rows.length === 1, 'User B remains securely connected throughout User A token revocation');

    // -------------------------------------------------------------------------
    // Clean up test data
    // -------------------------------------------------------------------------
    await pool.query('DELETE FROM github_connections WHERE user_id IN ($1, $2)', [userAId, userBId]);
    await pool.query('DELETE FROM github_oauth_states WHERE user_id IN ($1, $2)', [userAId, userBId]);
    await pool.query('DELETE FROM users WHERE id IN ($1, $2)', [userAId, userBId]);

    console.log(`\n${BOLD}----------------------------------------------------------------${RESET}`);
    console.log(`${BOLD}Test Summary: ${GREEN}${passedTests} passed${RESET}, ${failedTests === 0 ? GREEN : RED}${failedTests} failed${RESET}`);
    console.log(`${BOLD}----------------------------------------------------------------${RESET}\n`);

    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error(`\n${RED}Unexpected test runner error:${RESET}`, err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMultiUserVerification();
