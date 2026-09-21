import { pool } from '../../config/db';

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS_LIST: AchievementDef[] = [
  {
    key: 'FIRST_PROBLEM',
    title: 'First Problem',
    description: 'Solve your first problem on Placement Practice.',
    icon: 'Sparkles',
  },
  {
    key: 'PROBLEMS_10',
    title: '10 Problems',
    description: 'Successfully solve 10 placement practice problems.',
    icon: 'Target',
  },
  {
    key: 'PROBLEMS_50',
    title: '50 Problems',
    description: 'Conquer 50 placement coding challenges.',
    icon: 'Award',
  },
  {
    key: 'PROBLEMS_100',
    title: '100 Problems',
    description: 'Reach the centurion milestone: 100 solved problems.',
    icon: 'Crown',
  },
  {
    key: 'STREAK_7',
    title: '7 Day Streak',
    description: 'Practice coding for 7 consecutive days.',
    icon: 'Flame',
  },
  {
    key: 'STREAK_30',
    title: '30 Day Streak',
    description: 'Master consistency with a 30-day coding streak.',
    icon: 'Zap',
  },
  {
    key: 'JAVA_FOUNDATION',
    title: 'Java Foundation Complete',
    description: 'Solve 5 or more Java practice problems.',
    icon: 'Coffee',
  },
  {
    key: 'DSA_FOUNDATION',
    title: 'DSA Foundation Complete',
    description: 'Solve 5 or more Data Structures & Algorithms problems.',
    icon: 'Binary',
  },
  {
    key: 'APTITUDE_FOUNDATION',
    title: 'Aptitude Foundation Complete',
    description: 'Solve 5 or more Aptitude practice problems.',
    icon: 'BrainCircuit',
  },
];

