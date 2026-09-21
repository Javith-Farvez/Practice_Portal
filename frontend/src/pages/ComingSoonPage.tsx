import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock, Construction } from 'lucide-react';

interface ModuleInfo {
  title: string;
  description: string;
  phase: string;
  features: string[];
}

const MODULE_DATA: Record<string, ModuleInfo> = {
  '/track/java': {
    title: 'Java Learning Track',
    description: 'Structured problem sets covering OOPs, Collections, Exception Handling, Multithreading, and Coding Rounds.',
    phase: 'Phase 2 (Problem Engine & Compiler)',
    features: ['Curated Topic Trees', 'Java Compiler Execution', 'Company Interview Questions', 'Test Case Verifier'],
  },
  '/track/dsa': {
    title: 'Data Structures & Algorithms',
    description: 'End-to-end DSA preparation roadmap: Arrays, Stacks, Queues, Trees, Graphs, DP, and Greedy algorithms.',
    phase: 'Phase 2 (Problem Engine & Compiler)',
    features: ['Blind 75 & NeetCode Patterns', 'Editorial Explanations', 'Memory & Runtime Benchmarks', 'Mock Assessments'],
  },
  '/track/aptitude': {
    title: 'Aptitude & Reasoning Track',
    description: 'Quantitative aptitude, logical reasoning puzzles, and verbal proficiency designed for screening rounds.',
    phase: 'Phase 3 (Aptitude & Timed Quizzes)',
    features: ['Timed Practice Tests', 'Step-by-step Formulas', 'Speed Calculation Tricks', 'Placement Test Simulations'],
  },
  '/practice': {
    title: 'Daily Practice Schedule',
    description: 'Daily automated question drops with streak tracking and topic balancing.',
    phase: 'Phase 3 (Daily Challenges & Streaks)',
    features: ['Daily Challenge of the Day', 'Adaptive Difficulty', 'Reminder Notifications', 'Streak Badges'],
  },
  '/bookmarks': {
    title: 'Saved Bookmarks',
    description: 'Quickly bookmark difficult problems and revision notes to review before interviews.',
    phase: 'Phase 2 (Problem Engine)',
    features: ['Custom Folders', 'Revision Reminders', 'Personal Notes', 'Quick Access'],
  },
  '/analytics': {
    title: 'Performance Analytics',
    description: 'Interactive radar charts, topic mastery heatmaps, and placement readiness index.',
    phase: 'Phase 4 (Analytics & Insights)',
    features: ['Topic Mastery Index', 'Speed vs Accuracy Curves', 'Peer Benchmark Comparisons', 'Weakness Diagnostic'],
  },
  '/profile': {
    title: 'Student Profile',
    description: 'Manage educational background, target companies, resume links, and placement milestones.',
    phase: 'Phase 2 (Profile & Goals)',
    features: ['Target Company Watchlist', 'Resume URL', 'Skill Endorsements', 'Placement Status'],
  },
};

export const ComingSoonPage: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const currentModule = MODULE_DATA[currentPath] || {
    title: 'Feature Under Active Construction',
    description: 'This feature is slated for upcoming development phases as part of the Placement Practice Portal roadmap.',
    phase: 'Future Phase',
    features: ['Structured Curriculum', 'Interactive Evaluation', 'Continuous Progress Tracking'],
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm text-center relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Phase Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <Clock className="w-3.5 h-3.5" />
          <span>{currentModule.phase} • Coming Soon</span>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600/15 via-purple-600/15 to-blue-600/15 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Construction className="w-8 h-8" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          {currentModule.title}
        </h1>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8">
          {currentModule.description}
        </p>

        {/* Planned Features Preview */}
        <div className="text-left bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Planned Capabilities</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentModule.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Back button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
