import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  User,
  GraduationCap,
  Building2,
  FileText,
  Linkedin,
  Globe,
  ExternalLink,
  CheckCircle2,
  Flame,
  Award,
  BookOpen,
  Sparkles,
  Plus,
  X,
  Save,
  Check,
  Calendar,
  Briefcase,
  Layers,
  ArrowLeft,
  Mail,
  Shield,
} from 'lucide-react';

interface StudentProfileData {
  degree: string;
  major: string;
  college: string;
  gradYear: string;
  cgpa: string;
  studentId: string;
  placementStatus: 'ACTIVELY_PREPARING' | 'INTERVIEW_READY' | 'INTERVIEWING' | 'OFFER_SECURED';
  targetCompanies: string[];
  resumeUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  skills: string[];
  bio: string;
}

const DEFAULT_COMPANIES = ['Google', 'Amazon', 'Microsoft', 'TCS Digital', 'Infosys', 'Cognizant', 'Accenture'];
const DEFAULT_SKILLS = ['Core Java', 'Data Structures', 'Algorithms', 'OOP Concepts', 'Collections Framework', 'SQL', 'Problem Solving'];

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const profileKey = `placement_profile_${user?.id || 'guest'}`;

  // Form & Profile State
  const [profile, setProfile] = useState<StudentProfileData>(() => {
    const saved = localStorage.getItem(profileKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      degree: 'B.Tech / B.E.',
      major: 'Computer Science and Engineering',
      college: 'National Institute of Technology',
      gradYear: '2025',
      cgpa: '8.7',
      studentId: user?.id ? `STU-${String(user.id).padStart(4, '0')}` : 'STU-0102',
      placementStatus: 'ACTIVELY_PREPARING',
      targetCompanies: DEFAULT_COMPANIES,
      resumeUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      skills: DEFAULT_SKILLS,
      bio: 'Aspiring Software Development Engineer preparing for campus placement drives and technical interviews.',
    };
  });

  const [newCompany, setNewCompany] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live Stats from backend
  const [stats, setStats] = useState<{
    solvedCount: number;
    currentStreak: number;
  }>({
    solvedCount: 0,
    currentStreak: 1,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const dashRes = await api.get('/user/dashboard');
        let solved = 0;
        let streak = 1;

        if (dashRes.data?.success) {
          const d = dashRes.data.data;
          solved = d.totalSolved || d.solvedProblems || 0;
          streak = d.currentStreak || 1;
        }

        setStats({
          solvedCount: solved,
          currentStreak: streak,
        });
      } catch (err) {
        // graceful fallback
      }
    };

    fetchUserStats();
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(profileKey, JSON.stringify(profile));
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCompany.trim();
    if (trimmed && !profile.targetCompanies.includes(trimmed)) {
      setProfile({
        ...profile,
        targetCompanies: [...profile.targetCompanies, trimmed],
      });
      setNewCompany('');
    }
  };

  const handleRemoveCompany = (company: string) => {
    setProfile({
      ...profile,
      targetCompanies: profile.targetCompanies.filter((c) => c !== company),
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, trimmed],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    });
  };

  const getStatusLabel = (status: StudentProfileData['placementStatus']) => {
    switch (status) {
      case 'ACTIVELY_PREPARING':
        return { label: 'Actively Preparing', bg: 'bg-[#244D38]/10 text-[#244D38] border-[#244D38]/30' };
      case 'INTERVIEW_READY':
        return { label: 'Ready for Interviews', bg: 'bg-[#A8752D]/15 text-[#A8752D] border-[#A8752D]/30' };
      case 'INTERVIEWING':
        return { label: 'In Placement Drives', bg: 'bg-[#B95F3C]/15 text-[#B95F3C] border-[#B95F3C]/30' };
      case 'OFFER_SECURED':
        return { label: 'Offer Secured ✓', bg: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' };
    }
  };

  const statusBadge = getStatusLabel(profile.placementStatus);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb / Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F665F] hover:text-[#244D38] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F3EB] border border-[#BEDAC6] text-xs font-bold text-[#244D38] animate-in fade-in">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Profile Saved</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-[#244D38] hover:bg-[#1C4332] text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* Main Student Identity Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E5DED4]">
          <div className="flex items-start sm:items-center gap-4">
            {/* Initials Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#244D38] to-[#173024] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md border-2 border-white shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-[#17211B] tracking-tight">
                  {user?.name || 'Student Candidate'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0EBE2] border border-[#E5DED4] text-[#5F665F]">
                  #{profile.studentId}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge.bg}`}>
                  {statusBadge.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F665F]">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#A8752D]" />
                  <span>{user?.email || 'student@university.edu'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#244D38]" />
                  <span>{profile.college}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#B95F3C]" />
                  <span>Class of {profile.gradYear}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Placement Status Selector */}
          <div className="bg-[#FAF8F2] border border-[#DDD4C6] p-3 rounded-2xl space-y-1 sm:w-64 shrink-0">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E756D]">
              Placement Readiness Status
            </label>
            <select
              value={profile.placementStatus}
              onChange={(e) => setProfile({ ...profile, placementStatus: e.target.value as any })}
              className="w-full bg-[#FFFDF9] border border-[#DDD4C6] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38] cursor-pointer"
            >
              <option value="ACTIVELY_PREPARING">Actively Preparing</option>
              <option value="INTERVIEW_READY">Ready for Interviews</option>
              <option value="INTERVIEWING">In Placement Drives</option>
              <option value="OFFER_SECURED">Offer Secured ✓</option>
            </select>
          </div>
        </div>

        {/* Bio / Objective */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#244D38] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Objective & Bio</span>
          </label>
          <textarea
            rows={2}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Describe your academic goals, target roles (e.g. SDE, Backend Developer), or interview milestones..."
            className="w-full p-3 rounded-2xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs text-[#18251F] placeholder-[#A39A8C] focus:outline-none focus:ring-1 focus:ring-[#244D38] resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Placement Preparation Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#244D38]/10 text-[#244D38] flex items-center justify-center font-black shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-[#17211B]">{stats.solvedCount}</div>
            <div className="text-xs font-medium text-[#5F665F]">Problems Solved</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#A8752D]/15 text-[#A8752D] flex items-center justify-center font-black shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-[#17211B]">{stats.currentStreak} Days</div>
            <div className="text-xs font-medium text-[#5F665F]">Active Practice Streak</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B95F3C]/15 text-[#B95F3C] flex items-center justify-center font-black shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-[#17211B]">{profile.cgpa} / 10</div>
            <div className="text-xs font-medium text-[#5F665F]">Current CGPA</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#244D38]/10 text-[#244D38] flex items-center justify-center font-black shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-[#17211B]">{profile.targetCompanies.length}</div>
            <div className="text-xs font-medium text-[#5F665F]">Target Companies</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Details Card */}
        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#244D38] flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Background</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#6E756D] mb-1">Degree / Course</label>
              <input
                type="text"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                placeholder="e.g. B.Tech, MCA, B.Sc"
                className="w-full p-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-medium text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6E756D] mb-1">Branch / Specialization</label>
              <input
                type="text"
                value={profile.major}
                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                placeholder="e.g. Computer Science"
                className="w-full p-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-medium text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-[#6E756D] mb-1">College / University</label>
              <input
                type="text"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                placeholder="Full Institution Name"
                className="w-full p-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-medium text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6E756D] mb-1">Graduation Year</label>
              <input
                type="text"
                value={profile.gradYear}
                onChange={(e) => setProfile({ ...profile, gradYear: e.target.value })}
                placeholder="e.g. 2025"
                className="w-full p-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-medium text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6E756D] mb-1">CGPA / Percentage</label>
              <input
                type="text"
                value={profile.cgpa}
                onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                placeholder="e.g. 8.5"
                className="w-full p-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-medium text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38]"
              />
            </div>
          </div>
        </div>

        {/* Professional & Portfolio Links Card */}
        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#244D38] flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Resume & Profiles</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6E756D] mb-1 flex items-center justify-between">
                <span>Resume / CV URL</span>
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#244D38] font-bold underline flex items-center gap-0.5"
                  >
                    Test Link <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                type="url"
                value={profile.resumeUrl}
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/... or PDF link"
                className="w-full p-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-mono text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6E756D] mb-1">LinkedIn Profile</label>
              <div className="relative">
                <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="url"
                  value={profile.linkedinUrl}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-mono text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6E756D] mb-1">Portfolio / Personal Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="url"
                  value={profile.portfolioUrl}
                  onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                  placeholder="https://yourportfolio.dev"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-mono text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#244D38]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Companies & Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Company Watchlist */}
        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#A8752D] flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Target Company Watchlist</span>
            </h2>
            <span className="text-[11px] font-bold text-[#5F665F]">
              {profile.targetCompanies.length} Companies
            </span>
          </div>

          <p className="text-xs text-[#5F665F] leading-relaxed">
            Prioritize your placement preparations for specific company interview patterns and coding rounds.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {profile.targetCompanies.map((company) => (
              <span
                key={company}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF8F2] border border-[#DDD4C6] text-[#18251F] shadow-2xs"
              >
                <span>{company}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCompany(company)}
                  className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title={`Remove ${company}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Company Input */}
          <form onSubmit={handleAddCompany} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Add company (e.g. Adobe, Oracle, Zoho)..."
              className="flex-1 p-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#A8752D]"
            />
            <button
              type="submit"
              disabled={!newCompany.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#A8752D] hover:bg-[#916424] text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Technical Skills & Endorsements */}
        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E5DED4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#B95F3C] flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Skills & Competencies</span>
            </h2>
            <span className="text-[11px] font-bold text-[#5F665F]">
              {profile.skills.length} Skills
            </span>
          </div>

          <p className="text-xs text-[#5F665F] leading-relaxed">
            Highlight your verified Java proficiency, algorithms, and system engineering skills.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF8F2] border border-[#DDD4C6] text-[#244D38] shadow-2xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Skill Input */}
          <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Dynamic Programming, Spring, REST)..."
              className="flex-1 p-2.5 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs text-[#18251F] focus:outline-none focus:ring-1 focus:ring-[#B95F3C]"
            />
            <button
              type="submit"
              disabled={!newSkill.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#B95F3C] hover:bg-[#9E4F32] text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-5 rounded-3xl bg-[#F8F5EE] border border-[#E5DED4] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-[#5F665F]">
          <Shield className="w-4 h-4 text-[#244D38]" />
          <span>Profile data is saved and verified for placement tracking and mock evaluations.</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-[#244D38] hover:bg-[#1C4332] text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving Profile...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  );
};