export class AchievementService {
  /**
   * Evaluates all achievement criteria for a user and unlocks new ones.
   */
  public static async evaluateAchievements(userId: number): Promise<string[]> {
    // 1. Get user progress metrics
    const progRes = await pool.query<any>(
      'SELECT problems_solved, current_streak, longest_streak FROM user_progress WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    const progRows = progRes.rows;

    const progress = progRows[0] || { problems_solved: 0, current_streak: 0, longest_streak: 0 };
    const solvedCount = progress.problems_solved;
    const maxStreak = Math.max(progress.current_streak, progress.longest_streak);

    // 2. Get subject-specific solve counts
    const subRes = await pool.query<any>(
      `SELECT s.slug, COUNT(DISTINCT upp.problem_id) as count
       FROM user_problem_progress upp
       JOIN problems p ON upp.problem_id = p.id
       JOIN subjects s ON p.subject_id = s.id
       WHERE upp.user_id = $1 AND upp.status = 'SOLVED'
       GROUP BY s.slug`,
      [userId]
    );
    const subRows = subRes.rows;

    const subjectSolves: Record<string, number> = {};
    subRows.forEach((r) => {
      subjectSolves[r.slug] = Number(r.count) || 0;
    });

    // 3. Fetch already unlocked achievements
    const unlockedRes = await pool.query<any>(
      'SELECT achievement_key FROM achievements WHERE user_id = $1',
      [userId]
    );
    const unlockedRows = unlockedRes.rows;
    const unlockedSet = new Set(unlockedRows.map((r) => r.achievement_key));

    const newlyUnlocked: string[] = [];

    const tryUnlock = async (key: string) => {
      if (unlockedSet.has(key)) return;
      const def = ACHIEVEMENTS_LIST.find((a) => a.key === key);
      if (!def) return;

      await pool.query(
        `INSERT INTO achievements (user_id, achievement_key, title, description, icon)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, achievement_key) DO UPDATE SET title = EXCLUDED.title`,
        [userId, def.key, def.title, def.description, def.icon]
      );
      newlyUnlocked.push(def.title);
      unlockedSet.add(key);

      // Phase 8: Emit notification for achievement unlocked
      try {
        const { NotificationService } = await import('../notification.service');
        await NotificationService.createNotification(
          userId,
          'ACHIEVEMENT_UNLOCKED',
          `Achievement Unlocked: ${def.title}!`,
          def.description,
          '/analytics'
        );
      } catch (err) {
        // Silently continue if notification fails
      }
    };

    // Problem count thresholds
    if (solvedCount >= 1) await tryUnlock('FIRST_PROBLEM');
    if (solvedCount >= 10) await tryUnlock('PROBLEMS_10');
    if (solvedCount >= 50) await tryUnlock('PROBLEMS_50');
    if (solvedCount >= 100) await tryUnlock('PROBLEMS_100');

    // Streak thresholds
    if (maxStreak >= 7) await tryUnlock('STREAK_7');
    if (maxStreak >= 30) await tryUnlock('STREAK_30');

    // Subject foundation thresholds
    if ((subjectSolves['java'] || 0) >= 5) await tryUnlock('JAVA_FOUNDATION');
    if ((subjectSolves['dsa'] || 0) >= 5) await tryUnlock('DSA_FOUNDATION');
    if ((subjectSolves['aptitude'] || 0) >= 5) await tryUnlock('APTITUDE_FOUNDATION');

    return newlyUnlocked;
  }

  /**
   * Retrieves all achievements with unlock status and factual progress toward achievement.
   */
  public static async getUserAchievements(userId: number) {
    const unlockedRes = await pool.query<any>(
      'SELECT achievement_key, unlocked_at FROM achievements WHERE user_id = $1',
      [userId]
    );
    const unlockedRows = unlockedRes.rows;

    const unlockedMap = new Map<string, string>();
    unlockedRows.forEach((r) => {
      unlockedMap.set(r.achievement_key, r.unlocked_at);
    });

    // Fetch user progress for locked progress tracking
    const progRes = await pool.query<any>(
      'SELECT problems_solved, current_streak, longest_streak FROM user_progress WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    const progRows = progRes.rows;
    const progress = progRows[0] || { problems_solved: 0, current_streak: 0, longest_streak: 0 };
    const solvedCount = Number(progress.problems_solved) || 0;
    const maxStreak = Math.max(Number(progress.current_streak) || 0, Number(progress.longest_streak) || 0);

    const subRes = await pool.query<any>(
      `SELECT s.slug, COUNT(DISTINCT upp.problem_id) as count
       FROM user_problem_progress upp
       JOIN problems p ON upp.problem_id = p.id
       JOIN subjects s ON p.subject_id = s.id
       WHERE upp.user_id = $1 AND upp.status = 'SOLVED'
       GROUP BY s.slug`,
      [userId]
    );
    const subRows = subRes.rows;

    const subjectSolves: Record<string, number> = {};
    subRows.forEach((r) => {
      subjectSolves[r.slug] = Number(r.count) || 0;
    });

    return ACHIEVEMENTS_LIST.map((ach) => {
      const isUnlocked = unlockedMap.has(ach.key);

      let targetValue = 1;
      let currentValue = 0;

      switch (ach.key) {
        case 'FIRST_PROBLEM':
          targetValue = 1;
          currentValue = solvedCount;
          break;
        case 'PROBLEMS_10':
          targetValue = 10;
          currentValue = solvedCount;
          break;
        case 'PROBLEMS_50':
          targetValue = 50;
          currentValue = solvedCount;
          break;
        case 'PROBLEMS_100':
          targetValue = 100;
          currentValue = solvedCount;
          break;
        case 'STREAK_7':
          targetValue = 7;
          currentValue = maxStreak;
          break;
        case 'STREAK_30':
          targetValue = 30;
          currentValue = maxStreak;
          break;
        case 'JAVA_FOUNDATION':
          targetValue = 5;
          currentValue = subjectSolves['java'] || 0;
          break;
        case 'DSA_FOUNDATION':
          targetValue = 5;
          currentValue = subjectSolves['dsa'] || 0;
          break;
        case 'APTITUDE_FOUNDATION':
          targetValue = 5;
          currentValue = subjectSolves['aptitude'] || 0;
          break;
      }

      const clampedCurrent = isUnlocked ? targetValue : Math.min(currentValue, targetValue);
      const progressPercentage = isUnlocked
        ? 100
        : targetValue > 0
        ? Math.min(100, Math.round((clampedCurrent / targetValue) * 100))
        : 0;

      return {
        key: ach.key,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        is_unlocked: isUnlocked,
        unlocked_at: unlockedMap.get(ach.key) || null,
        current_value: clampedCurrent,
        target_value: targetValue,
        progress_percentage: progressPercentage,
      };
    });
  }
}
