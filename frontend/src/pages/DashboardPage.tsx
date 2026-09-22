import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { DailyPracticeCard, DailyPracticeItem } from '../components/DailyPracticeCard';
import { AchievementsCard, AchievementItem } from '../components/AchievementsModal';
import {
  Coffee,
  Terminal,
  Binary,
  BrainCircuit,
  Flame,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Target,
  Clock,
  Award,
  Zap,
  Loader2,
  Calendar,
  Layers,
  BarChart3,
  ChevronRight,
  Quote,
  BookOpen,
  Code2,
} from 'lucide-react';

interface SubjectProgress {
  id: number;
  slug: string;
  name: string;
  total: number;
  solved: number;
  percentage: number;
}

interface DashboardData {
  problems_solved: number;
  problems_attempted: number;
  total_problems: number;
  overall_progress_percentage: number;
  accepted_submissions: number;
  total_submissions: number;
  accuracy: number;
  current_streak: number;
  longest_streak: number;
  total_active_days: number;
  last_activity_date: string | null;
  subjects: SubjectProgress[];
}

interface AnalyticsData {
  difficulty: {
    EASY: { total: number; solved: number };
    MEDIUM: { total: number; solved: number };
    HARD: { total: number; solved: number };
  };
  submissions: Record<string, number>;
  daily_trends: Array<{ date: string; solved: number; submissions: number }>;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [heatmapDays, setHeatmapDays] = useState<Record<string, any>>({});
  const [dailyPractice, setDailyPractice] = useState<{
    date: string;
    total_goals: number;
    completed_goals: number;
    problems: DailyPracticeItem[];
  }>({
    date: new Date().toISOString().split('T')[0],
    total_goals: 6,
    completed_goals: 0,
    problems: [],
  });
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const fetchAllDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Dashboard summary
      const dashRes = await api.get('/user/dashboard');
      if (dashRes.data.success) {
        setDashboard(dashRes.data.data);
      }

      // 2. Heatmap
      const heatRes = await api.get('/user/activity-heatmap');
      if (heatRes.data.success) {
        setHeatmapDays(heatRes.data.data.days || {});
      }

      // 3. Daily Practice
      const pracRes = await api.get('/daily-practice');
      if (pracRes.data.success) {
        setDailyPractice(pracRes.data.data);
      }

      // 5. Achievements
      const achRes = await api.get('/user/achievements');
      if (achRes.data.success) {
        setAchievements(achRes.data.data.achievements || []);
      }

      // 6. Analytics
      const anaRes = await api.get('/user/analytics');
      if (anaRes.data.success) {
        setAnalytics(anaRes.data.data);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, [user?.id]);

  const getSubjectPercentage = (slug: string): number => {
    if (!dashboard?.subjects) return 0;
    const sub = dashboard.subjects.find((s) => s.slug === slug);
    return sub ? sub.percentage : 0;
  };

  const getSubjectSolved = (slug: string): { solved: number; total: number } => {
    if (!dashboard?.subjects) return { solved: 0, total: 0 };
    const sub = dashboard.subjects.find((s) => s.slug === slug);
    return sub ? { solved: sub.solved, total: sub.total } : { solved: 0, total: 0 };
  };

