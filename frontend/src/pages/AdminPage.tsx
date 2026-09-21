import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  Send,
  CheckCircle2,
  XCircle,
  Code2,
  Terminal,
  Binary,
  BrainCircuit,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Play,
  Eye,
  EyeOff,
  Upload,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
  Check,
  X,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

// --- Interfaces ---
interface AdminStats {
  total_users: number;
  active_users: number;
  total_students: number;
  total_admins: number;
  total_problems: number;
  java_problems: number;
  dsa_problems: number;
  aptitude_questions: number;
  total_submissions: number;
  accepted_submissions: number;
  rejected_submissions: number;
}

interface AdminProblem {
  id: number;
  title: string;
  slug?: string;
  subject_id?: number;
  topic_id?: number;
  subject_name: string;
  topic_name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  level: string;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
  is_published: boolean;
  is_deleted?: boolean;
  deleted_at?: string | null;
  created_at: string;
  total_submissions: number;
  accepted_submissions: number;
  test_cases_count: number;
  public_tests_count?: number;
  hidden_tests_count?: number;
}

interface TestCase {
  id?: number;
  problem_id?: number;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  validation_type: 'EXACT' | 'TRIMMED' | 'NUMERIC';
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  created_at: string;
  problems_solved: number;
  last_activity: string | null;
}

interface AuditLog {
  id: number;
  admin_name: string;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: number | null;
  details: any;
  ip_address: string | null;
  created_at: string;
}

interface TaxonomySubject {
  id: number;
  name: string;
  slug: string;
}

interface TaxonomyTopic {
  id: number;
  subject_id: number;
  name: string;
  slug: string;
}

interface AdminPageProps {
  defaultTab?: 'overview' | 'problems' | 'users' | 'import' | 'audit';
  createOnMount?: boolean;
}

