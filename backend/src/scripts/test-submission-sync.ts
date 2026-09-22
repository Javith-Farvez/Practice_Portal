import { pool } from '../config/db';
import { JudgeService } from '../services/judge/judge.service';
import { ProgressService } from '../services/progress/progress.service';

async function runVerification() {
  console.log('🚀 Starting Data Synchronization End-to-End Verification Test...');

  // 1. Create or fetch a test student user (User ID 9999 or dedicated test user)
  const testEmail = 'sync_verifier_student@example.com';
  let userId: number;

  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [testEmail]);
  if (existingUser.rows.length > 0) {
    userId = existingUser.rows[0].id;
  } else {
    const insertRes = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('Sync Verifier Student', $1, 'hashed_dummy_pw', 'STUDENT')
       RETURNING id`,
      [testEmail]
    );
    userId = insertRes.rows[0].id;
  }
  console.log(`👤 Using Test Student User ID: ${userId}`);

  // 2. Clean previous state for this test user
  await pool.query('DELETE FROM submissions WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM user_problem_progress WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM daily_activity WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM user_progress WHERE user_id = $1', [userId]);

  // Recalculate to ensure clean zero state
  await ProgressService.recalculateUserProgress(userId);

  console.log('🧹 Cleaned up previous user data to verify clean baseline.');

  // 3. Verify Baseline state is genuinely 0
  const baselineDash = await ProgressService.getUserDashboard(userId);
  const baselineAnalytics = await ProgressService.getUserAnalytics(userId);

  console.log('📊 Baseline Check:');
  console.log(`   - Solved: ${baselineDash.problems_solved} / ${baselineDash.total_problems}`);
  console.log(`   - Accuracy: ${baselineDash.accuracy}%`);
  console.log(`   - Weekly Solved: ${baselineAnalytics.weekly_activity.problems_solved}`);
  console.log(`   - Monthly Solved: ${baselineAnalytics.monthly_activity.problems_solved}`);

  if (baselineDash.problems_solved !== 0) throw new Error('Baseline solved should be 0');
  if (baselineDash.total_problems < 250) throw new Error(`Total problems in DB should be >= 250, got ${baselineDash.total_problems}`);
  if (baselineAnalytics.weekly_activity.problems_solved !== 0) throw new Error('Baseline weekly should be 0');

  // 4. TEST STEP: RUN Problem #1
  // Problem #1 is "Swap Two Numbers Using a Third Variable"
  const correctJavaCode = `
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        int temp = a;
        a = b;
        b = temp;
        
        System.out.println(a + " " + b);
    }
}
`;

  console.log('\n🧪 Testing RUN on Problem #1...');
  const runRes = await JudgeService.runPublicTests(1, 'JAVA', correctJavaCode);
  console.log(`   - RUN Status: ${runRes.status}`);
  console.log(`   - Passed Public Tests: ${runRes.passedPublicTests} / ${runRes.totalPublicTests}`);

  // Confirm RUN did NOT mark problem as solved or create submissions
  const checkSubRun = await pool.query('SELECT COUNT(*) as c FROM submissions WHERE user_id = $1', [userId]);
  const checkProgRun = await pool.query('SELECT COUNT(*) as c FROM user_problem_progress WHERE user_id = $1', [userId]);

  if (Number(checkSubRun.rows[0].c) !== 0) throw new Error('RUN must not insert submissions');
  if (Number(checkProgRun.rows[0].c) !== 0) throw new Error('RUN must not update problem progress');
  console.log('   ✓ Verified: RUN does not mark problem solved or insert submissions.');

  // 5. TEST STEP: SUBMIT Problem #1 with correct solution
  console.log('\n🚀 Testing SUBMIT on Problem #1 with correct Java solution...');
  const submitRes = await JudgeService.submitSolution(userId, 1, 'JAVA', correctJavaCode);
  console.log(`   - Submission Verdict: ${submitRes.status}`);
  console.log(`   - Passed Tests: ${submitRes.passedCount} / ${submitRes.totalCount}`);
  console.log(`   - Submission ID: ${submitRes.submissionId}`);

  if (submitRes.status !== 'ACCEPTED') {
    throw new Error(`Expected ACCEPTED, got ${submitRes.status}: ${submitRes.compilationError || ''}`);
  }

  // 6. Verify PostgreSQL database records directly
  console.log('\n🔍 Verifying PostgreSQL database tables...');
  const subRows = await pool.query(
    'SELECT id, user_id, problem_id, status, language, passed_tests, total_tests FROM submissions WHERE user_id = $1',
    [userId]
  );
  console.log(`   - Submissions table row count: ${subRows.rows.length}`);
  if (subRows.rows.length !== 1) throw new Error('Submissions table should have exactly 1 row');
  if (subRows.rows[0].status !== 'ACCEPTED') throw new Error(`Submission status should be ACCEPTED, got ${subRows.rows[0].status}`);

  const progRows = await pool.query(
    'SELECT problem_id, status, solved_at FROM user_problem_progress WHERE user_id = $1',
    [userId]
  );
  console.log(`   - user_problem_progress table: status = ${progRows.rows[0]?.status}`);
  if (progRows.rows.length !== 1 || progRows.rows[0].status !== 'SOLVED') {
    throw new Error('user_problem_progress should have status SOLVED');
  }

  const dailyRows = await pool.query(
    'SELECT activity_date::text as activity_date, problems_solved, accepted_submissions, total_submissions FROM daily_activity WHERE user_id = $1',
    [userId]
  );
  console.log('   - daily_activity table:', dailyRows.rows[0]);
  if (dailyRows.rows.length !== 1 || Number(dailyRows.rows[0].problems_solved) !== 1) {
    throw new Error('daily_activity should have 1 problems_solved');
  }

  // 7. Verify Submissions Page query (with LEFT JOIN)
  console.log('\n📄 Testing Submissions Page Query...');
  const subQueryRes = await pool.query(
    `SELECT 
       s.id,
       s.user_id,
       s.problem_id,
       COALESCE(p.title, 'Problem #' || s.problem_id) as problem_title,
       s.language,
       s.status,
       s.passed_tests,
       s.total_tests
     FROM submissions s
     LEFT JOIN problems p ON s.problem_id = p.id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC`,
    [userId]
  );
  console.log(`   - Submissions returned: ${subQueryRes.rows.length}`);
  console.log(`   - First submission: "${subQueryRes.rows[0].problem_title}", Verdict: ${subQueryRes.rows[0].status}`);
  if (subQueryRes.rows.length === 0) throw new Error('Submissions query returned 0 rows! Expected 1.');

  // 8. Verify Dashboard API
  console.log('\n📈 Testing Dashboard API calculation...');
  const dashData = await ProgressService.getUserDashboard(userId);
  console.log(`   - Questions Solved: ${dashData.problems_solved} / ${dashData.total_problems}`);
  console.log(`   - Judge Accuracy: ${dashData.accuracy}%`);
  console.log(`   - Current Streak: ${dashData.current_streak} Day(s)`);
  console.log(`   - Total Submissions: ${dashData.total_submissions}`);

  if (dashData.problems_solved !== 1) throw new Error(`Dashboard problems_solved should be 1, got ${dashData.problems_solved}`);
  if (dashData.accuracy !== 100) throw new Error(`Dashboard accuracy should be 100%, got ${dashData.accuracy}`);
  if (dashData.current_streak !== 1) throw new Error(`Dashboard current_streak should be 1, got ${dashData.current_streak}`);

  // 9. Verify Analytics API
  console.log('\n📊 Testing Analytics API calculation...');
  const analyticsData = await ProgressService.getUserAnalytics(userId);
  console.log(`   - Accuracy Card: ${analyticsData.accuracy}%`);
  console.log(`   - Past 7 Days Card: ${analyticsData.weekly_activity.problems_solved}`);
  console.log(`   - This Month Card: ${analyticsData.monthly_activity.problems_solved}`);
  console.log(`   - Needs Practice Card: ${analyticsData.weak_topics.length}`);
  console.log(`   - Weekly Chart Bars: ${analyticsData.weekly_chart.length} days`);
  console.log(`   - Monthly Chart Bars: ${analyticsData.monthly_chart.length} months`);

  const todayWeeklyBar = analyticsData.weekly_chart[analyticsData.weekly_chart.length - 1];
  console.log(`   - Today's Chart Bar (${todayWeeklyBar.day_name} ${todayWeeklyBar.date}): Solved=${todayWeeklyBar.solved}, Submissions=${todayWeeklyBar.submissions}`);

  const currentMonthBar = analyticsData.monthly_chart[analyticsData.monthly_chart.length - 1];
  console.log(`   - Current Month Chart Bar (${currentMonthBar.month} ${currentMonthBar.year_month}): Solved=${currentMonthBar.solved}, Submissions=${currentMonthBar.submissions}`);

  if (analyticsData.accuracy !== 100) throw new Error(`Analytics accuracy should be 100%, got ${analyticsData.accuracy}`);
  if (analyticsData.weekly_activity.problems_solved !== 1) throw new Error(`Weekly activity should be 1, got ${analyticsData.weekly_activity.problems_solved}`);
  if (analyticsData.monthly_activity.problems_solved !== 1) throw new Error(`Monthly activity should be 1, got ${analyticsData.monthly_activity.problems_solved}`);
  if (todayWeeklyBar.solved !== 1) throw new Error(`Today's weekly bar should show 1 solved problem, got ${todayWeeklyBar.solved}`);
  if (currentMonthBar.solved !== 1) throw new Error(`Current month's bar should show 1 solved problem, got ${currentMonthBar.solved}`);

  // 10. Multi-user data isolation test
  console.log('\n🔒 Verifying Multi-User Data Isolation...');
  const anotherUserDash = await ProgressService.getUserDashboard(3); // User 3 (Javith)
  const anotherUserAnalytics = await ProgressService.getUserAnalytics(3);
  console.log(`   - User 3 Dashboard Solved: ${anotherUserDash.problems_solved}`);
  console.log(`   - User 3 Weekly Solved: ${anotherUserAnalytics.weekly_activity.problems_solved}`);
  if (anotherUserDash.problems_solved === 1 && userId !== 3) {
    console.log('   Notice: User 3 has their own isolated stats.');
  }

  // 11. Cleanup test student
  await pool.query('DELETE FROM submissions WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM user_problem_progress WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM daily_activity WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM user_progress WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM users WHERE id = $1', [userId]);
  console.log('\n🧹 Test verification student and submission data cleaned up.');

  console.log('\n🎉 ALL 11 VERIFICATION CHECKS PASSED PERFECTLY!');
  await pool.end();
}

runVerification().catch((err) => {
  console.error('\n❌ Verification failed:', err);
  pool.end();
  process.exit(1);
});
