import React from 'react';
import { X, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import ReplyItemMy from './ReplyItem';

function CommentThreadMy({ comment, ideaId, user, onEdit, onLike, onDislike, onReply, onEditReply, onLikeReply, onDislikeReply, onDelete, onDeleteReply }) {
  const [editing, setEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(comment.text);
  const [replying, setReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const isOwner = user && (user.id === comment.userId || user._id === comment.userId);

  return (
    <div className="group relative">
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-gray-900">{user.username}</span>
              <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
            </div>
          </div>
          {/* Action menu (visible on hover) */}
          {isOwner && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-2">
                {!editing && (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit comment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete comment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Comment content */}
        {editing ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              onEdit(ideaId, comment.commentId, editText);
              setEditing(false);
            }}
            className="mb-4"
          >
            <div className="relative">
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 text-gray-800 focus:border-violet-500 focus:outline-none transition-colors resize-none"
                rows={3}
                autoFocus
              />
            </div>
            <div className="flex gap-3 mt-3">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium cursor-pointer"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-4 text-gray-800 leading-relaxed">{comment.text}</div>
        )}
        {/* Engagement bar */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(ideaId, comment.commentId)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors group cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{comment.likes.length}</span>
            </button>
            <button
              onClick={() => onDislike(ideaId, comment.commentId)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors group cursor-pointer"
            >
              <ThumbsDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{comment.dislikes.length}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {user && !replying && (
              <button
                onClick={() => setReplying(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-full transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="text-sm font-medium">Reply</span>
              </button>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium">
                  {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                </span>
                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {/* Reply form */}
        {replying && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (replyText.trim()) {
                  onReply(ideaId, comment.commentId, replyText);
                  setReplyText('');
                  setReplying(false);
                }
              }}
            >
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-violet-500 focus:outline-none transition-colors resize-none"
                placeholder="Write a thoughtful reply..."
                rows={2}
                autoFocus
              />
              <div className="flex gap-3 mt-3">
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Post Reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplying(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {/* Replies section */}
      {comment.replies && comment.replies.length > 0 && isExpanded && (
        <div className="ml-12 mt-4 space-y-3">
          {comment.replies.map(reply => (
            <ReplyItemMy
              key={reply.replyId}
              reply={reply}
              ideaId={ideaId}
              commentId={comment.commentId}
              user={user}
              onEdit={onEditReply}
              onLike={onLikeReply}
              onDislike={onDislikeReply}
              onDelete={onDeleteReply}
            />
          ))}
        </div>
      )}
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative animate-slideUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-violet-600 transition-colors cursor-pointer"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2 text-slate-800">Delete Comment?</h2>
              <p className="text-slate-600 mb-6">Are you sure you want to delete this comment? This action cannot be undone.</p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:from-red-600 hover:to-pink-600 transition-colors cursor-pointer"
                  onClick={() => {
                    setShowDeleteModal(false);
                    onDelete(ideaId, comment.commentId);
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

export default CommentThreadMy; 