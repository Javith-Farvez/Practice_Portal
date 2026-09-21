import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  Check,
  X,
  Trash2,
  BarChart2,
  Flame,
  CheckCircle2,
  Target,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  Coffee,
  Terminal,
  Binary,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';

interface FriendProfile {
  id: number;
  friendship_id: number;
  name: string;
  email: string;
  problems_solved: number;
  current_streak: number;
  longest_streak: number;
  accuracy: number;
  since: string;
}

interface FriendRequestItem {
  id: number;
  user_id: number;
  name: string;
  email: string;
  created_at: string;
}

interface SearchUserItem {
  id: number;
  name: string;
  email: string;
  problems_solved: number;
  current_streak: number;
  relationship: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' | 'REJECTED';
  friendship_id: number | null;
}

interface ComparisonData {
  you: {
    id: number;
    name: string;
    email: string;
    problems_solved: number;
    problems_attempted: number;
    accuracy: number;
    current_streak: number;
    longest_streak: number;
    total_active_days: number;
    overall_progress_percentage: number;
  };
  friend: {
    id: number;
    name: string;
    email: string;
    problems_solved: number;
    problems_attempted: number;
    accuracy: number;
    current_streak: number;
    longest_streak: number;
    total_active_days: number;
    overall_progress_percentage: number;
  };
  subjects: Array<{
    name: string;
    slug: string;
    total_problems: number;
    you_solved: number;
    you_percentage: number;
    friend_solved: number;
    friend_percentage: number;
  }>;
}

