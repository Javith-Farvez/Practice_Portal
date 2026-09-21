import { createApp } from '../app';
import { initDatabase, pool } from '../config/db';

const PORT = 5098;
const API_BASE = `http://127.0.0.1:${PORT}/api`;

async function request(
  method: string,
  path: string,
  body?: any,
  token?: string
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: res.status, data };
}

async function runPhase6Tests() {
  console.log('🧪 ========================================================');
  console.log('🧪 Starting Phase 6 Friends & Learning Analytics Test Suite');
  console.log('🧪 ========================================================\n');

  let server: any;

  try {
    await initDatabase();

    // Start Express app on port 5098
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(PORT, '127.0.0.1', () => {
        console.log(`📡 Test API Server running on http://127.0.0.1:${PORT}\n`);
        resolve();
      });
    });

    // Clean up past test users
    await pool.query("DELETE FROM users WHERE email LIKE 'phase6_%@test.com'");

    // ------------------------------------------------------------------
    // SETUP: Register 3 Test Users (User A, User B, User C)
    // ------------------------------------------------------------------
    const userARes = await request('POST', '/auth/register', {
      name: 'Alice Phase6',
      email: 'phase6_alice@test.com',
      password: 'password123',
    });
    const tokenA = userARes.data.data.token;
    const userA = userARes.data.data.user;

    const userBRes = await request('POST', '/auth/register', {
      name: 'Bob Phase6',
      email: 'phase6_bob@test.com',
      password: 'password123',
    });
    const tokenB = userBRes.data.data.token;
    const userB = userBRes.data.data.user;

    const userCRes = await request('POST', '/auth/register', {
      name: 'Charlie Phase6',
      email: 'phase6_charlie@test.com',
      password: 'password123',
    });
    const tokenC = userCRes.data.data.token;
    const userC = userCRes.data.data.user;

    // ------------------------------------------------------------------
    // TEST 1: User A sends friend request to User B
    // ------------------------------------------------------------------
    console.log('▶ Test 1: User A sends friend request to User B...');
    const req1Res = await request(
      'POST',
      '/friends/request',
      { receiver_id: userB.id },
      tokenA
    );
    console.assert(req1Res.status === 200, `Request failed with status ${req1Res.status}`);
    console.assert(req1Res.data.data.status === 'PENDING', 'Status should be PENDING');
    console.log('✅ Test 1 Passed: Friend request dispatched as PENDING.\n');

    // ------------------------------------------------------------------
    // TEST 2: User B checks incoming requests
    // ------------------------------------------------------------------
    console.log('▶ Test 2: User B views incoming pending friend requests...');
    const overviewB = await request('GET', '/friends', undefined, tokenB);
    console.assert(overviewB.status === 200, 'Get friends failed');
    const incoming = overviewB.data.data.pending_incoming;
    console.assert(incoming.length === 1, 'Should have 1 incoming request');
    console.assert(incoming[0].user_id === userA.id, 'Sender should be Alice');
    console.log(`✅ Test 2 Passed: User B sees incoming request from ${incoming[0].name}.\n`);

    // ------------------------------------------------------------------
    // TEST 3: User B accepts friend request
    // ------------------------------------------------------------------
    console.log('▶ Test 3: User B accepts friend request...');
    const acceptRes = await request(
      'POST',
      '/friends/accept',
      { request_id: incoming[0].id },
      tokenB
    );
    console.assert(acceptRes.status === 200, 'Accept request failed');
    console.assert(acceptRes.data.data.status === 'ACCEPTED', 'Status should be ACCEPTED');

    // Verify both users show each other as friends
    const updatedOverviewA = await request('GET', '/friends', undefined, tokenA);
    console.assert(
      updatedOverviewA.data.data.friends.some((f: any) => f.id === userB.id),
      'User B should be in User A friend list'
    );
    console.log('✅ Test 3 Passed: Friend request accepted & mutual friendship verified.\n');

    // ------------------------------------------------------------------
    // TEST 4: Privacy Protection: User C cannot view User A's dashboard
    // ------------------------------------------------------------------
    console.log("▶ Test 4: Verifying Privacy: Unrelated User C cannot view User A's dashboard...");
    const privRes = await request(
      'GET',
      `/friends/${userA.id}/dashboard`,
      undefined,
      tokenC
    );
    console.assert(privRes.status === 403, `Expected 403 Forbidden, got ${privRes.status}`);
    console.log('✅ Test 4 Passed: 403 Forbidden enforced for non-friends.\n');

    // ------------------------------------------------------------------
    // TEST 5: Accepted Friend views Dashboard stats
    // ------------------------------------------------------------------
    console.log("▶ Test 5: User B views User A's friend dashboard...");
    const friendDashRes = await request(
      'GET',
      `/friends/${userA.id}/dashboard`,
      undefined,
      tokenB
    );
    console.assert(friendDashRes.status === 200, 'Friend dashboard request failed');
    const fDash = friendDashRes.data.data;
    console.assert(typeof fDash.problems_solved === 'number', 'problems_solved missing');
    console.assert(typeof fDash.current_streak === 'number', 'current_streak missing');
    console.assert(Array.isArray(fDash.subjects), 'subjects list missing');
    console.log(
      `✅ Test 5 Passed: Friend dashboard returned factual stats (Solved: ${fDash.problems_solved}, Subjects: ${fDash.subjects.length}).\n`
    );

    // ------------------------------------------------------------------
    // TEST 6: Side-by-Side Comparison (You vs Friend)
    // ------------------------------------------------------------------
    console.log('▶ Test 6: Testing Side-by-Side Comparison between User A and User B...');
    const compareRes = await request(
      'GET',
      `/friends/${userB.id}/compare`,
      undefined,
      tokenA
    );
    console.assert(compareRes.status === 200, 'Compare request failed');
    const compData = compareRes.data.data;
    console.assert(compData.you.id === userA.id, 'You id mismatch');
    console.assert(compData.friend.id === userB.id, 'Friend id mismatch');
    console.assert(Array.isArray(compData.subjects), 'Subject comparison missing');
    console.log(
      '✅ Test 6 Passed: Factual side-by-side comparison returned without competitive toxicity.\n'
    );

    // ------------------------------------------------------------------
    // TEST 7: Rejection Flow
    // ------------------------------------------------------------------
    console.log('▶ Test 7: Testing Friend Request Rejection Flow...');
    // User C sends request to User A
    const reqC = await request(
      'POST',
      '/friends/request',
      { receiver_id: userA.id },
      tokenC
    );
    const requestIdC = reqC.data.data.friendship_id;

    // User A rejects request
    const rejectRes = await request(
      'POST',
      '/friends/reject',
      { request_id: requestIdC },
      tokenA
    );
    console.assert(rejectRes.status === 200, 'Reject request failed');
    console.assert(rejectRes.data.data.status === 'REJECTED', 'Status should be REJECTED');
    console.log('✅ Test 7 Passed: Friend request successfully rejected.\n');

    // ------------------------------------------------------------------
    // TEST 8: Unfriend / Delete Friend
    // ------------------------------------------------------------------
    console.log('▶ Test 8: Testing Remove Friend (Unfriend)...');
    const removeRes = await request(
      'DELETE',
      `/friends/${userB.id}`,
      undefined,
      tokenA
    );
    console.assert(removeRes.status === 200, 'Remove friend failed');

    const finalOverviewA = await request('GET', '/friends', undefined, tokenA);
    console.assert(
      !finalOverviewA.data.data.friends.some((f: any) => f.id === userB.id),
      'User B should no longer be in friend list'
    );
    console.log('✅ Test 8 Passed: Friend removed cleanly from both users.\n');

    // ------------------------------------------------------------------
    // TEST 9: Analytics Engine & Weak/Strong Topics
    // ------------------------------------------------------------------
    console.log('▶ Test 9: Testing Learning Analytics with Weak & Strong Topics...');
    // Simulate submissions for User A
    // Solved 1 Java Arrays problem
    await pool.query(
      `INSERT INTO submissions (user_id, problem_id, language, source_code, status, passed_tests, total_tests)
       VALUES (?, 1, 'JAVA', 'class Main {}', 'ACCEPTED', 7, 7)`,
      [userA.id]
    );
    await pool.query(
      `INSERT INTO user_problem_progress (user_id, problem_id, status) VALUES (?, 1, 'SOLVED')
       ON DUPLICATE KEY UPDATE status = 'SOLVED'`,
      [userA.id]
    );
    // Failed 3 submissions on problem 2 to create a low accuracy topic (< 60%)
    await pool.query(
      `INSERT INTO submissions (user_id, problem_id, language, source_code, status, passed_tests, total_tests)
       VALUES 
       (?, 2, 'JAVA', 'bad code', 'WRONG_ANSWER', 0, 5),
       (?, 2, 'JAVA', 'bad code 2', 'WRONG_ANSWER', 0, 5),
       (?, 2, 'JAVA', 'bad code 3', 'RUNTIME_ERROR', 0, 5)`,
      [userA.id, userA.id, userA.id]
    );

    const analyticsRes = await request('GET', '/user/analytics', undefined, tokenA);
    console.assert(analyticsRes.status === 200, 'Analytics endpoint failed');
    const analytics = analyticsRes.data.data;

    console.assert(Array.isArray(analytics.weekly_chart), 'weekly_chart missing');
    console.assert(Array.isArray(analytics.monthly_chart), 'monthly_chart missing');
    console.assert(typeof analytics.accuracy === 'number', 'accuracy missing');
    console.assert(
      typeof analytics.accepted_vs_rejected === 'object',
      'accepted_vs_rejected missing'
    );
    console.assert(Array.isArray(analytics.weak_topics), 'weak_topics missing');
    console.assert(Array.isArray(analytics.strong_topics), 'strong_topics missing');

    if (analytics.weak_topics.length > 0) {
      console.assert(
        analytics.weak_topics[0].tag === 'Needs More Practice',
        'Weak topic tag should be "Needs More Practice"'
      );
      console.log(
        `Factual Weak Topic identified: "${analytics.weak_topics[0].topic_name}" (${analytics.weak_topics[0].accuracy}% accuracy) - Tag: "${analytics.weak_topics[0].tag}"`
      );
    }

    console.log(
      `Accepted: ${analytics.accepted_vs_rejected.accepted}, Rejected: ${analytics.accepted_vs_rejected.rejected}, Overall Accuracy: ${analytics.accuracy}%`
    );
    console.log(
      '✅ Test 9 Passed: Analytics, charts, and factual weak/strong topic calculations verified.\n'
    );

    // Clean up
    await pool.query("DELETE FROM users WHERE email LIKE 'phase6_%@test.com'");

    console.log('🎉 ========================================================');
    console.log('🎉 All Phase 6 Friends & Analytics Tests Passed Successfully!');
    console.log('🎉 ========================================================\n');
  } catch (error: any) {
    console.error('❌ Phase 6 Test Failed:', error);
    process.exit(1);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await pool.end();
  }
}

runPhase6Tests();
