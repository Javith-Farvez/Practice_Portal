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

const runPhase1Tests = async () => {
  console.log('🧪 ========================================================');
  console.log('🧪 PLACEMENT PRACTICE PORTAL - PHASE 1 AUTOMATED TEST SUITE');
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
  const TEST_PORT = 5099;

  try {
    // 1. Database Connection & Schema Init
    await initDatabase();
    assert(true, '1. Connect to PostgreSQL Database & Verify Schema');

    // 2. Start Test Express Server
    const app = createApp();
    server = app.listen(TEST_PORT);
    assert(true, '2. Backend API Server Started for Testing');

    // Test Health Endpoint
    const healthRes = await makeRequest(TEST_PORT, 'GET', '/api/health');
    assert(healthRes.status === 200 && healthRes.data.success === true, 'API Health Check Endpoint Responds 200 OK');

    // 3. Register a Student
    const testTimestamp = Date.now();
    const studentEmail = `student_${testTimestamp}@test.com`;
    const studentPassword = 'Password123!';

    const regRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/register', {
      name: 'Test Student',
      email: studentEmail,
      password: studentPassword,
      role: 'STUDENT',
    });

    assert(
      regRes.status === 201 && regRes.data.success === true && !!regRes.data.data.token,
      '3. Register Student Account (POST /api/auth/register)',
      JSON.stringify(regRes.data)
    );

    const studentToken = regRes.data?.data?.token;

    // 4. Student Login with correct credentials
    const loginRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/login', {
      email: studentEmail,
      password: studentPassword,
    });

    assert(
      loginRes.status === 200 && loginRes.data.success === true && !!loginRes.data.data.token,
      '4. Student Login (POST /api/auth/login)',
      JSON.stringify(loginRes.data)
    );

    // 5. Verify JWT Authentication on Protected Route (/api/auth/me)
    const meRes = await makeRequest(TEST_PORT, 'GET', '/api/auth/me', undefined, studentToken);
    assert(
      meRes.status === 200 &&
        meRes.data.success === true &&
        meRes.data.data.user.email === studentEmail &&
        meRes.data.data.user.role === 'STUDENT' &&
        !meRes.data.data.user.password_hash,
      '5. Verify JWT Auth & User Profile (GET /api/auth/me - password_hash omitted)',
      JSON.stringify(meRes.data)
    );

    // 6. Test Protected Route without Token (Expect 401)
    const unauthRes = await makeRequest(TEST_PORT, 'GET', '/api/auth/me');
    assert(
      unauthRes.status === 401 && unauthRes.data.success === false,
      '6. Verify Protected Route Rejects Missing Token (401 Unauthorized)',
      JSON.stringify(unauthRes.data)
    );

    // 7. Test Protected Route with Malformed Token (Expect 401)
    const malformedRes = await makeRequest(TEST_PORT, 'GET', '/api/auth/me', undefined, 'invalid.token.here');
    assert(
      malformedRes.status === 401 && malformedRes.data.success === false,
      '7. Verify Protected Route Rejects Invalid Token (401 Unauthorized)',
      JSON.stringify(malformedRes.data)
    );

    // 8. Test Invalid Login (Non-existent Email) (Expect 401)
    const invalidEmailRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/login', {
      email: 'nonexistent_user_999@test.com',
      password: 'SomePassword123!',
    });
    assert(
      invalidEmailRes.status === 401 && invalidEmailRes.data.success === false,
      '8. Test Invalid Login with Non-existent Email (401 Unauthorized)',
      JSON.stringify(invalidEmailRes.data)
    );

    // 9. Test Duplicate Email Registration (Expect 409 Conflict)
    const duplicateRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/register', {
      name: 'Duplicate Student',
      email: studentEmail,
      password: 'AnotherPassword123!',
    });
    assert(
      duplicateRes.status === 409 && duplicateRes.data.success === false,
      '9. Test Duplicate Email Registration (409 Conflict)',
      JSON.stringify(duplicateRes.data)
    );

    // 10. Test Incorrect Password (Expect 401)
    const wrongPasswordRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/login', {
      email: studentEmail,
      password: 'WrongPassword999!',
    });
    assert(
      wrongPasswordRes.status === 401 && wrongPasswordRes.data.success === false,
      '10. Test Incorrect Password Rejection (401 Unauthorized)',
      JSON.stringify(wrongPasswordRes.data)
    );

    // 11. Test Password Validation (Minimum length validation < 8 chars)
    const weakPassRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/register', {
      name: 'Weak Pass',
      email: `weak_${testTimestamp}@test.com`,
      password: '123',
    });
    assert(
      weakPassRes.status === 400 && weakPassRes.data.success === false,
      '11. Test Password Length Validation (<8 chars rejected with 400 Bad Request)',
      JSON.stringify(weakPassRes.data)
    );

    // 12. Test ADMIN Role Protection:
    // 12a: STUDENT attempting to access ADMIN endpoint (Expect 403 Forbidden)
    const studentAccessAdminRes = await makeRequest(
      TEST_PORT,
      'GET',
      '/api/admin/metrics',
      undefined,
      studentToken
    );
    assert(
      studentAccessAdminRes.status === 403 && studentAccessAdminRes.data.success === false,
      '12a. Verify STUDENT role is blocked from ADMIN endpoint (403 Forbidden)',
      JSON.stringify(studentAccessAdminRes.data)
    );

    // 12b: Register/Login ADMIN and access ADMIN endpoint (Expect 200 OK)
    const adminEmail = `admin_${testTimestamp}@test.com`;
    const adminRegRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/register', {
      name: 'Admin Test',
      email: adminEmail,
      password: 'AdminPassword123!',
      role: 'ADMIN',
    });

    const adminToken = adminRegRes.data?.data?.token;
    const adminAccessRes = await makeRequest(
      TEST_PORT,
      'GET',
      '/api/admin/metrics',
      undefined,
      adminToken
    );
    assert(
      adminAccessRes.status === 200 &&
        adminAccessRes.data.success === true &&
        adminAccessRes.data.data.stats !== undefined,
      '12b. Verify ADMIN role successfully accesses ADMIN endpoint (200 OK)',
      JSON.stringify(adminAccessRes.data)
    );

    // 13. Test Logout Endpoint
    const logoutRes = await makeRequest(TEST_PORT, 'POST', '/api/auth/logout');
    assert(
      logoutRes.status === 200 && logoutRes.data.success === true,
      '13. Test Logout Endpoint (POST /api/auth/logout)',
      JSON.stringify(logoutRes.data)
    );

    console.log('\n========================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
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

runPhase1Tests();
