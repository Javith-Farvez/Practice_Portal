import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  Tag,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { JavaTopicVisualizer } from '../components/JavaTopicVisualizer';
import { TopicConceptCards } from '../components/TopicConceptCards';

interface ProblemSummary {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  level: string;
  status: 'SOLVED' | 'UNSOLVED' | 'ATTEMPTED';
  is_bookmarked: boolean;
}

interface Subtopic {
  id: number;
  name: string;
  slug: string;
  order_index: number;
}

interface TopicData {
  id: number;
  name: string;
  slug: string;
  order_index: number;
  description: string;
  subject_name: string;
  subject_slug: string;
}

export const TopicDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [topic, setTopic] = useState<TopicData | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [allTopics, setAllTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopicData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/topics/${id}`);
        if (response.data.success) {
          setTopic(response.data.data.topic);
          setSubtopics(response.data.data.subtopics);
          setProblems(response.data.data.problems);

          // Also fetch roadmap to discover next topic
          if (response.data.data.topic.subject_slug) {
            const subRes = await api.get(`/subjects/${response.data.data.topic.subject_slug}`);
            if (subRes.data.success) {
              setAllTopics(subRes.data.data.topics);
            }
          }
        } else {
          setError(response.data.message || 'Topic details could not be found.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading topic.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTopicData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#E76F51]" />
        <p className="text-sm text-[#6B706B]">Loading topic curriculum...</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1F2421] dark:text-white mb-2">Topic Error</h2>
        <p className="text-sm text-[#6B706B] dark:text-stone-400 mb-6">{error || 'Could not load topic.'}</p>
        <Link
          to="/dashboard"
          className="px-4 py-2 text-sm font-semibold text-white bg-[#E76F51] rounded-xl hover:bg-[#d85e40]"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const solvedCount = problems.filter((p) => p.status === 'SOLVED').length;
  const attemptedCount = problems.filter((p) => p.status === 'ATTEMPTED').length;
  const unsolvedCount = problems.length - solvedCount;
  const progressPercent = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  // Next topic discovery
  const currentIdx = allTopics.findIndex((t) => t.id === topic.id);
  const nextTopic = currentIdx !== -1 && currentIdx + 1 < allTopics.length ? allTopics[currentIdx + 1] : null;

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-[#5C8D68] dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40';
      case 'MEDIUM':
        return 'bg-amber-50 dark:bg-amber-950/40 text-[#E9B44C] dark:text-amber-400 border-amber-200 dark:border-amber-900/40';
      case 'HARD':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'SOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-[#5C8D68] dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
            <span>Solved ✓</span>
          </span>
        );
      case 'ATTEMPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-[#B57C1E] dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
            <span>Attempted •</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-[#6B706B] dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
            <span>Not Started ○</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Breadcrumb Header: Java > [Topic] */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#6B706B] dark:text-stone-400">
        <Link to={`/${topic.subject_slug}`} className="hover:text-[#E76F51] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Java</span>
        </Link>
        <span>&gt;</span>
        <span className="text-[#1F2421] dark:text-amber-200">{topic.name}</span>
      </div>

      {/* Header Topic Card */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E1813] rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] dark:border-stone-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF6EE] dark:bg-stone-900 text-[#E76F51] border border-[#E8DFC8] dark:border-stone-700 mb-2.5">
              <span>Topic {String(topic.order_index).padStart(2, '0')}</span>
              <span>•</span>
              <span>{problems.length} Practice Problems</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-amber-50 tracking-tight">
              {topic.name}
            </h1>
          </div>

          <div className="bg-[#FAF6EE] dark:bg-stone-900/80 p-4 rounded-2xl border border-[#E8DFC8] dark:border-stone-800 min-w-[200px] text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-2xl font-black text-[#1F2421] dark:text-amber-100">
                {solvedCount} / {problems.length}
              </span>
              <span className="text-xs text-[#6B706B] font-bold">Solved</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden mt-2 p-0.5">
              <div
                className="bg-gradient-to-r from-[#E76F51] to-[#5C8D68] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#6B706B] dark:text-stone-400 mt-1 font-medium">
              Progress: {progressPercent}% complete
            </p>
          </div>
        </div>

        {/* What the learner will understand */}
        <div className="mt-2 pt-3 border-t border-[#E8DFC8]/60 dark:border-stone-800">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B706B] dark:text-stone-400 mb-1">
            What you will understand:
          </p>
          <p className="text-sm text-[#1F2421] dark:text-stone-300 leading-relaxed max-w-3xl">
            {topic.description}
          </p>
        </div>

        {/* Subtopics Chips */}
        {subtopics.length > 0 && (
          <div className="pt-4 mt-4 border-t border-[#E8DFC8]/60 dark:border-stone-800">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E76F51] mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Key Focus Areas</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {subtopics.map((sub) => (
                <span
                  key={sub.id}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 text-[#1F2421] dark:text-stone-300"
                >
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Structured Concept Cards Component */}
      <TopicConceptCards orderIndex={topic.order_index} slug={topic.slug} />

      {/* Practice Section Header */}
      <div className="pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F2421] dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#E76F51]" />
              <span>Practice Problems ({problems.length})</span>
            </h2>
            <p className="text-xs text-[#6B706B] dark:text-stone-400">
              Problems progress from beginner fundamentals toward campus placement interview patterns. Practice completely at your own pace without any forced timers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B706B]">
            <span>{solvedCount} Solved</span>
            <span>•</span>
            <span>{unsolvedCount} Remaining</span>
          </div>
        </div>

        {/* Problem Cards Table */}
        {problems.length === 0 ? (
          <div className="bg-[#FFFDF8] dark:bg-[#1E1813] rounded-2xl p-8 text-center border border-[#E8DFC8] dark:border-stone-800">
            <p className="text-sm text-[#6B706B] dark:text-stone-400">
              Practice problems for this topic are currently being prepared.
            </p>
          </div>
        ) : (
          <div className="bg-[#FFFDF8] dark:bg-[#1E1813] rounded-2xl border border-[#E8DFC8] dark:border-stone-800 divide-y divide-[#E8DFC8]/60 dark:divide-stone-800/80 shadow-sm overflow-hidden">
            {problems.map((prob, idx) => (
              <div
                key={prob.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF6EE]/70 dark:hover:bg-stone-800/40 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-700 text-[#1F2421] dark:text-amber-200 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1F2421] dark:text-amber-50 truncate group-hover:text-[#E76F51] transition-colors">
                        {prob.title}
                      </h4>
                      {getStatusIndicator(prob.status)}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getDifficultyBadge(
                          prob.difficulty
                        )}`}
                      >
                        {prob.difficulty}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {prob.level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <Link
                    to={`/problems/${prob.id}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#E76F51] hover:bg-[#d85e40] shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Code Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation: Next Topic */}
      {nextTopic && (
        <div className="pt-6 border-t border-[#E8DFC8] dark:border-stone-800 flex items-center justify-between">
          <Link
            to={`/${topic.subject_slug}`}
            className="text-xs font-bold text-[#6B706B] hover:text-[#E76F51] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Java Topics</span>
          </Link>

          {nextTopic.order_index <= 4 ? (
            <Link
              to={`/topics/${nextTopic.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1F2421] hover:bg-stone-800 dark:bg-amber-100 dark:text-[#1F2421] transition-all shadow-sm"
            >
              <span>Next Topic: {nextTopic.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="text-xs text-stone-400 font-medium">
              Next Topic: {nextTopic.name} (Coming Next)
            </span>
          )}
        </div>
      )}
    </div>
  );
};
