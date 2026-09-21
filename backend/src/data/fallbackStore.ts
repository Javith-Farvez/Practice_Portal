import { SUBJECTS, TOPICS, SubjectDefinition, TopicDefinition } from './roadmapData';
import { ALL_JAVA_PROBLEMS, ProblemSeed } from './problems';
import { SEED_PROBLEMS } from './problemData';

export interface EnrichedProblem extends ProblemSeed {
  id: number;
  subject_id: number;
  subject_slug: string;
  subject_name: string;
  topic_id: number;
  topic_name: string;
  topic_slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
  is_published?: boolean;
  is_deleted: boolean;
  supported_languages: string[];
  public_test_cases?: Array<{ test_case_number?: number; input: string; expected_output?: string; output?: string }>;
  hidden_test_cases?: Array<{ test_case_number?: number; input: string; expected_output?: string; output?: string }>;
  test_cases?: any[];
  examples?: any[];
  starter_snippets?: Record<string, string>;
  problemIndex?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PLACEMENT';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface UserProgressRecord {
  status: 'UNSOLVED' | 'ATTEMPTED' | 'SOLVED';
  solved_at?: string;
  is_bookmarked: boolean;
}

export interface SubmissionRecord {
  id: number;
  user_id: number;
  problem_id: number;
  problem_title: string;
  problem_slug: string;
  topic_id: number;
  topic_name: string;
  subject_id: number;
  subject_name: string;
  language: string;
  source_code: string;
  status: string;
  passed_tests: number;
  total_tests: number;
  runtime_ms: number;
  memory_kb: number;
  created_at: string;
}

export interface DailyActivityRecord {
  activity_date: string;
  total_submissions: number;
  accepted_submissions: number;
  problems_solved: number;
  problems_attempted: number;
}

export interface AuditLogRecord {
  id: number;
  admin_id: number;
  admin_name: string;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: number | null;
  details: any;
  ip_address: string | null;
  created_at: string;
}

export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  created_at: string;
  problems_solved: number;
  last_activity: string | null;
  total_submissions: number;
}

class FallbackStore {
  private enrichedProblems: EnrichedProblem[] = [];
  private problemsById: Map<number, EnrichedProblem> = new Map();
  private problemsBySlug: Map<string, EnrichedProblem> = new Map();
  
  // In-memory state maps keyed by userId
  private userProgress: Map<number, Map<number, UserProgressRecord>> = new Map();
  private submissions: SubmissionRecord[] = [];
  private dailyActivity: Map<number, Map<string, DailyActivityRecord>> = new Map();
  private nextSubmissionId = 1000;
  private nextProblemId = 1000;
  private nextTestCaseId = 5000;

  // Admin users & audit logs
  private mockUsers: AdminUserRecord[] = [
    {
      id: 1,
      name: 'Mohammed Javith Farvez',
      email: 'mohammedjavithfarvezsk07@gmail.com',
      role: 'ADMIN',
      created_at: '2026-09-01T00:00:00.000Z',
      problems_solved: 48,
      last_activity: new Date().toISOString(),
      total_submissions: 65,
    },
    {
      id: 2,
      name: 'Kamalika',
      email: 'yskamalika09@gamil.com',
      role: 'ADMIN',
      created_at: '2026-09-01T00:00:00.000Z',
      problems_solved: 40,
      last_activity: new Date().toISOString(),
      total_submissions: 52,
    },
    {
      id: 3,
      name: 'Candidate Student',
      email: 'student@example.com',
      role: 'STUDENT',
      created_at: '2026-09-10T00:00:00.000Z',
      problems_solved: 15,
      last_activity: new Date().toISOString(),
      total_submissions: 22,
    },
  ];

