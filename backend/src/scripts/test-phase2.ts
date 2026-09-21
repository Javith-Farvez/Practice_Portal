import http from 'http';
import { createApp } from '../app';
import { initDatabase, pool } from '../config/db';

interface ApiResponse {
  status: number;
  data: any;
}

const makeRequest = (
  port: number,
  method: string,
  path: string,
  body?: any,
  token?: string
): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData).toString(),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          let parsedData = null;
          try {
            parsedData = JSON.parse(rawData);
          } catch (e) {
            parsedData = rawData;
          }
          resolve({
            status: res.statusCode || 500,
            data: parsedData,
          });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const runPhase2Tests = async () => {
  console.log('🧪 ========================================================');
  console.log('🧪 PLACEMENT PRACTICE PORTAL - PHASE 2 AUTOMATED TEST SUITE');
  console.log('🧪 ========================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, detail?: string) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (detail) console.error(`   Details: ${detail}`);
      failed++;
    }
  };

  let server: http.Server;
  const TEST_PORT = 5098;

  try {
    await initDatabase();
    const app = createApp();
    server = app.listen(TEST_PORT);
    assert(true, '1. Test Server started & PostgreSQL schema validated');

    // 2. Fetch Subjects
    const subjectsRes = await makeRequest(TEST_PORT, 'GET', '/api/subjects');
    const subjects = subjectsRes.data?.data?.subjects || [];
    assert(
      subjectsRes.status === 200 &&
        subjects.length === 4 &&
        subjects.some((s: any) => s.slug === 'java') &&
        subjects.some((s: any) => s.slug === 'python') &&
        subjects.some((s: any) => s.slug === 'dsa') &&
        subjects.some((s: any) => s.slug === 'aptitude'),
      '2. Load all 4 Subjects from database (Java, Python, DSA, Aptitude)',
      `Found subjects: ${subjects.map((s: any) => s.slug).join(', ')}`
    );

    // 3. Subject Roadmap (Java - 19 topics)
    const javaRoadmapRes = await makeRequest(TEST_PORT, 'GET', '/api/subjects/java');
    const javaTopics = javaRoadmapRes.data?.data?.topics || [];
    assert(
      javaRoadmapRes.status === 200 && javaTopics.length === 19,
      '3. Load Java Roadmap with all 19 Topics',
      `Found ${javaTopics.length} topics for Java.`
    );

    // Verify Python (20 topics), DSA (17 topics), Aptitude (17 topics)
    const pyRes = await makeRequest(TEST_PORT, 'GET', '/api/subjects/python');
    assert(
      pyRes.status === 200 && pyRes.data?.data?.topics?.length === 20,
      '4a. Load Python Roadmap with 20 Topics'
    );

    const dsaRes = await makeRequest(TEST_PORT, 'GET', '/api/subjects/dsa');
    assert(
      dsaRes.status === 200 && dsaRes.data?.data?.topics?.length === 17,
      '4b. Load DSA Roadmap with 17 Topics'
    );

    const aptRes = await makeRequest(TEST_PORT, 'GET', '/api/subjects/aptitude');
    assert(
      aptRes.status === 200 && aptRes.data?.data?.topics?.length === 17,
      '4c. Load Aptitude Roadmap with 17 Topics'
    );

    // 5. Problems Catalog - Basic Retrieval
    const problemsRes = await makeRequest(TEST_PORT, 'GET', '/api/problems');
    const totalProblems = problemsRes.data?.data?.total || 0;
    const problemsList = problemsRes.data?.data?.problems || [];
    assert(
      problemsRes.status === 200 && totalProblems >= 50 && problemsList.length > 0,
      `5. Retrieve Problem Catalog (Total problems: ${totalProblems})`
    );

    // 6. Test Problem Filters:
    // 6a: Difficulty filter
    const easyProblemsRes = await makeRequest(TEST_PORT, 'GET', '/api/problems?difficulty=EASY');
    const easyList = easyProblemsRes.data?.data?.problems || [];
    assert(
      easyProblemsRes.status === 200 && easyList.length > 0 && easyList.every((p: any) => p.difficulty === 'EASY'),
      '6a. Filter problems by difficulty=EASY'
    );

    // 6b: Level filter
    const beginnerRes = await makeRequest(TEST_PORT, 'GET', '/api/problems?level=BEGINNER');
    const begList = beginnerRes.data?.data?.problems || [];
    assert(
      beginnerRes.status === 200 && begList.length > 0 && begList.every((p: any) => p.level === 'BEGINNER'),
      '6b. Filter problems by level=BEGINNER'
    );

    // 6c: Subject filter
    const javaProblemsRes = await makeRequest(TEST_PORT, 'GET', '/api/problems?subject=java');
    const javaList = javaProblemsRes.data?.data?.problems || [];
    assert(
      javaProblemsRes.status === 200 && javaList.length > 0 && javaList.every((p: any) => p.subject_slug === 'java'),
      '6c. Filter problems by subject=java'
    );

    // 6d: Search keyword filter
    const searchRes = await makeRequest(TEST_PORT, 'GET', '/api/problems?search=Kadane');
    const searchList = searchRes.data?.data?.problems || [];
    assert(
      searchRes.status === 200 && searchList.length > 0 && searchList.some((p: any) => p.title.includes('Kadane')),
      '6d. Search problems by keyword "Kadane"'
    );

    // 7. Problem Detail view
    const testProblemId = problemsList[0]?.id;
    const detailRes = await makeRequest(TEST_PORT, 'GET', `/api/problems/${testProblemId}`);
    const probDetail = detailRes.data?.data?.problem;
    assert(
      detailRes.status === 200 &&
        probDetail &&
        probDetail.id === testProblemId &&
        probDetail.input_format &&
        probDetail.output_format &&
        probDetail.constraints &&
        Array.isArray(probDetail.hints),
      '7. Problem Details View with I/O format, constraints, and hints'
    );

    // 8. Auth Protection on Progress Endpoints (Expect 401 without token)
    const unauthSolveRes = await makeRequest(TEST_PORT, 'POST', `/api/problems/${testProblemId}/toggle-solve`);
    assert(
      unauthSolveRes.status === 401,
      '8. Unauthenticated user rejected from toggling solved state (401 Unauthorized)'
    );

    // 9. Student Login & Real Progress Tracking
    const loginRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/login', {
      email: 'rahul@student.com',
      password: 'Student@123456',
    });
    const studentToken = loginRes.data?.data?.token;

    assert(!!studentToken, '9a. Authenticate Student (rahul@student.com)');

    // Reset progress before test to guarantee clean slate
    await pool.query(
      "DELETE FROM user_problem_progress WHERE user_id = (SELECT id FROM users WHERE email = 'rahul@student.com')"
    );

    // 9b. Toggle problem solve
    const solveRes = await makeRequest(
      TEST_PORT,
      'POST',
      `/api/problems/${testProblemId}/toggle-solve`,
      {},
      studentToken
    );
    assert(
      solveRes.status === 200 && solveRes.data?.data?.status === 'SOLVED',
      '9b. Student marks problem as SOLVED (Real database state update)'
    );

    // 9c. Verify User Progress API calculates non-zero, real progress
    const progressRes = await makeRequest(TEST_PORT, 'GET', '/api/user/progress', undefined, studentToken);
    const progressData = progressRes.data?.data;
    assert(
      progressRes.status === 200 &&
        progressData.problems_solved >= 1 &&
        progressData.overall_progress_percentage > 0 &&
        Array.isArray(progressData.subjects),
      `9c. Dynamic user progress computed accurately (Solved: ${progressData.problems_solved}, Progress: ${progressData.overall_progress_percentage}%)`
    );

    // 9d. Toggle bookmark
    const bookmarkRes = await makeRequest(
      TEST_PORT,
      'POST',
      `/api/problems/${testProblemId}/toggle-bookmark`,
      {},
      studentToken
    );
    assert(
      bookmarkRes.status === 200 && bookmarkRes.data?.data?.is_bookmarked === true,
      '9d. Student bookmarks problem successfully'
    );

    // 10. Role Protection check
    const adminCheckRes = await makeRequest(
      TEST_PORT,
      'GET',
      '/api/admin/metrics',
      undefined,
      studentToken
    );
    assert(
      adminCheckRes.status === 403,
      '10. Student role cannot access admin APIs (403 Forbidden)'
    );

    console.log('\n========================================================');
    console.log(`📊 PHASE 2 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================================\n');

    server.close();
    await pool.end();

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('💥 Unhandled error in test suite:', err);
    if (server!) server.close();
    await pool.end();
    process.exit(1);
  }
};

runPhase2Tests();
