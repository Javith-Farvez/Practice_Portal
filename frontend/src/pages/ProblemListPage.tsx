import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { ProblemCardSkeleton } from '../components/Skeleton';
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Bookmark,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
} from 'lucide-react';

interface ProblemItem {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  level: string;
  subject_id: number;
  topic_id: number;
  subject_name: string;
  subject_slug: string;
  topic_name: string;
  status: 'SOLVED' | 'UNSOLVED' | 'ATTEMPTED';
  is_bookmarked: boolean;
  supported_languages?: string[];
}

interface SubjectSummary {
  id: number;
  slug: string;
  name: string;
}

export const ProblemListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states initialized from URL search params
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [subject, setSubject] = useState<string>(searchParams.get('subject') || '');
  const [difficulty, setDifficulty] = useState<string>(searchParams.get('difficulty') || '');
  const [level, setLevel] = useState<string>(searchParams.get('level') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || '');
  const [language, setLanguage] = useState<string>(searchParams.get('language') || '');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(searchParams.get('bookmarked') === 'true');
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));

  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectSummary[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch subjects for the filter dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        if (res.data.success) {
          setSubjectsList(res.data.data.subjects);
        }
      } catch (err) {
        console.error('Failed to load subjects for filter', err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch problems whenever filters or page changes
  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: '15',
      };
      if (search.trim()) params.search = search.trim();
      if (subject) params.subject = subject;
      if (difficulty) params.difficulty = difficulty;
      if (level) params.level = level;
      if (status) params.status = status;
      if (language) params.language = language;
      if (bookmarkedOnly) params.bookmarked = 'true';

      const res = await api.get('/problems', { params });
      if (res.data.success) {
        setProblems(res.data.data.problems);
        setTotalCount(res.data.data.total);
        setTotalPages(res.data.data.total_pages || 1);
        setHasNext(res.data.data.has_next || false);
        setHasPrev(res.data.data.has_prev || false);
      }
    } catch (err) {
      console.error('Failed to load problems', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();

    // Sync URL search params
    const newParams: Record<string, string> = {};
    if (search.trim()) newParams.search = search.trim();
    if (subject) newParams.subject = subject;
    if (difficulty) newParams.difficulty = difficulty;
    if (level) newParams.level = level;
    if (status) newParams.status = status;
    if (language) newParams.language = language;
    if (bookmarkedOnly) newParams.bookmarked = 'true';
    if (page > 1) newParams.page = String(page);
    setSearchParams(newParams);
  }, [search, subject, difficulty, level, status, language, bookmarkedOnly, page]);

  const resetFilters = () => {
    setSearch('');
    setSubject('');
    setDifficulty('');
    setLevel('');
    setStatus('');
    setLanguage('');
    setBookmarkedOnly(false);
    setPage(1);
  };

  const handleToggleBookmark = async (e: React.MouseEvent, problemId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.post(`/problems/${problemId}/bookmark`);
      if (res.data.success) {
        const isBookmarked = res.data.data.is_bookmarked;
        setProblems((prev) =>
          prev.map((p) => (p.id === problemId ? { ...p, is_bookmarked: isBookmarked } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'MEDIUM':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'HARD':
        return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'SOLVED':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[#5C8D68] border border-emerald-200 dark:border-emerald-800">
            Solved ✓
          </span>
        );
      case 'ATTEMPTED':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-[#E9B44C] border border-amber-200 dark:border-amber-800">
            Attempted •
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800/80 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
            Not Started ○
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Curriculum Problem Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Targeted placement questions across Java, DSA, and Aptitude
          </p>
        </div>

        <div className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
          Total: <strong className="text-brand-500">{totalCount}</strong> Problems
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#0D121F] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Global Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Global search by Problem title, Topic, Subject, or Difficulty..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {/* Subject Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Subjects</option>
              {subjectsList.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Level</label>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="PLACEMENT">Placement</option>
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Languages</option>
              <option value="java">Java</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="SOLVED">Solved</option>
              <option value="ATTEMPTED">Attempted</option>
              <option value="UNSOLVED">Not Started</option>
            </select>
          </div>

          {/* Bookmark Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Bookmarks</label>
            <button
              type="button"
              onClick={() => {
                setBookmarkedOnly(!bookmarkedOnly);
                setPage(1);
              }}
              className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                bookmarkedOnly
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{bookmarkedOnly ? 'Bookmarked' : 'All'}</span>
            </button>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Problem Cards List */}
      {loading ? (
        <div className="space-y-3">
          <ProblemCardSkeleton />
          <ProblemCardSkeleton />
          <ProblemCardSkeleton />
          <ProblemCardSkeleton />
        </div>
      ) : problems.length === 0 ? (
        <div className="bg-white dark:bg-[#0D121F] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No matching problems found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords or removing selected filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((prob) => (
            <div
              key={prob.id}
              onClick={() => navigate(`/problems/${prob.id}`)}
              className="group bg-white dark:bg-[#0D121F] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                {/* Solved Status */}
                <div className="shrink-0 mt-0.5 sm:mt-0">
                  {prob.status === 'SOLVED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : prob.status === 'ATTEMPTED' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 shrink-0">
                      #{prob.id}
                    </span>
                    <Link
                      to={`/problems/${prob.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate hover:text-brand-500 transition-colors"
                    >
                      {prob.title}
                    </Link>
                  </div>

                  {/* Metadata Chips: Topic, Subject, Level, Status */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400">
                      {prob.subject_name}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {prob.topic_name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      {prob.level}
                    </span>
                    {getStatusBadge(prob.status)}
                  </div>
                </div>
              </div>

              {/* Right Side: Difficulty badge, Bookmark, and Code Now button */}
              <div
                className="flex items-center gap-3 self-end sm:self-auto shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark(e, prob.id);
                  }}
                  title={prob.is_bookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <Bookmark
                    className={`w-4 h-4 transition-all ${
                      prob.is_bookmarked ? 'text-amber-500 fill-amber-500 scale-110' : ''
                    }`}
                  />
                </button>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${getDifficultyBadge(
                    prob.difficulty
                  )}`}
                >
                  {prob.difficulty}
                </span>

                <Link
                  to={`/problems/${prob.id}`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Code Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-[#0D121F] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={!hasPrev}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-500">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={!hasNext}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