  private auditLogs: AuditLogRecord[] = [
    {
      id: 1,
      admin_id: 1,
      admin_name: 'Mohammed Javith Farvez',
      admin_email: 'mohammedjavithfarvezsk07@gmail.com',
      action: 'SYSTEM_INITIALIZED',
      target_type: 'system',
      target_id: null,
      details: { mode: 'active_curriculum_ready' },
      ip_address: '127.0.0.1',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  constructor() {
    this.initializeProblems();
  }

  private initializeProblems(): void {
    // Map Java topics by order_index (1 to 26)
    const javaTopics = TOPICS.filter((t) => t.subjectSlug === 'java');
    const javaTopicMap = new Map<number, TopicDefinition>();
    javaTopics.forEach((t) => javaTopicMap.set(t.order_index, t));

    // 1. Preserve ALL 204 Java problems exactly as-is
    const javaEnriched: EnrichedProblem[] = ALL_JAVA_PROBLEMS.map((seed, index) => {
      const id = index + 1;
      const topic = javaTopicMap.get(seed.topicOrder) || {
        id: seed.topicOrder,
        name: `Topic ${seed.topicOrder}`,
        slug: `topic-${seed.topicOrder}`,
        order_index: seed.topicOrder,
        subjectSlug: 'java',
        description: '',
        subtopics: [],
      };

      const enriched: EnrichedProblem = {
        ...seed,
        id,
        subject_id: 1,
        subject_slug: 'java',
        subject_name: 'Java',
        topic_id: topic.id || seed.topicOrder,
        topic_name: topic.name,
        topic_slug: topic.slug,
        status: 'PUBLISHED',
        is_deleted: false,
        supported_languages: ['Java'],
      };

      this.problemsById.set(id, enriched);
      this.problemsBySlug.set(seed.slug, enriched);
      return enriched;
    });

    // 2. Enrich non-Java problems (DSA, Aptitude, Python) from SEED_PROBLEMS
    const nonJavaProblems = SEED_PROBLEMS.filter((p) => p.subjectSlug !== 'java');
    let dsaCounter = 0;
    let aptCounter = 0;
    let pyCounter = 0;

    const nonJavaEnriched: EnrichedProblem[] = nonJavaProblems.map((p) => {
      let subjectId = 1;
      let subjectName = 'Java';
      let id = 1000;

      if (p.subjectSlug === 'dsa') {
        subjectId = 3;
        subjectName = 'DSA';
        dsaCounter++;
        id = 1000 + dsaCounter;
      } else if (p.subjectSlug === 'aptitude') {
        subjectId = 4;
        subjectName = 'Aptitude';
        aptCounter++;
        id = 2000 + aptCounter;
      } else if (p.subjectSlug === 'python') {
        subjectId = 2;
        subjectName = 'Python';
        pyCounter++;
        id = 3000 + pyCounter;
      }

      const topic = TOPICS.find((t) => t.subjectSlug === p.subjectSlug && t.slug === p.topicSlug) ||
                    TOPICS.find((t) => t.subjectSlug === p.subjectSlug) || {
                      id: subjectId * 100 + 1,
                      name: p.topicSlug,
                      slug: p.topicSlug,
                      order_index: 1,
                      subjectSlug: p.subjectSlug,
                      description: '',
                      subtopics: [],
                    };

      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const enriched: EnrichedProblem = {
        id,
        title: p.title,
        slug,
        subject_id: subjectId,
        subject_slug: p.subjectSlug,
        subject_name: subjectName,
        topic_id: topic.id,
        topic_name: topic.name,
        topic_slug: topic.slug,
        topicOrder: topic.order_index,
        difficulty: p.difficulty,
        placement_importance: 'IMPORTANT',
        level: p.level || 'BEGINNER',
        description: p.description,
        input_format: p.input_format || '',
        output_format: p.output_format || '',
        constraints: p.constraints || '',
        sample_input: p.input_format || '',
        sample_output: p.output_format || '',
        explanation: p.explanation || '',
        hints: p.hints || [],
        starter_code: p.subjectSlug === 'python' ? '# Write your solution here\n' : '// Write your solution here\n',
        reference_solution: '',
        validation_type: 'TRIMMED',
        public_tests: [{ input: p.input_format || '', expected_output: p.output_format || '' }],
        hidden_tests: [],
        status: 'PUBLISHED',
        is_deleted: false,
        supported_languages: p.supported_languages || (p.subjectSlug === 'python' ? ['Python'] : ['Java', 'C++', 'Python']),
      };

      this.problemsById.set(id, enriched);
      this.problemsBySlug.set(slug, enriched);
      return enriched;
    });

    this.enrichedProblems = [...javaEnriched, ...nonJavaEnriched];
  }

  // --- Subjects ---
  public getSubjects(userId: number | null) {
    const userProg = userId ? this.userProgress.get(userId) : null;

    return SUBJECTS.map((s, idx) => {
      const subjectId = idx + 1;
      const topicsCount = TOPICS.filter((t) => t.subjectSlug === s.slug).length;
      const subjectProblems = this.enrichedProblems.filter((p) => p.subject_slug === s.slug);
      const totalProblems = subjectProblems.length;

      let solvedProblems = 0;
      if (userProg) {
        subjectProblems.forEach((p) => {
          if (userProg.get(p.id)?.status === 'SOLVED') solvedProblems++;
        });
      }

      const progress = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

      return {
        id: subjectId,
        slug: s.slug,
        name: s.name,
        description: s.description,
        icon: s.icon,
        color_gradient: s.color_gradient,
        order_index: s.order_index,
        total_topics: topicsCount,
        total_problems: totalProblems,
        solved_problems: solvedProblems,
        progress_percentage: progress,
      };
    });
  }

  public getSubjectBySlug(slug: string, userId: number | null) {
    const sIndex = SUBJECTS.findIndex((s) => s.slug === slug.toLowerCase());
    if (sIndex === -1) return null;

    const s = SUBJECTS[sIndex];
    const subjectId = sIndex + 1;
    const topics = TOPICS.filter((t) => t.subjectSlug === s.slug);
    const userProg = userId ? this.userProgress.get(userId) : null;

    let overallTotal = 0;
    let overallSolved = 0;

    const formattedTopics = topics.map((t) => {
      const topicProblems = this.enrichedProblems.filter(
        (p) => p.subject_slug === s.slug && p.topic_id === t.id
      );

      let solvedCount = 0;
      let easyCount = 0;
      let mediumCount = 0;
      let hardCount = 0;

      topicProblems.forEach((p) => {
        if (p.difficulty === 'EASY') easyCount++;
        else if (p.difficulty === 'MEDIUM') mediumCount++;
        else if (p.difficulty === 'HARD') hardCount++;

        if (userProg && userProg.get(p.id)?.status === 'SOLVED') {
          solvedCount++;
        }
      });

      const totalCount = topicProblems.length;
      overallTotal += totalCount;
      overallSolved += solvedCount;

      const progress = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        order_index: t.order_index,
        description: t.description,
        total_problems: totalCount,
        solved_problems: solvedCount,
        progress_percentage: progress,
        difficulty_distribution: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
        },
      };
    });

    const overallProgress = overallTotal > 0 ? Math.round((overallSolved / overallTotal) * 100) : 0;

    return {
      subject: {
        id: subjectId,
        slug: s.slug,
        name: s.name,
        description: s.description,
        icon: s.icon,
        color_gradient: s.color_gradient,
        total_problems: overallTotal,
        solved_problems: overallSolved,
        progress_percentage: overallProgress,
      },
      topics: formattedTopics,
    };
  }

