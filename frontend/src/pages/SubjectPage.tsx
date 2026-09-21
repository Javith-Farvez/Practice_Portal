import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import {
  Coffee,
  Terminal,
  Binary,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  GraduationCap,
  SlidersHorizontal,
} from 'lucide-react';
import { JavaTopicVisualizer } from '../components/JavaTopicVisualizer';

interface Topic {
  id: number;
  name: string;
  slug: string;
  order_index: number;
  description: string;
  total_problems: number;
  solved_problems: number;
  progress_percentage: number;
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface SubjectData {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color_gradient: string;
  total_problems: number;
  solved_problems: number;
  progress_percentage: number;
}

export const SubjectPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();

  // If accessed directly via /java, /dsa, /aptitude
  const currentSlug = slug || location.pathname.replace('/', '');

  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showVisualizer, setShowVisualizer] = useState<boolean>(true);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'coffee':
      case 'java':
        return Coffee;
      case 'binary':
      case 'dsa':
        return Binary;
      case 'braincircuit':
      case 'aptitude':
        return BrainCircuit;
      default:
        return BookOpen;
    }
  };

  useEffect(() => {
    const fetchSubjectData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/subjects/${currentSlug}`);
        if (response.data.success) {
          setSubject(response.data.data.subject);
          setTopics(response.data.data.topics);
        } else {
          setError(response.data.message || 'Failed to load subject roadmap.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading subject roadmap.');
      } finally {
        setLoading(false);
      }
    };

    if (currentSlug) {
      fetchSubjectData();
    }
  }, [currentSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <p className="text-sm text-stone-500 dark:text-stone-400">Loading learning roadmap...</p>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Subject Not Found</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">{error || 'Roadmap could not be loaded.'}</p>
        <Link
          to="/dashboard"
          className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const Icon = getSubjectIcon(subject.icon || subject.slug);

  return (
    <div className="space-y-8">
      {/* Subject Header Banner in warm Sandalwood / Amber Palette */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8C5820] via-[#B88442] to-[#D97706] p-6 sm:p-8 text-white shadow-xl shadow-amber-900/20 border border-amber-400/30">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-100 text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus Placement Curriculum • {topics.length || 29} Core Topics</span>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/30">
                <Icon className="w-7 h-7 text-amber-200" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                {subject.name}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-amber-50/90 leading-relaxed font-normal">
              {subject.description}
            </p>
          </div>

          {/* Overall Completion Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-5 min-w-[240px] text-center shrink-0 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-200/90">
              Overall Completion
            </p>
            <div className="flex items-baseline justify-center gap-1.5 my-2">
              <span className="text-4xl font-black text-white">{subject.progress_percentage}%</span>
            </div>
            <p className="text-xs text-amber-100/80 mb-3 font-medium">
              {subject.solved_problems} of {subject.total_problems} problems solved
            </p>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-300 to-white h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${subject.progress_percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Interactive Visualizer for Java */}
      {currentSlug === 'java' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-amber-200">
                Placement Visual Masterclass & Reference Guides
              </span>
            </div>
            <button
              onClick={() => setShowVisualizer(!showVisualizer)}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
            >
              {showVisualizer ? 'Collapse Guide' : 'Expand Guide'}
            </button>
          </div>
          {showVisualizer && <JavaTopicVisualizer activeTabDefault="methodology" showAllTabs={true} />}
        </div>
      )}

      {/* Topics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Curated Topics ({topics.length})</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Sequential curriculum path for interview placement coding rounds
          </p>
        </div>

        <Link
          to={`/problems?subject=${subject.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/50 hover:bg-amber-200 dark:hover:bg-amber-900/60 border border-amber-300/60 dark:border-amber-800/60 transition-all self-start sm:self-auto shadow-sm"
        >
          <span>View All {subject.name} Problems</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, idx) => {
          const getCurriculumStage = (order: number) => {
            if (order <= 5) return 'Stage 1: Core Fundamentals';
            if (order <= 11) return 'Stage 2: Logic & Control Flow';
            if (order <= 15) return 'Stage 3: Methods & Arrays';
            if (order <= 17) return 'Stage 4: String Processing';
            if (order <= 22) return 'Stage 5: OOP Architecture';
            return 'Stage 6: Advanced & Collections';
          };

          const stageLabel = getCurriculumStage(topic.order_index);

          return (
            <div
              key={topic.id}
              className="group rounded-2xl p-5 border transition-all flex flex-col justify-between bg-[#FFFDF8] dark:bg-[#1E1813] border-[#E8DFC8] dark:border-stone-800 shadow-sm hover:border-[#E76F51] hover:shadow-lg"
            >
              <div>
                {/* Stage Badge & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100/70 dark:bg-stone-800 text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-stone-700">
                    {stageLabel}
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${topic.progress_percentage === 100
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-[#5C8D68] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                        : topic.solved_problems > 0
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                      }`}
                  >
                    {topic.progress_percentage}% complete
                  </span>
                </div>

                {/* Card Header: Number + Title */}
                <div className="flex items-start gap-2.5 mb-2.5">
                  <span className="w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 border bg-amber-100/80 dark:bg-stone-800 text-[#1F2421] dark:text-amber-300 border-[#E8DFC8] dark:border-stone-700">
                    {String(topic.order_index || idx + 1).padStart(2, '0')}
                  </span>
                  <Link
                    to={`/topics/${topic.id}`}
                    className="text-base font-bold text-[#1F2421] dark:text-amber-50 group-hover:text-[#E76F51] transition-colors leading-snug cursor-pointer"
                  >
                    {topic.name}
                  </Link>
                </div>

                {/* Description */}
                <p className="text-xs text-[#6B706B] dark:text-stone-400 mb-4 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Progress Bar & Stats */}
                <div className="w-full bg-stone-200/60 dark:bg-stone-800 h-2 rounded-full overflow-hidden mb-4 p-0.5">
                  <div
                    className="bg-gradient-to-r from-[#E76F51] via-[#E9B44C] to-[#5C8D68] h-full rounded-full transition-all duration-300"
                    style={{ width: `${topic.progress_percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-t border-[#E8DFC8]/60 dark:border-stone-800 mb-4">
                  <span className="text-[#6B706B] dark:text-stone-400 font-semibold">
                    {topic.total_problems} Problems ({topic.solved_problems} Solved)
                  </span>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    {topic.difficulty_distribution.easy > 0 && (
                      <span className="text-[#5C8D68] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">
                        {topic.difficulty_distribution.easy} E
                      </span>
                    )}
                    {topic.difficulty_distribution.medium > 0 && (
                      <span className="text-[#E9B44C] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded">
                        {topic.difficulty_distribution.medium} M
                      </span>
                    )}
                    {topic.difficulty_distribution.hard > 0 && (
                      <span className="text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-1.5 py-0.5 rounded">
                        {topic.difficulty_distribution.hard} H
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E8DFC8]/40 dark:border-stone-800/40">
                <Link
                  to={`/topics/${topic.id}`}
                  className="text-xs font-bold text-[#1F2421] dark:text-stone-300 hover:text-[#E76F51] dark:hover:text-[#E76F51] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Study & Concepts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/topics/${topic.id}`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#E76F51] hover:bg-[#d85e40] shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Practice ({topic.total_problems})
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
