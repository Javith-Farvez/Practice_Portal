import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  Coffee,
  Terminal,
  Binary,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Target,
  BookOpen,
  Code2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const tracks = [
    {
      id: 'java',
      name: 'Java',
      icon: Coffee,
      badge: 'Object-Oriented',
      iconBg: 'bg-[#FBF6EE] dark:bg-[#2A2117] text-[#A8752F] border-[#ECD8BA] dark:border-[#4B3722]',
      accentColor: 'text-[#A8752F]',
      description: 'Core concepts, OOPs, Collections framework, Multithreading, and placement interview problem sets.',
      topics: ['OOP Principles', 'Collections', 'Exception Handling', 'Thread Lifecycle'],
    },
    {
      id: 'dsa',
      name: 'DSA',
      icon: Binary,
      badge: 'Core Problem Solving',
      iconBg: 'bg-[#FAF0EB] dark:bg-[#2F211C] text-[#B96545] dark:text-[#E8A58C] border-[#F1D6CA] dark:border-[#4B342C]',
      accentColor: 'text-[#B96545] dark:text-[#E8A58C]',
      description: 'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and algorithmic interview patterns.',
      topics: ['Time & Space Complexity', 'Trees & Graphs', 'Dynamic Programming', 'Two Pointers'],
    },
    {
      id: 'aptitude',
      name: 'Aptitude',
      icon: BrainCircuit,
      badge: 'Screening Round',
      iconBg: 'bg-[#F5F0F7] dark:bg-[#281F2B] text-[#715A78] dark:text-[#CBB5D1] border-[#E2D5E6] dark:border-[#433147]',
      accentColor: 'text-[#715A78] dark:text-[#CBB5D1]',
      description: 'Quantitative aptitude, logical reasoning, and verbal practice designed for campus placement tests.',
      topics: ['Quantitative Math', 'Logical Reasoning', 'Data Interpretation', 'Verbal Ability'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F2EA] dark:bg-[#16120E] text-[#13211A] dark:text-[#FAF6EE] transition-colors flex flex-col font-sans">
      <Navbar />

      {/* ==================================================== */}
      {/* HERO SECTION                                         */}
      {/* ==================================================== */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Phase 1 Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E4DDD2] dark:border-[#382D24] text-[#24513A] dark:text-[#A7D8B7] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#A8752F]" />
            <span>Placement Practice Portal • Phase 1</span>
          </div>

          {/* Large Editorial Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#13211A] dark:text-[#FAF6EE] max-w-4xl mx-auto leading-[1.12]">
            From <span className="text-[#B96545]">Beginner</span> to{' '}
            <span className="text-[#24513A] dark:text-emerald-400">Placement Ready</span>.
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#5F665F] dark:text-[#BDB7AB] max-w-2xl mx-auto font-normal leading-relaxed">
            Practice Java, DSA and Aptitude with structured problems and measurable progress.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#24513A] hover:bg-[#1D432F] rounded-xl shadow-md shadow-[#24513A]/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm sm:text-base font-bold text-[#13211A] dark:text-[#FAF6EE] bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E4DDD2] dark:border-[#382D24] hover:bg-[#F0EBE1] dark:hover:bg-[#271F19] rounded-xl shadow-xs transition-all"
            >
              Login
            </Link>
          </div>

          {/* Small Feature Strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-[#5F665F] dark:text-[#A69F94]">
            <div className="flex items-center gap-2 bg-[#FFFDF9]/60 dark:bg-[#1E1813]/60 px-3.5 py-1.5 rounded-full border border-[#E4DDD2]/80 dark:border-[#382D24]">
              <CheckCircle2 className="w-4 h-4 text-[#24513A] dark:text-emerald-400" />
              <span>JWT Authentication & bcrypt</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FFFDF9]/60 dark:bg-[#1E1813]/60 px-3.5 py-1.5 rounded-full border border-[#E4DDD2]/80 dark:border-[#382D24]">
              <CheckCircle2 className="w-4 h-4 text-[#A8752F]" />
              <span>PostgreSQL Relational Storage</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FFFDF9]/60 dark:bg-[#1E1813]/60 px-3.5 py-1.5 rounded-full border border-[#E4DDD2]/80 dark:border-[#382D24]">
              <CheckCircle2 className="w-4 h-4 text-[#B96545]" />
              <span>Role-Based Access Control</span>
            </div>
          </div>

          {/* Editorial Tagline */}
          <div className="mt-10 inline-flex items-center gap-2 text-xs font-serif italic text-[#A8752F] dark:text-[#CCA86F]">
            <span>Learn.</span>
            <span>•</span>
            <span>Practice.</span>
            <span>•</span>
            <span>Grow.</span>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4 LEARNING TRACKS SECTION                            */}
      {/* ==================================================== */}
      <section className="py-16 bg-[#F0EBE1]/60 dark:bg-[#1A140F] border-y border-[#E4DDD2] dark:border-[#382D24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#24513A] dark:text-[#A7D8B7] bg-[#EBF3EC] dark:bg-[#202E24] px-3 py-1 rounded-full inline-block mb-2">
              Curriculum Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13211A] dark:text-[#FAF6EE]">
              Four Specialized Tracks
            </h2>
            <p className="mt-2 text-sm text-[#5F665F] dark:text-[#BDB7AB]">
              Targeted modules tailored for campus placement rounds, technical interviews, and online assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className="group relative bg-[#FFFDF9] dark:bg-[#1E1813] rounded-2xl p-6 border border-[#E4DDD2] dark:border-[#382D24] shadow-xs hover:shadow-md hover:border-[#24513A]/40 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Track Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl ${track.iconBg} border flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F0EBE1] dark:bg-[#271F19] text-[#5F665F] dark:text-[#BDB7AB]">
                        {track.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#13211A] dark:text-[#FAF6EE] mb-2 group-hover:text-[#24513A] dark:group-hover:text-[#A7D8B7] transition-colors">
                      {track.name}
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#BDB7AB] leading-relaxed mb-4">
                      {track.description}
                    </p>

                    {/* Topic list */}
                    <ul className="space-y-2 mb-6">
                      {track.topics.map((topic, i) => (
                        <li key={i} className="text-xs text-[#5F665F] dark:text-[#BDB7AB] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#24513A] dark:bg-emerald-400" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={isAuthenticated ? '/dashboard' : '/login'}
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-[#E4DDD2] dark:border-[#382D24] text-xs font-bold text-[#24513A] dark:text-[#A7D8B7] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* PLATFORM PILLARS SECTION                             */}
      {/* ==================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E4DDD2] dark:border-[#382D24] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3EC] dark:bg-[#202E24] text-[#24513A] dark:text-[#A7D8B7] border border-[#CCE0CE] dark:border-[#2D4534] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#13211A] dark:text-[#FAF6EE] mb-1.5">
              Zero Distractions
            </h4>
            <p className="text-xs sm:text-sm text-[#5F665F] dark:text-[#BDB7AB] leading-relaxed">
              Clean, focused environment designed for consistent daily problem solving, code analysis, and placement drills.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E4DDD2] dark:border-[#382D24] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FBF6EE] dark:bg-[#2A2117] text-[#A8752F] border border-[#ECD8BA] dark:border-[#4B3722] flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#13211A] dark:text-[#FAF6EE] mb-1.5">
              Measurable Milestones
            </h4>
            <p className="text-xs sm:text-sm text-[#5F665F] dark:text-[#BDB7AB] leading-relaxed">
              Track progress percentages, daily streaks, and topic mastery across all 4 placement preparation areas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E4DDD2] dark:border-[#382D24] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] dark:bg-[#2F211C] text-[#B96545] border border-[#F1D6CA] dark:border-[#4B342C] flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#13211A] dark:text-[#FAF6EE] mb-1.5">
              Secure Authentication
            </h4>
            <p className="text-xs sm:text-sm text-[#5F665F] dark:text-[#BDB7AB] leading-relaxed">
              Robust JWT-backed authentication with bcrypt password hashing and PostgreSQL relational storage.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[#E4DDD2] dark:border-[#382D24] bg-[#F6F2EA] dark:bg-[#16120E] text-center text-xs text-[#5F665F] dark:text-[#A69F94]">
        <p>Placement Practice Portal • Built for Campus Recruitment Success</p>
      </footer>
    </div>
  );
};
