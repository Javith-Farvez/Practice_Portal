import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Target,
  Crown,
  Flame,
  Zap,
  Coffee,
  Terminal,
  Binary,
  BrainCircuit,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export interface AchievementItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
  current_value?: number;
  target_value?: number;
  progress_percentage?: number;
}

interface AchievementsCardProps {
  achievements: AchievementItem[];
}

export const AchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');

  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-5 h-5 ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`;
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Coffee':
        return <Coffee className={className} />;
      case 'Terminal':
        return <Terminal className={className} />;
      case 'Binary':
        return <Binary className={className} />;
      case 'BrainCircuit':
        return <BrainCircuit className={className} />;
      default:
        return <Trophy className={className} />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.is_unlocked).length;

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'UNLOCKED') return a.is_unlocked;
    if (filter === 'LOCKED') return !a.is_unlocked;
    return true;
  });

  return (
    <div className="bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5DED4] dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#17211B] dark:text-white tracking-tight">Milestones & Achievements</h3>
            <p className="text-[11px] text-[#5F665F] dark:text-stone-400">Trackable competency milestones and consistency badges</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#F0EBE2] dark:bg-stone-900 p-1 rounded-xl border border-[#E5DED4] dark:border-stone-800 text-[11px] font-bold">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'ALL' ? 'bg-[#244D38] text-white shadow-xs' : 'text-[#5F665F] dark:text-stone-400 hover:text-[#17211B] dark:hover:text-white'
              }`}
            >
              All ({achievements.length})
            </button>
            <button
              onClick={() => setFilter('UNLOCKED')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'UNLOCKED' ? 'bg-[#244D38] text-white shadow-xs' : 'text-[#5F665F] dark:text-stone-400 hover:text-[#17211B] dark:hover:text-white'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('LOCKED')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'LOCKED' ? 'bg-[#244D38] text-white shadow-xs' : 'text-[#5F665F] dark:text-stone-400 hover:text-[#17211B] dark:hover:text-white'
              }`}
            >
              Locked ({achievements.length - unlockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Achievements with Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredAchievements.map((ach) => (
          <div
            key={ach.key}
            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
              ach.is_unlocked
                ? 'bg-amber-500/[0.05] border-amber-500/30 shadow-xs'
                : 'bg-[#F8F5EE] dark:bg-stone-900/50 border-[#E5DED4] dark:border-stone-800/80 hover:border-stone-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  ach.is_unlocked ? 'bg-amber-100 dark:bg-amber-500/20' : 'bg-[#EDE7DC] dark:bg-stone-800/80'
                }`}
              >
                {getIcon(ach.icon, ach.is_unlocked)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={`text-xs font-bold truncate ${
                      ach.is_unlocked ? 'text-[#17211B] dark:text-white' : 'text-[#5F665F] dark:text-stone-300'
                    }`}
                  >
                    {ach.title}
                  </h4>
                  {ach.is_unlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4E8A61] dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-[#5F665F] dark:text-stone-400 line-clamp-2 mt-0.5">{ach.description}</p>
              </div>
            </div>

            {/* Progress Bar & Status */}
            <div className="space-y-1.5 pt-1 border-t border-[#E5DED4]/60 dark:border-stone-800/50">
              <div className="flex items-center justify-between text-[10px] font-mono">
                {ach.is_unlocked ? (
                  <span className="text-[#4E8A61] dark:text-emerald-400 font-bold">
                    ✓ Unlocked {ach.unlocked_at ? new Date(ach.unlocked_at).toLocaleDateString() : ''}
                  </span>
                ) : (
                  <>
                    <span className="text-[#5F665F] dark:text-stone-400 font-bold">
                      Progress: {ach.current_value ?? 0} / {ach.target_value ?? 1}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{ach.progress_percentage ?? 0}%</span>
                  </>
                )}
              </div>

              {!ach.is_unlocked && (
                <div className="h-1.5 rounded-full bg-[#EDE7DC] dark:bg-stone-800 overflow-hidden">
                  <div
                    style={{ width: `${ach.progress_percentage ?? 0}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