export const AdminPage: React.FC<AdminPageProps> = ({ defaultTab = 'overview', createOnMount = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'users' | 'import' | 'audit'>(defaultTab);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Metrics State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  // Taxonomy State (for dropdowns)
  const [subjects, setSubjects] = useState<TaxonomySubject[]>([]);
  const [topics, setTopics] = useState<TaxonomyTopic[]>([]);

  // Problems State
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [diffFilter, setDiffFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Problem Create/Edit Modal
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [editingProblemId, setEditingProblemId] = useState<number | null>(null);
  const [problemForm, setProblemForm] = useState({
    title: '',
    slug: '',
    description: '',
    subject_id: 0,
    topic_id: 0,
    difficulty: 'EASY',
    level: 'BEGINNER',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED',
    input_format: '',
    output_format: '',
    constraints: '',
    sample_input: '',
    sample_output: '',
    examples: '[\n  {\n    "input": "2 3",\n    "output": "5",\n    "explanation": "2 + 3 = 5"\n  }\n]',
    explanation: '',
    hints: '',
    supported_languages: ['Java'],
    is_published: true,
    starter_code: '',
    reference_solution: '',
  });
  const [savingProblem, setSavingProblem] = useState(false);

  // Test Cases Drawer/Modal
  const [managingProblemId, setManagingProblemId] = useState<number | null>(null);
  const [managingProblemTitle, setManagingProblemTitle] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loadingTestCases, setLoadingTestCases] = useState(false);
  const [newTestCase, setNewTestCase] = useState<TestCase>({
    input: '',
    expected_output: '',
    is_hidden: false,
    validation_type: 'TRIMMED',
  });
  const [editingTestCaseId, setEditingTestCaseId] = useState<number | null>(null);

  // Sandbox Pre-Publish Test Modal
  const [testingProblem, setTestingProblem] = useState<AdminProblem | null>(null);
  const [testLanguage, setTestLanguage] = useState<'Java'>('Java');
  const [testCode, setTestCode] = useState('');
  const [testResults, setTestResults] = useState<any | null>(null);
  const [runningSandbox, setRunningSandbox] = useState(false);

  // Users State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Bulk Import State
  const [bulkFormat, setBulkFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [bulkInput, setBulkInput] = useState(`[
  {
    "title": "Reverse String",
    "description": "Given a string, return its reversed format.",
    "subject": "java",
    "topic_id": 1,
    "difficulty": "EASY",
    "level": "BEGINNER",
    "input_format": "A single line containing string S",
    "output_format": "The reversed string",
    "constraints": "1 <= |S| <= 1000",
    "supported_languages": ["Java"],
    "is_published": true,
    "test_cases": [
      {
        "input": "hello",
        "expected_output": "olleh",
        "is_hidden": false,
        "validation_type": "TRIMMED"
      },
      {
        "input": "antigravity",
        "expected_output": "ytivargitna",
        "is_hidden": true,
        "validation_type": "TRIMMED"
      }
    ]
  }
]`);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Notifications / Alert
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    setActiveTab(defaultTab);
    fetchTaxonomy();
    fetchMetrics();
    if (defaultTab === 'problems' || createOnMount) {
      fetchProblems();
      if (createOnMount) {
        openCreateProblem();
      }
    } else if (defaultTab === 'users') {
      fetchUsers();
    } else if (defaultTab === 'audit') {
      fetchAuditLogs();
    }
  }, [defaultTab]);

  const fetchTaxonomy = async () => {
    try {
      const res = await api.get('/admin/taxonomy');
      if (res.data.success) {
        setSubjects(res.data.data.subjects);
        setTopics(res.data.data.topics);
      }
    } catch {
      // Fallback if needed
    }
  };

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const res = await api.get('/admin/metrics');
      if (res.data.success) {
        setStats(res.data.data.stats);
      }
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to fetch admin metrics.');
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchProblems = async () => {
    setLoadingProblems(true);
    try {
      const params: any = {};
      if (subjectFilter) params.subject = subjectFilter;
      if (topicFilter) params.topic_id = topicFilter;
      if (diffFilter) params.difficulty = diffFilter;
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      if (statusFilter === 'ARCHIVED') params.include_deleted = 'true';

      const res = await api.get('/admin/problems', { params });
      if (res.data.success) {
        setProblems(res.data.data.problems);
      }
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to fetch problems inventory.');
    } finally {
      setLoadingProblems(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data.users);
      }
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to fetch users list.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res = await api.get('/admin/audit-logs?limit=50');
      if (res.data.success) {
        setAuditLogs(res.data.data.logs);
      }
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to fetch audit logs.');
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleTabChange = (tab: 'overview' | 'problems' | 'users' | 'import' | 'audit') => {
    setActiveTab(tab);
    setBannerError(null);
    setBannerSuccess(null);
    if (tab === 'overview') fetchMetrics();
    if (tab === 'problems') fetchProblems();
    if (tab === 'users') fetchUsers();
    if (tab === 'audit') fetchAuditLogs();
  };

  // --- Problem Management Handlers ---
  const openCreateProblem = () => {
    setEditingProblemId(null);
    const firstSub = subjects[0]?.id || 1;
    const filteredT = topics.filter((t) => t.subject_id === firstSub);
    setProblemForm({
      title: '',
      slug: '',
      description: '',
      subject_id: firstSub,
      topic_id: filteredT[0]?.id || topics[0]?.id || 1,
      difficulty: 'EASY',
      level: 'BEGINNER',
      status: 'PUBLISHED',
      input_format: '',
      output_format: '',
      constraints: '',
      sample_input: '',
      sample_output: '',
      examples: '[\n  {\n    "input": "1 2",\n    "output": "3",\n    "explanation": "1 + 2 = 3"\n  }\n]',
      explanation: '',
      hints: '',
      supported_languages: ['Java'],
      is_published: true,
      starter_code: '',
      reference_solution: '',
    });
    setShowProblemModal(true);
  };

  const openEditProblem = async (problemId: number) => {
    try {
      const res = await api.get(`/admin/problems/${problemId}`);
      if (res.data.success) {
        const p = res.data.data.problem;
        setEditingProblemId(problemId);
        setProblemForm({
          title: p.title || '',
          slug: p.slug || '',
          description: p.description || '',
          subject_id: p.subject_id,
          topic_id: p.topic_id,
          difficulty: p.difficulty || 'EASY',
          level: p.level || 'BEGINNER',
          status: p.status || (p.is_published ? 'PUBLISHED' : 'DRAFT'),
          input_format: p.input_format || '',
          output_format: p.output_format || '',
          constraints: p.constraints || '',
          sample_input: p.sample_input || '',
          sample_output: p.sample_output || '',
          examples: typeof p.examples === 'string' ? p.examples : JSON.stringify(p.examples || [], null, 2),
          explanation: p.explanation || '',
          hints: Array.isArray(p.hints) ? p.hints.join('\n') : '',
          supported_languages: Array.isArray(p.supported_languages) ? p.supported_languages : ['Java'],
          is_published: Boolean(p.is_published),
          starter_code: p.starter_code || '',
          reference_solution: p.reference_solution || '',
        });
        setShowProblemModal(true);
      }
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to load problem details.');
    }
  };

  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProblem(true);
    setBannerError(null);

    let parsedExamples = null;
    try {
      if (problemForm.examples && problemForm.examples.trim()) {
        parsedExamples = JSON.parse(problemForm.examples);
      }
    } catch {
      setBannerError('Examples must be valid JSON array.');
      setSavingProblem(false);
      return;
    }

    const payload = {
      ...problemForm,
      is_published: problemForm.status === 'PUBLISHED',
      examples: parsedExamples,
      hints: problemForm.hints
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
    };

    try {
      if (editingProblemId) {
        await api.put(`/admin/problems/${editingProblemId}`, payload);
        setBannerSuccess(`Problem #${editingProblemId} updated successfully.`);
      } else {
        await api.post('/admin/problems', payload);
        setBannerSuccess('New problem created successfully.');
      }
      setShowProblemModal(false);
      fetchProblems();
      fetchMetrics();
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to save problem.');
    } finally {
      setSavingProblem(false);
    }
  };

  const handleUpdateStatus = async (
    id: number,
    newStatus: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
  ) => {
    try {
      await api.patch(`/admin/problems/${id}/status`, { status: newStatus });
      setProblems((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: newStatus,
                is_published: newStatus === 'PUBLISHED',
                is_deleted: newStatus === 'ARCHIVED',
              }
            : p
        )
      );
      setBannerSuccess(`Problem #${id} status updated to ${newStatus}.`);
      fetchMetrics();
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to update problem status.');
    }
  };

  const handleDeleteProblem = async (id: number, title: string) => {
    if (
      !window.confirm(
        `Are you sure you want to soft-delete problem #${id}: "${title}"?\n\nThis will archive the problem and remove it from active student curricula, while preserving historical student submissions.`
      )
    ) {
      return;
    }
    try {
      await api.delete(`/admin/problems/${id}`);
      setBannerSuccess(`Problem #${id} soft-deleted and archived.`);
      fetchProblems();
      fetchMetrics();
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to delete problem.');
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    const nextStatus = currentStatus ? 'UNPUBLISHED' : 'PUBLISHED';
    handleUpdateStatus(id, nextStatus);
  };

  // --- Test Case Management Handlers ---
  const openTestCaseManager = async (problem: AdminProblem) => {
    setManagingProblemId(problem.id);
    setManagingProblemTitle(problem.title);
    setLoadingTestCases(true);
    setEditingTestCaseId(null);
    setNewTestCase({ input: '', expected_output: '', is_hidden: false, validation_type: 'TRIMMED' });
    try {
      const res = await api.get(`/admin/problems/${problem.id}/test-cases`);
      if (res.data.success) {
        setTestCases(res.data.data.test_cases);
      }
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to load test cases.');
    } finally {
      setLoadingTestCases(false);
    }
  };

  const handleSaveTestCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingProblemId) return;

    try {
      if (editingTestCaseId) {
        await api.put(`/admin/test-cases/${editingTestCaseId}`, newTestCase);
        setTestCases((prev) =>
          prev.map((tc) => (tc.id === editingTestCaseId ? { ...tc, ...newTestCase } : tc))
        );
        setBannerSuccess('Test case updated.');
      } else {
        const res = await api.post(`/admin/problems/${managingProblemId}/test-cases`, newTestCase);
        if (res.data.success) {
          setTestCases((prev) => [...prev, { ...newTestCase, id: res.data.data.test_case_id }]);
          setBannerSuccess('New test case added.');
        }
      }
      setEditingTestCaseId(null);
      setNewTestCase({ input: '', expected_output: '', is_hidden: false, validation_type: 'TRIMMED' });
      fetchProblems();
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to save test case.');
    }
  };

  const handleDeleteTestCase = async (testCaseId: number) => {
    if (!window.confirm('Delete this test case?')) return;
    try {
      await api.delete(`/admin/test-cases/${testCaseId}`);
      setTestCases((prev) => prev.filter((tc) => tc.id !== testCaseId));
      setBannerSuccess('Test case removed.');
      fetchProblems();
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to delete test case.');
    }
  };

  // --- Sandbox Pre-Publish Test Handlers ---
  const openPrePublishTester = (problem: AdminProblem) => {
    setTestingProblem(problem);
    setTestLanguage('Java');
    setTestCode(
      `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            System.out.println(sc.next());\n        }\n    }\n}`
    );
    setTestResults(null);
  };

  const handleRunSandboxTest = async () => {
    if (!testingProblem) return;
    setRunningSandbox(true);
    setTestResults(null);
    try {
      const res = await api.post(`/admin/problems/${testingProblem.id}/test`, {
        code: testCode,
        language: testLanguage,
      });
      if (res.data.success) {
        setTestResults(res.data.data);
      }
    } catch (err: any) {
      setTestResults({
        passed_count: 0,
        total_count: 0,
        all_passed: false,
        error: err.response?.data?.message || 'Execution failed in sandbox.',
      });
    } finally {
      setRunningSandbox(false);
    }
  };

  // --- User Management Handlers ---
  const handleToggleUserRole = async (user: AdminUser) => {
    const nextRole = user.role === 'ADMIN' ? 'STUDENT' : 'ADMIN';
    if (!window.confirm(`Change role of "${user.name}" to ${nextRole}?`)) return;

    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: nextRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      );
      setBannerSuccess(`Updated ${user.name}'s role to ${nextRole}.`);
      fetchMetrics();
    } catch (err: any) {
      setBannerError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  // --- Bulk Import Handlers ---
  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);
    setImportResult(null);
    setBannerError(null);

    let items: any[] = [];
    try {
      if (bulkFormat === 'JSON') {
        const parsed = JSON.parse(bulkInput);
        items = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        // Simple CSV parser for questions
        const lines = bulkInput.trim().split('\n');
        if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row.');
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        items = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const row: any = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] || '';
          });
          return row;
        });
      }
    } catch (err: any) {
      setImporting(false);
      setImportResult({ success: false, message: `Syntax validation failed: ${err.message}` });
      return;
    }

    try {
      const res = await api.post('/admin/problems/bulk-import', { items });
      if (res.data.success) {
        const { imported_problems, imported_test_cases } = res.data.data;
        setImportResult({
          success: true,
          message: `Successfully imported ${imported_problems} problems and ${imported_test_cases} test cases!`,
        });
        fetchMetrics();
        fetchProblems();
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        message: err.response?.data?.message || 'Bulk import rejected due to schema or constraint violations.',
      });
    } finally {
      setImporting(false);
    }
  };

  // Filtered lists
  const filteredProblems = problems.filter((p) => {
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 dark:from-black dark:via-[#0c1322] dark:to-black p-6 rounded-3xl border border-slate-800 text-white shadow-xl shadow-brand-500/5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System & Curriculum Management
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Real-time PostgreSQL curriculum orchestration, sandbox pre-publish testing, user role access control, and complete audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => {
              if (activeTab === 'overview') fetchMetrics();
              if (activeTab === 'problems') fetchProblems();
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'audit') fetchAuditLogs();
            }}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
            title="Refresh current view"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={openCreateProblem}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Problem</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {bannerError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{bannerError}</span>
          </div>
          <button onClick={() => setBannerError(null)} className="text-rose-400 hover:text-rose-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {bannerSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            <span>{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="text-emerald-400 hover:text-emerald-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modern Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none pb-px">
        {[
          { key: 'overview', label: 'Dashboard Overview', icon: Activity },
          { key: 'problems', label: 'Problems & Test Cases', icon: BookOpen },
          { key: 'users', label: 'User Directory', icon: Users },
          { key: 'import', label: 'Bulk Import', icon: Database },
          { key: 'audit', label: 'Audit Logs', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as any)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                isActive
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {loadingMetrics ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm text-slate-500">Querying PostgreSQL administrative metrics...</p>
            </div>
          ) : (
            <>
              {/* Top 10 Factual System Metrics Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-brand-500" />
                  <span>Platform System Metrics (10 Real-time Factual Counts)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  {/* 1. Total Users */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-slate-400">Total Users</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {stats?.total_users ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">All registered</span>
                  </div>

                  {/* 2. Active Users */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Active Users</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {stats?.active_users ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Activity tracked</span>
                  </div>

                  {/* 3. Total Problems */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-brand-600 dark:text-brand-400">Total Problems</p>
                    <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
                      {stats?.total_problems ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">In database</span>
                  </div>

                  {/* 4. Total Submissions */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-purple-600 dark:text-purple-400">Total Submissions</p>
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                      {stats?.total_submissions ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Code runs & submits</span>
                  </div>

                  {/* 5. Accepted Submissions */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-teal-600 dark:text-teal-400">Accepted</p>
                    <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                      {stats?.accepted_submissions ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Passed all tests</span>
                  </div>

                  {/* 6. Rejected Submissions */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-rose-600 dark:text-rose-400">Rejected</p>
                    <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                      {stats?.rejected_submissions ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">WA, TLE, or CE</span>
                  </div>

                  {/* 7. Java Problems */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-amber-600 dark:text-amber-400">Java Track</p>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                      {stats?.java_problems ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Java problems</span>
                  </div>

                  {/* 8. DSA Problems */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-indigo-600 dark:text-indigo-400">DSA Track</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      {stats?.dsa_problems ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Algorithms & structures</span>
                  </div>

                  {/* 10. Aptitude Questions */}
                  <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase text-violet-600 dark:text-violet-400">Aptitude</p>
                    <p className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">
                      {stats?.aptitude_questions ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-400">Placement questions</span>
                  </div>
                </div>
              </div>

              {/* Submissions Health & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Ratio Bar */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0D121F] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">Submission Health Ratio</h4>
                      <p className="text-xs text-slate-500">Live evaluation accuracy across all student executions</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Total: {stats?.total_submissions ?? 0}
                    </span>
                  </div>

                  {stats && stats.total_submissions > 0 ? (
                    <div className="space-y-2">
                      <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                        <div
                          style={{
                            width: `${Math.round((stats.accepted_submissions / stats.total_submissions) * 100)}%`,
                          }}
                          className="bg-emerald-500 h-full transition-all"
                          title={`Accepted: ${stats.accepted_submissions}`}
                        />
                        <div
                          style={{
                            width: `${Math.round((stats.rejected_submissions / stats.total_submissions) * 100)}%`,
                          }}
                          className="bg-rose-500 h-full transition-all"
                          title={`Rejected: ${stats.rejected_submissions}`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accepted: {stats.accepted_submissions} (
                          {Math.round((stats.accepted_submissions / stats.total_submissions) * 100)}%)
                        </span>
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejected: {stats.rejected_submissions} (
                          {Math.round((stats.rejected_submissions / stats.total_submissions) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No code submissions recorded yet. Students can run and submit problems on any track.
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-white dark:bg-[#0D121F] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Quick Operations</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleTabChange('problems')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-brand-500" />
                        <span>Manage Problems & Test Cases</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleTabChange('import')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4 text-indigo-500" />
                        <span>Bulk Import Problems (JSON/CSV)</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleTabChange('users')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-amber-500" />
                        <span>Inspect User Roles & Progress</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ================= TAB 2: PROBLEMS & TEST CASES ================= */}
      {activeTab === 'problems' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Controls & Filter Bar */}
          <div className="bg-white dark:bg-[#0D121F] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search problem title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Subject Filter */}
              <select
                value={subjectFilter}
                onChange={(e) => {
                  setSubjectFilter(e.target.value);
                  setTopicFilter('');
                }}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* Topic Filter */}
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                <option value="">All Topics</option>
                {topics
                  .filter((t) => {
                    if (!subjectFilter) return true;
                    const sub = subjects.find((s) => s.slug === subjectFilter);
                    return sub ? t.subject_id === sub.id : true;
                  })
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={diffFilter}
                onChange={(e) => setDiffFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="UNPUBLISHED">Unpublished</option>
                <option value="ARCHIVED">Archived (Deleted)</option>
              </select>

              <button
                onClick={fetchProblems}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                title="Apply filters"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={openCreateProblem}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Problem</span>
            </button>
          </div>

          {/* Problem Table */}
          {loadingProblems ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm text-slate-500">Loading curriculum problems...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">ID</th>
                      <th className="px-5 py-3.5">Problem Details</th>
                      <th className="px-5 py-3.5">Subject & Topic</th>
                      <th className="px-5 py-3.5">Difficulty</th>
                      <th className="px-5 py-3.5">Test Cases</th>
                      <th className="px-5 py-3.5">Submissions</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredProblems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-xs">
                          No problems match your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProblems.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-4 font-mono text-xs text-slate-400 font-bold">#{p.id}</td>
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400">{p.level}</span>
                              {p.slug && <span className="text-[10px] font-mono text-slate-400">/{p.slug}</span>}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {p.subject_name}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{p.topic_name}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                p.difficulty === 'EASY'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                  : p.difficulty === 'MEDIUM'
                                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                                  : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                              }`}
                            >
                              {p.difficulty}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => openTestCaseManager(p)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold cursor-pointer"
                              title="Manage test cases"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                              <span>
                                {p.public_tests_count !== undefined && p.hidden_tests_count !== undefined
                                  ? `${p.public_tests_count} pub / ${p.hidden_tests_count} hid`
                                  : `${p.test_cases_count} cases`}
                              </span>
                            </button>
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                            {p.accepted_submissions} / {p.total_submissions}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                p.status === 'PUBLISHED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                                  : p.status === 'DRAFT'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                                  : p.status === 'ARCHIVED' || p.is_deleted
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                              }`}
                            >
                              {p.status === 'PUBLISHED' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{p.status || (p.is_published ? 'PUBLISHED' : 'DRAFT')}</span>
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Sandbox Pre-Publish Runner */}
                              <button
                                onClick={() => openPrePublishTester(p)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 cursor-pointer"
                                title="Run sandbox code tests"
                              >
                                <Play className="w-4 h-4" />
                              </button>

                              {/* Edit Problem */}
                              <button
                                onClick={() => openEditProblem(p.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                                title="Edit problem"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Quick Status Toggle */}
                              {p.status === 'PUBLISHED' ? (
                                <button
                                  onClick={() => handleUpdateStatus(p.id, 'UNPUBLISHED')}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                                  title="Unpublish problem"
                                >
                                  <EyeOff className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(p.id, 'PUBLISHED')}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                  title="Publish problem to all students"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              {/* Soft Delete Problem */}
                              <button
                                onClick={() => handleDeleteProblem(p.id, p.title)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                title="Soft-delete problem (Archive)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: USER DIRECTORY ================= */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-[#0D121F] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white"
              />
            </div>
            <span className="text-xs text-slate-400">
              Total Accounts: <strong className="text-slate-700 dark:text-slate-200">{filteredUsers.length}</strong>
            </span>
          </div>

          {loadingUsers ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm text-slate-500">Loading user accounts...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Current Role</th>
                      <th className="px-6 py-4">Problems Solved</th>
                      <th className="px-6 py-4">Last Activity</th>
                      <th className="px-6 py-4">Created At</th>
                      <th className="px-6 py-4 text-right">Role Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 font-mono">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              u.role === 'ADMIN'
                                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                                : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {u.problems_solved} solved
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {u.last_activity ? new Date(u.last_activity).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleUserRole(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          >
                            <span>Make {u.role === 'ADMIN' ? 'STUDENT' : 'ADMIN'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: BULK CONTENT IMPORT ================= */}
      {activeTab === 'import' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-[#0D121F] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bulk Curriculum Importer</h3>
                <p className="text-xs text-slate-500">
                  Import multiple problems and test cases in a single atomic PostgreSQL transaction.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBulkFormat('JSON')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    bulkFormat === 'JSON'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  JSON Format
                </button>
                <button
                  type="button"
                  onClick={() => setBulkFormat('CSV')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    bulkFormat === 'CSV'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  CSV Format
                </button>
              </div>
            </div>

            {importResult && (
              <div
                className={`p-4 rounded-2xl text-sm flex items-start gap-3 ${
                  importResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                }`}
              >
                {importResult.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{importResult.success ? 'Import Complete' : 'Validation Error'}</p>
                  <p className="text-xs mt-0.5">{importResult.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleBulkImport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Content Payload ({bulkFormat})
                </label>
                <textarea
                  rows={14}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  className="w-full font-mono text-xs p-4 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 focus:outline-none focus:border-brand-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Atomic rollback: If any single row fails schema validation or foreign key lookup, zero changes are written.
                </span>
                <button
                  type="submit"
                  disabled={importing}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{importing ? 'Validating & Importing...' : 'Validate & Import Content'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 5: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-[#0D121F] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Operations Audit Trail</h3>
              <p className="text-xs text-slate-500">Immutable record of all curriculum changes, test modifications, and role updates</p>
            </div>
            <button
              onClick={fetchAuditLogs}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              title="Refresh audit trail"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loadingAudit ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm text-slate-500">Querying security audit logs...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Timestamp</th>
                      <th className="px-5 py-3.5">Admin Operator</th>
                      <th className="px-5 py-3.5">Action Event</th>
                      <th className="px-5 py-3.5">Target</th>
                      <th className="px-5 py-3.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-xs">
                          No audit events recorded yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="px-5 py-3.5 font-mono text-xs text-slate-500 whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-xs text-slate-900 dark:text-white">{log.admin_name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{log.admin_email}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                            {log.target_type} {log.target_id ? `#${log.target_id}` : ''}
                          </td>
                          <td className="px-5 py-3.5">
                            <pre className="font-mono text-[11px] text-slate-600 dark:text-slate-400 max-w-xs truncate">
                              {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                            </pre>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL 1: CREATE / EDIT PROBLEM ================= */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingProblemId ? `Edit Problem #${editingProblemId}` : 'Create New Curriculum Problem'}
                </h3>
                <p className="text-xs text-slate-500">Configure problem statement, constraints, and test suite</p>
              </div>
              <button onClick={() => setShowProblemModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProblem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={problemForm.title}
                    onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject</label>
                  <select
                    value={problemForm.subject_id}
                    onChange={(e) => {
                      const sId = Number(e.target.value);
                      const filteredT = topics.filter((t) => t.subject_id === sId);
                      setProblemForm({
                        ...problemForm,
                        subject_id: sId,
                        topic_id: filteredT[0]?.id || problemForm.topic_id,
                      });
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Topic</label>
                  <select
                    value={problemForm.topic_id}
                    onChange={(e) => setProblemForm({ ...problemForm, topic_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    {topics
                      .filter((t) => !problemForm.subject_id || t.subject_id === problemForm.subject_id)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Difficulty</label>
                  <select
                    value={problemForm.difficulty}
                    onChange={(e) => setProblemForm({ ...problemForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Level</label>
                  <select
                    value={problemForm.level}
                    onChange={(e) => setProblemForm({ ...problemForm, level: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="PLACEMENT">Placement</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description (Markdown)</label>
                  <textarea
                    rows={4}
                    required
                    value={problemForm.description}
                    onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Input Format</label>
                  <textarea
                    rows={2}
                    value={problemForm.input_format}
                    onChange={(e) => setProblemForm({ ...problemForm, input_format: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Output Format</label>
                  <textarea
                    rows={2}
                    value={problemForm.output_format}
                    onChange={(e) => setProblemForm({ ...problemForm, output_format: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Constraints</label>
                  <input
                    type="text"
                    value={problemForm.constraints}
                    onChange={(e) => setProblemForm({ ...problemForm, constraints: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Sample Input</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 10 20"
                    value={problemForm.sample_input}
                    onChange={(e) => setProblemForm({ ...problemForm, sample_input: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Sample Output</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 30"
                    value={problemForm.sample_output}
                    onChange={(e) => setProblemForm({ ...problemForm, sample_output: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Explanation</label>
                  <textarea
                    rows={2}
                    placeholder="Sample explanation or breakdown"
                    value={problemForm.explanation}
                    onChange={(e) => setProblemForm({ ...problemForm, explanation: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Starter Code (Java Template)</label>
                  <textarea
                    rows={3}
                    placeholder="public class Solution { ... }"
                    value={problemForm.starter_code}
                    onChange={(e) => setProblemForm({ ...problemForm, starter_code: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Reference Solution (Java)</label>
                  <textarea
                    rows={3}
                    placeholder="public class Solution { ... }"
                    value={problemForm.reference_solution}
                    onChange={(e) => setProblemForm({ ...problemForm, reference_solution: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Examples (JSON Array format)
                  </label>
                  <textarea
                    rows={4}
                    value={problemForm.examples}
                    onChange={(e) => setProblemForm({ ...problemForm, examples: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status Lifecycle</label>
                  <select
                    value={problemForm.status}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        status: e.target.value as any,
                        is_published: e.target.value === 'PUBLISHED',
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="PUBLISHED">PUBLISHED (Active on all student accounts)</option>
                    <option value="DRAFT">DRAFT (Hidden from students)</option>
                    <option value="UNPUBLISHED">UNPUBLISHED (Hidden from students)</option>
                    <option value="ARCHIVED">ARCHIVED (Soft-deleted)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Custom Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. reverse-linked-list"
                    value={problemForm.slug}
                    onChange={(e) => setProblemForm({ ...problemForm, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProblemModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProblem}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {savingProblem ? 'Saving...' : editingProblemId ? 'Update Problem' : 'Create Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: TEST CASES MANAGER ================= */}
      {managingProblemId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Test Case Suite — Problem #{managingProblemId}
                </h3>
                <p className="text-xs text-slate-500">{managingProblemTitle}</p>
              </div>
              <button
                onClick={() => setManagingProblemId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Test Cases */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {loadingTestCases ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading test cases...</div>
              ) : testCases.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  No test cases defined yet. Add public and hidden test cases below.
                </div>
              ) : (
                testCases.map((tc, idx) => (
                  <div
                    key={tc.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Case #{idx + 1}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tc.is_hidden
                              ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {tc.is_hidden ? 'HIDDEN' : 'PUBLIC'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Match: {tc.validation_type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                          <span className="text-[10px] text-slate-400 block font-sans">Input:</span>
                          <span className="whitespace-pre-wrap break-all">{tc.input || '(empty)'}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400">
                          <span className="text-[10px] text-slate-400 block font-sans">Expected Output:</span>
                          <span className="whitespace-pre-wrap break-all">{tc.expected_output}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingTestCaseId(tc.id || null);
                          setNewTestCase({
                            input: tc.input,
                            expected_output: tc.expected_output,
                            is_hidden: tc.is_hidden,
                            validation_type: tc.validation_type,
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500"
                        title="Edit test case"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => tc.id && handleDeleteTestCase(tc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                        title="Delete test case"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add / Edit Form */}
            <form onSubmit={handleSaveTestCase} className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                {editingTestCaseId ? 'Edit Test Case' : 'Add New Test Case'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Standard Input</label>
                  <textarea
                    rows={2}
                    value={newTestCase.input}
                    onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. 5\n1 2 3 4 5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Expected Output *</label>
                  <textarea
                    rows={2}
                    required
                    value={newTestCase.expected_output}
                    onChange={(e) => setNewTestCase({ ...newTestCase, expected_output: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. 15"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTestCase.is_hidden}
                      onChange={(e) => setNewTestCase({ ...newTestCase, is_hidden: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Mark as Hidden Test Case</span>
                  </label>

                  <select
                    value={newTestCase.validation_type}
                    onChange={(e) =>
                      setNewTestCase({
                        ...newTestCase,
                        validation_type: e.target.value as 'EXACT' | 'TRIMMED' | 'NUMERIC',
                      })
                    }
                    className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <option value="TRIMMED">Trimmed Match (Default)</option>
                    <option value="EXACT">Exact Match</option>
                    <option value="NUMERIC">Numeric Float Tolerance</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {editingTestCaseId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestCaseId(null);
                        setNewTestCase({ input: '', expected_output: '', is_hidden: false, validation_type: 'TRIMMED' });
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold cursor-pointer shadow-sm"
                  >
                    {editingTestCaseId ? 'Save Changes' : 'Add Test Case'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: SANDBOX PRE-PUBLISH TESTER ================= */}
      {testingProblem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-bold mb-1">
                  <Play className="w-3 h-3" />
                  <span>Pre-Publish Verification Sandbox</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Test Problem #{testingProblem.id}: {testingProblem.title}
                </h3>
              </div>
              <button onClick={() => setTestingProblem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-600/10 text-amber-500 text-xs font-bold border border-amber-600/20">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Java 8</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Tests against public test cases before student launch
                </span>
              </div>

              <textarea
                rows={10}
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className="w-full font-mono text-xs p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 focus:outline-none focus:border-brand-500 leading-relaxed"
              />
            </div>

            {/* Test Execution Output */}
            {testResults && (
              <div
                className={`p-4 rounded-2xl text-xs space-y-3 ${
                  testResults.all_passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>
                    Status: {testResults.all_passed ? 'ALL PUBLIC TESTS PASSED ✓' : 'SOME TESTS FAILED ✗'}
                  </span>
                  <span>
                    Passed: {testResults.passed_count} / {testResults.total_count}
                  </span>
                </div>

                {testResults.results && (
                  <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
                    {testResults.results.map((r: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/70 dark:bg-black/30 font-mono text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>Case #{idx + 1}</span>
                          <span className={r.passed ? 'text-emerald-600' : 'text-rose-600'}>
                            {r.status} ({r.execution_time_ms || 0}ms)
                          </span>
                        </div>
                        <div>Input: {r.input}</div>
                        <div>Expected: {r.expected_output}</div>
                        <div>Actual: {r.actual_output}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              {testingProblem.is_published ? (
                <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Published live
                </span>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    await handleTogglePublish(testingProblem.id, false);
                    setTestingProblem({ ...testingProblem, is_published: true });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Publish Problem Now</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRunSandboxTest}
                disabled={runningSandbox}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 disabled:opacity-50 cursor-pointer"
              >
                {runningSandbox ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{runningSandbox ? 'Compiling in Sandbox...' : 'Run Sandbox Verification'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
