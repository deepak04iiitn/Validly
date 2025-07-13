import React from 'react';
import { X, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';

function ReplyItemMy({ reply, ideaId, commentId, user, onEdit, onLike, onDislike, onDelete }) {
  const [editing, setEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(reply.text);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const isOwner = user && (user.id === reply.userId || user._id === reply.userId);
  return (
    <div className="group relative">
      <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm">{user.username}</span>
              <div className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</div>
            </div>
          </div>
          {/* Action menu (visible on hover) */}
          {isOwner && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-1">
                {!editing && (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit reply"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete reply"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Reply content */}
        {editing ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              onEdit(ideaId, commentId, reply.replyId, editText);
              setEditing(false);
            }}
            className="mb-3"
          >
            <div className="relative">
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 text-gray-800 focus:border-violet-500 focus:outline-none transition-colors resize-none text-sm"
                rows={2}
                autoFocus
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium text-sm cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-3 text-gray-800 leading-relaxed text-sm">{reply.text}</div>
        )}
        {/* Engagement bar */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => onLike(ideaId, commentId, reply.replyId)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors group cursor-pointer"
          >
            <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">{reply.likes.length}</span>
          </button>
          <button
            onClick={() => onDislike(ideaId, commentId, reply.replyId)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors group cursor-pointer"
          >
            <ThumbsDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">{reply.dislikes.length}</span>
          </button>
        </div>
      </div>
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
              <h2 className="text-xl font-bold mb-2 text-slate-800">Delete Reply?</h2>
              <p className="text-slate-600 mb-6">Are you sure you want to delete this reply? This action cannot be undone.</p>
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
                    onDelete(ideaId, commentId, reply.replyId);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Connection line to parent comment */}
      <div className="absolute -left-6 top-0 w-6 h-6 border-l-2 border-b-2 border-gray-200 rounded-bl-lg"></div>
    </div>
  );
}

export default ReplyItemMy; 