export const FriendsPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'FRIENDS' | 'REQUESTS' | 'FIND'>('FRIENDS');
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestItem[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchUserItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Comparison & Stats Modal
  const [comparingFriend, setComparingFriend] = useState<FriendProfile | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loadingComparison, setLoadingComparison] = useState<boolean>(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  // Action status message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const res = await api.get('/friends');
      if (res.data.success) {
        setFriends(res.data.data.friends || []);
        setIncomingRequests(res.data.data.pending_incoming || []);
        setOutgoingRequests(res.data.data.pending_outgoing || []);
      }
    } catch (err) {
      console.error('Failed to load friends overview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Search users debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/friends/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.data.success) {
          setSearchResults(res.data.data.users || []);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Send request
  const handleSendRequest = async (targetId: number) => {
    try {
      const res = await api.post('/friends/request', { receiver_id: targetId });
      if (res.data.success) {
        showNotification(res.data.message || 'Friend request sent!');
        // Update local search result state
        setSearchResults((prev) =>
          prev.map((u) => (u.id === targetId ? { ...u, relationship: 'PENDING_SENT' } : u))
        );
        fetchFriends();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send friend request');
    }
  };

  // Accept request
  const handleAcceptRequest = async (requestId: number) => {
    try {
      const res = await api.post('/friends/accept', { request_id: requestId });
      if (res.data.success) {
        showNotification('Friend request accepted!');
        fetchFriends();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept request');
    }
  };

  // Reject request
  const handleRejectRequest = async (requestId: number) => {
    try {
      const res = await api.post('/friends/reject', { request_id: requestId });
      if (res.data.success) {
        showNotification('Friend request declined.');
        fetchFriends();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to decline request');
    }
  };

  // Remove friend
  const handleRemoveFriend = async (friendId: number, friendName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${friendName} from your friends list?`)) {
      return;
    }
    try {
      const res = await api.delete(`/friends/${friendId}`);
      if (res.data.success) {
        showNotification(`${friendName} removed from friends.`);
        fetchFriends();
        if (comparingFriend?.id === friendId) {
          setComparingFriend(null);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove friend');
    }
  };

  // Open comparison modal
  const handleOpenComparison = async (friend: FriendProfile) => {
    setComparingFriend(friend);
    setComparisonData(null);
    setComparisonError(null);
    setLoadingComparison(true);
    try {
      const res = await api.get(`/friends/${friend.id}/compare`);
      if (res.data.success) {
        setComparisonData(res.data.data);
      } else {
        setComparisonError(res.data.message || 'Could not load comparison data.');
      }
    } catch (err: any) {
      setComparisonError(
        err.response?.data?.message || 'Access denied: You can only compare stats with accepted friends.'
      );
    } finally {
      setLoadingComparison(false);
    }
  };

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-500" />
            Friends & Study Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect with peer students, follow mutual progress, and compare practice metrics factually.
          </p>
        </div>

        {/* Action feedback toast */}
        {feedbackMessage && (
          <div className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('FRIENDS')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'FRIENDS'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>My Friends</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {friends.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'REQUESTS'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Friend Requests</span>
          {incomingRequests.length > 0 && (
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-brand-500 text-white font-bold animate-pulse">
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('FIND')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'FIND'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Find Friends</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MY FRIENDS LIST                                    */}
      {/* ========================================================= */}
      {activeTab === 'FRIENDS' && (
        <div>
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm text-slate-400">Loading your friends list...</p>
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No Friends Connected Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                Connect with classmates and peer placement candidates to share consistency and compare learning roadmaps.
              </p>
              <button
                onClick={() => setActiveTab('FIND')}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl inline-flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Candidates</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((f) => (
                <div
                  key={f.id}
                  className="bg-white dark:bg-[#0D121F] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                          {f.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {f.name}
                          </h3>
                          <p className="text-xs text-slate-400 truncate">{f.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFriend(f.id, f.name)}
                        title="Remove Friend"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stats Highlights */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                        <span className="text-[10px] font-semibold uppercase text-slate-400">Solved</span>
                        <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {f.problems_solved}
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                        <span className="text-[10px] font-semibold uppercase text-slate-400">Streak</span>
                        <p className="text-base font-bold text-amber-500 flex items-center justify-center gap-0.5 mt-0.5">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{f.current_streak}d</span>
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                        <span className="text-[10px] font-semibold uppercase text-slate-400">Accuracy</span>
                        <p className="text-base font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                          {f.accuracy}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 flex gap-2">
                    <button
                      onClick={() => handleOpenComparison(f)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Compare Side-by-Side</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FRIEND REQUESTS                                    */}
      {/* ========================================================= */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-6">
          {/* Incoming */}
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-brand-500" />
              <span>Incoming Requests ({incomingRequests.length})</span>
            </h2>

            {incomingRequests.length === 0 ? (
              <div className="bg-white dark:bg-[#0D121F] rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                No pending requests at this time.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-brand-600/20 text-brand-500 font-bold flex items-center justify-center shrink-0">
                        {req.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {req.name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">{req.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        title="Accept Request"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                        title="Decline Request"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing */}
          {outgoingRequests.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                Sent Requests ({outgoingRequests.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {req.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">{req.email}</p>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Pending Approval
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FIND FRIENDS (SEARCH)                              */}
      {/* ========================================================= */}
      {activeTab === 'FIND' && (
        <div className="space-y-4">
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name or email..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
              </div>
            )}
          </div>

          {searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
            <div className="p-8 text-center bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-400">
              No registered students found matching "{searchQuery}".
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map((u) => (
                <div
                  key={u.id}
                  className="bg-white dark:bg-[#0D121F] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {u.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>{u.problems_solved} solved</span>
                      <span>•</span>
                      <span>{u.current_streak}d streak</span>
                    </div>
                  </div>

                  <div>
                    {u.relationship === 'ACCEPTED' ? (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Friends
                      </span>
                    ) : u.relationship === 'PENDING_SENT' ? (
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Request Sent
                      </span>
                    ) : u.relationship === 'PENDING_RECEIVED' ? (
                      <button
                        onClick={() => u.friendship_id && handleAcceptRequest(u.friendship_id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                      >
                        Accept
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(u.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl inline-flex items-center gap-1.5 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SIDE-BY-SIDE FACTUAL COMPARISON MODAL                     */}
      {/* ========================================================= */}
      {comparingFriend && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 animate-scale-in my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-500">
                  <BarChart2 className="w-4 h-4" />
                  <span>Factual Learning Comparison</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  You vs. {comparingFriend.name}
                </h3>
              </div>

              <button
                onClick={() => setComparingFriend(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingComparison ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                <p className="text-sm text-slate-400">Loading side-by-side stats...</p>
              </div>
            ) : comparisonError ? (
              <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{comparisonError}</span>
              </div>
            ) : comparisonData ? (
              <div className="space-y-6">
                {/* Side-by-Side Metric Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* You Card */}
                  <div className="bg-brand-500/5 dark:bg-brand-950/20 rounded-2xl p-4 border border-brand-500/20 text-center">
                    <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400">
                      You ({comparisonData.you.name})
                    </span>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                      {comparisonData.you.problems_solved}
                    </p>
                    <span className="text-[11px] text-slate-500">Problems Solved</span>
                  </div>

                  {/* Friend Card */}
                  <div className="bg-purple-500/5 dark:bg-purple-950/20 rounded-2xl p-4 border border-purple-500/20 text-center">
                    <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                      {comparisonData.friend.name}
                    </span>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                      {comparisonData.friend.problems_solved}
                    </p>
                    <span className="text-[11px] text-slate-500">Problems Solved</span>
                  </div>
                </div>

                {/* Factual Metrics Rows */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Core Metrics
                  </h4>

                  {/* Problems Attempted */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {comparisonData.you.problems_attempted}
                    </span>
                    <span className="text-slate-400 font-medium">Problems Attempted</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {comparisonData.friend.problems_attempted}
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {comparisonData.you.accuracy}%
                    </span>
                    <span className="text-slate-400 font-medium">Submission Accuracy</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {comparisonData.friend.accuracy}%
                    </span>
                  </div>

                  {/* Current Streak */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-500 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{comparisonData.you.current_streak} days</span>
                    </span>
                    <span className="text-slate-400 font-medium">Current Streak</span>
                    <span className="font-semibold text-amber-500 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{comparisonData.friend.current_streak} days</span>
                    </span>
                  </div>

                  {/* Longest Streak */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {comparisonData.you.longest_streak} days
                    </span>
                    <span className="text-slate-400 font-medium">Longest Streak</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {comparisonData.friend.longest_streak} days
                    </span>
                  </div>

                  {/* Active Days */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {comparisonData.you.total_active_days} days
                    </span>
                    <span className="text-slate-400 font-medium">Total Active Days</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {comparisonData.friend.total_active_days} days
                    </span>
                  </div>
                </div>

                {/* Subject Track Comparison */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Subject Track Progress
                  </h4>

                  <div className="space-y-2">
                    {comparisonData.subjects.map((sub) => {
                      const Icon = getSubjectIcon(sub.slug);
                      return (
                        <div
                          key={sub.slug}
                          className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-brand-600 dark:text-brand-400">
                              {sub.you_solved} solved ({sub.you_percentage}%)
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Icon className="w-3.5 h-3.5 text-slate-400" />
                              <span>{sub.name}</span>
                            </span>
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              {sub.friend_solved} solved ({sub.friend_percentage}%)
                            </span>
                          </div>

                          {/* Progress comparison bars */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-500 rounded-full transition-all"
                                style={{ width: `${sub.you_percentage}%` }}
                              />
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full transition-all"
                                style={{ width: `${sub.friend_percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setComparingFriend(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
