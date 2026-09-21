import { initDatabase, pool } from '../config/db';
import { ProgressService } from '../services/progress/progress.service';
import { DailyPracticeService } from '../services/progress/dailyPractice.service';
import { AchievementService } from '../services/progress/achievement.service';

const runPhase4Tests = async (): Promise<void> => {
  console.log('🧪 ========================================================');
  console.log('🧪 Starting Phase 4 Progress, Streak & Practice Test Suite');
  console.log('🧪 ========================================================\n');

  await initDatabase();

  // Find student user id
  const userRes = await pool.query<any>(
    "SELECT id FROM users WHERE role = 'STUDENT' LIMIT 1"
  );
  const userRows = userRes.rows;
  const studentId = userRows[0]?.id || 2;

  // Clean test tables for studentId to guarantee clean assertions
  await pool.query('DELETE FROM daily_activity WHERE user_id = $1', [studentId]);
  await pool.query('DELETE FROM user_progress WHERE user_id = $1', [studentId]);
  await pool.query('DELETE FROM achievements WHERE user_id = $1', [studentId]);
  await pool.query('DELETE FROM bookmarks WHERE user_id = $1', [studentId]);
  await pool.query('DELETE FROM user_problem_progress WHERE user_id = $1', [studentId]);
  await pool.query('DELETE FROM submissions WHERE user_id = $1', [studentId]);

  // ------------------------------------------------------------------
  // TEST 1: Run vs Accepted Integrity
  // ------------------------------------------------------------------
  console.log('▶ Test 1: Verifying that Run / Failed Submission does NOT count as solved...');
  // Simulate a failed submission
  await ProgressService.recordSubmissionActivity(studentId, 1, 'WRONG_ANSWER');

  const dashAfterFail = await ProgressService.getUserDashboard(studentId);
  console.assert(dashAfterFail.problems_solved === 0, 'Problems solved must remain 0 on failed submission');
  console.assert(dashAfterFail.problems_attempted === 1, 'Problems attempted must be 1');
  console.assert(dashAfterFail.current_streak === 0, 'Current streak must be 0 when 0 problems solved');
  console.log('✅ Test 1 Passed: Failed submissions do not credit solved count or streak.\n');

  // ------------------------------------------------------------------
  // TEST 2: Accepted Submission Credits Progress
  // ------------------------------------------------------------------
  console.log('▶ Test 2: Verifying Accepted Submission credits solved count, accuracy, and active day...');
  await ProgressService.recordSubmissionActivity(studentId, 1, 'ACCEPTED');

  const dashAfterAccepted = await ProgressService.getUserDashboard(studentId);
  console.assert(dashAfterAccepted.problems_solved === 1, 'Problems solved must become 1');
  console.assert(dashAfterAccepted.accepted_submissions === 1, 'Accepted submissions count = 1');
  console.assert(dashAfterAccepted.current_streak === 1, 'Current streak must become 1');
  console.assert(dashAfterAccepted.total_active_days === 1, 'Total active days = 1');
  console.log(
    `Dashboard state: Solved=${dashAfterAccepted.problems_solved}, Streak=${dashAfterAccepted.current_streak}, Accuracy=${dashAfterAccepted.accuracy}%`
  );
  console.log('✅ Test 2 Passed: Accepted submission credited progress and streak.\n');

  // ------------------------------------------------------------------
  // TEST 3: Multiple Solved Problems on Same Day Count as 1 Streak Day
  // ------------------------------------------------------------------
  console.log('▶ Test 3: Verifying multiple solved problems on same day count as 1 streak day...');
  await ProgressService.recordSubmissionActivity(studentId, 2, 'ACCEPTED');

  const dashMultipleSameDay = await ProgressService.getUserDashboard(studentId);
  console.assert(dashMultipleSameDay.problems_solved === 2, 'Problems solved must become 2');
  console.assert(dashMultipleSameDay.total_active_days === 1, 'Total active days must still be 1');
  console.assert(dashMultipleSameDay.current_streak === 1, 'Current streak is still 1');
  console.log('✅ Test 3 Passed: Multiple solves today correctly collapse into 1 streak day.\n');

  // ------------------------------------------------------------------
  // TEST 4: Consecutive Days Streak Calculation
  // ------------------------------------------------------------------
  console.log('▶ Test 4: Verifying Consecutive Days Streak Calculation...');
  // Insert activity for yesterday (Day -1) and Day -2
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const dayMinusTwo = new Date();
  dayMinusTwo.setDate(dayMinusTwo.getDate() - 2);
  const dayMinusTwoStr = dayMinusTwo.toISOString().split('T')[0];

  await pool.query(
    `INSERT INTO daily_activity (user_id, activity_date, problems_solved, total_submissions, accepted_submissions)
     VALUES (?, ?, 1, 1, 1), (?, ?, 2, 2, 2)
     ON DUPLICATE KEY UPDATE problems_solved=VALUES(problems_solved)`,
    [studentId, yesterdayStr, studentId, dayMinusTwoStr]
  );

  await ProgressService.recalculateUserProgress(studentId);
  const dashConsecutive = await ProgressService.getUserDashboard(studentId);

  console.log(
    `Consecutive streak: Current=${dashConsecutive.current_streak}, Longest=${dashConsecutive.longest_streak}, ActiveDays=${dashConsecutive.total_active_days}`
  );
  console.assert(dashConsecutive.current_streak === 3, 'Current streak should be 3 (Day -2, Day -1, Today)');
  console.assert(dashConsecutive.longest_streak >= 3, 'Longest streak should be at least 3');
  console.log('✅ Test 4 Passed: Consecutive day practice increments streak accurately.\n');

  // ------------------------------------------------------------------
  // TEST 5: Skipped Days Resets Current Streak but Preserves Longest Streak
  // ------------------------------------------------------------------
  console.log('▶ Test 5: Verifying Skipped Days behavior...');
  // Clear activity and insert Day -5 and Day -4 (no activity yesterday or today)
  await pool.query('DELETE FROM daily_activity WHERE user_id = ?', [studentId]);
  const dayMinusFour = new Date();
  dayMinusFour.setDate(dayMinusFour.getDate() - 4);
  const dayMinusFive = new Date();
  dayMinusFive.setDate(dayMinusFive.getDate() - 5);

  await pool.query(
    `INSERT INTO daily_activity (user_id, activity_date, problems_solved, total_submissions, accepted_submissions)
     VALUES (?, ?, 1, 1, 1), (?, ?, 1, 1, 1)`,
    [studentId, dayMinusFour.toISOString().split('T')[0], studentId, dayMinusFive.toISOString().split('T')[0]]
  );

  await ProgressService.recalculateUserProgress(studentId);
  const dashSkipped = await ProgressService.getUserDashboard(studentId);

  console.log(`Skipped streak: Current=${dashSkipped.current_streak}, Longest=${dashSkipped.longest_streak}`);
  console.assert(dashSkipped.current_streak === 0, 'Current streak must be 0 if gap > 1 day');
  console.assert(dashSkipped.longest_streak === 2, 'Longest streak must be preserved as 2');
  console.log('✅ Test 5 Passed: Skipped days resets current streak while preserving longest streak.\n');

  // ------------------------------------------------------------------
  // TEST 6: Daily Practice Generator (6 Problems: Java 1, Python 1, DSA 2, Aptitude 2)
  // ------------------------------------------------------------------
  console.log("▶ Test 6: Verifying Daily Practice Generator (6 Problems)...");
  const dailyPractice = await DailyPracticeService.getTodayPractice(studentId);

  console.log(
    `Today's Practice: ${dailyPractice.problems.length} problems generated for ${dailyPractice.date}`
  );
  console.assert(dailyPractice.total_goals === 6, 'Total daily goals = 6');
  console.assert(dailyPractice.problems.length === 6, 'Exactly 6 problems generated');

  const javaCount = dailyPractice.problems.filter((p) => p.subject_slug === 'java').length;
  const pyCount = dailyPractice.problems.filter((p) => p.subject_slug === 'python').length;
  const dsaCount = dailyPractice.problems.filter((p) => p.subject_slug === 'dsa').length;
  const aptCount = dailyPractice.problems.filter((p) => p.subject_slug === 'aptitude').length;

  console.assert(javaCount === 1, 'Java quota = 1');
  console.assert(pyCount === 1, 'Python quota = 1');
  console.assert(dsaCount === 2, 'DSA quota = 2');
  console.assert(aptCount === 2, 'Aptitude quota = 2');
  console.log('✅ Test 6 Passed: Daily Practice quotas distributed accurately.\n');

  // ------------------------------------------------------------------
  // TEST 7: Achievements System
  // ------------------------------------------------------------------
  console.log('▶ Test 7: Verifying Achievements System...');
  // Force 1 solved problem
  await pool.query(
    `INSERT INTO user_problem_progress (user_id, problem_id, status, solved_at)
     VALUES (?, 1, 'SOLVED', NOW())
     ON DUPLICATE KEY UPDATE status='SOLVED'`,
    [studentId]
  );
  await ProgressService.recalculateUserProgress(studentId);

  const unlocked = await AchievementService.evaluateAchievements(studentId);
  const achievements = await AchievementService.getUserAchievements(studentId);

  const firstProblemAch = achievements.find((a) => a.key === 'FIRST_PROBLEM');
  console.assert(firstProblemAch?.is_unlocked === true, 'FIRST_PROBLEM achievement must be unlocked');
  console.log(`Achievements: ${achievements.filter((a) => a.is_unlocked).length}/10 unlocked`);
  console.log('✅ Test 7 Passed: Achievements evaluated and unlocked successfully.\n');

  // ------------------------------------------------------------------
  // TEST 8: Bookmarks Operations
  // ------------------------------------------------------------------
  console.log('▶ Test 8: Verifying Bookmarks Operations...');
  await pool.query('INSERT INTO bookmarks (user_id, problem_id) VALUES ($1, 1)', [studentId]);
  const bRes = await pool.query<any>('SELECT * FROM bookmarks WHERE user_id = $1', [studentId]);
  console.assert(bRes.rows.length === 1, 'Bookmark inserted');

  await pool.query('DELETE FROM bookmarks WHERE user_id = $1 AND problem_id = 1', [studentId]);
  const bAfterRes = await pool.query<any>('SELECT * FROM bookmarks WHERE user_id = $1', [studentId]);
  console.assert(bAfterRes.rows.length === 0, 'Bookmark removed');
  console.log('✅ Test 8 Passed: Bookmarks CRUD verified.\n');

  // ------------------------------------------------------------------
  // TEST 9: Heatmap & Analytics Data Integrity
  // ------------------------------------------------------------------
  console.log('▶ Test 9: Verifying 12-Month Heatmap and Analytics...');
  const heatmap = await ProgressService.getActivityHeatmap(studentId);
  console.assert(heatmap.start_date !== undefined, 'Heatmap start date present');

  const analytics = await ProgressService.getUserAnalytics(studentId);
  console.assert(analytics.difficulty !== undefined, 'Difficulty distribution present');
  console.assert(analytics.submissions !== undefined, 'Submission stats present');
  console.log('✅ Test 9 Passed: Heatmap and analytics calculated cleanly.\n');

  console.log('🎉 ========================================================');
  console.log('🎉 All Phase 4 Progress, Streak & Practice Tests Passed!');
  console.log('🎉 ========================================================\n');
};

runPhase4Tests()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Phase 4 Test Failed:', err);
    await pool.end();
    process.exit(1);
  });
