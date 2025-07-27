import React from 'react';
import { ExternalLink, ChartNoAxesCombined, Share2, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';

export default function Browse({ 
  posts, 
  loading, 
  currentUser, 
  handleLike, 
  handleDislike, 
  handleCopyLink, 
  setActiveTab 
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Featured Promotions
            </h2>
            <p className="text-slate-600">Discover amazing projects from our community</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{posts.length}</div>
              <div className="text-sm text-slate-600">Total Posts</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {posts.filter(post => new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-slate-600">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">Loading promotions...</span>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl mb-6">
            <ChartNoAxesCombined className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">No Promotions Yet</h3>
          <p className="text-slate-600 mb-8">Be the first to share your amazing project!</p>
          <button
            onClick={() => setActiveTab('create')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            Create First Promotion
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={post._id}
              className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <ChartNoAxesCombined className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-white/80 text-sm font-medium">
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/80 text-xs font-medium">Live</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-100 transition-colors duration-300">
                    {post.title}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <p className="text-slate-600 leading-relaxed line-clamp-3">
                  {truncateText(post.description, 120)}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
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

                {/* Like/Dislike Section */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(post._id)}
                      disabled={!currentUser}
                      className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                        currentUser && post.likes.includes(currentUser._id)
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      } ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.numberOfLikes || 0}</span>
                    </button>
                    
                    <button
                      onClick={() => handleDislike(post._id)}
                      disabled={!currentUser}
                      className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                        currentUser && post.dislikes.includes(currentUser._id)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      } ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.numberOfDislikes || 0}</span>
                    </button>
                  </div>
                  
                  <div className="text-xs text-slate-400 font-medium">
                    #{index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}