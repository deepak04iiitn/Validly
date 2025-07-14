import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasFailure,
  fetchUserIdeasSuccess,
  addIdeaSuccess,
  updateIdeaSuccess,
  deleteIdeaSuccess,
  addCommentSuccess,
  editCommentSuccess,
  likeCommentSuccess,
  dislikeCommentSuccess,
  addReplySuccess,
  editReplySuccess,
  likeReplySuccess,
  dislikeReplySuccess,
  deleteCommentSuccess,
  deleteReplySuccess,
} from '../redux/ideaSlice';
import AddCommentForm from '../components/ideas/AddCommentForm';
import CommentThread from '../components/ideas/CommentThread';
import AddCommentFormMy from '../components/progress/AddCommentForm';
import CommentThreadMy from '../components/progress/CommentThread';
import { Plus, X, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, Clock, BarChart3, Lightbulb, Users, Award, AlertTriangle, ChevronDown, Sparkles, Zap, AlertCircle, Share2, Search, Filter, SortAsc, SortDesc, Calendar, Heart } from 'lucide-react';

// Development stages configuration
const DEVELOPMENT_STAGES = [
  { value: 'Concept', label: 'Concept', color: 'from-blue-100 to-indigo-100' },
  { value: 'Prototype', label: 'Prototype', color: 'from-yellow-100 to-orange-100' },
  { value: 'MVP', label: 'MVP', color: 'from-green-100 to-emerald-100' },
  { value: 'Beta', label: 'Beta', color: 'from-purple-100 to-violet-100' },
  { value: 'Production', label: 'Production', color: 'from-red-100 to-pink-100' }
];

