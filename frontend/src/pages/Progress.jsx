import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchIdeasStart,
  fetchUserIdeasSuccess,
  fetchIdeasFailure,
  updateIdeaSuccess,
  deleteIdeaSuccess,
  ideaActionFailure,
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
// At the top, import Lucide icons used in Ideas.jsx
import { Plus, X, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, Clock, BarChart3, Lightbulb, Users, Award, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import AddCommentForm from '../components/progress/AddCommentForm';
import CommentThread from '../components/progress/CommentThread';
import ReplyItem from '../components/progress/ReplyItem';

export default function Progress() {
  const dispatch = useDispatch();
  const { userIdeas, loading, error } = useSelector(state => state.ideas);
  const user = useSelector(state => state.user.currentUser);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editPolls, setEditPolls] = useState([]);
  const [editError, setEditError] = useState('');
  const [showDeleteIdeaModal, setShowDeleteIdeaModal] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchUserIdeas = async () => {
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
    fetchUserIdeas();
  }, [dispatch, user]);

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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/backend/ideas/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        dispatch(deleteIdeaSuccess(id));
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

  // Comment handlers (same as Ideas page)
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

  // PDF download handler (fetch from backend)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-10">My Ideas (Manage)</h1>
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading your ideas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-red-600 font-semibold text-lg">{error}</div>
          </div>
        ) : (
          <div className="space-y-8">
            {userIdeas.map(idea => (
              <div key={idea._id} className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                
                {editId === idea._id ? (
                  <form className="p-8 space-y-6" onSubmit={e => { e.preventDefault(); handleSaveEdit(idea._id); }}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 font-semibold text-slate-700">
                          <TrendingUp className="w-4 h-4" />
                          Problem Statement
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="problem"
                          value={editForm.problem}
                          onChange={handleEditFormChange}
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
                          value={editForm.solution}
                          onChange={handleEditFormChange}
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
                          value={editForm.stage}
                          onChange={handleEditFormChange}
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
                          value={editForm.link}
                          onChange={handleEditFormChange}
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
                          value={editForm.autoDeleteAfterDays}
                          onChange={handleEditFormChange}
                          type="number"
                          min="1"
                          className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                          placeholder="Optional: Auto-delete after specified days"
                        />
                      </div>
                      {/* Polls Edit */}
                      <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Community Polls
                        </h3>
                        {editPolls.map((poll, pollIdx) => (
                          <div key={poll.pollId || pollIdx} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                            <input
                              type="text"
                              value={poll.question}
                              onChange={e => handleEditPollChange(pollIdx, 'question', e.target.value)}
                              className="border border-slate-200 px-4 py-3 rounded-xl w-full mb-2 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                            />
                            {poll.options.map((opt, optIdx) => (
                              <input
                                key={opt.optionId || optIdx}
                                type="text"
                                value={opt.text}
                                onChange={e => handleEditPollOptionChange(pollIdx, optIdx, e.target.value)}
                                className="border border-slate-200 px-4 py-3 rounded-xl w-full mb-1 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      {editError && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-medium">{editError}</div>}
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition cursor-pointer">Save</button>
                        <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded-2xl font-semibold hover:bg-gray-500 transition cursor-pointer" onClick={() => setEditId(null)}>Cancel</button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white rounded-t-3xl">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-2 leading-tight">{idea.problem}</h2>
                          <div className="flex items-center gap-4 text-slate-200">
                            <button onClick={() => handleEdit(idea)} className="flex items-center gap-2 text-blue-400 hover:text-blue-200 font-semibold transition-colors duration-200 cursor-pointer">
                              <Award className="w-4 h-4" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => { setShowDeleteIdeaModal(true); setIdeaToDelete(idea._id); }}
                              className="flex items-center gap-2 text-red-400 hover:text-red-200 font-semibold transition-colors duration-200 cursor-pointer"
                            >
                              <X className="w-4 h-4" /> Delete
                            </button>
                            <button onClick={() => handleLike(idea._id)} className="flex items-center gap-2 text-green-400 hover:text-green-200 font-semibold transition-colors duration-200 cursor-pointer">
                              <ThumbsUp className="w-4 h-4" /> {idea.numberOfLikes}
                            </button>
                            <button onClick={() => handleDislike(idea._id)} className="flex items-center gap-2 text-red-400 hover:text-red-200 font-semibold transition-colors duration-200 cursor-pointer">
                              <ThumbsDown className="w-4 h-4" /> {idea.numberOfDislikes}
                            </button>

                            {/* Download PDF Button */}
                            <button
                                onClick={() => handleDownloadPDF(idea)}
                                className="cursor-pointer bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
                              >
                                Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
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
                            className="text-violet-600 hover:text-violet-800 font-medium underline decoration-violet-200 hover:decoration-violet-400 transition-colors duration-200 cursor-pointer"
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
                                onDeleteReply={handleDeleteReply}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showDeleteIdeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative animate-slideUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-violet-600 transition-colors cursor-pointer"
              onClick={() => setShowDeleteIdeaModal(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2 text-slate-800">Delete Idea?</h2>
              <p className="text-slate-600 mb-6">Are you sure you want to delete this idea? This action cannot be undone.</p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
                  onClick={() => setShowDeleteIdeaModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:from-red-600 hover:to-pink-600 transition-colors cursor-pointer"
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
    </div>
  );
}