  const tracks = [
    {
      id: 'java',
      name: 'Java',
      icon: Coffee,
      progress: getSubjectPercentage('java'),
      solved: getSubjectSolved('java').solved,
      total: getSubjectSolved('java').total,
      badge: 'Core Track',
      color: 'from-amber-600 to-amber-700',
      description: 'OOPs, Collections, Multithreading, and interview questions.',
      route: '/java',
    },
    {
      id: 'dsa',
      name: 'DSA',
      icon: Binary,
      progress: getSubjectPercentage('dsa'),
      solved: getSubjectSolved('dsa').solved,
      total: getSubjectSolved('dsa').total,
      badge: 'Essential',
      color: 'from-stone-700 to-stone-800',
      description: 'Arrays, Trees, Graphs, DP, and standard interview patterns.',
      route: '/dsa',
    },
    {
      id: 'aptitude',
      name: 'Aptitude',
      icon: BrainCircuit,
      progress: getSubjectPercentage('aptitude'),
      solved: getSubjectSolved('aptitude').solved,
      total: getSubjectSolved('aptitude').total,
      badge: 'Screening',
      color: 'from-amber-700 to-orange-700',
      description: 'Quantitative math, Logical reasoning, and Verbal tests.',
      route: '/aptitude',
    },
  ];



  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#244D38] dark:text-emerald-400" />
        <p className="text-sm text-[#5F665F] dark:text-stone-400">Loading your learning workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-14 max-w-7xl mx-auto">
      {/* ==================================================== */}
      {/* 1. EDITORIAL HERO SECTION                            */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EFE9DC] via-[#FAF6EE] to-[#E8DFC8] dark:from-[#241C15] dark:via-[#1E1712] dark:to-[#17110C] border border-[#E5DED4] dark:border-stone-800 p-7 sm:p-9 shadow-sm">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-[#244D38]/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#244D38]/10 dark:bg-emerald-950/40 text-[#244D38] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-[#244D38]/20 dark:border-emerald-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Placement Preparation • Full Practice Suite</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17211B] dark:text-[#FAF6EE] tracking-tight leading-tight">
              Code Better. <br />
              <span className="text-[#244D38] dark:text-emerald-400">Build Bigger.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#5F665F] dark:text-[#BDB7AB] mt-3 leading-relaxed max-w-xl">
              Structured Java practice from basics to advanced enterprise concepts and placement interview challenges.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              <Link
                to="/java"
                className="px-6 py-3 rounded-2xl bg-[#244D38] hover:bg-[#1B3B2B] text-white text-sm font-bold shadow-md shadow-[#244D38]/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Editorial Motivation Quote / Learning Badge Card */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9]/90 dark:bg-stone-900/80 border border-[#E5DED4] dark:border-stone-800 shadow-xs max-w-sm shrink-0">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
              <Quote className="w-5 h-5 fill-current" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400">Daily Focus</span>
            </div>
            <p className="text-xs sm:text-sm text-[#17211B] dark:text-stone-200 italic font-medium leading-relaxed">
              &ldquo;Premature optimization is the root of all evil. Write clean, understandable code first.&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-[#E5DED4]/80 dark:border-stone-800 flex items-center justify-between text-[11px] text-[#5F665F] dark:text-stone-400">
              <span className="font-semibold">— Donald Knuth</span>
              <span className="font-mono text-[10px] bg-[#F0EBE2] dark:bg-stone-800 px-2 py-0.5 rounded-md">Continuous Practice</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. HORIZONTAL PROGRESS SUMMARY                       */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Completion Ring */}
        <div className="p-5 rounded-3xl bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#EDE7DC] dark:text-stone-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#244D38] dark:text-emerald-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${dashboard?.overall_progress_percentage || 0}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-[#17211B] dark:text-white font-mono">
              {dashboard?.overall_progress_percentage || 0}%
            </span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#5F665F] dark:text-stone-400">Overall Progress</p>
            <h3 className="text-lg font-black text-[#17211B] dark:text-white mt-0.5 font-mono">
              {dashboard?.overall_progress_percentage || 0}%
            </h3>
            <p className="text-[11px] text-[#5F665F] dark:text-stone-400">Curriculum Completion</p>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-5 rounded-3xl bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4E8A61]/15 text-[#4E8A61] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#5F665F] dark:text-stone-400">Questions Solved</p>
            <h3 className="text-lg font-black text-[#17211B] dark:text-white mt-0.5 font-mono">
              {dashboard?.problems_solved || 0}{' '}
              <span className="text-xs font-normal text-[#5F665F] dark:text-stone-400">/ {dashboard?.total_problems || 0}</span>
            </h3>
            <p className="text-[11px] text-[#5F665F] dark:text-stone-400">Practice Challenges</p>
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-5 rounded-3xl bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#5F665F] dark:text-stone-400">Current Streak</p>
            <h3 className="text-lg font-black text-[#17211B] dark:text-white mt-0.5 font-mono">
              {dashboard?.current_streak || 0} Days
            </h3>
            <p className="text-[11px] text-[#5F665F] dark:text-stone-400">Best: {dashboard?.longest_streak || 0} days streak</p>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-5 rounded-3xl bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B95F3C]/15 text-[#B95F3C] dark:text-amber-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#5F665F] dark:text-stone-400">Judge Accuracy</p>
            <h3 className="text-lg font-black text-[#17211B] dark:text-white mt-0.5 font-mono">
              {dashboard?.accuracy || 0}%
            </h3>
            <p className="text-[11px] text-[#5F665F] dark:text-stone-400">
              {dashboard?.accepted_submissions || 0}/{dashboard?.total_submissions || 0} Submissions
            </p>
          </div>
        </div>
      </div>



      {/* ==================================================== */}
      {/* 4. TODAY'S PRACTICE TARGETS                          */}
      {/* ==================================================== */}
      <div>
        <DailyPracticeCard
          date={dailyPractice.date}
          totalGoals={dailyPractice.total_goals}
          completedGoals={dailyPractice.completed_goals}
          problems={dailyPractice.problems}
        />
      </div>

      {/* ==================================================== */}
      {/* 5. 12-MONTH ACTIVITY CONTRIBUTION HEATMAP             */}
      {/* ==================================================== */}
      <ActivityHeatmap
        days={heatmapDays}
        totalSolved={dashboard?.problems_solved || 0}
        totalSubmissions={dashboard?.total_submissions || 0}
      />

      {/* ==================================================== */}
      {/* 6. SUBJECT LEARNING TRACKS (Java, DSA, Aptitude)      */}
      {/* ==================================================== */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
            <h2 className="text-base font-bold text-[#17211B] dark:text-white tracking-tight">Core Learning Roadmaps</h2>
          </div>
          <span className="text-xs text-[#5F665F] dark:text-stone-400 font-medium">
            Overall Completion: <strong className="text-[#17211B] dark:text-white">{dashboard?.overall_progress_percentage || 0}%</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <Link
                key={track.id}
                to={track.route}
                className="group bg-[#FFFDF9] dark:bg-[#1E1813] hover:bg-[#F8F5EE] dark:hover:bg-stone-900 border border-[#E5DED4] dark:border-stone-800 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center text-white shadow-sm`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F0EBE2] dark:bg-stone-800 text-[#5F665F] dark:text-stone-300">
                      {track.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#17211B] dark:text-white group-hover:text-[#244D38] dark:group-hover:text-emerald-400 transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-xs text-[#5F665F] dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5DED4] dark:border-stone-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-[#5F665F] dark:text-stone-400 font-sans">Progress</span>
                    <span className="text-[#17211B] dark:text-white font-bold">{track.progress}%</span>
                  </div>
                  <div className="w-full bg-[#EDE7DC] dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${track.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${track.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#5F665F] dark:text-stone-500 font-mono mt-2">
                    <span>
                      {track.solved}/{track.total} solved
                    </span>
                    <span className="text-[#244D38] dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-sans font-medium">
                      Roadmap <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 7. LEARNING ANALYTICS & ACHIEVEMENTS                */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (6 cols): Performance & Difficulty Analytics */}
        <div className="lg:col-span-6 bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E5DED4] dark:border-stone-800/80">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-[#17211B] dark:text-white tracking-tight">Difficulty Breakdown</h3>
              </div>
              <span className="text-xs font-mono text-[#5F665F] dark:text-stone-400">By Challenge Level</span>
            </div>

            {/* Difficulty Bars */}
            <div className="space-y-3.5 pt-1">
              {/* EASY */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Easy Problems</span>
                  <span className="font-mono text-[#17211B] dark:text-stone-300">
                    {analytics?.difficulty?.EASY?.solved || 0} /{' '}
                    {analytics?.difficulty?.EASY?.total || 0}
                  </span>
                </div>
                <div className="w-full bg-[#EDE7DC] dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${analytics?.difficulty?.EASY?.total
                          ? Math.round(
                            ((analytics.difficulty.EASY.solved || 0) /
                              analytics.difficulty.EASY.total) *
                            100
                          )
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

              {/* MEDIUM */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Medium Problems</span>
                  <span className="font-mono text-[#17211B] dark:text-stone-300">
                    {analytics?.difficulty?.MEDIUM?.solved || 0} /{' '}
                    {analytics?.difficulty?.MEDIUM?.total || 0}
                  </span>
                </div>
                <div className="w-full bg-[#EDE7DC] dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${analytics?.difficulty?.MEDIUM?.total
                          ? Math.round(
                            ((analytics.difficulty.MEDIUM.solved || 0) /
                              analytics.difficulty.MEDIUM.total) *
                            100
                          )
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

              {/* HARD */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">Hard Problems</span>
                  <span className="font-mono text-[#17211B] dark:text-stone-300">
                    {analytics?.difficulty?.HARD?.solved || 0} /{' '}
                    {analytics?.difficulty?.HARD?.total || 0}
                  </span>
                </div>
                <div className="w-full bg-[#EDE7DC] dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${analytics?.difficulty?.HARD?.total
                          ? Math.round(
                            ((analytics.difficulty.HARD.solved || 0) /
                              analytics.difficulty.HARD.total) *
                            100
                          )
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5DED4] dark:border-stone-800/80 flex items-center justify-between text-[11px] text-[#5F665F] dark:text-stone-400 font-mono">
            <span>Accepted: {dashboard?.accepted_submissions || 0}</span>
            <span>Submissions: {dashboard?.total_submissions || 0}</span>
            <span>Overall: {dashboard?.accuracy || 0}% Accuracy</span>
          </div>
        </div>

        {/* Right (6 cols): Achievements Showcase */}
        <div className="lg:col-span-6">
          <AchievementsCard achievements={achievements} />
        </div>
      </div>
    </div>
  );
};