// Custom CSS animations for premium experience
const premiumStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.5s ease-out;
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .premium-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .glass-effect {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
`;

export default function Ideas() {
  const dispatch = useDispatch();
  const { ideas, userIdeas, loading, error } = useSelector(state => state.ideas);
  const user = useSelector(state => state.user.currentUser);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    problem: '',
    solution: '',
    stage: '',
    link: '',
    autoDeleteAfterDays: '',
    polls: [],
  });
  const [polls, setPolls] = useState([]);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editPolls, setEditPolls] = useState([]);
  const [editError, setEditError] = useState('');
  const [showDeleteIdeaModal, setShowDeleteIdeaModal] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);
  const modalRef = useRef();
  
  // Search and Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'mostLiked', 'mostComments', 'stage'
  const [filterStage, setFilterStage] = useState('all'); // 'all', 'Concept', 'Prototype', 'MVP', 'Beta', 'Production'
  const [showFilters, setShowFilters] = useState(false);
  
  // Comment pagination state
  const [commentPages, setCommentPages] = useState({});
  const [loadingMoreComments, setLoadingMoreComments] = useState({});
  const COMMENTS_PER_PAGE = 5;

  // If user is not signed in, show a beautiful warning
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 p-12 max-w-lg w-full text-center animate-fadeIn">
          <div className="flex flex-col items-center gap-6">
            <div className="p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl mb-4">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Sign In Required</h2>
            <p className="text-slate-600 text-lg">You need to be signed in to view and share ideas.<br/>Please sign in to access the Innovation Hub.</p>
            <a
              href="/sign-in"
              className="inline-block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer mt-4"
            >
              Go to Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all ideas and user ideas
  useEffect(() => {
    const fetchAllIdeas = async () => {
      dispatch(fetchIdeasStart());
      try {
        const res = await fetch('/backend/ideas');
        const data = await res.json();
        if (res.ok) {
          dispatch(fetchIdeasSuccess(data));
        } else {
          dispatch(fetchIdeasFailure(data.error || 'Failed to fetch ideas.'));
        }
      } catch (err) {
        dispatch(fetchIdeasFailure('Failed to fetch ideas.'));
      }
    };

    const fetchUserIdeas = async () => {
      if (!user) return;
      dispatch(fetchIdeasStart());
      try {
        const res = await fetch('/backend/ideas/mine', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          dispatch(fetchUserIdeasSuccess(data));
        } else {
          dispatch(fetchIdeasFailure(data.error || 'Failed to fetch your ideas.'));
        }
      } catch (err) {
        dispatch(fetchIdeasFailure('Failed to fetch your ideas.'));
      }
    };

    fetchAllIdeas();
    fetchUserIdeas();
    // Reset comment pages when fetching new ideas
    resetCommentPages();
  }, [dispatch, user]);

  // Close modal on Escape key or overlay click
  useEffect(() => {
    if (!showForm && !editId && !showDeleteIdeaModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setEditId(null);
        setShowDeleteIdeaModal(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showForm, editId, showDeleteIdeaModal]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && e.target === modalRef.current) {
      setShowForm(false);
      setEditId(null);
      setShowDeleteIdeaModal(false);
    }
  };

  // Form handlers for adding idea
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPoll = () => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) {
      setFormError('Poll question and all options are required.');
      return;
    }
    setPolls(prev => [
      ...prev,
      {
        question: pollQuestion,
        options: pollOptions.map(text => ({ text })),
      },
    ]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setFormError('');
  };

  const handlePollOptionChange = (idx, value) => {
    setPollOptions(prev => prev.map((opt, i) => (i === idx ? value : opt)));
  };

  const handleAddIdea = async e => {
    e.preventDefault();
    setFormError('');
    if (!form.problem || !form.solution || !form.stage) {
      setFormError('Problem, Solution, and Stage are required.');
      return;
    }
    try {
      const res = await fetch('/backend/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, polls }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(addIdeaSuccess(data));
        setShowForm(false);
        setForm({ problem: '', solution: '', stage: '', link: '', autoDeleteAfterDays: '', polls: [] });
        setPolls([]);
      } else {
        setFormError(data.error || 'Failed to add idea.');
      }
    } catch (err) {
      setFormError('Failed to add idea.');
    }
  };

  // Form handlers for editing idea
  const handleEdit = (idea) => {
    setEditId(idea._id);
    setEditForm({
      problem: idea.problem,
      solution: idea.solution,
      stage: idea.stage,
      link: idea.link || '',
      autoDeleteAfterDays: idea.autoDeleteAfterDays || '',
    });
    setEditPolls(idea.polls || []);
    setEditError('');
  };

  const handleEditFormChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditPollChange = (pollIdx, field, value) => {
    setEditPolls(prev => prev.map((poll, idx) => idx === pollIdx ? { ...poll, [field]: value } : poll));
  };

  const handleEditPollOptionChange = (pollIdx, optIdx, value) => {
    setEditPolls(prev => prev.map((poll, idx) => idx === pollIdx ? {
      ...poll,
      options: poll.options.map((opt, i) => i === optIdx ? { ...opt, text: value } : opt)
    } : poll));
  };

  const handleSaveEdit = async (id) => {
    setEditError('');
    try {
      const res = await fetch(`/backend/ideas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...editForm, polls: editPolls }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(updateIdeaSuccess(data));
        setEditId(null);
      } else {
        setEditError(data.error || 'Failed to update idea.');
      }
    } catch (err) {
      setEditError('Failed to update idea.');
    }
  };

  // Delete idea handler
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/backend/ideas/${id}`, {
        MovementMethod: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        dispatch(deleteIdeaSuccess(id));
      }
    } catch {}
  };

  // PDF download handler
  const handleDownloadPDF = async (idea) => {
    try {
      const response = await fetch(`/backend/ideas/${idea._id}/export/pdf`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to download PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `idea-report-${idea._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF.');
    }
  };

  // Like, Dislike, Vote, and Comment handlers
  const handleLike = async (id) => {
    try {
      const res = await fetch(`/backend/ideas/${id}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(updateIdeaSuccess(data));
      }
    } catch {}
  };

  const handleDislike = async (id) => {
    try {
      const res = await fetch(`/backend/ideas/${id}/dislike`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(updateIdeaSuccess(data));
      }
    } catch {}
  };

  const handleVote = async (ideaId, pollId, optionId) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ optionId }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(updateIdeaSuccess(data));
      }
    } catch {}
  };

  const handleAddComment = async (ideaId, text) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(addCommentSuccess(data));
        // Reset comment pages for this idea when a new comment is added
        setCommentPages(prev => ({
          ...prev,
          [ideaId]: 1
        }));
      }
    } catch {}
  };

  const handleEditComment = async (ideaId, commentId, text) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) dispatch(editCommentSuccess(data));
    } catch {}
  };

  const handleLikeComment = async (ideaId, commentId) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}/like`, {
        method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok) dispatch(likeCommentSuccess(data));
    } catch {}
  };

  const handleDislikeComment = async (ideaId, commentId) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}/dislike`, {
        method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok) dispatch(dislikeCommentSuccess(data));
    } catch {}
  };

  const handleAddReply = async (ideaId, commentId, text) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) dispatch(addReplySuccess(data));
    } catch {}
  };

  const handleEditReply = async (ideaId, commentId, replyId, text) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}/replies/${replyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) dispatch(editReplySuccess(data));
    } catch {}
  };

  const handleLikeReply = async (ideaId, commentId, replyId) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}/replies/${replyId}/like`, {
        method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok) dispatch(likeReplySuccess(data));
    } catch {}
  };

  const handleDislikeReply = async (ideaId, commentId, replyId) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}/replies/${replyId}/dislike`, {
        method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok) dispatch(dislikeReplySuccess(data));
    } catch {}
  };

  const handleDeleteComment = async (ideaId, commentId) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}`, {
        method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.ok) dispatch(deleteCommentSuccess(data));
    } catch {}
  };

  const handleDeleteReply = async (ideaId, commentId, replyId) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}/replies/${replyId}`, {
        method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.ok) dispatch(deleteReplySuccess(data));
    } catch {}
  };

  // Comment pagination helpers
  const getVisibleComments = (ideaId) => {
    const page = commentPages[ideaId] || 1;
    const idea = [...ideas, ...userIdeas].find(i => i._id === ideaId);
    if (!idea || !idea.comments) return [];
    return idea.comments.slice(0, page * COMMENTS_PER_PAGE);
  };

  const hasMoreComments = (ideaId) => {
    const idea = [...ideas, ...userIdeas].find(i => i._id === ideaId);
    if (!idea || !idea.comments) return false;
    const currentPage = commentPages[ideaId] || 1;
    return idea.comments.length > currentPage * COMMENTS_PER_PAGE;
  };

  const loadMoreComments = (ideaId) => {
    setLoadingMoreComments(prev => ({ ...prev, [ideaId]: true }));
    // Simulate a small delay for better UX
    setTimeout(() => {
      setCommentPages(prev => ({
        ...prev,
        [ideaId]: (prev[ideaId] || 1) + 1
      }));
      setLoadingMoreComments(prev => ({ ...prev, [ideaId]: false }));
    }, 300);
  };

  const resetCommentPages = () => {
    setCommentPages({});
  };

  // Search and Sort functions
  const filteredAndSortedIdeas = () => {
    let currentIdeas = activeTab === 'all' ? ideas : userIdeas;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      currentIdeas = currentIdeas.filter(idea => 
        idea.problem.toLowerCase().includes(query) ||
        idea.solution.toLowerCase().includes(query) ||
        idea.stage.toLowerCase().includes(query) ||
        (idea.link && idea.link.toLowerCase().includes(query))
      );
    }
    
    // Filter by stage
    if (filterStage !== 'all') {
      currentIdeas = currentIdeas.filter(idea => idea.stage === filterStage);
    }
    
    // Sort ideas
    switch (sortBy) {
      case 'newest':
        currentIdeas = [...currentIdeas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        currentIdeas = [...currentIdeas].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostLiked':
        currentIdeas = [...currentIdeas].sort((a, b) => (b.numberOfLikes || 0) - (a.numberOfLikes || 0));
        break;
      case 'mostComments':
        currentIdeas = [...currentIdeas].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      case 'stage':
        const stageOrder = {};
        DEVELOPMENT_STAGES.forEach((stage, index) => {
          stageOrder[stage.value] = index + 1;
        });
        currentIdeas = [...currentIdeas].sort((a, b) => (stageOrder[a.stage] || 0) - (stageOrder[b.stage] || 0));
        break;
      default:
        break;
    }
    
    return currentIdeas;
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'newest':
      case 'mostLiked':
      case 'mostComments':
        return <SortDesc className="w-4 h-4" />;
      case 'oldest':
        return <SortAsc className="w-4 h-4" />;
      default:
        return <SortAsc className="w-4 h-4" />;
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'newest':
        return 'Newest First';
      case 'oldest':
        return 'Oldest First';
      case 'mostLiked':
        return 'Most Liked';
      case 'mostComments':
        return 'Most Comments';
      case 'stage':
        return 'By Stage';
      default:
        return 'Sort By';
    }
  };

  // Render idea card
  const renderIdeaCard = (idea, isMyIdea = false) => (
    <div key={idea._id} className="group relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:border-slate-300/80 transition-all duration-500 transform hover:scale-[1.02] hover-lift animate-fadeIn">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {editId === idea._id ? (
        <div className="relative z-10 p-8 space-y-8">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 -m-8 mb-8 p-8 rounded-t-3xl">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Award className="w-6 h-6" />
              Edit Your Innovation
            </h3>
            <p className="text-violet-100 mt-2">Refine your idea and make it even better</p>
          </div>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSaveEdit(idea._id); }}>
            <div className="grid gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-semibold text-slate-700 text-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Problem Statement
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="problem"
                  value={editForm.problem}
                  onChange={handleEditFormChange}
                  className="w-full border-2 border-slate-200 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 min-h-[100px] resize-y text-lg"
                  placeholder="What problem does your idea solve?"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-semibold text-slate-700 text-lg">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Solution
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="solution"
                  value={editForm.solution}
                  onChange={handleEditFormChange}
                  className="w-full border-2 border-slate-200 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 min-h-[100px] resize-y text-lg"
                  placeholder="Describe your innovative solution"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-semibold text-slate-700 text-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Development Stage
                  <span className="text-red-500">*</span>
                </label>
                                  <select
                    name="stage"
                    value={editForm.stage}
                    onChange={handleEditFormChange}
                    className="w-full border-2 border-slate-200 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 text-lg font-medium cursor-pointer"
                    required
                  >
                    <option value="">Select development stage</option>
                    {DEVELOPMENT_STAGES.map(stage => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-semibold text-slate-700 text-lg">
                  <ExternalLink className="w-5 h-5 text-green-600" />
                  Reference Link
                </label>
                <input
                  name="link"
                  value={editForm.link}
                  onChange={handleEditFormChange}
                  className="w-full border-2 border-slate-200 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 text-lg"
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-semibold text-slate-700 text-lg">
                  <Clock className="w-5 h-5 text-slate-600" />
                  Auto-Delete (days)
                </label>
                <input
                  name="autoDeleteAfterDays"
                  value={editForm.autoDeleteAfterDays}
                  onChange={handleEditFormChange}
                  type="number"
                  min="1"
                  className="w-full border-2 border-slate-200 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 text-lg"
                  placeholder="Optional: Auto-delete after specified days"
                />
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border-2 border-slate-200 rounded-3xl p-8 space-y-6">
                <h3 className="font-bold text-slate-800 text-xl flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Community Polls
                </h3>
                {editPolls.map((poll, pollIdx) => (
                  <div key={poll.pollId || pollIdx} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
                    <input
                      type="text"
                      value={poll.question}
                      onChange={e => handleEditPollChange(pollIdx, 'question', e.target.value)}
                      className="border-2 border-slate-200 px-4 py-3 rounded-xl w-full mb-4 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 text-lg"
                      placeholder="Enter poll question"
                    />
                    {poll.options.map((opt, optIdx) => (
                      <input
                        key={opt.optionId || optIdx}
                        type="text"
                        value={opt.text}
                        onChange={e => handleEditPollOptionChange(pollIdx, optIdx, e.target.value)}
                        className="border-2 border-slate-200 px-4 py-3 rounded-xl w-full mb-2 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300"
                        placeholder={`Option ${optIdx + 1}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {editError && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 text-red-700 font-medium text-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {editError}
                </div>
              </div>
            )}
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                className="flex-1 bg-gradient-to-r from-slate-400 to-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-slate-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer" 
                onClick={() => setEditId(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative z-10">
          {/* Premium Header */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white rounded-t-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative space-y-6">
              {/* Problem Statement */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold leading-tight text-white mb-3">
                    {idea.problem}
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-slate-200">
                    <button 
                      onClick={() => handleLike(idea._id)} 
                      className="group flex items-center gap-2 hover:text-green-400 transition-all duration-300 cursor-pointer"
                    >
                      <div className="p-2 bg-white/10 rounded-xl group-hover:bg-green-500/20 transition-all duration-300">
                        <ThumbsUp className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-lg">{idea.numberOfLikes}</span>
                    </button>
                    <button 
                      onClick={() => handleDislike(idea._id)} 
                      className="group flex items-center gap-2 hover:text-red-400 transition-all duration-300 cursor-pointer"
                    >
                      <div className="p-2 bg-white/10 rounded-xl group-hover:bg-red-500/20 transition-all duration-300">
                        <ThumbsDown className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-lg">{idea.numberOfDislikes}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Only for My Ideas */}
              {isMyIdea && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20">
                  <button 
                    onClick={() => handleEdit(idea)} 
                    className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  >
                    <Award className="w-4 h-4" /> 
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowDeleteIdeaModal(true); setIdeaToDelete(idea._id); }}
                    className="group flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  >
                    <X className="w-4 h-4" /> 
                    Delete
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(idea)}
                    className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {/* Solution Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700 font-bold text-xl">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  Solution
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-6 border-2 border-slate-100">
                  <p className="text-slate-700 leading-relaxed text-lg">{idea.solution}</p>
                </div>
              </div>
              
              {/* Stage Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700 font-bold text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  Development Stage
                </div>
                <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-6 py-3 rounded-2xl text-lg font-bold border-2 border-violet-200">
                  {idea.stage}
                </div>
              </div>
            </div>

            {/* Reference Link */}
            {idea.link && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <ExternalLink className="w-5 h-5 text-green-600" />
                  </div>
                  <a 
                    href={idea.link} 
                    className="text-green-700 hover:text-green-800 font-bold text-lg underline decoration-green-300 hover:decoration-green-500 transition-all duration-300 cursor-pointer"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Reference Link
                  </a>
                </div>
              </div>
            )}

            {/* Community Polls */}
            {idea.polls && idea.polls.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-indigo-100 space-y-6">
                <h3 className="font-bold text-slate-800 text-2xl flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  Community Polls
                </h3>
                <div className="space-y-6">
                  {idea.polls.map((poll, idx) => (
                    <div key={poll.pollId || idx} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-200 shadow-lg">
                      <div className="font-bold text-slate-700 text-lg mb-4 flex items-center gap-2">
                        <span className="text-indigo-600">Q:</span> {poll.question}
                      </div>
                      <div className="space-y-3">
                        {poll.options.map((opt, i) => {
                          const userVoted = opt.votes && user && opt.votes.includes(user.id || user._id);
                          const voteCount = opt.votes ? opt.votes.length : 0;
                          const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes ? option.votes.length : 0), 0);
                          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                          
                          return (
                            <div key={opt.optionId || i} className="space-y-2">
                              <button
                                disabled={!user}
                                className={`w-full relative overflow-hidden rounded-2xl p-4 font-semibold text-left transition-all duration-300 ${
                                  userVoted 
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl transform scale-105' 
                                    : 'bg-white border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
                                } cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                onClick={() => handleVote(idea._id, poll.pollId, opt.optionId)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-lg">{opt.text}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold">
                                      {voteCount} votes ({percentage}%)
                                    </span>
                                    {userVoted && (
                                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {userVoted && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full animate-pulse"></div>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            {idea.comments && (
              <div className="border-t-2 border-slate-200 pt-8 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 text-2xl flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-100 to-gray-100 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-slate-600" />
                    </div>
                    Discussion
                  </h3>
                  <div className="bg-gradient-to-r from-slate-100 to-gray-100 px-4 py-2 rounded-2xl">
                    <span className="font-bold text-slate-700">{idea.comments.length} comments</span>
                  </div>
                </div>
                
                {user && (
                  <div className="mb-6">
                    {isMyIdea ? (
                      <AddCommentFormMy onAdd={text => handleAddComment(idea._id, text)} />
                    ) : (
                      <AddCommentForm onAdd={text => handleAddComment(idea._id, text)} />
                    )}
                  </div>
                )}
                
                <div className="space-y-6">
                  {getVisibleComments(idea._id).map(comment => (
                    isMyIdea ? (
                      <CommentThreadMy
                        key={comment.commentId}
                        comment={comment}
                        ideaId={idea._id}
                        user={user}
                        onEdit={handleEditComment}
                        onLike={handleLikeComment}
                        onDislike={handleDislikeComment}
                        onReply={handleAddReply}
                        onEditReply={handleEditReply}
                        onLikeReply={handleLikeReply}
                        onDislikeReply={handleDislikeReply}
                        onDelete={handleDeleteComment}
                        onDeleteReply={handleDeleteReply}
                      />
                    ) : (
                      <CommentThread
                        key={comment.commentId}
                        comment={comment}
                        ideaId={idea._id}
                        user={user}
                        onEdit={handleEditComment}
                        onLike={handleLikeComment}
                        onDislike={handleDislikeComment}
                        onReply={handleAddReply}
                        onEditReply={handleEditReply}
                        onLikeReply={handleLikeReply}
                        onDislikeReply={handleDislikeReply}
                        onDelete={handleDeleteComment}
                        onDeleteReply={handleDeleteReply}
                      />
                    )
                  ))}
                </div>
                
                {hasMoreComments(idea._id) && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => loadMoreComments(idea._id)}
                      disabled={loadingMoreComments[idea._id]}
                      className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      {loadingMoreComments[idea._id] ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                          <span className="relative z-10">Loading...</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-6 h-6 relative z-10" />
                          <span className="relative z-10">Load More Comments</span>
                          <span className="text-sm opacity-90 relative z-10">
                            ({idea.comments.length - getVisibleComments(idea._id).length} remaining)
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{premiumStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col lg:flex-row">
          {/* Premium Sidebar (Sticky) */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <div className="relative bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl animate-fadeIn rounded-tr-3xl rounded-br-3xl min-h-[calc(100vh-80px)]">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-blue-50/20 to-indigo-50/30 rounded-tr-3xl rounded-br-3xl"></div>
                <div className="relative p-8 space-y-8 h-full">
                  {/* Mobile Close Button (hidden on desktop) */}
                  <div className="lg:hidden absolute top-4 right-4">
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-xl text-slate-400 hover:text-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Logo & Title */}
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <div className="p-4 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl animate-float">
                        <Lightbulb className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                        Innovation Hub
                      </h1>
                      <p className="text-slate-600 text-sm font-medium mt-2">
                        Discover & share ideas
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-6 border border-slate-200/50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Lightbulb className="w-4 h-4 text-violet-500" />
                          <span className="font-semibold">All Ideas</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{ideas.length}</span>
                      </div>
                      {user && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Award className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">My Ideas</span>
                          </div>
                          <span className="text-2xl font-bold text-slate-800">{userIdeas.length}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {user && (
                    <div className="space-y-4">
                      <button
                        className="group relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer overflow-hidden"
                        onClick={() => setShowForm(true)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <Share2 className="w-5 h-5" />
                          Share Idea
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Navigation Tabs */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Browse Ideas</h3>
                    <div className="space-y-2">
                      <button
                        className={`w-full relative px-4 py-3 rounded-xl font-semibold text-left transition-all duration-300 cursor-pointer ${
                          activeTab === 'all' 
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105' 
                            : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                        }`}
                        onClick={() => {
                          setActiveTab('all');
                          resetCommentPages();
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          <Lightbulb className="w-5 h-5" />
                          All Ideas
                        </span>
                        {activeTab === 'all' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl animate-pulse"></div>
                        )}
                      </button>
                      {user && (
                        <button
                          className={`w-full relative px-4 py-3 rounded-xl font-semibold text-left transition-all duration-300 cursor-pointer ${
                            activeTab === 'my' 
                              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105' 
                              : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                          }`}
                          onClick={() => {
                            setActiveTab('my');
                            resetCommentPages();
                          }}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            <Award className="w-5 h-5" />
                            My Ideas
                          </span>
                          {activeTab === 'my' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl animate-pulse"></div>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  

                  {/* Footer */}
                  <div className="pt-8 border-t border-slate-200/50">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-slate-500 font-medium">Innovation Hub v2.0</p>
                      <p className="text-xs text-slate-400">Powered by creativity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Toggle and Overlay (unchanged) */}
          <div className="lg:hidden fixed top-24 left-4 z-40">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/60 text-slate-600 hover:text-violet-600 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
          {/* Mobile Sidebar (unchanged, still fixed for mobile) */}
          <div className={`lg:hidden fixed left-0 top-20 bottom-0 w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl animate-fadeIn overflow-hidden transition-transform duration-300 z-30 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-blue-50/20 to-indigo-50/30"></div>
            <div className="relative p-8 space-y-8 h-full overflow-y-auto">
              {/* Mobile Close Button */}
              <div className="lg:hidden absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-xl text-slate-400 hover:text-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Logo & Title */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="p-4 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl animate-float">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                    Innovation Hub
                  </h1>
                  <p className="text-slate-600 text-sm font-medium mt-2">
                    Discover & share ideas
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-6 border border-slate-200/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Lightbulb className="w-4 h-4 text-violet-500" />
                      <span className="font-semibold">All Ideas</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-800">{ideas.length}</span>
                  </div>
                  {user && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">My Ideas</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-800">{userIdeas.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {user && (
                <div className="space-y-4">
                  <button
                    className="group relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer overflow-hidden"
                    onClick={() => setShowForm(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Share2 className="w-5 h-5" />
                      Share Idea
                    </span>
                  </button>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Browse Ideas</h3>
                <div className="space-y-2">
                  <button
                    className={`w-full relative px-4 py-3 rounded-xl font-semibold text-left transition-all duration-300 cursor-pointer ${
                      activeTab === 'all' 
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105' 
                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                    }`}
                    onClick={() => {
                      setActiveTab('all');
                      resetCommentPages();
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Lightbulb className="w-5 h-5" />
                      All Ideas
                    </span>
                    {activeTab === 'all' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl animate-pulse"></div>
                    )}
                  </button>
                  {user && (
                    <button
                      className={`w-full relative px-4 py-3 rounded-xl font-semibold text-left transition-all duration-300 cursor-pointer ${
                        activeTab === 'my' 
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105' 
                          : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                      }`}
                      onClick={() => {
                        setActiveTab('my');
                        resetCommentPages();
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <Award className="w-5 h-5" />
                        My Ideas
                      </span>
                      {activeTab === 'my' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl animate-pulse"></div>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-slate-200/50">
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">Innovation Hub v2.0</p>
                  <p className="text-xs text-slate-400">Powered by creativity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Ideas List Container */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 pb-32">
              {/* Search and Filter Bar */}
              <div className="mb-8 space-y-6 mt-10">
                {/* Search Bar */}
                <div className="relative sm:ml-0 ml-12">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search ideas by problem, solution, stage, or link..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/95 backdrop-blur-xl border-2 border-slate-200 rounded-2xl text-lg font-medium placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 shadow-lg hover:shadow-xl"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-violet-600 transition-colors duration-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer ${
                      showFilters || filterStage !== 'all'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                        : 'bg-white/95 backdrop-blur-xl border-2 border-slate-200 text-slate-700 hover:border-violet-300'
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                    {(filterStage !== 'all') && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative flex-1 sm:flex-none">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-full sm:w-auto flex items-center justify-between gap-3 px-6 py-4 bg-white/95 backdrop-blur-xl border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-700 hover:border-violet-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {getSortIcon()}
                        {getSortLabel()}
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Clear Filters */}
                  {(searchQuery || filterStage !== 'all' || sortBy !== 'newest') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterStage('all');
                        setSortBy('newest');
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
                  <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200 rounded-3xl p-6 shadow-xl animate-slideUp">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Sort Options */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                          <SortAsc className="w-5 h-5 text-violet-600" />
                          Sort By
                        </h3>
                        <div className="space-y-2">
                          {[
                            { value: 'newest', label: 'Newest First', icon: <Calendar className="w-4 h-4" /> },
                            { value: 'oldest', label: 'Oldest First', icon: <Calendar className="w-4 h-4" /> },
                            { value: 'mostLiked', label: 'Most Liked', icon: <Heart className="w-4 h-4" /> },
                            { value: 'mostComments', label: 'Most Comments', icon: <MessageSquare className="w-4 h-4" /> },
                            { value: 'stage', label: 'By Stage', icon: <BarChart3 className="w-4 h-4" /> }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSortBy(option.value)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-left transition-all duration-300 cursor-pointer ${
                                sortBy === option.value
                                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105'
                                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                              }`}
                            >
                              {option.icon}
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stage Filter */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          Filter by Stage
                        </h3>
                        <div className="space-y-2">
                          {[
                            { value: 'all', label: 'All Stages', color: 'from-slate-100 to-gray-100' },
                            ...DEVELOPMENT_STAGES
                          ].map((stage) => (
                            <button
                              key={stage.value}
                              onClick={() => setFilterStage(stage.value)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-left transition-all duration-300 cursor-pointer ${
                                filterStage === stage.value
                                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105'
                                  : `bg-gradient-to-r ${stage.color} text-slate-700 hover:bg-white/80`
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full ${
                                filterStage === stage.value ? 'bg-white' : 'bg-slate-400'
                              }`}></div>
                              {stage.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Search Stats */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          Results
                        </h3>
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 font-semibold">Total Ideas:</span>
                              <span className="text-2xl font-bold text-slate-800">
                                {(activeTab === 'all' ? ideas : userIdeas).length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 font-semibold">Filtered:</span>
                              <span className="text-2xl font-bold text-violet-600">
                                {filteredAndSortedIdeas().length}
                              </span>
                            </div>
                            {(searchQuery || filterStage !== 'all') && (
                              <div className="pt-2 border-t border-slate-200">
                                <div className="text-sm text-slate-500">
                                  {searchQuery && <div>Searching for: "{searchQuery}"</div>}
                                  {filterStage !== 'all' && <div>Stage: {filterStage}</div>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {loading ? (
                <div className="text-center py-20">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-violet-200 rounded-full animate-spin">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-violet-600 rounded-full animate-spin"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-violet-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-8 text-slate-600 font-bold text-xl">Loading innovations...</p>
                  <p className="mt-2 text-slate-500 text-lg">Discovering amazing ideas from the community</p>
                </div>
              ) : error ? (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                  <div className="p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl inline-block mb-6">
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-700 mb-4">Oops! Something went wrong</h3>
                  <p className="text-red-600 text-lg leading-relaxed">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredAndSortedIdeas().length === 0 ? (
                <div className="text-center py-20">
                  <div className="p-8 bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl inline-block mb-8">
                    <Lightbulb className="w-20 h-20 text-slate-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-700 mb-4">
                    {searchQuery || filterStage !== 'all' ? 'No Matching Ideas' : (activeTab === 'all' ? 'No Ideas Yet' : 'No Ideas Created')}
                  </h3>
                  <p className="text-slate-600 text-xl leading-relaxed max-w-2xl mx-auto mb-8">
                    {searchQuery || filterStage !== 'all' 
                      ? 'Try adjusting your search terms or filters to find more ideas.'
                      : (activeTab === 'all' 
                        ? 'Be the first to share an innovative idea and inspire the community!' 
                        : 'Start your innovation journey by sharing your first idea with the community.'
                      )
                    }
                  </p>
                  {user && activeTab === 'all' && !searchQuery && filterStage === 'all' && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <Sparkles className="w-6 h-6 relative z-10" />
                      <span className="relative z-10">Share Your First Idea</span>
                    </button>
                  )}
                  {(searchQuery || filterStage !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterStage('all');
                        setSortBy('newest');
                      }}
                      className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-slate-500 to-gray-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-slate-600 hover:to-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                      <span>Clear Filters</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-10 space-y-8 lg:space-y-12">
                  
                  {/* Search Results Summary */}
                  {(searchQuery || filterStage !== 'all' || sortBy !== 'newest') && (
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-100 rounded-3xl p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl">
                            <Search className="w-5 h-5 text-violet-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg">
                              Showing {filteredAndSortedIdeas().length} of {(activeTab === 'all' ? ideas : userIdeas).length} ideas
                            </h3>
                            <p className="text-slate-600 text-sm">
                              {searchQuery && `Searching for: "${searchQuery}"`}
                              {searchQuery && filterStage !== 'all' && ' • '}
                              {filterStage !== 'all' && `Stage: ${filterStage}`}
                              {(searchQuery || filterStage !== 'all') && ' • '}
                              {getSortLabel()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setFilterStage('all');
                            setSortBy('newest');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-slate-600 hover:text-violet-600 transition-all duration-300 font-semibold"
                        >
                          <X className="w-4 h-4" />
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Ideas Grid */}
                  <div className="grid gap-8 lg:gap-12">
                    {filteredAndSortedIdeas().map(idea => renderIdeaCard(idea, activeTab === 'my'))}
                  </div>
                  
                  {/* End Message */}
                  <div className="text-center py-12">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-4 rounded-2xl border-2 border-violet-100">
                      <Sparkles className="w-5 h-5 text-violet-600" />
                      <span className="font-bold text-slate-700 text-lg">
                        {searchQuery || filterStage !== 'all' 
                          ? `You've reached the end of ${filteredAndSortedIdeas().length} filtered ideas!`
                          : (activeTab === 'all' 
                            ? 'You\'ve reached the end of all ideas!' 
                            : 'You\'ve reached the end of your ideas!'
                          )
                        }
                      </span>
                    </div>
                    {activeTab === 'all' && user && !searchQuery && filterStage === 'all' && (
                      <p className="mt-4 text-slate-600 text-lg">
                        Ready to share your own innovation? 
                        <button
                          onClick={() => setShowForm(true)}
                          className="ml-2 text-violet-600 hover:text-violet-800 font-bold underline decoration-violet-300 hover:decoration-violet-500 transition-all duration-300 cursor-pointer"
                        >
                          Create your first idea
                        </button>
                      </p>
                    )}
                    {(searchQuery || filterStage !== 'all') && (
                      <p className="mt-4 text-slate-600 text-lg">
                        Want to see all ideas? 
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setFilterStage('all');
                            setSortBy('newest');
                          }}
                          className="ml-2 text-violet-600 hover:text-violet-800 font-bold underline decoration-violet-300 hover:decoration-violet-500 transition-all duration-300 cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Premium Share Idea Modal */}
      {showForm && (
        <div
          ref={modalRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn"
        >
          <div className="relative w-full max-w-4xl mx-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden animate-slideUp max-h-[95vh] flex flex-col">
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-2xl text-slate-400 hover:text-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Premium Header */}
            <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 sm:p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full animate-pulse"></div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-24 translate-x-24"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl">
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                      Share Your Innovation
                    </h2>
                    <p className="text-violet-100 mt-2 text-lg font-medium">
                      Transform your ideas into reality and inspire the community
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Content */}
            <form className="p-8 sm:p-12 space-y-8 overflow-y-auto flex-1" style={{ maxHeight: 'calc(95vh - 200px)' }} onSubmit={handleAddIdea}>
              <div className="space-y-8">
                {/* Problem Statement */}
                <div className="space-y-4">
                  <label className="flex items-center gap-3 font-bold text-slate-700 text-xl">
                    <div className="p-2 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    Problem Statement
                    <span className="text-red-500 text-2xl">*</span>
                  </label>
                  <textarea
                    name="problem"
                    value={form.problem}
                    onChange={handleFormChange}
                    className="w-full border-2 border-slate-200 px-8 py-6 rounded-3xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 min-h-[120px] resize-y text-lg font-medium"
                    placeholder="What problem does your idea solve? Describe the challenge in short you're addressing..."
                    required
                  />
                </div>
                
                {/* Solution */}
                <div className="space-y-4">
                  <label className="flex items-center gap-3 font-bold text-slate-700 text-xl">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl">
                      <Lightbulb className="w-6 h-6 text-amber-600" />
                    </div>
                    Solution
                    <span className="text-red-500 text-2xl">*</span>
                  </label>
                  <textarea
                    name="solution"
                    value={form.solution}
                    onChange={handleFormChange}
                    className="w-full border-2 border-slate-200 px-8 py-6 rounded-3xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 min-h-[120px] resize-y text-lg font-medium"
                    placeholder="Describe your innovative solution and how it addresses the problem..."
                    required
                  />
                </div>
                
                {/* Development Stage */}
                <div className="space-y-4">
                  <label className="flex items-center gap-3 font-bold text-slate-700 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    Development Stage
                    <span className="text-red-500 text-2xl">*</span>
                  </label>
                  <select
                    name="stage"
                    value={form.stage}
                    onChange={handleFormChange}
                    className="w-full border-2 border-slate-200 px-8 py-6 rounded-3xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 text-lg font-medium cursor-pointer"
                    required
                  >
                    <option value="">Select development stage</option>
                    {DEVELOPMENT_STAGES.map(stage => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Reference Link */}
                <div className="space-y-4">
                  <label className="flex items-center gap-3 font-bold text-slate-700 text-xl">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                      <ExternalLink className="w-6 h-6 text-green-600" />
                    </div>
                    Reference Link
                  </label>
                  <input
                    name="link"
                    value={form.link}
                    onChange={handleFormChange}
                    className="w-full border-2 border-slate-200 px-8 py-6 rounded-3xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 text-lg font-medium"
                    placeholder="https://example.com (optional)"
                  />
                </div>
                
                {/* Auto-Delete */}
                <div className="space-y-4">
                  <label className="flex items-center gap-3 font-bold text-slate-700 text-xl">
                    <div className="p-2 bg-gradient-to-br from-slate-100 to-gray-100 rounded-xl">
                      <Clock className="w-6 h-6 text-slate-600" />
                    </div>
                    Auto-Delete (days)
                  </label>
                  <input
                    name="autoDeleteAfterDays"
                    value={form.autoDeleteAfterDays}
                    onChange={handleFormChange}
                    type="number"
                    min="1"
                    className="w-full border-2 border-slate-200 px-8 py-6 rounded-3xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-slate-300 text-lg font-medium"
                    placeholder="Optional: Auto-delete after specified days"
                  />
                </div>
                
                {/* Community Polls */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-3xl p-8 space-y-6">
                  <h3 className="font-bold text-slate-800 text-2xl flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl">
                      <Users className="w-7 h-7 text-indigo-600" />
                    </div>
                    Community Polls (Optional)
                  </h3>
                  
                  {/* Existing Polls */}
                  {polls.map((poll, idx) => (
                    <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-200 shadow-lg">
                      <div className="font-bold text-slate-700 text-lg mb-4 flex items-center gap-2">
                        <span className="text-indigo-600">Q:</span> {poll.question}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {poll.options.map((opt, i) => (
                          <span key={i} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-200">
                            {opt.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Poll */}
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <input
                        type="text"
                        placeholder="Enter your poll question"
                        value={pollQuestion}
                        onChange={e => setPollQuestion(e.target.value)}
                        className="border-2 border-indigo-200 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg font-medium"
                      />
                      {pollOptions.map((opt, idx) => (
                        <input
                          key={idx}
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={e => handlePollOptionChange(idx, e.target.value)}
                          className="border-2 border-indigo-200 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg font-medium"
                        />
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        onClick={() => setPollOptions(prev => [...prev, ''])}
                        disabled={pollOptions.length >= 6}
                      >
                        Add Option
                      </button>
                      <button
                        type="button"
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        onClick={handleAddPoll}
                        disabled={pollOptions.length < 2}
                      >
                        Add Poll
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Error Message */}
                {formError && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 text-red-700 font-bold text-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6" />
                      {formError}
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-8 py-6 rounded-3xl font-bold text-xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Share2 className="w-6 h-6" />
                    Share Your Innovation
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Delete Idea Modal */}
      {showDeleteIdeaModal && (
        <div
          ref={modalRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fadeIn"
        >
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full mx-4 animate-slideUp overflow-hidden">
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-2xl text-slate-400 hover:text-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
              onClick={() => setShowDeleteIdeaModal(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Delete Idea?</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Are you sure you want to delete this idea? This action cannot be undone and all associated data will be permanently removed.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  className="flex-1 bg-gradient-to-r from-slate-400 to-gray-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-slate-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  onClick={() => setShowDeleteIdeaModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  onClick={() => {
                    setShowDeleteIdeaModal(false);
                    if (ideaToDelete) handleDelete(ideaToDelete);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}