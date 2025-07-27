import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar,
  Save,
  X,
  Plus,
  AlertTriangle
} from 'lucide-react';

// Delete Confirmation Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting, postTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-t-3xl">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white text-center">Delete Promotion</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 text-center mb-2">
            Are you sure you want to delete this promotion?
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <p className="font-semibold text-slate-800 text-center truncate">
              "{postTitle}"
            </p>
          </div>
          <p className="text-sm text-slate-500 text-center mb-6">
            This action cannot be undone. All associated data will be permanently removed.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MyPromotions({ currentUser, setActiveTab, setNotification }) {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    link: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    postId: null,
    postTitle: ''
  });

  // Fetch user's promotions
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/backend/promote/mine', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch your posts');
      }

      const data = await response.json();
      setMyPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load your promotions'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyPosts();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setEditFormData({
      title: post.title,
      description: post.description,
      link: post.link
    });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditFormData({
      title: '',
      description: '',
      link: ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (postId) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/backend/promote/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update promotion');
      }

      const updatedPost = await response.json();
      
      // Update the posts array with the updated post
      setMyPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? updatedPost : post
        )
      );

      setEditingPost(null);
      setEditFormData({
        title: '',
        description: '',
        link: ''
      });

      setNotification({
        type: 'success',
        message: 'Promotion updated successfully!'
      });
      setTimeout(() => setNotification(null), 3000);

    } catch (error) {
      console.error('Error updating post:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to update promotion'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteModal = (postId, postTitle) => {
    setDeleteModal({
      isOpen: true,
      postId,
      postTitle
    });
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({
        isOpen: false,
        postId: null,
        postTitle: ''
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/backend/promote/${deleteModal.postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete promotion');
      }

      // Remove the deleted post from the array
      setMyPosts(prevPosts => prevPosts.filter(post => post._id !== deleteModal.postId));

      setNotification({
        type: 'success',
        message: 'Promotion deleted successfully!'
      });
      setTimeout(() => setNotification(null), 3000);

      // Close modal after successful deletion
      setDeleteModal({
        isOpen: false,
        postId: null,
        postTitle: ''
      });

    } catch (error) {
      console.error('Error deleting post:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to delete promotion'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setNotification({
        type: 'success',
        message: 'Link copied to clipboard!'
      });
      setTimeout(() => setNotification(null), 2000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to copy link'
      });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl mb-6">
          <User className="w-10 h-10 text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Login Required</h3>
        <p className="text-slate-600 mb-8">Please login to view your promotions</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        postTitle={deleteModal.postTitle}
      />

      {/* Stats Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Promotions
            </h2>
            <p className="text-slate-600">Manage and track your promotional content</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{myPosts.length}</div>
              <div className="text-sm text-slate-600">Total Posts</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {myPosts.reduce((total, post) => total + (post.numberOfLikes || 0), 0)}
              </div>
              <div className="text-sm text-slate-600">Total Likes</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
            <button
              onClick={() => setActiveTab('create')}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">Loading your promotions...</span>
          </div>
        </div>
      ) : myPosts.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl mb-6">
            <User className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">No Promotions Yet</h3>
          <p className="text-slate-600 mb-8">Create your first promotion to get started!</p>
          <button
            onClick={() => setActiveTab('create')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            Create First Promotion
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {editingPost === post._id ? (
                // Edit Mode
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Edit Promotion</h3>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        rows="4"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Link</label>
                      <input
                        type="url"
                        name="link"
                        value={editFormData.link}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleUpdate(post._id)}
                        disabled={isUpdating}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/80 text-sm">
                        <Calendar className="w-4 h-4" />
                        Created: {formatDate(post.createdAt)}
                        {post.updatedAt !== post.createdAt && (
                          <span className="ml-4">• Updated: {formatDate(post.updatedAt)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="cursor-pointer p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-200 transform hover:scale-110"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(post._id, post.title)}
                          className="cursor-pointer p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all duration-200 transform hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-4 mb-2">
                      {post.title}
                    </h3>
                  </div>

                  <div className="p-6">
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {post.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-6 p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-2 text-blue-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-semibold">{post.numberOfLikes || 0}</span>
                        <span className="text-sm text-slate-500">likes</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-600">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="font-semibold">{post.numberOfDislikes || 0}</span>
                        <span className="text-sm text-slate-500">dislikes</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl font-semibold text-center hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Project
                      </a>
                      <button 
                        onClick={() => handleCopyLink(post.link)}
                        className="cursor-pointer w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group"
                      >
                        <Share2 className="w-4 h-4 group-hover:text-blue-500" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}