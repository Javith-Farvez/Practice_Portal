import { pool } from '../../config/db';
import { AchievementService } from './achievement.service';
import { fallbackStore } from '../../data/fallbackStore';

export class ProgressService {
  /**
   * Records a submission's activity into daily_activity and recalculates user_progress & streaks.
   * Only marks problem as solved if status === 'ACCEPTED'.
   */
  public static async recordSubmissionActivity(
    userId: number,
    problemId: number,
    status: string,
    language = 'JAVA',
    sourceCode = ''
  ): Promise<void> {
    const isAccepted = status === 'ACCEPTED';
    const todayStr = new Date().toISOString().split('T')[0];

    // Always update fallback store
    fallbackStore.recordSubmission(
      userId,
      problemId,
      language,
      sourceCode,
      status,
      isAccepted ? 1 : 0,
      1,
      10,
      2048
    );

    try {
      // 1. Check previous status of problem for this user
      const prevProgressRes = await pool.query(
        'SELECT status FROM user_problem_progress WHERE user_id = $1 AND problem_id = $2 LIMIT 1',
        [userId, problemId]
      );

      const prevProgressRows = prevProgressRes.rows;
      const wasAlreadySolved =
        prevProgressRows.length > 0 && prevProgressRows[0].status === 'SOLVED';
      const wasAlreadyAttempted = prevProgressRows.length > 0;

      const isNewlySolved = isAccepted && !wasAlreadySolved;
      const isNewlyAttempted = !wasAlreadyAttempted;

      // 2. Update user_problem_progress (PostgreSQL ON CONFLICT)
      if (isAccepted) {
        await pool.query(
          `INSERT INTO user_problem_progress (user_id, problem_id, status, solved_at)
           VALUES ($1, $2, 'SOLVED', NOW())
           ON CONFLICT (user_id, problem_id) DO UPDATE SET 
             status = 'SOLVED', 
             solved_at = COALESCE(user_problem_progress.solved_at, NOW())`,
          [userId, problemId]
        );
      } else {
        await pool.query(
          `INSERT INTO user_problem_progress (user_id, problem_id, status)
           VALUES ($1, $2, 'ATTEMPTED')
           ON CONFLICT (user_id, problem_id) DO UPDATE SET 
             status = CASE WHEN user_problem_progress.status = 'SOLVED' THEN 'SOLVED' ELSE 'ATTEMPTED' END`,
          [userId, problemId]
        );
      }

      // 3. Update daily_activity for today (PostgreSQL ON CONFLICT)
      await pool.query(
        `INSERT INTO daily_activity (
          user_id, activity_date, total_submissions, accepted_submissions, problems_solved, problems_attempted
        ) VALUES ($1, $2, 1, $3, $4, $5)
        ON CONFLICT (user_id, activity_date) DO UPDATE SET 
          total_submissions = daily_activity.total_submissions + 1,
          accepted_submissions = daily_activity.accepted_submissions + EXCLUDED.accepted_submissions,
          problems_solved = daily_activity.problems_solved + EXCLUDED.problems_solved,
          problems_attempted = daily_activity.problems_attempted + EXCLUDED.problems_attempted`,
        [
          userId,
          todayStr,
          isAccepted ? 1 : 0,
          isNewlySolved ? 1 : 0,
          isNewlyAttempted ? 1 : 0,
        ]
      );

      // 4. Recalculate Streak & Aggregate User Progress
      await this.recalculateUserProgress(userId);

      // 5. Evaluate achievements
      try {
        await AchievementService.evaluateAchievements(userId);
      } catch (achErr) {
        console.error('Failed to evaluate achievements:', achErr);
      }
    } catch (dbErr) {
      console.warn('[Progress Service] Database update failed in recordSubmissionActivity, fallback store was updated:', (dbErr as any).message);
    }
  }

