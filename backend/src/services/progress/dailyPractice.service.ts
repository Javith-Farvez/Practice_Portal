import { pool } from '../../config/db';

export interface DailyPracticeProblem {
  id: number;
  title: string;
  subject_id: number;
  subject_name: string;
  subject_slug: string;
  topic_name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  level: string;
  is_completed_today: boolean;
}

export class DailyPracticeService {
  /**
   * Generates Today's Practice recommendations:
   * Java: 2, DSA: 2, Aptitude: 2 (Total: 6)
   */
  public static async getTodayPractice(userId: number): Promise<{
    date: string;
    total_goals: number;
    completed_goals: number;
    problems: DailyPracticeProblem[];
  }> {
    const todayStr = new Date().toISOString().split('T')[0];

    // Compute deterministic daily seed from date string
    const seed = todayStr
      .split('-')
      .reduce((acc, part, idx) => acc + parseInt(part, 10) * (idx + 1) * 31, 0);

    const quotas = [
      { slug: 'java', count: 2 },
      { slug: 'dsa', count: 2 },
      { slug: 'aptitude', count: 2 },
    ];

    const practiceProblems: DailyPracticeProblem[] = [];
    let completedCount = 0;

    for (const quota of quotas) {
      // Fetch problems under subject with user solved status
      const res = await pool.query<any>(
        `SELECT 
          p.id,
          p.title,
          p.subject_id,
          s.name as subject_name,
          s.slug as subject_slug,
          t.name as topic_name,
          p.difficulty,
          p.level,
          upp.status,
          upp.solved_at
         FROM problems p
         JOIN subjects s ON p.subject_id = s.id
         JOIN topics t ON p.topic_id = t.id
         LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
         WHERE s.slug = $2
         ORDER BY p.id ASC`,
        [userId, quota.slug]
      );
      const rows = res.rows;

      if (rows.length === 0) continue;

      // Prioritize unsolved problems, fallback to all problems
      const unsolved = rows.filter((r) => r.status !== 'SOLVED');
      const poolList = unsolved.length >= quota.count ? unsolved : rows;

      // Select deterministically using seed offset
      for (let i = 0; i < quota.count && poolList.length > 0; i++) {
        const index = (seed + i * 3) % poolList.length;
        const selected = poolList.splice(index, 1)[0];

        // Check if solved today
        const solvedToday =
          selected.status === 'SOLVED' &&
          selected.solved_at &&
          new Date(selected.solved_at).toISOString().split('T')[0] === todayStr;

        if (solvedToday) {
          completedCount++;
        }

        practiceProblems.push({
          id: selected.id,
          title: selected.title,
          subject_id: selected.subject_id,
          subject_name: selected.subject_name,
          subject_slug: selected.subject_slug,
          topic_name: selected.topic_name,
          difficulty: selected.difficulty,
          level: selected.level,
          is_completed_today: Boolean(solvedToday),
        });
      }
    }

    return {
      date: todayStr,
      total_goals: 6,
      completed_goals: completedCount,
      problems: practiceProblems,
    };
  }
}
