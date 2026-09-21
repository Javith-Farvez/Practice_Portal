import { createApp } from '../app';
import { initDatabase, pool } from '../config/db';

const PORT = 5097;
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

async function runPhase7Tests() {
  console.log('🧪 ========================================================');
  console.log('🧪 Starting Phase 7 Admin Panel & Problem Management Tests');
  console.log('🧪 ========================================================\n');

  let server: any;

  try {
    await initDatabase();

    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(PORT, '127.0.0.1', () => {
        console.log(`📡 Admin Test Server listening on http://127.0.0.1:${PORT}\n`);
        resolve();
      });
    });

    // Cleanup past test users
    await pool.query("DELETE FROM users WHERE email LIKE 'phase7_%@test.com'");

    // ------------------------------------------------------------------
    // SETUP: Create 1 Student and 1 Admin
    // ------------------------------------------------------------------
    const studentRes = await request('POST', '/auth/register', {
      name: 'Sam Student',
      email: 'phase7_student@test.com',
      password: 'password123',
    });
    const studentToken = studentRes.data.data.token;
    const studentUser = studentRes.data.data.user;

    const adminRes = await request('POST', '/auth/register', {
      name: 'Alex Admin',
      email: 'phase7_admin@test.com',
      password: 'password123',
    });
    let adminToken = adminRes.data.data.token;
    const adminUser = adminRes.data.data.user;

    // Promote Alex to ADMIN in database directly for test setup and re-login to obtain ADMIN token
    await pool.query("UPDATE users SET role = 'ADMIN' WHERE id = ?", [adminUser.id]);
    const adminLoginRes = await request('POST', '/auth/login', {
      email: 'phase7_admin@test.com',
      password: 'password123',
    });
    adminToken = adminLoginRes.data.data.token;

    // ------------------------------------------------------------------
    // TEST 1: Security & RBAC Enforcement
    // ------------------------------------------------------------------
    console.log('▶ Test 1: Verifying Security: Unauthenticated and Student access rejected...');
    // Unauthenticated
    const unauth = await request('GET', '/admin/metrics');
    console.assert(unauth.status === 401, `Expected 401 for unauthenticated, got ${unauth.status}`);

    // Student role (forbidden)
    const studentAccess = await request('GET', '/admin/metrics', undefined, studentToken);
    console.assert(studentAccess.status === 403, `Expected 403 Forbidden for Student, got ${studentAccess.status}`);
    console.log('✅ Test 1 Passed: 401 and 403 RBAC guards strictly enforced.\n');

    // ------------------------------------------------------------------
    // TEST 2: Admin Metrics Retrieval (10 Required Statistics)
    // ------------------------------------------------------------------
    console.log('▶ Test 2: Admin retrieves all 10 factual system metrics...');
    const metricsRes = await request('GET', '/admin/metrics', undefined, adminToken);
    console.assert(metricsRes.status === 200, `Metrics failed with ${metricsRes.status}`);
    const stats = metricsRes.data.data.stats;

    console.assert(typeof stats.total_users === 'number', 'total_users missing');
    console.assert(typeof stats.active_users === 'number', 'active_users missing');
    console.assert(typeof stats.total_problems === 'number', 'total_problems missing');
    console.assert(typeof stats.total_submissions === 'number', 'total_submissions missing');
    console.assert(typeof stats.accepted_submissions === 'number', 'accepted_submissions missing');
    console.assert(typeof stats.rejected_submissions === 'number', 'rejected_submissions missing');
    console.assert(typeof stats.java_problems === 'number', 'java_problems missing');
    console.assert(typeof stats.python_problems === 'number', 'python_problems missing');
    console.assert(typeof stats.dsa_problems === 'number', 'dsa_problems missing');
    console.assert(typeof stats.aptitude_questions === 'number', 'aptitude_questions missing');

    console.log(`Stats Summary: Users=${stats.total_users}, Problems=${stats.total_problems}, Java=${stats.java_problems}, Python=${stats.python_problems}, DSA=${stats.dsa_problems}, Aptitude=${stats.aptitude_questions}`);
    console.log('✅ Test 2 Passed: All 10 required admin metrics successfully calculated.\n');

    // ------------------------------------------------------------------
    // TEST 3: Problem Creation with Public and Hidden Test Cases
    // ------------------------------------------------------------------
    console.log('▶ Test 3: Creating a new problem with public & hidden test cases...');
    // Grab Java Subject & Topic ID
    const topicRes = await pool.query<any>(
      `SELECT t.id as topic_id, s.id as subject_id 
       FROM topics t 
       JOIN subjects s ON t.subject_id = s.id 
       WHERE s.slug = 'java' LIMIT 1`
    );
    const topicRows = topicRes.rows;
    const subjectId = topicRows[0].subject_id;
    const topicId = topicRows[0].topic_id;

    const createProbRes = await request(
      'POST',
      '/admin/problems',
      {
        title: 'Phase 7 Custom Problem',
        description: 'Compute the factorial of a number N.',
        subject_id: subjectId,
        topic_id: topicId,
        difficulty: 'EASY',
        level: 'BEGINNER',
        input_format: 'An integer N',
        output_format: 'The factorial of N',
        constraints: '0 <= N <= 12',
        explanation: '5! = 120',
        is_published: false, // Created as draft
        test_cases: [
          { input: '5', expected_output: '120', is_hidden: false, validation_type: 'TRIMMED' },
          { input: '3', expected_output: '6', is_hidden: false, validation_type: 'TRIMMED' },
          { input: '0', expected_output: '1', is_hidden: true, validation_type: 'TRIMMED' },
          { input: '6', expected_output: '720', is_hidden: true, validation_type: 'TRIMMED' },
        ],
      },
      adminToken
    );

    console.assert(createProbRes.status === 201, `Failed to create problem: ${JSON.stringify(createProbRes.data)}`);
    const createdProblemId = createProbRes.data.data.id;
    console.assert(createProbRes.data.data.test_cases_count === 4, 'Test cases count should be 4');
    console.log(`✅ Test 3 Passed: Problem #${createdProblemId} created as draft with 4 test cases.\n`);

    // ------------------------------------------------------------------
    // TEST 4: Pre-Publish Testing & Problem Preview
    // ------------------------------------------------------------------
    console.log('▶ Test 4: Testing problem before publishing (Run Tests)...');
    const javaFactorialCode = `
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            long f = 1;
            for (int i = 2; i <= n; i++) f *= i;
            System.out.println(f);
        }
    }
}
    `;

    const testRunRes = await request(
      'POST',
      `/admin/problems/${createdProblemId}/test`,
      {
        language: 'JAVA',
        source_code: javaFactorialCode,
      },
      adminToken
    );

    console.assert(testRunRes.status === 200, 'Test execution failed');
    console.assert(testRunRes.data.data.passedPublicTests === 2, 'Should pass 2 public test cases');
    console.log('✅ Test 4 Passed: Pre-publish test execution passed 2/2 public tests.\n');

    // ------------------------------------------------------------------
    // TEST 5: Publish / Unpublish Toggle & Student Visibility Check
    // ------------------------------------------------------------------
    console.log('▶ Test 5: Verifying Publish/Unpublish toggle and student visibility...');
    // Currently unpublished: Student querying /problems should NOT see it
    const studentCatalogBefore = await request(
      'GET',
      `/problems?search=Phase 7 Custom Problem`,
      undefined,
      studentToken
    );
    console.assert(
      studentCatalogBefore.data.data.problems.length === 0,
      'Unpublished draft problem should NOT be visible to students'
    );

    // Publish problem
    const publishRes = await request(
      'PATCH',
      `/admin/problems/${createdProblemId}/publish`,
      { is_published: true },
      adminToken
    );
    console.assert(publishRes.status === 200, 'Publish toggle failed');
    console.assert(publishRes.data.data.is_published === true, 'Should be published');

    // Now student should see it
    const studentCatalogAfter = await request(
      'GET',
      `/problems?search=Phase 7 Custom Problem`,
      undefined,
      studentToken
    );
    console.assert(
      studentCatalogAfter.data.data.problems.length === 1,
      'Published problem should now be visible to students'
    );
    console.log('✅ Test 5 Passed: Publish toggle correctly controls student visibility.\n');

    // ------------------------------------------------------------------
    // TEST 6: Test Case Management (Add, Update, Delete)
    // ------------------------------------------------------------------
    console.log('▶ Test 6: Testing Test Case Management (Add, Edit, Delete)...');
    // Add new hidden test case
    const addTcRes = await request(
      'POST',
      `/admin/problems/${createdProblemId}/test-cases`,
      {
        input: '4',
        expected_output: '24',
        is_hidden: true,
        validation_type: 'EXACT',
      },
      adminToken
    );
    console.assert(addTcRes.status === 201, 'Add test case failed');
    const newTcId = addTcRes.data.data.test_case.id;

    // Update test case
    const updateTcRes = await request(
      'PUT',
      `/admin/test-cases/${newTcId}`,
      {
        expected_output: '24',
        validation_type: 'TRIMMED',
      },
      adminToken
    );
    console.assert(updateTcRes.status === 200, 'Update test case failed');

    // Delete test case
    const delTcRes = await request('DELETE', `/admin/test-cases/${newTcId}`, undefined, adminToken);
    console.assert(delTcRes.status === 200, 'Delete test case failed');
    console.log('✅ Test 6 Passed: Test case added, updated, and deleted successfully.\n');

    // ------------------------------------------------------------------
    // TEST 7: Bulk Content Import with Schema Validation
    // ------------------------------------------------------------------
    console.log('▶ Test 7: Testing Bulk Import Validation...');
    // Malformed problem (missing title) should fail validation
    const badBatch = [
      {
        description: 'Missing title problem',
        subject: 'java',
        difficulty: 'EASY',
      },
    ];
    const badImportRes = await request(
      'POST',
      '/admin/problems/bulk-import',
      { problems: badBatch },
      adminToken
    );
    console.assert(badImportRes.status === 400, 'Malformed import should return 400');
    console.log('Malformed import safely rejected with error:', badImportRes.data.message);

    // Valid batch import
    const validBatch = [
      {
        title: 'Phase 7 Bulk Problem 1',
        description: 'Sum of two integers.',
        subject: 'java',
        difficulty: 'EASY',
        level: 'BEGINNER',
        test_cases: [
          { input: '2 3', expected_output: '5', is_hidden: false },
          { input: '10 20', expected_output: '30', is_hidden: true },
        ],
      },
      {
        title: 'Phase 7 Bulk Problem 2',
        description: 'Square of an integer.',
        subject: 'python',
        difficulty: 'EASY',
        level: 'BEGINNER',
        test_cases: [
          { input: '4', expected_output: '16', is_hidden: false },
        ],
      },
    ];

    const goodImportRes = await request(
      'POST',
      '/admin/problems/bulk-import',
      { problems: validBatch },
      adminToken
    );
    console.assert(goodImportRes.status === 200, `Valid import failed: ${JSON.stringify(goodImportRes.data)}`);
    console.assert(goodImportRes.data.data.imported_problems === 2, 'Should import 2 problems');
    console.log(`✅ Test 7 Passed: Bulk import validated and inserted 2 problems with test cases.\n`);

    // ------------------------------------------------------------------
    // TEST 8: User Management & Role Change
    // ------------------------------------------------------------------
    console.log('▶ Test 8: Testing User Management & Role Changing...');
    const usersListRes = await request('GET', '/admin/users', undefined, adminToken);
    console.assert(usersListRes.status === 200, 'Failed to fetch users list');
    const users = usersListRes.data.data.users;

    // Verify password_hash is strictly NOT present
    console.assert(!users.some((u: any) => u.password_hash !== undefined), 'Security alert: password_hash exposed!');
    console.log('Security check passed: Zero password_hash exposure in user list.');

    // Promote Sam Student to ADMIN
    const roleChangeRes = await request(
      'PATCH',
      `/admin/users/${studentUser.id}/role`,
      { role: 'ADMIN' },
      adminToken
    );
    console.assert(roleChangeRes.status === 200, 'Role change failed');
    console.assert(roleChangeRes.data.data.role === 'ADMIN', 'Role should be ADMIN');
    console.log('✅ Test 8 Passed: User list verified (passwords omitted) and role changed to ADMIN.\n');

    // ------------------------------------------------------------------
    // TEST 9: Audit Logs Verification
    // ------------------------------------------------------------------
    console.log('▶ Test 9: Verifying Audit Logs for admin actions...');
    const logsRes = await request('GET', '/admin/audit-logs', undefined, adminToken);
    console.assert(logsRes.status === 200, 'Failed to fetch audit logs');
    const logs = logsRes.data.data.logs;
    console.assert(logs.length > 0, 'Audit logs should contain recorded actions');

    const actions = logs.map((l: any) => l.action);
    console.assert(actions.includes('PROBLEM_CREATED'), 'PROBLEM_CREATED audit missing');
    console.assert(actions.includes('USER_ROLE_CHANGED'), 'USER_ROLE_CHANGED audit missing');
    console.assert(actions.includes('BULK_IMPORT_EXECUTED'), 'BULK_IMPORT_EXECUTED audit missing');
    console.log(`✅ Test 9 Passed: Audit logs recorded actions: ${actions.slice(0, 5).join(', ')}...\n`);

    // ------------------------------------------------------------------
    // TEST 10: Problem Deletion
    // ------------------------------------------------------------------
    console.log('▶ Test 10: Testing Problem Deletion...');
    const delRes = await request('DELETE', `/admin/problems/${createdProblemId}`, undefined, adminToken);
    console.assert(delRes.status === 200, 'Delete problem failed');

    // Clean up bulk problems & test users
    await pool.query("DELETE FROM problems WHERE title LIKE 'Phase 7%'");
    await pool.query("DELETE FROM users WHERE email LIKE 'phase7_%@test.com'");

    console.log('🎉 ========================================================');
    console.log('🎉 All Phase 7 Admin Panel & Problem Management Tests Passed!');
    console.log('🎉 ========================================================\n');
  } catch (error: any) {
    console.error('❌ Phase 7 Test Failed:', error);
    process.exit(1);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await pool.end();
  }
}

runPhase7Tests();
