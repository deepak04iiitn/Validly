import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import FloatingActionPanel from '../components/collaborate/FloatingActionPanel';
import StickyTopBar from '../components/collaborate/StickyTopBar';
import LeftStatsPanel from '../components/collaborate/LeftStatsPanel';
import RightActivityPanel from '../components/collaborate/RightActivityPanel';
import CornerDecorations from '../components/collaborate/CornerDecorations';
import HackathonPostForm from '../components/collaborate/HackathonPostForm';
import { X } from 'lucide-react';

export default function Collaborate() {
  const user = useSelector(state => state.user.currentUser);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [activeFeature, setActiveFeature] = useState('hackathon');
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    role: '',
    type: '',
    startDate: '',
    endDate: '',
  });
  const [sort, setSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, post: null });
  const [applyModal, setApplyModal] = useState({ open: false, post: null });
  const [messageModal, setMessageModal] = useState({ open: false, user: null });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [expandedHackathon, setExpandedHackathon] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  const [hackIdx, setHackIdx] = useState(10);
  const [userIdx, setUserIdx] = useState(10);
  const [hasMoreHackathons, setHasMoreHackathons] = useState(true);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [isLoadingMoreHackathons, setIsLoadingMoreHackathons] = useState(false);
  const [isLoadingMoreUsers, setIsLoadingMoreUsers] = useState(false);

  const [allPosts, setAllPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);


  useEffect(() => {
    if (activeFeature !== 'hackathon') return;
    setLoading(true);
    setError('');
    fetch('/backend/hackathon-posts', { credentials: 'include' })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setAllPosts(data); 
          setPosts(data.slice(0, hackIdx)); 
          setHasMoreHackathons(data.length > hackIdx);
        } else {
          setError(data.message || 'Failed to fetch posts.');
        }
      })
      .catch(() => setError('Failed to fetch posts.'))
      .finally(() => setLoading(false));
  }, [activeFeature, hackIdx]);

  useEffect(() => {
    if (activeFeature !== 'founder') return;
    setUsersLoading(true);
    setUsersError('');
    fetch('/backend/auth/users', { credentials: 'include' })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setAllUsers(data); 
          setUsers(data.slice(0, userIdx)); 
          setHasMoreUsers(data.length > userIdx);
        } else {
          setUsersError(data.message || 'Failed to fetch users.');
        }
      })
      .catch(() => setUsersError('Failed to fetch users.'))
      .finally(() => setUsersLoading(false));
  }, [activeFeature, userIdx]);


  const handleLoadMoreHackathons = () => {
    setIsLoadingMoreHackathons(true);
    setTimeout(() => {
      setHackIdx(prev => prev + 10);
      setIsLoadingMoreHackathons(false);
    }, 500);
  };
  
  const handleLoadMoreUsers = () => {
    setIsLoadingMoreUsers(true);
    setTimeout(() => {
      setUserIdx(prev => prev + 10);
      setIsLoadingMoreUsers(false);
    }, 500);
  };

  const filteredPosts = React.useMemo(() => {
    let result = allPosts;
    if (activeFeature === 'myposts' && user) {
      result = result.filter(post => post.user === user._id || post.user?._id === user._id);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        (post.hackathonName && post.hackathonName.toLowerCase().includes(query)) ||
        (post.description && post.description.toLowerCase().includes(query)) ||
        (post.skills && post.skills.join(' ').toLowerCase().includes(query))
      );
    }
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.location) {
      result = result.filter(p => (p.location || '').toLowerCase() === filters.location.toLowerCase());
    }
    if (filters.startDate) {
      result = result.filter(p => p.startDate && new Date(p.startDate) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(p => p.endDate && new Date(p.endDate) <= new Date(filters.endDate));
    }
    switch (sort) {
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

    setHasMoreHackathons(result.length > hackIdx);

    return result;
  }, [allPosts, searchQuery, filters, sort, activeFeature, user, hackIdx]);

  const filteredUsers = React.useMemo(() => {
    let result = allUsers;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u =>
        (u.fullName && u.fullName.toLowerCase().includes(query)) ||
        (u.username && u.username.toLowerCase().includes(query)) ||
        (u.role && u.role.toLowerCase().includes(query)) ||
        (u.bio && u.bio.toLowerCase().includes(query))
      );
    }
    if (filters.role) {
      result = result.filter(u => u.role === filters.role);
    }
    if (filters.type) {
      result = result.filter(u => u.userType === filters.type);
    }
    switch (sort) {
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

    setHasMoreUsers(result.length > userIdx);

    return result;
  }, [allUsers, searchQuery, filters, sort, userIdx]);

  const handleEditPost = (post) => {
    setEditingPost(post);
  };
  const handleDeletePost = (post) => {
    setDeleteModal({ open: true, post });
  };
  const handleApplyPost = (post) => {
    setApplyModal({ open: true, post });
  };
  const handleMessageUser = (user) => {
    setMessageModal({ open: true, user });
  };

  const closeEditModal = () => setEditingPost(null);
  const closeDeleteModal = () => setDeleteModal({ open: false, post: null });
  const closeApplyModal = () => setApplyModal({ open: false, post: null });
  const closeMessageModal = () => setMessageModal({ open: false, user: null });

  const handleEditSubmit = async (form) => {
    if (!editingPost) return;
    setError('');
    try {
      const res = await fetch(`/backend/hackathon-posts/${editingPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts => posts.map(p => (p._id === editingPost._id ? data : p)));
        setAllPosts(allPosts => allPosts.map(p => (p._id === editingPost._id ? data : p)));
        setEditingPost(null);
      } else {
        setError(data.message || 'Failed to update post.');
      }
    } catch (err) {
      setError('Failed to update post.');
    }
  };

  const confirmDeletePost = async () => {
    if (!deleteModal.post) return;
    setError('');
    try {
      const res = await fetch(`/backend/hackathon-posts/${deleteModal.post._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts => posts.filter(p => p._id !== deleteModal.post._id));
        setAllPosts(allPosts => allPosts.filter(p => p._id !== deleteModal.post._id));
        setDeleteModal({ open: false, post: null });
      } else {
        setError(data.message || 'Failed to delete post.');
      }
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  const handleCreatePost = async (form) => {
    if (!user) return;
    setPosting(true);
    setError('');
    try {
      const res = await fetch('/backend/hackathon-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts => [data, ...posts]);
        setAllPosts(allPosts => [data, ...allPosts]);
        setShowCreateModal(false);
      } else {
        setError(data.message || 'Failed to post.');
      }
    } catch (err) {
      setError('Failed to post.');
    }
    setPosting(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 pt-16 sm:pt-20">

      {/* <LeftStatsPanel />
      <RightActivityPanel /> */}
      
      <StickyTopBar
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
      />
      <FloatingActionPanel
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        user={user}
        onCreate={() => setShowCreateModal(true)}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-28">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 font-medium shadow-lg border border-red-200">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        ) : (activeFeature === 'hackathon' || activeFeature === 'myposts') ? (
          <div className="space-y-6">
            {filteredPosts.length === 0 && (
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 opacity-60"></div>
                <div className="relative p-12 text-center bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No hackathons found</h3>
                  <p className="text-slate-500">Try adjusting your search criteria</p>
                </div>
              </div>
            )}
            
            {filteredPosts.slice(0, hackIdx).map((post) => (
              <div key={post._id} className="group relative overflow-hidden">
                {/* Premium gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm scale-105"></div>
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-slate-300/70">
                  <button
                    className="cursor-pointer w-full flex items-center justify-between p-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-3xl transition-all duration-300"
                    onClick={() => setExpandedHackathon(expandedHackathon === post._id ? null : post._id)}
                    aria-expanded={expandedHackathon === post._id}
                  >
                    <div className="flex items-center space-x-6 flex-1 min-w-0">
                      {/* Status indicator */}
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                        post.status === 'Open'
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-green-500/30'
                          : post.status === 'Full'
                          ? 'bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-500/30'
                          : 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-yellow-500/30'
                      }`}></div>
                      
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <h3 className="font-bold text-2xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate mb-2">
                          {post.hackathonName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{post.location}</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.status === 'Open'
                              ? 'bg-green-100 text-green-800'
                              : post.status === 'Full'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                            </svg>
                            <span className="font-medium">
                              {post.startDate && post.endDate
                                ? `${new Date(post.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(post.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                : 'Dates TBD'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`cursor-pointer w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center transform transition-all duration-300 ${
                      expandedHackathon === post._id ? 'rotate-180 from-blue-100 to-indigo-200' : 'group-hover:scale-110'
                    }`}>
                      <svg className="cursor-pointer w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {expandedHackathon === post._id && (
                    <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                      {/* Elegant divider */}
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8"></div>
                      
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          <div className="group/item">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                              <h4 className="font-bold text-slate-800 text-lg">Description</h4>
                            </div>
                            <p className="text-slate-600 leading-relaxed pl-5 text-sm">{post.description}</p>
                          </div>
                          
                          <div className="group/item">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                              <h4 className="font-bold text-slate-800 text-lg">Skills Required</h4>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-5">
                              {post.skills?.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-100 hover:to-indigo-100 text-slate-700 text-sm font-medium rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-default"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="group/item">
                              <div className="flex items-center gap-3 mb-2">
                                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                <h4 className="font-semibold text-slate-700 text-sm">Team Size</h4>
                              </div>
                              <p className="text-slate-600 text-sm pl-7">{post.teammatesRequired}</p>
                            </div>
                            
                            <div className="group/item">
                              <div className="flex items-center gap-3 mb-2">
                                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="font-semibold text-slate-700 text-sm">Status</h4>
                              </div>
                              <div className="pl-7">
                                <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                                  post.status === 'Open'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                                    : post.status === 'Full'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
                                    : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/30'
                                }`}>
                                  {post.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200/60">
                              <div className="flex items-center gap-3 mb-3">
                                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <h4 className="font-bold text-slate-800 text-sm">Location</h4>
                              </div>
                              <p className="text-slate-600 text-sm font-medium">{post.location}{post.city && `, ${post.city}`}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200/60">
                              <div className="flex items-center gap-3 mb-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                                </svg>
                                <h4 className="font-bold text-slate-800 text-sm">Duration</h4>
                              </div>
                              <div className="space-y-1">
                                <p className="text-slate-600 text-sm font-medium">
                                  {post.startDate && new Date(post.startDate).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-slate-600 text-sm font-medium">
                                  {post.endDate && new Date(post.endDate).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {post.prize && (
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 border border-yellow-200/60">
                              <div className="flex items-center gap-3 mb-3">
                                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <h4 className="font-bold text-slate-800">Prize Pool</h4>
                              </div>
                              <p className="text-slate-700 font-semibold text-lg">{post.prize}</p>
                            </div>
                          )}
                          
                          {post.hackathonLink && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-200/60">
                              <div className="flex items-center gap-3 mb-3">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <h4 className="font-bold text-slate-800 text-sm">Official Link</h4>
                              </div>
                              <a
                                href={post.hackathonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200 hover:underline"
                              >
                                Visit Website
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          )}
                          
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Posted {post.createdAt && new Date(post.createdAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-200/60">
                        {(user && (post.user === user._id || post.user?._id === user._id)) ? (
                          <>
                            <button
                              className="cursor-pointer group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                              onClick={() => handleEditPost(post)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit 
                              </div>
                            </button>
                            <button
                              className="cursor-pointer group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2"
                              onClick={() => handleDeletePost(post)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </div>
                            </button>
                          </>
                        ) : (
                          <button
                            className="cursor-pointer group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2"
                            onClick={() => handleApplyPost(post)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-3">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              Apply Now
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {hasMoreHackathons && (
              <div className="flex justify-center mt-8">
                <button
                  className={`group relative cursor-pointer overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 ${
                    isLoadingMoreHackathons ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  onClick={handleLoadMoreHackathons}
                  disabled={isLoadingMoreHackathons}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {isLoadingMoreHackathons ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Load More Hackathons
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}

          </div>
        ) : usersLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        ) : usersError ? (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 font-medium shadow-lg border border-red-200">
            {usersError}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUsers.length === 0 && (
              <div className="p-12 text-center bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-200/50 backdrop-blur-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No founders found</h3>
                <p className="text-slate-500">Try adjusting your search criteria</p>
              </div>
            )}
            
            {filteredUsers.slice(0, userIdx).map((u) => (
              <div key={u._id} className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/90">
                <button
                  className="cursor-pointer w-full flex items-center justify-between p-6 focus:outline-none focus:ring-4 focus:ring-blue-500/20 rounded-3xl transition-all duration-300"
                  onClick={() => setExpandedUser(expandedUser === u._id ? null : u._id)}
                  aria-expanded={expandedUser === u._id}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <img src={u.profilePicture} />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                        {u.fullName || u.username}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200/50">
                          {u.role}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200/50">
                          {u.userType}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:flex items-center space-x-2 text-slate-500 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{u.location || 'Remote'}</span>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/50 flex items-center justify-center transition-all duration-300 ${expandedUser === u._id ? 'rotate-180 bg-gradient-to-br from-blue-100 to-purple-100' : 'group-hover:from-blue-50 group-hover:to-purple-50'}`}>
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {expandedUser === u._id && (
                  <div className="px-6 pb-6 animate-slideDown">
                    <div className="bg-gradient-to-br from-slate-50/50 to-white rounded-2xl p-6 border border-slate-200/50">
                      
                      {/* Bio Section */}
                      <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">About</h4>
                        </div>
                        <p className="text-slate-700 leading-relaxed bg-white/60 rounded-xl p-4 border border-slate-200/50">
                          {u.bio || 'No bio available'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {/* Skills */}
                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </div>
                              <h4 className="text-lg font-bold text-slate-800">Skills</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {u.skills && u.skills.length > 0 ? (
                                u.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-500 italic">No skills listed</span>
                              )}
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Looking For</span>
                              <p className="text-slate-800 font-medium mt-1">{u.lookingFor || 'Not specified'}</p>
                            </div>
                            <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</span>
                              <p className="text-slate-800 font-medium mt-1 truncate">{u.email}</p>
                            </div>
                            <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</span>
                              <p className="text-slate-800 font-medium mt-1">{u.location || 'Not specified'}</p>
                            </div>
                            <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</span>
                              <p className="text-slate-800 font-medium mt-1">
                                {u.createdAt && new Date(u.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {/* Education/Experience */}
                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <h4 className="text-lg font-bold text-slate-800">
                                {u.userType === 'Student' ? 'Education' : 'Experience'}
                              </h4>
                            </div>
                            
                            {u.userType === 'Student' ? (
                              <div className="grid grid-cols-1 gap-3">
                                <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Degree</span>
                                  <p className="text-slate-800 font-medium mt-1">{u.degree || 'Not specified'}</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Branch</span>
                                  <p className="text-slate-800 font-medium mt-1">{u.branch || 'Not specified'}</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Year</span>
                                  <p className="text-slate-800 font-medium mt-1">{u.year || 'Not specified'}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-3">
                                <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</span>
                                  <p className="text-slate-800 font-medium mt-1">{u.companyName || 'Not specified'}</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Position</span>
                                  <p className="text-slate-800 font-medium mt-1">{u.position || 'Not specified'}</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Experience</span>
                                  <p className="text-slate-800 font-medium mt-1">{u.yoe || 'Not specified'}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Links */}
                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                              </div>
                              <h4 className="text-lg font-bold text-slate-800">Links</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {u.resumeLink && (
                                <a
                                  href={u.resumeLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-slate-200/50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                                >
                                  <span className="font-medium text-slate-800">Resume</span>
                                  <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                              {u.portfolio && (
                                <a
                                  href={u.portfolio}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-slate-200/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 group"
                                >
                                  <span className="font-medium text-slate-800">Portfolio</span>
                                  <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                              {u.github && (
                                <a
                                  href={u.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-slate-200/50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                                >
                                  <span className="font-medium text-slate-800">GitHub</span>
                                  <svg className="w-4 h-4 text-slate-500 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Best Works */}
                      {u.bestWorks && u.bestWorks.length > 0 && (
                        <div className="mt-8">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">Best Works</h4>
                          </div>
                          <div className="space-y-4">
                            {u.bestWorks.map((work, index) => (
                              <div
                                key={index}
                                className="p-5 bg-white/80 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300"
                              >
                                <p className="text-slate-700 mb-4 leading-relaxed">{work.description}</p>
                                <div className="flex gap-3">
                                  {work.github && (
                                    <a
                                      href={work.github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-sm font-medium rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-200 transform hover:scale-105"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                      </svg>
                                      GitHub
                                    </a>
                                  )}
                                  {work.live && (
                                    <a
                                      href={work.live}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                      Live Demo
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex justify-center mt-8 pt-6 border-t border-slate-200/50">
                        <button
                          className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                          onClick={() => handleMessageUser(u)}
                        >
                          <span className="relative z-10 flex items-center">
                            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Send Message
                          </span>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-700 via-purple-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {hasMoreUsers && (
              <div className="flex justify-center mt-8">
                <button
                  className={`group relative cursor-pointer overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 ${
                    isLoadingMoreUsers ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  onClick={handleLoadMoreUsers}
                  disabled={isLoadingMoreUsers}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {isLoadingMoreUsers ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Load More Users
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}

          </div>
        )}
      </main>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn p-4 sm:p-6">
          <div className="relative w-full max-w-2xl max-h-[95vh] flex flex-col bg-transparent">
            <button
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 hover:text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              onClick={() => setShowCreateModal(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative z-10 p-0 overflow-y-auto flex-1 hide-scrollbar">
              <HackathonPostForm onSubmit={handleCreatePost} disabled={posting || !user} />
            </div>
          </div>
        </div>
      )}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn p-4 sm:p-6">
          <div className="relative w-full max-w-2xl max-h-[95vh] flex flex-col bg-transparent">
            <button
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 hover:text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              onClick={closeEditModal}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative z-10 p-0 overflow-y-auto flex-1 hide-scrollbar">
              <HackathonPostForm onSubmit={handleEditSubmit} disabled={!user} initialValues={editingPost} />
            </div>
          </div>
        </div>
      )}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn p-4 sm:p-6">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
            <div className="mb-4 flex flex-col items-center">
              <svg className="w-12 h-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Delete Post?</h2>
              <p className="text-gray-600 text-center">
                Are you sure you want to delete <span className="font-semibold text-red-600">{deleteModal.post?.hackathonName}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
              <button
                className="px-6 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
                onClick={confirmDeletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {applyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn p-4 sm:p-6">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
            <button
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full text-gray-500 hover:text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              onClick={closeApplyModal}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Apply to Hackathon</h2>
            <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">Application functionality coming soon!</p>
            <button
              className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
              onClick={closeApplyModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {messageModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn p-4 sm:p-6">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
            <button
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full text-gray-500 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              onClick={closeMessageModal}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Message User</h2>
            <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">Messaging functionality coming soon!</p>
            <button
              className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
              onClick={closeMessageModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}