  // --- Topics ---
  public getTopicById(topicId: number, userId: number | null) {
    const topicNum = Number(topicId);
    let topic = TOPICS.find((t) => t.id === topicNum);
    if (!topic) {
      if (topicNum <= 26) {
        topic = TOPICS.find((t) => t.subjectSlug === 'java' && t.order_index === topicNum);
      }
    }
    if (!topic) return null;

    const subject = SUBJECTS.find((s) => s.slug === topic!.subjectSlug) || SUBJECTS[0];
    const subjectId = SUBJECTS.findIndex((s) => s.slug === topic!.subjectSlug) + 1;
    const userProg = userId ? this.userProgress.get(userId) : null;

    const subtopics = (topic.subtopics || []).map((st, idx) => ({
      id: idx + 1,
      name: st,
      slug: st.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      order_index: idx + 1,
    }));

    const problems = this.enrichedProblems
      .filter((p) => p.subject_slug === topic!.subjectSlug && p.topic_id === topic!.id)
      .map((p) => {
        const prog = userProg ? userProg.get(p.id) : null;
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          difficulty: p.difficulty,
          level: p.level || 'BEGINNER',
          subtopic_id: null,
          problem_status: 'PUBLISHED',
          status: prog?.status || 'UNSOLVED',
          is_bookmarked: prog?.is_bookmarked || false,
        };
      });

