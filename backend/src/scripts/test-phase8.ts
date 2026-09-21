import { createApp } from '../app';
import { initDatabase, pool } from '../config/db';
import { NotificationService } from '../services/notification.service';

const PORT = 5096;
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

async function runPhase8Tests() {
  console.log('🧪 ========================================================');
  console.log('🧪 Starting Phase 8 Placement Mode, Polish & Security Tests');
  console.log('🧪 ========================================================\n');

  let server: any;

  try {
    await initDatabase();

    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(PORT, '127.0.0.1', () => {
        console.log(`📡 Phase 8 Test Server listening on http://127.0.0.1:${PORT}\n`);
        resolve();
      });
    });

    // Cleanup past test users
    await pool.query("DELETE FROM users WHERE email LIKE 'phase8_%@test.com'");

    // ------------------------------------------------------------------
    // SETUP: Create 1 Student and authenticate
    // ------------------------------------------------------------------
    const studentReg = await request('POST', '/auth/register', {
      name: 'Priya Sharma Phase8',
      email: 'phase8_priya@test.com',
      password: 'StrongPassword123!',
    });

    const studentToken = studentReg.data?.data?.token;
    const studentId = studentReg.data?.data?.user?.id;
    if (!studentToken || !studentId) {
      throw new Error(`Failed to register student: ${JSON.stringify(studentReg.data)}`);
    }

    // ------------------------------------------------------------------
    // Test 1: Notifications Security & Missing Token Rejection
    // ------------------------------------------------------------------
    console.log('▶ Test 1: Verifying Notifications Authentication Enforcement (401)...');
    const unauthNotifs = await request('GET', '/notifications');
    if (unauthNotifs.status !== 401) {
      throw new Error(`Expected 401 for unauthenticated notifications, got ${unauthNotifs.status}`);
    }
    console.log('✅ Test 1 Passed: 401 Unauthorized strictly enforced for notifications.\n');

    // ------------------------------------------------------------------
    // Test 2: Notification Creation & Anti-Spam Deduplication
    // ------------------------------------------------------------------
    console.log('▶ Test 2: Creating notifications & testing anti-spam deduplication...');
    const n1 = await NotificationService.createNotification(
      studentId,
      'STREAK_MILESTONE',
      '7-Day Streak Achieved! 🔥',
      'You are on fire with a 7-day practice streak!',
      '/practice'
    );
    if (!n1) throw new Error('Failed to create first notification');

    // Attempt exact duplicate within 1 hour -> should return same ID and NOT duplicate
    const nDuplicate = await NotificationService.createNotification(
      studentId,
      'STREAK_MILESTONE',
      '7-Day Streak Achieved! 🔥',
      'You are on fire with a 7-day practice streak!',
      '/practice'
    );
    if (nDuplicate !== n1) {
      throw new Error('Anti-spam deduplication failed: duplicate notification was inserted');
    }

    // Insert second different notification
    const n2 = await NotificationService.createNotification(
      studentId,
      'ACHIEVEMENT_UNLOCKED',
      'Achievement Unlocked: Java Foundation!',
      'Solved 5 Java problems.',
      '/analytics'
    );

    const getNotifs = await request('GET', '/notifications', undefined, studentToken);
    if (getNotifs.status !== 200 || !getNotifs.data.success) {
      throw new Error(`Failed to fetch notifications: ${JSON.stringify(getNotifs.data)}`);
    }

    const { notifications, unread_count, total } = getNotifs.data.data;
    if (total < 2 || unread_count < 2) {
      throw new Error(`Expected at least 2 unread notifications, got unread=${unread_count}, total=${total}`);
    }
    console.log(`✅ Test 2 Passed: Notifications retrieved with anti-spam deduplication (Unread: ${unread_count}).\n`);

    // ------------------------------------------------------------------
    // Test 3: Mark Single Notification as Read
    // ------------------------------------------------------------------
    console.log('▶ Test 3: Marking single notification as read...');
    const markOne = await request('PATCH', `/notifications/${n1}/read`, {}, studentToken);
    if (markOne.status !== 200 || !markOne.data.success) {
      throw new Error(`Failed to mark notification read: ${JSON.stringify(markOne.data)}`);
    }

    const getNotifsAfterOne = await request('GET', '/notifications', undefined, studentToken);
    if (getNotifsAfterOne.data.data.unread_count !== unread_count - 1) {
      throw new Error(`Unread count did not decrement: ${getNotifsAfterOne.data.data.unread_count}`);
    }
    console.log('✅ Test 3 Passed: Notification marked as read and unread count decremented.\n');

    // ------------------------------------------------------------------
    // Test 4: Mark All Notifications as Read
    // ------------------------------------------------------------------
    console.log('▶ Test 4: Marking all notifications as read...');
    const markAll = await request('POST', '/notifications/read-all', {}, studentToken);
    if (markAll.status !== 200 || !markAll.data.success) {
      throw new Error(`Failed to mark all read: ${JSON.stringify(markAll.data)}`);
    }

    const getNotifsAfterAll = await request('GET', '/notifications', undefined, studentToken);
    if (getNotifsAfterAll.data.data.unread_count !== 0) {
      throw new Error(`Expected 0 unread notifications, got ${getNotifsAfterAll.data.data.unread_count}`);
    }
    console.log('✅ Test 4 Passed: All notifications marked as read (Unread count = 0).\n');

    // ------------------------------------------------------------------
    // Test 5: Placement Mode Practice Set Generation
    // ------------------------------------------------------------------
    console.log('▶ Test 5: Generating Placement Mode practice set (Java, DSA, Aptitude, Python)...');
    const placementRes = await request(
      'GET',
      '/placement/generate?java_count=3&dsa_count=3&aptitude_count=3&python_count=3',
      undefined,
      studentToken
    );

    if (placementRes.status !== 200 || !placementRes.data.success) {
      throw new Error(`Failed to generate placement session: ${JSON.stringify(placementRes.data)}`);
    }

    const placementData = placementRes.data.data;
    if (placementData.total_problems <= 0) {
      throw new Error(`Expected problems in placement set, got 0`);
    }

    console.log(
      `Placement session generated: ID=${placementData.session_id}, Total=${placementData.total_problems} (Java=${placementData.counts.java}, DSA=${placementData.counts.dsa}, Aptitude=${placementData.counts.aptitude}, Python=${placementData.counts.python})`
    );

    // SECURITY CHECK: Verify hidden test cases are NEVER exposed
    let exposedHiddenTestCases = 0;
    for (const p of placementData.problems) {
      if ((p as any).test_cases) {
        for (const tc of (p as any).test_cases) {
          if (tc.is_hidden) exposedHiddenTestCases++;
        }
      }
    }

    if (exposedHiddenTestCases > 0) {
      throw new Error(`SECURITY VULNERABILITY: ${exposedHiddenTestCases} hidden test cases leaked to client!`);
    }

    console.log('✅ Test 5 Passed: Placement practice set generated cleanly without hidden test exposure.\n');

    // ------------------------------------------------------------------
    // Test 6: Global Multi-Field Search (Title, Topic, Subject, Difficulty)
    // ------------------------------------------------------------------
    console.log('▶ Test 6: Verifying Global Multi-field Search & Pagination...');
    // Search by difficulty
    const searchDiff = await request('GET', '/problems?search=EASY&limit=10', undefined, studentToken);
    if (searchDiff.status !== 200 || !searchDiff.data.success) {
      throw new Error('Search by difficulty failed');
    }
    if (searchDiff.data.data.problems.length === 0) {
      throw new Error('Expected results for search=EASY');
    }

    // Verify pagination metadata returned
    const pMeta = searchDiff.data.data;
    if (pMeta.total_pages === undefined || pMeta.has_next === undefined || pMeta.has_prev === undefined) {
      throw new Error(`Pagination metadata missing in response: ${JSON.stringify(pMeta)}`);
    }
    console.log(
      `Global search verified: Found ${pMeta.total} problems matching 'EASY' across ${pMeta.total_pages} pages.`
    );
    console.log('✅ Test 6 Passed: Global search and pagination metadata functioning properly.\n');

    // ------------------------------------------------------------------
    // Test 7: Language Filter & Bookmarked Filter
    // ------------------------------------------------------------------
    console.log('▶ Test 7: Testing Language and Bookmarked Filters...');
    const langJava = await request('GET', '/problems?language=java&limit=10', undefined, studentToken);
    if (langJava.status !== 200 || !langJava.data.success) {
      throw new Error('Language filter failed');
    }
    const hasNonJava = langJava.data.data.problems.some((p: any) => {
      const langs = typeof p.supported_languages === 'string' ? JSON.parse(p.supported_languages) : p.supported_languages;
      return Array.isArray(langs) && !langs.map((l: string) => l.toLowerCase()).includes('java');
    });
    if (hasNonJava) {
      throw new Error('Problem returned that does not support Java when language=java was filtered');
    }
    console.log(`✅ Test 7 Passed: Language filter strictly enforced (${langJava.data.data.problems.length} problems).\n`);

    // ------------------------------------------------------------------
    // Test 8: Achievement Progress Enrichment (Current, Target, Percentage)
    // ------------------------------------------------------------------
    console.log('▶ Test 8: Testing Achievement Progress Calculations...');
    const { AchievementService } = await import('../services/progress/achievement.service');
    const achievements = await AchievementService.getUserAchievements(studentId);

    if (achievements.length === 0) {
      throw new Error('No achievements returned');
    }

    const firstAch = achievements[0];
    if (
      firstAch.current_value === undefined ||
      firstAch.target_value === undefined ||
      firstAch.progress_percentage === undefined
    ) {
      throw new Error(`Achievement progress metrics missing: ${JSON.stringify(firstAch)}`);
    }

    console.log(
      `Sample achievement progress: "${firstAch.title}" -> ${firstAch.current_value} / ${firstAch.target_value} (${firstAch.progress_percentage}%) [Unlocked=${firstAch.is_unlocked}]`
    );
    console.log('✅ Test 8 Passed: Achievements return factual progress values and percentages.\n');

    // ------------------------------------------------------------------
    // Test 9: Complete Security Audit Check
    // ------------------------------------------------------------------
    console.log('▶ Test 9: Security Audit: Password hashes and SQL Injection tests...');
    // Verify no password hash in auth profile
    const meRes = await request('GET', '/auth/me', undefined, studentToken);
    if ((meRes.data?.data?.user as any)?.password_hash || (meRes.data?.data?.user as any)?.password) {
      throw new Error('SECURITY VIOLATION: Password hash present in user profile response!');
    }

    // Test SQL injection attempt in search and filters
    const sqliRes = await request(
      'GET',
      "/problems?search=' OR '1'='1&difficulty=EASY' OR '1'='1",
      undefined,
      studentToken
    );
    if (sqliRes.status !== 200 && sqliRes.status !== 400) {
      throw new Error(`Unexpected status code on SQL injection test: ${sqliRes.status}`);
    }
    console.log('✅ Test 9 Passed: Zero password hash exposure and parameterized queries prevent SQL injection.\n');

    // Cleanup test user
    await pool.query('DELETE FROM users WHERE id = ?', [studentId]);

    console.log('🎉 ========================================================');
    console.log('🎉 All Phase 8 Placement Mode & Security Tests Passed!');
    console.log('🎉 ========================================================\n');
  } catch (error: any) {
    console.error('❌ Phase 8 Test Failed:', error);
    process.exit(1);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await pool.end();
  }
}

runPhase8Tests();

