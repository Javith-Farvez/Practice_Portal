import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  BarChart3,
  TrendingUp,
  Target,
  AlertTriangle,
  Award,
  Calendar,
  Coffee,
  Terminal,
  Binary,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface WeeklyChartItem {
  date: string;
  day_name: string;
  solved: number;
  submissions: number;
}

interface MonthlyChartItem {
  year_month: string;
  month: string;
  solved: number;
  submissions: number;
}

interface SubjectProgressItem {
  id: number;
  slug: string;
  name: string;
  total: number;
  solved: number;
  percentage: number;
}

interface TopicProgressItem {
  id: number;
  topic_name: string;
  subject_name: string;
  subject_slug: string;
  total: number;
  solved: number;
  percentage: number;
}

interface WeakTopicItem {
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
}

interface StrongTopicItem {
  topic_id: number;
  topic_name: string;
  subject_name: string;
  subject_slug: string;
  accuracy: number;
  completion_rate: number;
  solved_problems: number;
  total_problems: number;
  tag: string;
}

interface AnalyticsData {
  weekly_activity: {
    problems_solved: number;
    total_submissions: number;
  };
  monthly_activity: {
    problems_solved: number;
    total_submissions: number;
  };
  weekly_chart: WeeklyChartItem[];
  monthly_chart: MonthlyChartItem[];
  accuracy: number;
  accepted_vs_rejected: {
    accepted: number;
    rejected: number;
    total: number;
  };
  difficulty_distribution: {
    EASY: { total: number; solved: number };
    MEDIUM: { total: number; solved: number };
    HARD: { total: number; solved: number };
  };
  subject_progress: SubjectProgressItem[];
  topic_progress: TopicProgressItem[];
  weak_topics: WeakTopicItem[];
  strong_topics: StrongTopicItem[];
}

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm text-slate-400">Aggregating learning analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Unable to Load Analytics
        </h3>
        <p className="text-xs text-slate-500 mb-4">{error || 'Something went wrong.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  // Safe normalized fallbacks
  const weeklyChart = data.weekly_chart || [];
  const monthlyChart = data.monthly_chart || [];
  const subjectProgress = data.subject_progress || [];
  const weakTopics = data.weak_topics || [];
  const strongTopics = data.strong_topics || [];
  const weeklyActivity = data.weekly_activity || { problems_solved: 0, total_submissions: 0 };
  const monthlyActivity = data.monthly_activity || { problems_solved: 0, total_submissions: 0 };
  const acceptedVsRejected = data.accepted_vs_rejected || { accepted: 0, rejected: 0, total: 0 };
  const difficultyDist = data.difficulty_distribution || {
    EASY: { total: 0, solved: 0 },
    MEDIUM: { total: 0, solved: 0 },
    HARD: { total: 0, solved: 0 },
  };

  // Calculate max values for bar chart scaling
  const maxWeeklySubs = Math.max(1, ...weeklyChart.map((d) => Math.max(d.solved, d.submissions)));
  const maxMonthlySubs = Math.max(1, ...monthlyChart.map((d) => Math.max(d.solved, d.submissions)));

  const getSubjectIcon = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'java':
        return Coffee;
      case 'dsa':
        return Binary;
      default:
        return BrainCircuit;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-brand-500" />
          Learning Analytics & Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Factual diagnostic insights across your practice consistency, subject mastery, and topic precision.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Accuracy */}
        <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
            <Target className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {data.accuracy ?? 0}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {acceptedVsRejected.accepted} accepted of {acceptedVsRejected.total} submissions
          </span>
        </div>

        {/* Weekly Solved */}
        <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Past 7 Days</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {weeklyActivity.problems_solved}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Problems solved across {weeklyActivity.total_submissions} attempts
          </span>
        </div>

        {/* Monthly Solved */}
        <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">This Month</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {monthlyActivity.problems_solved}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Total problems completed this month
          </span>
        </div>

        {/* Needs Practice Count */}
        <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Needs Practice</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {weakTopics.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Topics with &lt;60% accuracy requiring review
          </span>
        </div>
      </div>

      {/* Grid: Charts (Weekly + Monthly Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Weekly Activity (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-400">Problems solved and total attempts</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" /> Solved
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-slate-700" /> Submissions
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyChart.map((day) => {
              const solvedHeight = (day.solved / maxWeeklySubs) * 100;
              const subHeight = (day.submissions / maxWeeklySubs) * 100;

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Submissions Bar */}
                    <div
                      className="w-1/2 bg-slate-200 dark:bg-slate-800 rounded-t-md transition-all hover:opacity-80"
                      style={{ height: `${Math.max(4, subHeight)}%` }}
                      title={`${day.day_name}: ${day.submissions} submissions`}
                    />
                    {/* Solved Bar */}
                    <div
                      className="w-1/2 bg-brand-500 rounded-t-md transition-all hover:bg-brand-400"
                      style={{ height: `${Math.max(4, solvedHeight)}%` }}
                      title={`${day.day_name}: ${day.solved} solved`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{day.day_name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Activity Chart */}
        <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Activity Trend
              </h3>
              <p className="text-xs text-slate-400">Month-over-month solved problems</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> Solved
              </span>
            </div>
          </div>

          {/* Monthly Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyChart.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No monthly activity recorded yet.
              </div>
            ) : (
              monthlyChart.map((m) => {
                const height = (m.solved / maxMonthlySubs) * 100;
                return (
                  <div key={m.year_month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full flex items-end justify-center h-36">
                      <div
                        className="w-8 bg-purple-500 rounded-t-md transition-all hover:bg-purple-400"
                        style={{ height: `${Math.max(6, height)}%` }}
                        title={`${m.month}: ${m.solved} solved`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{m.month}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Grid: Accuracy & Difficulty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions Breakdown */}
        <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Submission Verdicts
          </h3>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-xs text-slate-400">Accepted</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {acceptedVsRejected.accepted}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-xs text-slate-400">Rejected</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {acceptedVsRejected.rejected}
                </p>
              </div>
            </div>
          </div>

          {/* Bar Ratio */}
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {acceptedVsRejected.total > 0 && (
              <>
                <div
                  className="bg-emerald-500 h-full"
                  style={{
                    width: `${(acceptedVsRejected.accepted / acceptedVsRejected.total) * 100}%`,
                  }}
                />
                <div
                  className="bg-red-500 h-full"
                  style={{
                    width: `${(acceptedVsRejected.rejected / acceptedVsRejected.total) * 100}%`,
                  }}
                />
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            {data.accuracy ?? 0}% Accuracy Rate
          </p>
        </div>

        {/* Difficulty Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0D121F] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Difficulty Distribution
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Easy */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                Easy
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {difficultyDist.EASY.solved} / {difficultyDist.EASY.total}
              </p>
              <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900/60 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${
                      difficultyDist.EASY.total > 0
                        ? (difficultyDist.EASY.solved /
                            difficultyDist.EASY.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
              <span className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400">
                Medium
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {difficultyDist.MEDIUM.solved} / {difficultyDist.MEDIUM.total}
              </p>
              <div className="w-full h-1.5 bg-amber-200 dark:bg-amber-900/60 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: `${
                      difficultyDist.MEDIUM.total > 0
                        ? (difficultyDist.MEDIUM.solved /
                            difficultyDist.MEDIUM.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Hard */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/60">
              <span className="text-[11px] font-bold uppercase text-red-700 dark:text-red-400">
                Hard
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {difficultyDist.HARD.solved} / {difficultyDist.HARD.total}
              </p>
              <div className="w-full h-1.5 bg-red-200 dark:bg-red-900/60 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      difficultyDist.HARD.total > 0
                        ? (difficultyDist.HARD.solved /
                            difficultyDist.HARD.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress Tracks */}
      <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Subject Track Completion
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectProgress.map((s) => {
            const Icon = getSubjectIcon(s.slug);
            return (
              <div
                key={s.slug}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-brand-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{s.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {s.percentage}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  {s.solved} of {s.total} problems completed
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Topics ("Needs More Practice") Section */}
      <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Topics Needing Focus (Factual Analytics)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Calculated strictly when topic accuracy &lt; 60%
          </span>
        </div>

        {weakTopics.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              No High-Error Topics Detected!
            </h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 max-w-md mx-auto mt-1">
              Your submission accuracy across attempted topics is steady above 60%. Continue practicing consistently!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {weakTopics.map((wt) => (
              <div
                key={wt.topic_id}
                className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">
                      {wt.subject_name}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {wt.topic_name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Needs More Practice
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">{wt.reason}</p>

                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {wt.solved_problems} / {wt.total_problems} solved
                  </span>
                  <Link
                    to={`/problems?subject=${wt.subject_slug}`}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <span>Practice Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strong Topics Section */}
      {strongTopics.length > 0 && (
        <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Strong Topics (High Accuracy & Completion)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {strongTopics.map((st) => (
              <div
                key={st.topic_id}
                className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                      {st.subject_name}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {st.topic_name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Strong Topic
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>Accuracy: {st.accuracy}%</span>
                  <span>Completion: {st.completion_rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