    return {
      topic: {
        id: topic.id,
        subject_id: subjectId,
        name: topic.name,
        slug: topic.slug,
        order_index: topic.order_index,
        description: topic.description,
        subject_name: subject.name,
        subject_slug: subject.slug,
      },
      subtopics,
      problems,
    };
  }

  public getTopicBySlugAndSubject(topicSlug: string, subjectSlug: string, userId: number | null) {
    const topic = TOPICS.find(
      (t) => t.subjectSlug.toLowerCase() === subjectSlug.toLowerCase() && t.slug.toLowerCase() === topicSlug.toLowerCase()
    );
    if (!topic) return null;
    return this.getTopicById(topic.id, userId);
  }

  // --- Problems ---
  public getProblems(query: any, userId: number | null) {
    const userProg = userId ? this.userProgress.get(userId) : null;
    let list = [...this.enrichedProblems];

    // Subject filtering
    if (query.subject) {
      const sVal = String(query.subject).toLowerCase();
      if (!isNaN(Number(query.subject))) {
        list = list.filter((p) => p.subject_id === Number(query.subject));
      } else {
        list = list.filter((p) => p.subject_slug.toLowerCase() === sVal || p.subject_name.toLowerCase() === sVal);
      }
    }
    if (query.subject_slug) {
      const sVal = String(query.subject_slug).toLowerCase();
      list = list.filter((p) => p.subject_slug.toLowerCase() === sVal);
    }
    if (query.subject_id && !isNaN(Number(query.subject_id))) {
      list = list.filter((p) => p.subject_id === Number(query.subject_id));
    }

    // Topic filtering
    if (query.topic) {
      if (!isNaN(Number(query.topic))) {
        const topicNum = Number(query.topic);
        list = list.filter((p) => p.topic_id === topicNum || (p.subject_slug === 'java' && p.topicOrder === topicNum));
      } else {
        list = list.filter((p) => p.topic_slug.toLowerCase() === String(query.topic).toLowerCase());
      }
    }
    if (query.difficulty) {
      list = list.filter((p) => p.difficulty.toUpperCase() === String(query.difficulty).toUpperCase());
    }
    if (query.level) {
      list = list.filter((p) => (p.level || 'BEGINNER').toUpperCase() === String(query.level).toUpperCase());
    }
    if (query.search && String(query.search).trim() !== '') {
      const q = String(query.search).trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.topic_name.toLowerCase().includes(q) ||
          p.subject_name.toLowerCase().includes(q)
      );
    }
    if (query.status) {
      const st = String(query.status).toUpperCase();
      list = list.filter((p) => {
        const userStatus = userProg?.get(p.id)?.status || 'UNSOLVED';
        if (st === 'SOLVED') return userStatus === 'SOLVED';
        if (st === 'ATTEMPTED') return userStatus === 'ATTEMPTED';
        if (st === 'UNSOLVED' || st === 'NOT_STARTED') return userStatus === 'UNSOLVED';
        return true;
      });
    }
    if (query.bookmarked === 'true' && userProg) {
      list = list.filter((p) => userProg.get(p.id)?.is_bookmarked);
    }

    const total = list.length;
    const pageNum = Math.max(1, parseInt(query.page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(query.limit as string, 10) || 50));
    const offset = (pageNum - 1) * limitNum;
    const paginated = list.slice(offset, offset + limitNum);

    const problems = paginated.map((p) => {
      const prog = userProg ? userProg.get(p.id) : null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        level: p.level || 'BEGINNER',
        subject_id: p.subject_id,
        topic_id: p.topic_id,
        supported_languages: p.supported_languages,
        subject_name: p.subject_name,
        subject_slug: p.subject_slug,
        topic_name: p.topic_name,
        status: prog?.status || 'UNSOLVED',
        is_bookmarked: prog?.is_bookmarked || false,
        created_at: new Date().toISOString(),
      };
    });

    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    return {
      total,
      page: pageNum,
      limit: limitNum,
      total_pages: totalPages,
      has_next: pageNum < totalPages,
      has_prev: pageNum > 1,
      problems,
    };
  }

  public getProblemById(idOrSlug: number | string, userId: number | null) {
    let p: EnrichedProblem | undefined;
    if (typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug))) {
      p = this.problemsById.get(Number(idOrSlug));
    } else {
      p = this.problemsBySlug.get(String(idOrSlug));
    }
    if (!p) return null;

    const userProg = userId ? this.userProgress.get(userId) : null;
    const prog = userProg ? userProg.get(p.id) : null;

    return {
      ...p,
      status: 'PUBLISHED',
      user_status: prog?.status || 'UNSOLVED',
      is_bookmarked: prog?.is_bookmarked || false,
      public_test_cases: p.public_tests.map((tc, idx) => ({
        id: idx + 1,
        input: tc.input,
        expected_output: tc.expected_output,
        is_hidden: false,
        validation_type: p?.validation_type || 'TRIMMED',
      })),
    };
  }

  public toggleBookmark(userId: number, problemId: number): boolean {
    let userMap = this.userProgress.get(userId);
    if (!userMap) {
      userMap = new Map();
      this.userProgress.set(userId, userMap);
    }
    const current = userMap.get(problemId) || { status: 'UNSOLVED', is_bookmarked: false };
    current.is_bookmarked = !current.is_bookmarked;
    userMap.set(problemId, current);
    return current.is_bookmarked;
  }

  // --- Submissions & Progress ---
  public recordSubmission(
    userId: number,
    problemId: number,
    language: string,
    sourceCode: string,
    verdict: string,
    passedTests: number,
    totalTests: number,
    runtimeMs: number,
    memoryKb: number
  ): SubmissionRecord {
    const isAccepted = verdict === 'ACCEPTED';
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Update user_problem_progress
    let userMap = this.userProgress.get(userId);
    if (!userMap) {
      userMap = new Map();
      this.userProgress.set(userId, userMap);
    }

    const prevProg = userMap.get(problemId);
    const wasAlreadySolved = prevProg?.status === 'SOLVED';
    const wasAlreadyAttempted = !!prevProg;
    const isNewlySolved = isAccepted && !wasAlreadySolved;
    const isNewlyAttempted = !wasAlreadyAttempted;

    userMap.set(problemId, {
      status: isAccepted || wasAlreadySolved ? 'SOLVED' : 'ATTEMPTED',
      solved_at: isAccepted ? new Date().toISOString() : prevProg?.solved_at,
      is_bookmarked: prevProg?.is_bookmarked || false,
    });

    // 2. Update daily_activity
    let userDaily = this.dailyActivity.get(userId);
    if (!userDaily) {
      userDaily = new Map();
      this.dailyActivity.set(userId, userDaily);
    }

    const todayAct = userDaily.get(todayStr) || {
      activity_date: todayStr,
      total_submissions: 0,
      accepted_submissions: 0,
      problems_solved: 0,
      problems_attempted: 0,
    };

    todayAct.total_submissions += 1;
    if (isAccepted) todayAct.accepted_submissions += 1;
    if (isNewlySolved) todayAct.problems_solved += 1;
    if (isNewlyAttempted) todayAct.problems_attempted += 1;
    userDaily.set(todayStr, todayAct);

    // 3. Create submission record
    const prob = this.problemsById.get(problemId);
    const subRecord: SubmissionRecord = {
      id: ++this.nextSubmissionId,
      user_id: userId,
      problem_id: problemId,
      problem_title: prob?.title || `Problem #${problemId}`,
      problem_slug: prob?.slug || `problem-${problemId}`,
      topic_id: prob?.topic_id || 1,
      topic_name: prob?.topic_name || 'General',
      subject_id: prob?.subject_id || 1,
      subject_name: prob?.subject_name || 'Java',
      language,
      source_code: sourceCode,
      status: verdict,
      passed_tests: passedTests,
      total_tests: totalTests,
      runtime_ms: runtimeMs,
      memory_kb: memoryKb,
      created_at: new Date().toISOString(),
    };

    this.submissions.unshift(subRecord);
    return subRecord;
  }

  public getUserDashboard(userId: number) {
    const userMap = this.userProgress.get(userId) || new Map();
    const userDaily = this.dailyActivity.get(userId) || new Map();
    const userSubs = this.submissions.filter((s) => s.user_id === userId);

    let solvedCount = 0;
    let attemptedCount = 0;

    userMap.forEach((v) => {
      if (v.status === 'SOLVED') solvedCount++;
      if (v.status === 'ATTEMPTED' || v.status === 'SOLVED') attemptedCount++;
    });

    const totalProblems = this.enrichedProblems.length;
    const overallProgress = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    const acceptedSubs = userSubs.filter((s) => s.status === 'ACCEPTED').length;
    const totalSubs = userSubs.length;
    const accuracy = totalSubs > 0 ? Math.round((acceptedSubs / totalSubs) * 100) : 0;

    // Streaks calculation: only dates with accepted solutions count towards active streak
    const activeDates = Array.from(userDaily.entries())
      .filter(([_, act]) => (act.problems_solved > 0 || act.accepted_submissions > 0))
      .map(([date]) => date)
      .sort()
      .reverse();
    let currentStreak = 0;
    let longestStreak = 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (activeDates.includes(todayStr) || activeDates.includes(yesterdayStr)) {
      currentStreak = 1;
      let checkDate = new Date(activeDates[0]);
      for (let i = 1; i < activeDates.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const expectedStr = checkDate.toISOString().split('T')[0];
        if (activeDates[i] === expectedStr) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    longestStreak = Math.max(currentStreak, activeDates.length > 0 ? 1 : 0);

    // Dynamic Subject breakdown across all subjects
    const subjects = SUBJECTS.map((s, idx) => {
      const subjectProblems = this.enrichedProblems.filter((p) => p.subject_slug === s.slug);
      const tot = subjectProblems.length;
      let sol = 0;
      subjectProblems.forEach((p) => {
        if (userMap.get(p.id)?.status === 'SOLVED') sol++;
      });
      return {
        id: idx + 1,
        slug: s.slug,
        name: s.name,
        total: tot,
        solved: sol,
        percentage: tot > 0 ? Math.round((sol / tot) * 100) : 0,
      };
    });

    return {
      problems_solved: solvedCount,
      problems_attempted: attemptedCount,
      total_problems: totalProblems,
      overall_progress_percentage: overallProgress,
      accepted_submissions: acceptedSubs,
      total_submissions: totalSubs,
      accuracy,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_active_days: activeDates.length,
      last_activity_date: activeDates[0] || null,
      subjects,
    };
  }

  public getActivityHeatmap(userId: number) {
    const userDaily = this.dailyActivity.get(userId) || new Map();
    const days: Record<string, { count: number; submissions: number; level: number }> = {};
    let totalSolved = 0;
    let totalSubmissions = 0;

    userDaily.forEach((act, dateStr) => {
      const solved = act.problems_solved || 0;
      const subs = act.total_submissions || 0;
      totalSolved += solved;
      totalSubmissions += subs;

      let level = 0;
      if (solved >= 6) level = 4;
      else if (solved >= 4) level = 3;
      else if (solved >= 2) level = 2;
      else if (solved >= 1) level = 1;
      else if (subs > 0) level = 1;

      days[dateStr] = { count: solved, submissions: subs, level };
    });

    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    return {
      start_date: oneYearAgo.toISOString().split('T')[0],
      total_problems_solved: totalSolved,
      total_submissions: totalSubmissions,
      days,
    };
  }

  public getUserAnalytics(userId: number) {
    const userMap = this.userProgress.get(userId) || new Map();
    const userSubs = this.submissions.filter((s) => s.user_id === userId);
    const userDaily = this.dailyActivity.get(userId) || new Map();

    const difficulty = {
      EASY: { total: 0, solved: 0 },
      MEDIUM: { total: 0, solved: 0 },
      HARD: { total: 0, solved: 0 },
    };

    this.enrichedProblems.forEach((p) => {
      const diff = p.difficulty as 'EASY' | 'MEDIUM' | 'HARD';
      if (difficulty[diff]) {
        difficulty[diff].total++;
        if (userMap.get(p.id)?.status === 'SOLVED') {
          difficulty[diff].solved++;
        }
      }
    });

    const submissions: Record<string, number> = {};
    let acceptedSubs = 0;
    let rejectedSubs = 0;
    userSubs.forEach((s) => {
      submissions[s.status] = (submissions[s.status] || 0) + 1;
      if (s.status === 'ACCEPTED') acceptedSubs++;
      else rejectedSubs++;
    });
    const totalSubs = userSubs.length;
    const accuracy = totalSubs > 0 ? Math.round((acceptedSubs / totalSubs) * 100) : 0;

    const daily_trends = Array.from(userDaily.entries()).map(([date, act]) => ({
      date,
      solved: act.problems_solved,
      submissions: act.total_submissions,
    }));

    // Weekly Chart: 7 days
    const weekly_chart = [];
    let weeklySolved = 0;
    let weeklySubmissions = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const match = userDaily.get(dStr);
      const sCount = match ? match.problems_solved : 0;
      const subCount = match ? match.total_submissions : 0;
      weeklySolved += sCount;
      weeklySubmissions += subCount;
      weekly_chart.push({
        date: dStr,
        day_name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        solved: sCount,
        submissions: subCount,
      });
    }

    // Monthly Chart: 6 months
    const monthly_chart = [];
    let monthlySolved = 0;
    let monthlySubmissions = 0;
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const ym = d.toISOString().substring(0, 7);
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });

      let mSolved = 0;
      let mSubs = 0;
      userDaily.forEach((act, dateStr) => {
        if (dateStr.startsWith(ym)) {
          mSolved += act.problems_solved || 0;
          mSubs += act.total_submissions || 0;
        }
      });
      monthlySolved += mSolved;
      monthlySubmissions += mSubs;

      monthly_chart.push({
        year_month: ym,
        month: monthName,
        solved: mSolved,
        submissions: mSubs,
      });
    }

    // Subject progress
    const subject_progress = SUBJECTS.map((s, idx) => {
      const subjectProblems = this.enrichedProblems.filter((p) => p.subject_slug === s.slug);
      const total = subjectProblems.length;
      let solved = 0;
      subjectProblems.forEach((p) => {
        if (userMap.get(p.id)?.status === 'SOLVED') solved++;
      });
      return {
        id: idx + 1,
        slug: s.slug,
        name: s.name,
        total,
        solved,
        percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    });

    // Topic progress & Weak/Strong topics
    const weak_topics: any[] = [];
    const strong_topics: any[] = [];
    const topic_progress = TOPICS.map((t) => {
      const topicProblems = this.enrichedProblems.filter(
        (p) => p.subject_slug === t.subjectSlug && p.topic_id === t.id
      );
      const total = topicProblems.length;
      let solved = 0;
      const topicProbIds = new Set(topicProblems.map((p) => p.id));
      topicProblems.forEach((p) => {
        if (userMap.get(p.id)?.status === 'SOLVED') solved++;
      });

      const topicSubs = userSubs.filter((s) => topicProbIds.has(s.problem_id));
      const topicAccepted = topicSubs.filter((s) => s.status === 'ACCEPTED').length;
      const topicAccuracy = topicSubs.length > 0 ? Math.round((topicAccepted / topicSubs.length) * 100) : 0;
      const completionRate = total > 0 ? Math.round((solved / total) * 100) : 0;

      const subject = SUBJECTS.find((s) => s.slug === t.subjectSlug);
      const subjectName = subject?.name || 'General';

      if (topicSubs.length > 0 && topicAccuracy < 60) {
        weak_topics.push({
          topic_id: t.id,
          topic_name: t.name,
          subject_name: subjectName,
          subject_slug: t.subjectSlug,
          accuracy: topicAccuracy,
          total_submissions: topicSubs.length,
          solved_problems: solved,
          total_problems: total,
          tag: 'Needs More Practice',
          reason: `Submission accuracy is ${topicAccuracy}% across ${topicSubs.length} attempts.`,
        });
      }

      if (solved >= 1 && (completionRate >= 50 || solved >= 2) && topicAccuracy >= 80) {
        strong_topics.push({
          topic_id: t.id,
          topic_name: t.name,
          subject_name: subjectName,
          subject_slug: t.subjectSlug,
          accuracy: topicAccuracy,
          completion_rate: completionRate,
          solved_problems: solved,
          total_problems: total,
          tag: 'Strong Topic',
        });
      }

      return {
        id: t.id,
        topic_name: t.name,
        subject_name: subjectName,
        subject_slug: t.subjectSlug,
        total,
        solved,
        percentage: completionRate,
      };
    });

    return {
      problems_solved_per_day: daily_trends,
      weekly_activity: {
        problems_solved: weeklySolved,
        total_submissions: weeklySubmissions,
      },
      monthly_activity: {
        problems_solved: monthlySolved,
        total_submissions: monthlySubmissions,
      },
      weekly_chart,
      monthly_chart,
      accuracy,
      accepted_vs_rejected: {
        accepted: acceptedSubs,
        rejected: rejectedSubs,
        total: totalSubs,
      },
      difficulty_distribution: difficulty,
      difficulty,
      subject_progress,
      topic_progress,
      weak_topics,
      strong_topics,
      submissions,
      daily_trends,
    };
  }

  public getUserSubmissions(userId: number, limit = 20) {
    const userSubs = this.submissions.filter((s) => s.user_id === userId);
    return {
      total: userSubs.length,
      submissions: userSubs.slice(0, limit),
    };
  }

  // =========================================================================
  // --- Admin Portal Fallback Store Methods ---
  // =========================================================================

  public getTaxonomy() {
    const subjects = SUBJECTS.map((s, idx) => ({
      id: idx + 1,
      name: s.name,
      slug: s.slug,
    }));
    const subjectIdMap = new Map<string, number>();
    subjects.forEach((s) => subjectIdMap.set(s.slug, s.id));

    const topics = TOPICS.map((t, idx) => ({
      id: t.id || idx + 1,
      subject_id: subjectIdMap.get(t.subjectSlug) || 1,
      name: t.name,
      slug: t.slug,
    }));

    return { subjects, topics };
  }

  public getAdminMetrics() {
    const totalUsers = this.mockUsers.length;
    const totalStudents = this.mockUsers.filter((u) => u.role === 'STUDENT').length;
    const totalAdmins = this.mockUsers.filter((u) => u.role === 'ADMIN').length;
    const activeUsers = Math.max(1, totalUsers);

    const nonDeleted = this.enrichedProblems.filter((p) => !p.is_deleted);
    const totalProblems = nonDeleted.length;
    const javaProblems = nonDeleted.filter((p) => p.subject_slug === 'java').length;
    const dsaProblems = nonDeleted.filter((p) => p.subject_slug === 'dsa').length;
    const aptitudeQuestions = nonDeleted.filter((p) => p.subject_slug === 'aptitude').length;

    const totalSubs = this.submissions.length;
    const acceptedSubs = this.submissions.filter((s) => s.status === 'ACCEPTED').length;
    const rejectedSubs = totalSubs - acceptedSubs;

    return {
      stats: {
        total_users: totalUsers,
        active_users: activeUsers,
        total_students: totalStudents,
        total_admins: totalAdmins,
        total_problems: totalProblems,
        java_problems: javaProblems,
        python_problems: 0,
        dsa_problems: dsaProblems,
        aptitude_questions: aptitudeQuestions,
        total_submissions: totalSubs,
        accepted_submissions: acceptedSubs,
        rejected_submissions: rejectedSubs,
      },
    };
  }

  public getAdminProblems(params: {
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
    topic_id?: number | string;
    difficulty?: string;
    level?: string;
    status?: string;
    is_published?: string;
    include_deleted?: boolean | string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(Math.max(1, Number(params.limit) || 20), 100);

    let list = this.enrichedProblems.slice();

    if (params.include_deleted !== true && params.include_deleted !== 'true') {
      list = list.filter((p) => !p.is_deleted);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }

    if (params.subject) {
      const s = String(params.subject).toLowerCase();
      list = list.filter((p) =>
        String(p.subject_id) === s || p.subject_slug.toLowerCase() === s
      );
    }

    if (params.topic_id) {
      const tid = Number(params.topic_id);
      list = list.filter((p) => p.topic_id === tid);
    }

    if (params.difficulty) {
      const diff = params.difficulty.toUpperCase();
      list = list.filter((p) => p.difficulty === diff);
    }

    if (params.status) {
      const st = params.status.toUpperCase();
      list = list.filter((p) => (p.status || 'PUBLISHED') === st);
    }

    if (params.is_published !== undefined && params.is_published !== '') {
      const pub = params.is_published === 'true' || params.is_published === '1';
      list = list.filter((p) => (p.is_published !== false) === pub);
    }

    const total = list.length;
    const start = (page - 1) * limit;
    const paged = list.slice(start, start + limit);

    const formattedProblems = paged.map((p) => {
      const subs = this.submissions.filter((s) => s.problem_id === p.id);
      const totalSubs = subs.length;
      const acceptedSubs = subs.filter((s) => s.status === 'ACCEPTED').length;
      const publicCount = p.public_test_cases?.length || 2;
      const hiddenCount = p.hidden_test_cases?.length || 3;
      const testCasesCount = (p.test_cases?.length || 0) + publicCount + hiddenCount;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        level: (p as any).level || 'BEGINNER',
        status: p.status || 'PUBLISHED',
        is_published: p.is_published !== false,
        is_deleted: Boolean(p.is_deleted),
        created_at: (p as any).created_at || '2026-09-01T00:00:00.000Z',
        updated_at: (p as any).updated_at || '2026-09-01T00:00:00.000Z',
        subject_id: p.subject_id,
        subject_name: p.subject_name,
        subject_slug: p.subject_slug,
        topic_id: p.topic_id,
        topic_name: p.topic_name,
        total_submissions: totalSubs,
        accepted_submissions: acceptedSubs,
        test_cases_count: testCasesCount,
        public_tests_count: publicCount,
        hidden_tests_count: hiddenCount,
      };
    });

    return {
      total,
      page,
      limit,
      problems: formattedProblems,
    };
  }

  public getAdminProblemById(id: number) {
    const p = this.problemsById.get(id);
    if (!p) return null;
    const testCases = this.getProblemTestCases(id);
    return {
      ...p,
      test_cases: testCases,
    };
  }

  public createProblem(data: any, adminId: number) {
    this.nextProblemId++;
    const id = this.nextProblemId;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const subjects = SUBJECTS;
    const subject = subjects.find((s, idx) => (idx + 1) === Number(data.subject_id)) || subjects[0];
    const topic = TOPICS.find((t) => t.id === Number(data.topic_id)) || {
      id: Number(data.topic_id) || 1,
      name: 'General Topic',
      slug: 'general',
    };

    const newProblem: EnrichedProblem = {
      id,
      title: data.title,
      slug,
      description: data.description || '',
      subject_id: Number(data.subject_id) || 1,
      subject_name: subject.name,
      subject_slug: subject.slug,
      topic_id: Number(data.topic_id) || 1,
      topic_name: topic.name,
      topic_slug: topic.slug,
      topicOrder: Number(data.topic_id) || 1,
      problemIndex: id,
      difficulty: data.difficulty || 'EASY',
      status: data.status || 'PUBLISHED',
      is_published: data.is_published !== false,
      is_deleted: false,
      supported_languages: data.supported_languages || ['Java'],
      input_format: data.input_format || '',
      output_format: data.output_format || '',
      constraints: data.constraints || '',
      starter_code: data.starter_code || 'public class Solution {\n    public static void main(String[] args) {\n        // Code here\n    }\n}',
      starter_snippets: { java: data.starter_code || '' },
      reference_solution: data.reference_solution || '',
      sample_input: data.sample_input || '',
      sample_output: data.sample_output || '',
      explanation: data.explanation || '',
      examples: data.examples || [],
      hints: data.hints || [],
      placement_importance: data.placement_importance || 'HIGH',
      public_tests: (data.test_cases || []).filter((tc: any) => !tc.is_hidden).map((tc: any) => ({
        input: tc.input,
        output: tc.expected_output || tc.output || '',
      })),
      hidden_tests: (data.test_cases || []).filter((tc: any) => tc.is_hidden).map((tc: any) => ({
        input: tc.input,
        output: tc.expected_output || tc.output || '',
      })),
      public_test_cases: (data.test_cases || []).filter((tc: any) => !tc.is_hidden).map((tc: any, idx: number) => ({
        test_case_number: idx + 1,
        input: tc.input,
        expected_output: tc.expected_output,
      })),
      hidden_test_cases: (data.test_cases || []).filter((tc: any) => tc.is_hidden).map((tc: any, idx: number) => ({
        test_case_number: idx + 1,
        input: tc.input,
        expected_output: tc.expected_output,
      })),
    };

    this.enrichedProblems.unshift(newProblem);
    this.problemsById.set(id, newProblem);
    this.problemsBySlug.set(slug, newProblem);

    this.recordAuditAction(adminId, 'PROBLEM_CREATED', 'problem', id, { title: newProblem.title });
    return { problem: newProblem };
  }

  public updateProblem(id: number, data: any, adminId: number) {
    const problem = this.problemsById.get(id);
    if (!problem) throw new Error(`Problem with ID ${id} not found.`);

    if (data.title !== undefined) problem.title = data.title;
    if (data.description !== undefined) problem.description = data.description;
    if (data.difficulty !== undefined) problem.difficulty = data.difficulty;
    if (data.status !== undefined) problem.status = data.status;
    if (data.is_published !== undefined) problem.is_published = Boolean(data.is_published);
    if (data.input_format !== undefined) problem.input_format = data.input_format;
    if (data.output_format !== undefined) problem.output_format = data.output_format;
    if (data.constraints !== undefined) problem.constraints = data.constraints;
    if (data.starter_code !== undefined) {
      problem.starter_code = data.starter_code;
      problem.starter_snippets = { java: data.starter_code };
    }
    if (data.reference_solution !== undefined) problem.reference_solution = data.reference_solution;

    (problem as any).updated_at = new Date().toISOString();
    this.recordAuditAction(adminId, 'PROBLEM_UPDATED', 'problem', id, { title: problem.title });
    return { problem };
  }

  public deleteProblem(id: number, adminId: number) {
    const problem = this.problemsById.get(id);
    if (!problem) throw new Error(`Problem with ID ${id} not found.`);

    problem.is_deleted = true;
    (problem as any).deleted_at = new Date().toISOString();

    this.recordAuditAction(adminId, 'PROBLEM_DELETED', 'problem', id, { title: problem.title });
    return { id };
  }

  public togglePublish(id: number, isPublished: boolean, adminId: number) {
    const problem = this.problemsById.get(id);
    if (!problem) throw new Error(`Problem with ID ${id} not found.`);

    problem.is_published = isPublished;
    (problem as any).updated_at = new Date().toISOString();

    this.recordAuditAction(adminId, isPublished ? 'PROBLEM_PUBLISHED' : 'PROBLEM_UNPUBLISHED', 'problem', id);
    return { id, is_published: isPublished };
  }

  public setStatus(id: number, status: string, adminId: number) {
    const problem = this.problemsById.get(id);
    if (!problem) throw new Error(`Problem with ID ${id} not found.`);

    problem.status = status as any;
    if (status === 'PUBLISHED') problem.is_published = true;
    if (status === 'UNPUBLISHED' || status === 'DRAFT') problem.is_published = false;

    (problem as any).updated_at = new Date().toISOString();
    this.recordAuditAction(adminId, 'PROBLEM_STATUS_CHANGED', 'problem', id, { status });
    return { id, status };
  }

  public getProblemTestCases(problemId: number) {
    const p = this.problemsById.get(problemId);
    if (!p) return [];

    const list: any[] = [];
    let idx = 1;

    if (p.public_test_cases) {
      p.public_test_cases.forEach((tc: any) => {
        list.push({
          id: idx++,
          problem_id: problemId,
          input: tc.input,
          expected_output: tc.expected_output || tc.output || '',
          is_hidden: false,
          validation_type: 'TRIMMED',
        });
      });
    } else if (p.public_tests) {
      p.public_tests.forEach((tc: any) => {
        list.push({
          id: idx++,
          problem_id: problemId,
          input: tc.input,
          expected_output: tc.output || tc.expected_output || '',
          is_hidden: false,
          validation_type: 'TRIMMED',
        });
      });
    }

    if (p.hidden_test_cases) {
      p.hidden_test_cases.forEach((tc: any) => {
        list.push({
          id: idx++,
          problem_id: problemId,
          input: tc.input,
          expected_output: tc.expected_output || tc.output || '',
          is_hidden: true,
          validation_type: 'TRIMMED',
        });
      });
    } else if (p.hidden_tests) {
      p.hidden_tests.forEach((tc: any) => {
        list.push({
          id: idx++,
          problem_id: problemId,
          input: tc.input,
          expected_output: tc.output || tc.expected_output || '',
          is_hidden: true,
          validation_type: 'TRIMMED',
        });
      });
    }

    if (list.length === 0 && p.test_cases) {
      p.test_cases.forEach((tc: any) => {
        list.push({
          id: idx++,
          problem_id: problemId,
          input: tc.input,
          expected_output: tc.expected_output || tc.output || '',
          is_hidden: Boolean(tc.is_hidden),
          validation_type: tc.validation_type || 'TRIMMED',
        });
      });
    }

    return list;
  }

  public addTestCase(problemId: number, data: any, adminId: number) {
    const problem = this.problemsById.get(problemId);
    if (!problem) throw new Error(`Problem with ID ${problemId} not found.`);

    this.nextTestCaseId++;
    const tc = {
      id: this.nextTestCaseId,
      problem_id: problemId,
      input: data.input,
      expected_output: data.expected_output,
      is_hidden: Boolean(data.is_hidden),
      validation_type: data.validation_type || 'TRIMMED',
      created_at: new Date().toISOString(),
    };

    if (data.is_hidden) {
      problem.hidden_test_cases = problem.hidden_test_cases || [];
      problem.hidden_test_cases.push({
        test_case_number: problem.hidden_test_cases.length + 1,
        input: data.input,
        expected_output: data.expected_output,
      });
    } else {
      problem.public_test_cases = problem.public_test_cases || [];
      problem.public_test_cases.push({
        test_case_number: problem.public_test_cases.length + 1,
        input: data.input,
        expected_output: data.expected_output,
      });
    }

    this.recordAuditAction(adminId, 'TEST_CASE_ADDED', 'test_case', tc.id, { problem_id: problemId });
    return tc;
  }

  public updateTestCase(testId: number, data: any, adminId: number) {
    this.recordAuditAction(adminId, 'TEST_CASE_UPDATED', 'test_case', testId, data);
    return {
      id: testId,
      ...data,
      is_hidden: Boolean(data.is_hidden),
    };
  }

  public deleteTestCase(testId: number, adminId: number) {
    this.recordAuditAction(adminId, 'TEST_CASE_DELETED', 'test_case', testId);
    return { id: testId };
  }

  public bulkImport(problems: any[], adminId: number) {
    let importedProblems = 0;
    let importedTestCases = 0;

    for (const p of problems) {
      this.createProblem(p, adminId);
      importedProblems++;
      if (p.test_cases && Array.isArray(p.test_cases)) {
        importedTestCases += p.test_cases.length;
      }
    }

    this.recordAuditAction(adminId, 'PROBLEMS_BULK_IMPORTED', 'problem', null, {
      count: importedProblems,
    });

    return {
      imported_problems: importedProblems,
      imported_test_cases: importedTestCases,
    };
  }

  public getAdminUsers() {
    return this.mockUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
      problems_solved: u.problems_solved || 0,
      last_activity_date: u.last_activity || null,
      total_submissions: u.total_submissions || 0,
    }));
  }

  public updateUserRole(userId: number, role: 'STUDENT' | 'ADMIN', adminId: number) {
    const user = this.mockUsers.find((u) => u.id === userId);
    if (user) {
      user.role = role;
    }
    this.recordAuditAction(adminId, 'USER_ROLE_CHANGED', 'user', userId, { new_role: role });
    return { user_id: userId, role };
  }

  public recordAuditAction(
    adminId: number,
    action: string,
    targetType: string,
    targetId: number | null,
    details?: any,
    ipAddress?: string
  ): number {
    const admin = this.mockUsers.find((u) => u.id === adminId) || {
      name: 'Admin User',
      email: 'admin@placement.edu',
    };
    const id = this.auditLogs.length + 1;
    const log: AuditLogRecord = {
      id,
      admin_id: adminId,
      admin_name: admin.name,
      admin_email: admin.email,
      action,
      target_type: targetType,
      target_id: targetId,
      details: details || null,
      ip_address: ipAddress || '127.0.0.1',
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return id;
  }

  public getRecentAuditLogs(limit = 50) {
    return this.auditLogs.slice(0, Math.min(Math.max(1, limit), 200));
  }
}

export const fallbackStore = new FallbackStore();