  /**
   * Recalculates user_progress aggregate row and historical streaks.
   */
  public static async recalculateUserProgress(userId: number): Promise<void> {
    // 1. Calculate active dates where user solved >= 1 problem (or has accepted submission)
    const dateRes = await pool.query(
      `SELECT DISTINCT activity_date 
       FROM daily_activity 
       WHERE user_id = $1 AND (problems_solved > 0 OR accepted_submissions > 0)
       ORDER BY activity_date DESC`,
      [userId]
    );

    const dateRows = dateRes.rows;
    const activeDates = dateRows.map(
      (r: any) => new Date(r.activity_date).toISOString().split('T')[0]
    );

    let currentStreak = 0;
    let longestStreak = 0;
    const totalActiveDays = activeDates.length;

    if (activeDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const latestDate = new Date(activeDates[0]);
      latestDate.setHours(0, 0, 0, 0);

      // Streak counts if practiced today or yesterday
      if (
        latestDate.getTime() === today.getTime() ||
        latestDate.getTime() === yesterday.getTime()
      ) {
        currentStreak = 1;
        let expectedDate = new Date(latestDate);

        for (let i = 1; i < activeDates.length; i++) {
          expectedDate.setDate(expectedDate.getDate() - 1);
          const nextDate = new Date(activeDates[i]);
          nextDate.setHours(0, 0, 0, 0);

          if (nextDate.getTime() === expectedDate.getTime()) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Compute longest streak across historical contiguous blocks
      let tempStreak = 1;
      longestStreak = 1;
      for (let i = 1; i < activeDates.length; i++) {
        const prev = new Date(activeDates[i - 1]);
        prev.setHours(0, 0, 0, 0);
        const curr = new Date(activeDates[i]);
        curr.setHours(0, 0, 0, 0);

        const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    // 2. Aggregate problem stats
    const solvedRes = await pool.query(
      "SELECT COUNT(DISTINCT problem_id) as count FROM user_problem_progress WHERE user_id = $1 AND status = 'SOLVED'",
      [userId]
    );
    const problemsSolved = Number(solvedRes.rows[0]?.count) || 0;

    const attemptedRes = await pool.query(
      'SELECT COUNT(DISTINCT problem_id) as count FROM user_problem_progress WHERE user_id = $1',
      [userId]
    );
    const problemsAttempted = Number(attemptedRes.rows[0]?.count) || 0;

    const submissionRes = await pool.query(
      `SELECT 
        COUNT(*) as total_sub,
        COUNT(CASE WHEN status = 'ACCEPTED' THEN 1 END) as accepted_sub
       FROM submissions WHERE user_id = $1`,
      [userId]
    );

    const totalSubmissions = Number(submissionRes.rows[0]?.total_sub) || 0;
    const acceptedSubmissions = Number(submissionRes.rows[0]?.accepted_sub) || 0;
    const accuracy =
      totalSubmissions > 0
        ? Math.round((acceptedSubmissions / totalSubmissions) * 10000) / 100
        : 0;

    const lastActivityDate = activeDates.length > 0 ? activeDates[0] : null;

    // 3. Upsert user_progress (PostgreSQL ON CONFLICT)
    await pool.query(
      `INSERT INTO user_progress (
        user_id, problems_attempted, problems_solved, accepted_submissions,
        total_submissions, accuracy, current_streak, longest_streak,
        total_active_days, last_activity_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id) DO UPDATE SET
        problems_attempted = EXCLUDED.problems_attempted,
        problems_solved = EXCLUDED.problems_solved,
        accepted_submissions = EXCLUDED.accepted_submissions,
        total_submissions = EXCLUDED.total_submissions,
        accuracy = EXCLUDED.accuracy,
        current_streak = EXCLUDED.current_streak,
        longest_streak = EXCLUDED.longest_streak,
        total_active_days = EXCLUDED.total_active_days,
        last_activity_date = EXCLUDED.last_activity_date,
        updated_at = CURRENT_TIMESTAMP`,
      [
        userId,
        problemsAttempted,
        problemsSolved,
        acceptedSubmissions,
        totalSubmissions,
        accuracy,
        currentStreak,
        longestStreak,
        totalActiveDays,
        lastActivityDate,
      ]
    );
  }

  /**
   * Retrieves full dashboard summary.
   */
  public static async getUserDashboard(userId: number) {
    try {
      // Ensure progress row exists
      try {
        await this.recalculateUserProgress(userId);
      } catch {}

      const totalProbRes = await pool.query('SELECT COUNT(*) as count FROM problems');
      const totalProblems = Number(totalProbRes.rows[0]?.count) || 0;

      if (totalProblems > 0) {
        const progRes = await pool.query(
          'SELECT * FROM user_progress WHERE user_id = $1 LIMIT 1',
          [userId]
        );
        const progress = progRes.rows[0] || {};
        const solvedProblems = Number(progress.problems_solved) || 0;
        const overallPercentage =
          totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

        // Subject breakdown
        const subjectSql = `
          SELECT 
            s.id,
            s.slug,
            s.name,
            COUNT(p.id) as total,
            COUNT(CASE WHEN upp.status = 'SOLVED' THEN 1 END) as solved
          FROM subjects s
          LEFT JOIN problems p ON s.id = p.subject_id
          LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
          GROUP BY s.id, s.slug, s.name, s.order_index
          ORDER BY s.order_index ASC
        `;

        const subjectRes = await pool.query(subjectSql, [userId]);
        const subjects = subjectRes.rows.map((row: any) => {
          const tot = Number(row.total) || 0;
          const sol = Number(row.solved) || 0;
          return {
            id: row.id,
            slug: row.slug,
            name: row.name,
            total: tot,
            solved: sol,
            percentage: tot > 0 ? Math.round((sol / tot) * 100) : 0,
          };
        });

        return {
          problems_solved: solvedProblems,
          problems_attempted: Number(progress.problems_attempted) || 0,
          total_problems: totalProblems,
          overall_progress_percentage: overallPercentage,
          accepted_submissions: Number(progress.accepted_submissions) || 0,
          total_submissions: Number(progress.total_submissions) || 0,
          accuracy: Number(progress.accuracy) || 0,
          current_streak: Number(progress.current_streak) || 0,
          longest_streak: Number(progress.longest_streak) || 0,
          total_active_days: Number(progress.total_active_days) || 0,
          last_activity_date: progress.last_activity_date,
          subjects,
        };
      }
    } catch (dbErr) {
      console.warn('[Progress Service] Database query for dashboard failed, using fallback store:', (dbErr as any).message);
    }

    // Fallback store
    return fallbackStore.getUserDashboard(userId);
  }

  /**
   * Retrieves 12-month annual activity heatmap data.
   */
  public static async getActivityHeatmap(userId: number) {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);
      const startDateStr = oneYearAgo.toISOString().split('T')[0];

      const result = await pool.query(
        `SELECT activity_date, problems_solved, total_submissions
         FROM daily_activity
         WHERE user_id = $1 AND activity_date >= $2
         ORDER BY activity_date ASC`,
        [userId, startDateStr]
      );

      if (result.rows && result.rows.length > 0) {
        const activityMap: Record<string, { count: number; submissions: number; level: number }> = {};
        let totalSolvedYear = 0;
        let totalSubmissionsYear = 0;

        result.rows.forEach((r: any) => {
          const dateKey = new Date(r.activity_date).toISOString().split('T')[0];
          const solved = Number(r.problems_solved) || 0;
          const subs = Number(r.total_submissions) || 0;

          totalSolvedYear += solved;
          totalSubmissionsYear += subs;

          // Intensity level: 0 to 4
          let level = 0;
          if (solved >= 6) level = 4;
          else if (solved >= 4) level = 3;
          else if (solved >= 2) level = 2;
          else if (solved >= 1) level = 1;
          else if (subs > 0) level = 1;

          activityMap[dateKey] = {
            count: solved,
            submissions: subs,
            level,
          };
        });

        return {
          start_date: startDateStr,
          total_problems_solved: totalSolvedYear,
          total_submissions: totalSubmissionsYear,
          days: activityMap,
        };
      }
    } catch (dbErr) {
      console.warn('[Progress Service] Database query for activity heatmap failed, using fallback store:', (dbErr as any).message);
    }

    // Fallback store
    return fallbackStore.getActivityHeatmap(userId);
  }

  /**
   * Retrieves deep learning analytics
   */
  public static async getUserAnalytics(userId: number) {
    try {
      // 1. Difficulty Distribution
      const diffRes = await pool.query(
      `SELECT 
        p.difficulty,
        COUNT(p.id) as total,
        COUNT(CASE WHEN upp.status = 'SOLVED' THEN 1 END) as solved
       FROM problems p
       LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
       GROUP BY p.difficulty`,
      [userId]
    );

    const difficultyDistribution = {
      EASY: { total: 0, solved: 0 },
      MEDIUM: { total: 0, solved: 0 },
      HARD: { total: 0, solved: 0 },
    };

    diffRes.rows.forEach((r: any) => {
      const diff = r.difficulty as 'EASY' | 'MEDIUM' | 'HARD';
      if (difficultyDistribution[diff]) {
        difficultyDistribution[diff] = {
          total: Number(r.total) || 0,
          solved: Number(r.solved) || 0,
        };
      }
    });

    // 2. Submission status breakdown (Accepted vs Rejected)
    const statusRes = await pool.query(
      `SELECT status, COUNT(*) as count FROM submissions WHERE user_id = $1 GROUP BY status`,
      [userId]
    );

    const submissionStats: Record<string, number> = {};
    let totalSubs = 0;
    let acceptedSubs = 0;
    statusRes.rows.forEach((r: any) => {
      const count = Number(r.count) || 0;
      submissionStats[r.status] = count;
      totalSubs += count;
      if (r.status === 'ACCEPTED') {
        acceptedSubs += count;
      }
    });

    const rejectedSubs = totalSubs - acceptedSubs;
    const accuracy = totalSubs > 0 ? Math.round((acceptedSubs / totalSubs) * 10000) / 100 : 0;

    // 3. Activity trends: last 30 days
    const dailyRes = await pool.query(
      `SELECT activity_date, problems_solved, total_submissions
       FROM daily_activity
       WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '30 days'
       ORDER BY activity_date ASC`,
      [userId]
    );

    const problemsSolvedPerDay = dailyRes.rows.map((r: any) => ({
      date: new Date(r.activity_date).toISOString().split('T')[0],
      solved: Number(r.problems_solved) || 0,
      submissions: Number(r.total_submissions) || 0,
    }));

    // 4. Weekly Activity (last 7 days)
    const weeklyRes = await pool.query(
      `SELECT 
        COALESCE(SUM(problems_solved), 0) as solved,
        COALESCE(SUM(total_submissions), 0) as submissions
       FROM daily_activity
       WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '7 days'`,
      [userId]
    );
    const weeklyActivity = {
      problems_solved: Number(weeklyRes.rows[0]?.solved) || 0,
      total_submissions: Number(weeklyRes.rows[0]?.submissions) || 0,
    };

    // 5. Monthly Activity (current month)
    const monthlyRes = await pool.query(
      `SELECT 
        COALESCE(SUM(problems_solved), 0) as solved,
        COALESCE(SUM(total_submissions), 0) as submissions
       FROM daily_activity
       WHERE user_id = $1 
         AND EXTRACT(YEAR FROM activity_date) = EXTRACT(YEAR FROM CURRENT_DATE)
         AND EXTRACT(MONTH FROM activity_date) = EXTRACT(MONTH FROM CURRENT_DATE)`,
      [userId]
    );
    const monthlyActivity = {
      problems_solved: Number(monthlyRes.rows[0]?.solved) || 0,
      total_submissions: Number(monthlyRes.rows[0]?.submissions) || 0,
    };

    // 6. Subject Progress
    const subjectRes = await pool.query(
      `SELECT 
        s.id,
        s.slug,
        s.name,
        COUNT(p.id) as total,
        COUNT(CASE WHEN upp.status = 'SOLVED' THEN 1 END) as solved
      FROM subjects s
      LEFT JOIN problems p ON s.id = p.subject_id
      LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
      GROUP BY s.id, s.slug, s.name, s.order_index
      ORDER BY s.order_index ASC`,
      [userId]
    );
    const subjectProgress = subjectRes.rows.map((r: any) => {
      const tot = Number(r.total) || 0;
      const sol = Number(r.solved) || 0;
      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        total: tot,
        solved: sol,
        percentage: tot > 0 ? Math.round((sol / tot) * 100) : 0,
      };
    });

    // 7. Topic Progress
    const topicRes = await pool.query(
      `SELECT 
        t.id,
        t.name as topic_name,
        s.name as subject_name,
        s.slug as subject_slug,
        COUNT(p.id) as total,
        COUNT(CASE WHEN upp.status = 'SOLVED' THEN 1 END) as solved
       FROM topics t
       JOIN subjects s ON t.subject_id = s.id
       LEFT JOIN problems p ON t.id = p.topic_id
       LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
       GROUP BY t.id, t.name, s.name, s.slug, s.order_index, t.order_index
       ORDER BY s.order_index ASC, t.order_index ASC`,
      [userId]
    );
    const topicProgress = topicRes.rows.map((r: any) => {
      const tot = Number(r.total) || 0;
      const sol = Number(r.solved) || 0;
      return {
        id: r.id,
        topic_name: r.topic_name,
        subject_name: r.subject_name,
        subject_slug: r.subject_slug,
        total: tot,
        solved: sol,
        percentage: tot > 0 ? Math.round((sol / tot) * 100) : 0,
      };
    });

    // 8. Per-Topic Accuracy & Weak/Strong Topics calculation
    const topicSubmissionRes = await pool.query(
      `SELECT 
        t.id as topic_id,
        t.name as topic_name,
        s.name as subject_name,
        s.slug as subject_slug,
        COUNT(DISTINCT p.id) as total_problems,
        COUNT(DISTINCT CASE WHEN upp.status = 'SOLVED' THEN p.id END) as solved_problems,
        COUNT(sub.id) as total_submissions,
        COUNT(CASE WHEN sub.status = 'ACCEPTED' THEN 1 END) as accepted_submissions
       FROM topics t
       JOIN subjects s ON t.subject_id = s.id
       JOIN problems p ON t.id = p.topic_id
       LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
       LEFT JOIN submissions sub ON p.id = sub.problem_id AND sub.user_id = $2
       GROUP BY t.id, t.name, s.name, s.slug, s.order_index, t.order_index
       ORDER BY s.order_index ASC, t.order_index ASC`,
      [userId, userId]
    );

    const weakTopics: Array<{
      topic_id: number;
      topic_name: string;
      subject_name: string;
      subject_slug: string;
      accuracy: number;
      total_submissions: number;
      solved_problems: number;
      total_problems: number;
      tag: string;
      reason: string;
    }> = [];

    const strongTopics: Array<{
      topic_id: number;
      topic_name: string;
      subject_name: string;
      subject_slug: string;
      accuracy: number;
      completion_rate: number;
      solved_problems: number;
      total_problems: number;
      tag: string;
    }> = [];

    topicSubmissionRes.rows.forEach((row: any) => {
      const totalProblems = Number(row.total_problems) || 0;
      const solvedProblems = Number(row.solved_problems) || 0;
      const totalSubs = Number(row.total_submissions) || 0;
      const acceptedSubs = Number(row.accepted_submissions) || 0;

      const completionRate = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;
      const topicAccuracy = totalSubs > 0 ? Math.round((acceptedSubs / totalSubs) * 100) : 0;

      // Weak Topic Rule: Accuracy < 60% on attempted topics
      if (totalSubs > 0 && topicAccuracy < 60) {
        weakTopics.push({
          topic_id: row.topic_id,
          topic_name: row.topic_name,
          subject_name: row.subject_name,
          subject_slug: row.subject_slug,
          accuracy: topicAccuracy,
          total_submissions: totalSubs,
          solved_problems: solvedProblems,
          total_problems: totalProblems,
          tag: 'Needs More Practice',
          reason: `Submission accuracy is ${topicAccuracy}% across ${totalSubs} attempts.`,
        });
      }

      // Strong Topic Rule: High completion & High accuracy
      if (solvedProblems >= 1 && (completionRate >= 50 || solvedProblems >= 2) && topicAccuracy >= 80) {
        strongTopics.push({
          topic_id: row.topic_id,
          topic_name: row.topic_name,
          subject_name: row.subject_name,
          subject_slug: row.subject_slug,
          accuracy: topicAccuracy,
          completion_rate: completionRate,
          solved_problems: solvedProblems,
          total_problems: totalProblems,
          tag: 'Strong Topic',
        });
      }
    });

    // 9. Last 7 Days (Weekly Chart Data)
    const daysArr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const match = problemsSolvedPerDay.find((p) => p.date === dStr);
      daysArr.push({
        date: dStr,
        day_name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        solved: match ? match.solved : 0,
        submissions: match ? match.submissions : 0,
      });
    }

    // 10. Last 6 Months (Monthly Chart Data using PostgreSQL TO_CHAR)
    const monthRes = await pool.query(
      `SELECT 
        TO_CHAR(activity_date, 'YYYY-MM') as ym,
        TO_CHAR(activity_date, 'Mon') as month_name,
        COALESCE(SUM(problems_solved), 0) as solved,
        COALESCE(SUM(total_submissions), 0) as submissions
       FROM daily_activity
       WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '6 months'
       GROUP BY TO_CHAR(activity_date, 'YYYY-MM'), TO_CHAR(activity_date, 'Mon')
       ORDER BY ym ASC`,
      [userId]
    );

    const monthlyChart = monthRes.rows.map((r: any) => ({
      year_month: r.ym,
      month: r.month_name,
      solved: Number(r.solved) || 0,
      submissions: Number(r.submissions) || 0,
    }));

    return {
      problems_solved_per_day: problemsSolvedPerDay,
      weekly_activity: weeklyActivity,
      monthly_activity: monthlyActivity,
      weekly_chart: daysArr,
      monthly_chart: monthlyChart,
      accuracy,
      accepted_vs_rejected: {
        accepted: acceptedSubs,
        rejected: rejectedSubs,
        total: totalSubs,
      },
        difficulty_distribution: difficultyDistribution,
        difficulty: difficultyDistribution,
        subject_progress: subjectProgress,
        topic_progress: topicProgress,
        weak_topics: weakTopics,
        strong_topics: strongTopics,
        submissions: submissionStats,
        daily_trends: problemsSolvedPerDay,
      };
    } catch (dbErr) {
      console.warn('[Progress Service] Database query for analytics failed, using fallback store:', (dbErr as any).message);
      return fallbackStore.getUserAnalytics(userId);
    }
  }
}
