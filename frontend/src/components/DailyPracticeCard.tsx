import React from 'react';
import { Link } from 'react-router-dom';
import { Target, CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';

export interface DailyPracticeItem {
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

interface DailyPracticeCardProps {
  date: string;
  totalGoals: number;
  completedGoals: number;
  problems: DailyPracticeItem[];
}

export const DailyPracticeCard: React.FC<DailyPracticeCardProps> = ({
  date,
  totalGoals,
  completedGoals,
  problems,
}) => {
  const getSubjectBadge = (slug: string) => {
    switch (slug) {
      case 'java':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'dsa':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'aptitude':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'text-emerald-400';
      case 'MEDIUM':
        return 'text-amber-400';
      case 'HARD':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const progressPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E5DED4] dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[#17211B] dark:text-white tracking-tight">Today&rsquo;s Practice</h3>
            <span className="text-xs font-mono text-[#5F665F] dark:text-stone-400">({date})</span>
          </div>
          <p className="text-xs text-[#5F665F] dark:text-stone-400">
            6 daily curated problems: Java (2) • DSA (2) • Aptitude (2)
          </p>
        </div>

        {/* Completion Meter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#17211B] dark:text-white">
              {completedGoals} / {totalGoals}
            </span>
            <span className="text-[11px] text-[#5F665F] dark:text-stone-400 ml-1">Solved Today</span>
          </div>
          <div className="w-24 bg-[#EDE7DC] dark:bg-stone-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#244D38] dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {problems.map((prob) => (
          <Link
            key={prob.id}
            to={`/problems/${prob.id}`}
            className="group p-3.5 rounded-2xl bg-[#F8F5EE] dark:bg-stone-900/60 border border-[#E5DED4] dark:border-stone-800 hover:border-[#244D38] dark:hover:border-emerald-600 hover:bg-[#F2EDE2] dark:hover:bg-stone-800/70 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getSubjectBadge(
                    prob.subject_slug
                  )}`}
                >
                  {prob.subject_name}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-semibold ${getDifficultyColor(prob.difficulty)}`}>
                    {prob.difficulty}
                  </span>
                  {prob.is_completed_today ? (
                    <CheckCircle2 className="w-4 h-4 text-[#4E8A61] dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-[#244D38]" />
                  )}
                </div>
              </div>

              <h4 className="text-xs font-semibold text-[#17211B] dark:text-stone-200 group-hover:text-[#244D38] dark:group-hover:text-emerald-400 line-clamp-2 leading-relaxed">
                #{prob.id} {prob.title}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#E5DED4]/60 dark:border-stone-800/60 text-[11px] text-[#5F665F] dark:text-stone-400">
              <span className="truncate">{prob.topic_name}</span>
              <span className="text-[#244D38] dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Practice <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
