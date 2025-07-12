import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasFailure,
  addIdeaSuccess,
  ideaActionFailure,
  updateIdeaSuccess,
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
import { Plus, X, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, Clock, BarChart3, Lightbulb, Users, Award } from 'lucide-react';

export default function Ideas() {
  const dispatch = useDispatch();
  const { ideas, loading, error } = useSelector(state => state.ideas);
  const user = useSelector(state => state.user.currentUser);
  const [showForm, setShowForm] = useState(false);
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
  const modalRef = useRef();

  // Close modal on overlay click or Escape key
  useEffect(() => {
    if (!showForm) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowForm(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showForm]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && e.target === modalRef.current) {
      setShowForm(false);
    }
  };

  useEffect(() => {
    const fetchIdeas = async () => {
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
    fetchIdeas();
  }, [dispatch]);

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

  // Comment handlers
  const handleAddComment = async (ideaId, text) => {
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) dispatch(addCommentSuccess(data));
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
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}`, {
        method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.ok) dispatch(deleteCommentSuccess(data));
    } catch {}
  };

  const handleDeleteReply = async (ideaId, commentId, replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      const res = await fetch(`/backend/ideas/${ideaId}/comments/${commentId}/replies/${replyId}`, {
        method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.ok) dispatch(deleteReplySuccess(data));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md mt-20 border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Innovation Hub
                </h1>
                <p className="text-slate-600 mt-1">Discover and share groundbreaking ideas</p>
              </div>
            </div>
            {user && (
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                onClick={() => setShowForm(v => !v)}
              >
                {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {showForm ? 'Cancel' : 'Share Idea'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Idea Sharing Form */}
      {showForm && (
        <div
          ref={modalRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden animate-slideUp max-h-[90vh] flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-violet-600 transition-colors z-10"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6 cursor-pointer" />
            </button>
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Award className="w-6 h-6" />
                Share Your Innovation
              </h2>
              <p className="text-violet-100 mt-2">Transform your ideas into reality</p>
            </div>
            <form className="p-8 space-y-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 64px)' }} onSubmit={handleAddIdea}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-700">
                    <TrendingUp className="w-4 h-4" />
                    Problem Statement
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="problem"
                    value={form.problem}
                    onChange={handleFormChange}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 min-h-[80px] resize-y"
                    placeholder="What problem does your idea solve?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-700">
                    <Lightbulb className="w-4 h-4" />
                    Solution
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="solution"
                    value={form.solution}
                    onChange={handleFormChange}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 min-h-[80px] resize-y"
                    placeholder="Describe your innovative solution"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-700">
                    <BarChart3 className="w-4 h-4" />
                    Development Stage
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="stage"
                    value={form.stage}
                    onChange={handleFormChange}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                    placeholder="e.g., Concept, Prototype, MVP"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-700">
                    <ExternalLink className="w-4 h-4" />
                    Reference Link
                  </label>
                  <input
                    name="link"
                    value={form.link}
                    onChange={handleFormChange}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-700">
                    <Clock className="w-4 h-4" />
                    Auto-Delete (days)
                  </label>
                  <input
                    name="autoDeleteAfterDays"
                    value={form.autoDeleteAfterDays}
                    onChange={handleFormChange}
                    type="number"
                    min="1"
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                    placeholder="Optional: Auto-delete after specified days"
                  />
                </div>
                {/* Polls Section */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Community Polls (Optional)
                  </h3>
                  {polls.map((poll, idx) => (
                    <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                      <div className="font-semibold text-slate-700 mb-2">Q: {poll.question}</div>
                      <div className="flex flex-wrap gap-2">
                        {poll.options.map((opt, i) => (
                          <span key={i} className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium cursor-pointer">
                            {opt.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="grid gap-3">
                    <input
                      type="text"
                      placeholder="Enter your poll question"
                      value={pollQuestion}
                      onChange={e => setPollQuestion(e.target.value)}
                      className="border border-slate-200 px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    />
                    {pollOptions.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={e => handlePollOptionChange(idx, e.target.value)}
                        className="border border-slate-200 px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                      />
                    ))}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                        onClick={() => setPollOptions(prev => [...prev, ''])}
                        disabled={pollOptions.length >= 6}
                      >
                        Add Option
                      </button>
                      <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                        onClick={handleAddPoll}
                        disabled={pollOptions.length < 2}
                      >
                        Add Poll
                      </button>
                    </div>
                  </div>
                </div>
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-medium">
                    {formError}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  Share Your Innovation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Ideas List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading innovations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-red-600 font-semibold text-lg">{error}</div>
          </div>
        ) : (
          <div className="space-y-6">
            {ideas.map(idea => (
              <div key={idea._id} className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                {/* Idea Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2 leading-tight">{idea.problem}</h2>
                      <div className="flex items-center gap-4 text-slate-200">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleLike(idea._id)} 
                            className="flex items-center gap-1 hover:text-green-400 transition-colors duration-200 cursor-pointer"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="font-semibold">{idea.numberOfLikes}</span>
                          </button>
                          <button 
                            onClick={() => handleDislike(idea._id)} 
                            className="flex items-center gap-1 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span className="font-semibold">{idea.numberOfDislikes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Idea Content */}
                <div className="p-6 space-y-4">
                  {/* Solution and Development Stage - stack vertically */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600 font-semibold">
                        <Lightbulb className="w-4 h-4" />
                        Solution
                      </div>
                      <p className="text-slate-700 leading-relaxed">{idea.solution}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600 font-semibold">
                        <BarChart3 className="w-4 h-4" />
                        Development Stage
                      </div>
                      <div className="inline-flex items-center bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                        {idea.stage}
                      </div>
                    </div>
                  </div>

                  {idea.link && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-slate-600" />
                      <a 
                        href={idea.link} 
                        className="text-violet-600 hover:text-violet-800 font-medium underline decoration-violet-200 hover:decoration-violet-400 transition-colors duration-200" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Reference
                      </a>
                    </div>
                  )}

                  {/* Remove autoDeleteAfterDays display for security */}
                  {/* {idea.autoDeleteAfterDays && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" />
                      Auto-deletes after {idea.autoDeleteAfterDays} days
                    </div>
                  )} */}

                  {/* Polls */}
                  {idea.polls && idea.polls.length > 0 && (
                    <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Community Polls
                      </h3>
                      {idea.polls.map((poll, idx) => (
                        <div key={poll.pollId || idx} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                          <div className="font-semibold text-slate-700 mb-3">Q: {poll.question}</div>
                          <div className="space-y-2">
                            {poll.options.map((opt, i) => {
                              const userVoted = opt.votes && user && opt.votes.includes(user.id || user._id);
                              return (
                                <div key={opt.optionId || i} className="flex items-center gap-3">
                                  <button
                                    disabled={!user}
                                    className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                      userVoted 
                                        ? 'bg-violet-600 text-white shadow-lg' 
                                        : 'bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                                    } cursor-pointer`}
                                    onClick={() => handleVote(idea._id, poll.pollId, opt.optionId)}
                                  >
                                    {opt.text}
                                  </button>
                                  <span className="text-sm text-slate-500 font-medium min-w-[60px]">
                                    {opt.votes ? opt.votes.length : 0} votes
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comments Section */}
                  {idea.comments && (
                    <div className="border-t border-slate-200 pt-6 mt-6">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5" />
                        Discussion ({idea.comments.length})
                      </h3>
                      {user && (
                        <div className="mb-4">
                          <AddCommentForm onAdd={text => handleAddComment(idea._id, text)} />
                        </div>
                      )}
                      <div className="space-y-4">
                        {idea.comments.map(comment => (
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
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}