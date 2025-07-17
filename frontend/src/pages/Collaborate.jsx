import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import HackathonPostForm from '../components/collaborate/HackathonPostForm';
import HackathonPostList from '../components/collaborate/HackathonPostList';
import ProfileSummary from '../components/ProfileSummary';
import { Plus, Users, Award, Search, X, UserPlus, Menu } from 'lucide-react';

const premiumStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
`;

export default function Collaborate() {
  const user = useSelector(state => state.user.currentUser);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeFeature, setActiveFeature] = useState('hackathon'); // 'hackathon' or 'founder'
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const [editingPost, setEditingPost] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, post: null });
  const modalRef = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  // 1. Add state for filter/sort options for both features
  const [showFilters, setShowFilters] = useState(false);
  // Hackathon post filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterSkill, setFilterSkill] = useState('');
  const [sortByPost, setSortByPost] = useState('newest');
  // Founder filters
  const [filterRole, setFilterRole] = useState('all');
  const [filterUserType, setFilterUserType] = useState('all');
  const [filterUserLocation, setFilterUserLocation] = useState('all');
  const [filterUserSkill, setFilterUserSkill] = useState('');
  const [sortByUser, setSortByUser] = useState('recent');

  // 2. Compute unique values for filters (skills, locations, status, roles, userTypes)
  const allPostSkills = Array.from(new Set(posts.flatMap(p => p.skills || [])));
  const allPostLocations = Array.from(new Set(posts.map(p => p.location).filter(Boolean)));
  const allStatuses = ['Open', 'Full', 'In Progress'];
  // Update allUserRoles and allUserTypes for founder matching
  const founderRoles = ['Founder', 'Co-Founder', 'Hustler'];
  const founderUserTypes = ['Student', 'Working Professional'];
  const allUserLocations = Array.from(new Set(users.map(u => u.location).filter(Boolean)));
  const allUserSkills = Array.from(new Set(users.flatMap(u => u.skills || [])));

  // For hackathon location, use only these options
  const hackathonLocations = ['Online', 'Offline', 'Hybrid'];
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // 3. Filter and sort logic for posts
  const filteredAndSortedPosts = React.useMemo(() => {
    let result = posts;
    if (activeTab === 'my' && user) {
      result = result.filter(p => p.user?._id === user._id);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.hackathonName.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.skills && post.skills.join(' ').toLowerCase().includes(query))
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }
    if (filterLocation !== 'all') {
      result = result.filter(p => (p.location || '').toLowerCase() === filterLocation.toLowerCase());
    }
    if (filterStartDate) {
      result = result.filter(p => p.startDate && new Date(p.startDate) >= new Date(filterStartDate));
    }
    if (filterEndDate) {
      result = result.filter(p => p.endDate && new Date(p.endDate) <= new Date(filterEndDate));
    }
    switch (sortByPost) {
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'soonest':
        result = [...result].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        break;
      case 'teammates':
        result = [...result].sort((a, b) => (b.teammatesRequired || 0) - (a.teammatesRequired || 0));
        break;
      default:
        break;
    }
    return result;
  }, [posts, activeTab, user, searchQuery, filterStatus, filterLocation, filterStartDate, filterEndDate, sortByPost]);

  // 4. Filter and sort logic for users
  const filteredAndSortedUsers = React.useMemo(() => {
    let result = users;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q)) ||
        (u.bio && u.bio.toLowerCase().includes(q))
      );
    }
    if (filterRole !== 'all') {
      result = result.filter(u => u.role === filterRole);
    }
    if (filterUserType !== 'all') {
      result = result.filter(u => u.userType === filterUserType);
    }
    switch (sortByUser) {
      case 'recent':
        result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'nameaz':
        result = [...result].sort((a, b) => (a.fullName || a.username || '').localeCompare(b.fullName || b.username || ''));
        break;
      case 'nameza':
        result = [...result].sort((a, b) => (b.fullName || b.username || '').localeCompare(a.fullName || a.username || ''));
        break;
      default:
        break;
    }
    return result;
  }, [users, searchQuery, filterRole, filterUserType, sortByUser]);

  // Fetch all hackathon posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/backend/hackathon-posts', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          setError(data.message || 'Failed to fetch posts.');
        }
      } catch (err) {
        setError('Failed to fetch posts.');
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Fetch users when switching to founder tab
  useEffect(() => {
    if (activeFeature === 'founder') {
      setUsersLoading(true);
      setUsersError('');
      fetch('/backend/auth/users', { credentials: 'include' })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (ok) setUsers(data);
          else setUsersError(data.message || 'Failed to fetch users.');
        })
        .catch(() => setUsersError('Failed to fetch users.'))
        .finally(() => setUsersLoading(false));
    }
  }, [activeFeature]);

  // Filter posts by search and tab
  useEffect(() => {
    let visiblePosts = posts;
    if (activeTab === 'my' && user) {
      visiblePosts = visiblePosts.filter(p => p.user?._id === user._id);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      visiblePosts = visiblePosts.filter(post =>
        post.hackathonName.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.skills && post.skills.join(' ').toLowerCase().includes(query))
      );
    }
    setFilteredPosts(visiblePosts);
  }, [searchQuery, posts, activeTab, user]);

  // Filter users by search
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.skills && u.skills.join(' ').toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.bio && u.bio.toLowerCase().includes(q))
    );
  });

  // Add a new hackathon post
  const handleAddPost = async (form) => {
    if (!user) {
      setError('You must be signed in to post.');
      return;
    }
    setPosting(true);
    setError('');
    try {
      const res = await fetch('/backend/hackathon-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          startDate: form.startDate ? form.startDate : '',
          endDate: form.endDate ? form.endDate : '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts([data, ...posts]);
        setShowForm(false);
      } else {
        setError(data.message || 'Failed to post.');
      }
    } catch (err) {
      setError('Failed to post.');
    }
    setPosting(false);
  };

  // Edit a hackathon post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  // Delete a hackathon post
  const handleDeletePost = (post) => {
    setDeleteModal({ open: true, post });
  };

  const confirmDeletePost = async () => {
    const post = deleteModal.post;
    setError('');
    try {
      const res = await fetch(`/backend/hackathon-posts/${post._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts.filter(p => p._id !== post._id));
        setDeleteModal({ open: false, post: null });
      } else {
        setError(data.message || 'Failed to delete post.');
      }
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  const cancelDeletePost = () => {
    setDeleteModal({ open: false, post: null });
  };

  // Submit handler for add/edit
  const handleFormSubmit = async (form) => {
    if (!user) {
      setError('You must be signed in to post.');
      return;
    }
    setPosting(true);
    setError('');
    try {
      let res, data;
      if (editingPost) {
        res = await fetch(`/backend/hackathon-posts/${editingPost._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });
        data = await res.json();
        if (res.ok) {
          setPosts(posts.map(p => (p._id === editingPost._id ? data : p)));
          setShowForm(false);
          setEditingPost(null);
        } else {
          setError(data.message || 'Failed to update post.');
        }
      } else {
        res = await fetch('/backend/hackathon-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...form,
            startDate: form.startDate ? form.startDate : '',
            endDate: form.endDate ? form.endDate : '',
          }),
        });
        data = await res.json();
        if (res.ok) {
          setPosts([data, ...posts]);
          setShowForm(false);
        } else {
          setError(data.message || 'Failed to post.');
        }
      }
    } catch (err) {
      setError('Failed to post.');
    }
    setPosting(false);
  };

  // Modal close handler
  const handleOverlayClick = (e) => {
    if (modalRef.current && e.target === modalRef.current) {
      setShowForm(false);
    }
  };

  return (
    <>
      <style>{premiumStyles}</style>
      {/* Hamburger for mobile */}
      <div className="lg:hidden fixed top-24 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-white/90 border border-slate-200 rounded-2xl shadow-lg hover:bg-violet-50 transition-all cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-7 h-7 text-violet-700" />
        </button>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar for large screens */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <div className="relative bg-white/90 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl animate-fadeIn rounded-tr-3xl rounded-br-3xl min-h-[calc(100vh-80px)]">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-blue-50/20 to-indigo-50/30 rounded-tr-3xl rounded-br-3xl"></div>
                <div className="relative p-8 space-y-8 h-full">
                  {/* Feature Navigation */}
                  <div className="flex flex-col gap-3 mb-6">
                    <button
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer ${activeFeature === 'hackathon' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-105' : 'text-slate-700 hover:bg-violet-50'}`}
                      onClick={() => setActiveFeature('hackathon')}
                    >
                      <Users className="w-5 h-5" />
                      Hackathon Teammate Finder
                    </button>
                    <button
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer ${activeFeature === 'founder' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105' : 'text-slate-700 hover:bg-blue-50'}`}
                      onClick={() => setActiveFeature('founder')}
                    >
                      <UserPlus className="w-5 h-5" />
                      Founder/Co-Founder Matching
                    </button>
                  </div>
                  {/* Section Title */}
                  {activeFeature === 'hackathon' && (
                    <>
                      <div className="text-center space-y-4">
                        <div className="relative inline-block">
                          <div className="p-4 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl animate-float">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                            Hackathon Teammate Finder
                          </h1>
                          <p className="text-slate-600 text-sm font-medium mt-2">
                            Find or build your dream hackathon team
                          </p>
                        </div>
                      </div>
                      {/* Post Filters */}
                      <div className="flex flex-col gap-2 mt-8 mb-4">
                        <button
                          className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl font-semibold text-base transition-all duration-200 ${activeTab === 'all' ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow' : 'text-slate-700 hover:bg-violet-50'}`}
                          onClick={() => setActiveTab('all')}
                        >
                          <Users className="w-4 h-4" /> All Posts <span className="ml-auto font-bold">{posts.length}</span>
                        </button>
                        {user && (
                          <button
                            className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl font-semibold text-base transition-all duration-200 ${activeTab === 'my' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow' : 'text-slate-700 hover:bg-blue-50'}`}
                            onClick={() => setActiveTab('my')}
                          >
                            <Award className="w-4 h-4" /> My Posts <span className="ml-auto font-bold">{posts.filter(p => p.user?._id === user._id).length}</span>
                          </button>
                        )}
                      </div>
                      {/* Action Button */}
                      {user && (
                        <div className="space-y-4 mt-6">
                          <button
                            className="group relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer overflow-hidden"
                            onClick={() => setShowForm(true)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <span className="relative z-10 flex items-center justify-center gap-3">
                              <Plus className="w-5 h-5" />
                              Post Team Request
                            </span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {activeFeature === 'founder' && (
                    <>
                      <div className="text-center space-y-4">
                        <div className="relative inline-block">
                          <div className="p-4 bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600 rounded-3xl shadow-2xl animate-float">
                            <UserPlus className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                            Founder/Co-Founder Matching
                          </h1>
                          <p className="text-slate-600 text-sm font-medium mt-2">
                            Find your perfect co-founder, hustler, or technical partner. Browse profiles, connect, and build your dream startup team!
                          </p>
                          <div className="mt-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4 border border-blue-200 text-blue-700 font-semibold shadow">
                            <p>🚀 Ready to start your entrepreneurial journey?</p>
                            <p>Use the filters to find founders, co-founders, and hustlers who match your vision.</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>
          {/* Sidebar drawer for mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
              {/* Overlay */}
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
              {/* Drawer */}
              <div className="relative w-80 max-w-full bg-white/95 shadow-2xl h-full animate-fadeIn overflow-y-auto">
                <button
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-2xl text-slate-400 hover:text-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="pt-12">
                  <div className="relative bg-white/90 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl animate-fadeIn rounded-tr-3xl rounded-br-3xl min-h-[calc(100vh-80px)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-blue-50/20 to-indigo-50/30 rounded-tr-3xl rounded-br-3xl"></div>
                    <div className="relative p-8 space-y-8 h-full">
                      {/* Feature Navigation */}
                      <div className="flex flex-col gap-3 mb-6">
                        <button
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer ${activeFeature === 'hackathon' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-105' : 'text-slate-700 hover:bg-violet-50'}`}
                          onClick={() => setActiveFeature('hackathon')}
                        >
                          <Users className="w-5 h-5" />
                          Hackathon Teammate Finder
                        </button>
                        <button
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer ${activeFeature === 'founder' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105' : 'text-slate-700 hover:bg-blue-50'}`}
                          onClick={() => setActiveFeature('founder')}
                        >
                          <UserPlus className="w-5 h-5" />
                          Founder/Co-Founder Matching
                        </button>
                      </div>
                      {/* Section Title */}
                      {activeFeature === 'hackathon' && (
                        <>
                          <div className="text-center space-y-4">
                            <div className="relative inline-block">
                              <div className="p-4 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl animate-float">
                                <Users className="w-8 h-8 text-white" />
                              </div>
                            </div>
                            <div>
                              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                                Hackathon Teammate Finder
                              </h1>
                              <p className="text-slate-600 text-sm font-medium mt-2">
                                Find or build your dream hackathon team
                              </p>
                            </div>
                          </div>
                          {/* Post Filters */}
                          <div className="flex flex-col gap-2 mt-8 mb-4">
                            <button
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-base transition-all duration-200 ${activeTab === 'all' ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow' : 'text-slate-700 hover:bg-violet-50'}`}
                              onClick={() => setActiveTab('all')}
                            >
                              <Users className="w-4 h-4" /> All Posts <span className="ml-auto font-bold">{posts.length}</span>
                            </button>
                            {user && (
                              <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-base transition-all duration-200 ${activeTab === 'my' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow' : 'text-slate-700 hover:bg-blue-50'}`}
                                onClick={() => setActiveTab('my')}
                              >
                                <Award className="w-4 h-4" /> My Posts <span className="ml-auto font-bold">{posts.filter(p => p.user?._id === user._id).length}</span>
                              </button>
                            )}
                          </div>
                          {/* Action Button */}
                          {user && (
                            <div className="space-y-4 mt-6">
                              <button
                                className="group relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer overflow-hidden"
                                onClick={() => setShowForm(true)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                  <Plus className="w-5 h-5" />
                                  Post Team Request
                                </span>
                              </button>
                            </div>
                          )}
                        </>
                      )}
                      {activeFeature === 'founder' && (
                        <div className="text-center text-slate-400 font-semibold mt-12">Founder/Co-Founder Matching coming soon!</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 pb-32">
              {/* 5. Add filter/sort UI below the search bar */}
              <div className="mb-8 space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={activeFeature === 'hackathon' ? 'Search hackathons by name, skills, or description...' : 'Search founders, co-founders, or projects...'}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/90 backdrop-blur-xl border-2 border-slate-200 rounded-2xl text-lg font-medium placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 shadow-lg hover:shadow-xl cursor-pointer"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-violet-600 transition-colors duration-300 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {/* Filter and Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer ${showFilters ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' : 'bg-white/95 backdrop-blur-xl border-2 border-slate-200 text-slate-700 hover:border-violet-300'}`}
                  >
                    <span>Filters</span>
                  </button>
                  {/* Sort Dropdown */}
                  {activeFeature === 'hackathon' ? (
                    <select
                      value={sortByPost}
                      onChange={e => setSortByPost(e.target.value)}
                      className="flex-1 sm:w-auto px-6 py-4 bg-white/95 backdrop-blur-xl border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-700 hover:border-violet-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="soonest">Soonest Start Date</option>
                      <option value="teammates">Most Teammates Required</option>
                    </select>
                  ) : (
                    <select
                      value={sortByUser}
                      onChange={e => setSortByUser(e.target.value)}
                      className="flex-1 sm:w-auto px-6 py-4 bg-white/95 backdrop-blur-xl border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-700 hover:border-violet-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    >
                      <option value="recent">Recently Joined</option>
                      <option value="nameaz">Name A-Z</option>
                      <option value="nameza">Name Z-A</option>
                    </select>
                  )}
                  {/* Clear Filters */}
                  {(activeFeature === 'hackathon' ? (filterStatus !== 'all' || filterLocation !== 'all' || filterStartDate || filterEndDate || sortByPost !== 'newest') : (filterRole !== 'all' || filterUserType !== 'all' || sortByUser !== 'recent')) && (
                    <button
                      onClick={() => {
                        if (activeFeature === 'hackathon') {
                          setFilterStatus('all'); setFilterLocation('all'); setFilterStartDate(''); setFilterEndDate(''); setSortByPost('newest');
                        } else {
                          setFilterRole('all'); setFilterUserType('all'); setSortByUser('recent');
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-2xl font-bold text-lg hover:from-slate-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                      Clear All
                    </button>
                  )}
                </div>
                {/* Expanded Filters */}
                {showFilters && (
                  <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200 rounded-3xl p-6 shadow-xl animate-fadeIn mt-4">
                    {activeFeature === 'hackathon' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Status Filter */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-slate-700 text-lg">Status</h3>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-xl font-semibold ${filterStatus === 'all' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' : 'bg-slate-100 text-slate-700'}`}>All</button>
                            {allStatuses.map(status => (
                              <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-xl font-semibold ${filterStatus === status ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{status}</button>
                            ))}
                          </div>
                        </div>
                        {/* Location Filter */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-slate-700 text-lg">Location</h3>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => setFilterLocation('all')} className={`px-4 py-2 rounded-xl font-semibold ${filterLocation === 'all' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' : 'bg-slate-100 text-slate-700'}`}>All</button>
                            {hackathonLocations.map(loc => (
                              <button key={loc} onClick={() => setFilterLocation(loc)} className={`px-4 py-2 rounded-xl font-semibold ${filterLocation.toLowerCase() === loc.toLowerCase() ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{loc}</button>
                            ))}
                          </div>
                        </div>
                        {/* Start Date Filter */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-slate-700 text-lg">Start Date (on or after)</h3>
                          <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white/80 text-lg cursor-pointer" />
                        </div>
                        {/* End Date Filter */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-slate-700 text-lg">End Date (on or before)</h3>
                          <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white/80 text-lg cursor-pointer" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Role Filter */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-slate-700 text-lg">Role</h3>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => setFilterRole('all')} className={`px-4 py-2 rounded-xl font-semibold ${filterRole === 'all' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-slate-100 text-slate-700'}`}>All</button>
                            {founderRoles.map(role => (
                              <button key={role} onClick={() => setFilterRole(role)} className={`px-4 py-2 rounded-xl font-semibold ${filterRole === role ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{role}</button>
                            ))}
                          </div>
                        </div>
                        {/* User Type Filter */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-slate-700 text-lg">User Type</h3>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => setFilterUserType('all')} className={`px-4 py-2 rounded-xl font-semibold ${filterUserType === 'all' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-slate-100 text-slate-700'}`}>All</button>
                            {founderUserTypes.map(type => (
                              <button key={type} onClick={() => setFilterUserType(type)} className={`px-4 py-2 rounded-xl font-semibold ${filterUserType === type ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{type}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {error && <div className="mb-4 p-4 rounded-xl bg-red-100 text-red-700 font-semibold shadow">{error}</div>}
              <div className="mt-6">
                {loading ? (
                  <div className="flex justify-center items-center min-h-[200px]">
                    <svg className="animate-spin h-8 w-8 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  </div>
                ) : (
                  activeFeature === 'hackathon' ? (
                    <HackathonPostList
                      posts={filteredAndSortedPosts.map(post => ({
                        ...post,
                        userName: post.user?.fullName || post.user?.username || 'User',
                        userProfile: `/profile/${post.user?._id || ''}`,
                        userAvatar: post.user?.profilePicture || '',
                        startDate: post.startDate ? new Date(post.startDate).toLocaleDateString() : '',
                        endDate: post.endDate ? new Date(post.endDate).toLocaleDateString() : '',
                      }))}
                      currentUser={user}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                      showOwnerActions={activeTab === 'my'}
                    />
                  ) : (
                    usersLoading ? (
                      <div className="flex justify-center items-center min-h-[200px]">
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                      </div>
                    ) : usersError ? (
                      <div className="mb-4 p-4 rounded-xl bg-red-100 text-red-700 font-semibold shadow">{usersError}</div>
                    ) : filteredAndSortedUsers.length === 0 ? (
                      <div className="text-center text-slate-400 font-semibold py-24">No users found.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedUsers.map(user => (
                          <div key={user._id} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center cursor-pointer">
                            <img src={user.profilePicture || 'https://www.pngall.com/wp-content/uploads/5/Profile.png'} alt="avatar" className="w-20 h-20 rounded-full mb-3 object-cover" />
                            <h3 className="text-lg font-bold text-slate-800">{user.fullName || user.username}</h3>
                            <div className="text-slate-500 text-sm mb-2">{user.role || 'Member'}</div>
                            <div className="text-slate-600 text-xs mb-2">{user.bio}</div>
                            <div className="flex flex-wrap gap-1 justify-center mb-2">
                              {user.skills && user.skills.slice(0, 5).map(skill => (
                                <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{skill}</span>
                              ))}
                            </div>
                            <a href={`/profile/${user._id}`} className="mt-2 text-blue-600 hover:underline text-sm font-semibold">View Profile</a>
                          </div>
                        ))}
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Premium Post Modal */}
      {showForm && activeFeature === 'hackathon' && (
        <div
          ref={modalRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn"
        >
          <div className="relative w-full max-w-2xl mx-4 max-h-[95vh] flex flex-col" style={{ background: 'transparent', boxShadow: 'none', border: 'none', borderRadius: 0, padding: 0 }}>
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-2xl text-slate-400 hover:text-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
              onClick={() => { setShowForm(false); setEditingPost(null); }}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative z-10 p-0 sm:p-0 overflow-y-auto flex-1 hide-scrollbar" style={{ maxHeight: 'calc(95vh - 80px)' }}>
              <HackathonPostForm onSubmit={handleFormSubmit} disabled={posting || !user} initialValues={editingPost} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center">
            <div className="mb-4 flex flex-col items-center">
              <svg className="w-12 h-12 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete Post?</h2>
              <p className="text-slate-600 text-center">Are you sure you want to delete <span className="font-semibold text-red-600">{deleteModal.post?.hackathonName}</span>? This action cannot be undone.</p>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="px-6 py-2 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all shadow focus:outline-none"
                onClick={cancelDeletePost}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow focus:outline-none"
                onClick={confirmDeletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
