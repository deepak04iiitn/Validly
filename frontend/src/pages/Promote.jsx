import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ChartNoAxesCombined, CheckCircle, AlertCircle } from 'lucide-react';
import Form from '../components/promote/Form';
import Browse from '../components/promote/Browse';
import MyPromotions from '../components/promote/MyPromotions';


export default function Promote() {
  const [notification, setNotification] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'browse'
  const [copyNotification, setCopyNotification] = useState(null);
  
  const currentUser = useSelector(state => state.user.currentUser);

  // Fetch all promotion posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/backend/promote/getAllPromotions', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load promotion posts'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    if (!currentUser) {
      setNotification({
        type: 'error',
        message: 'Please login to like posts'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const response = await fetch(`/backend/promote/${postId}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const updatedPost = await response.json();
      
      // Update the posts array with the updated post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      setNotification({
        type: 'error',
        message: 'Failed to like post'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDislike = async (postId) => {
    if (!currentUser) {
      setNotification({
        type: 'error',
        message: 'Please login to dislike posts'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const response = await fetch(`/backend/promote/${postId}/dislike`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to dislike post');
      }

      const updatedPost = await response.json();
      
      // Update the posts array with the updated post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error disliking post:', error);
      setNotification({
        type: 'error',
        message: 'Failed to dislike post'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopyNotification('Link copied to clipboard!');
      setTimeout(() => setCopyNotification(null), 2000);
    } catch (error) {
      setCopyNotification('Failed to copy link');
      setTimeout(() => setCopyNotification(null), 2000);
    }
  };

  return (
    <div className="mt-12 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-8 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 ${
          notification.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {copyNotification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 bg-blue-500 text-white">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{copyNotification}</span>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <ChartNoAxesCombined className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Promote Your Vision
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Share your project, idea, or achievement with our community. 
            Create compelling promotions that capture attention and drive engagement.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/20">
                <button
                onClick={() => setActiveTab('create')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'create'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
                >
                Create Promotion
                </button>
                <button
                onClick={() => setActiveTab('browse')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'browse'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
                >
                Browse Promotions
                </button>
                <button
                onClick={() => setActiveTab('my-promotions')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'my-promotions'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
                >
                My Promotions
                </button>
            </div>
        </div>

        {/* Render Components Based on Active Tab */}
        {activeTab === 'create' && (
          <Form 
            fetchPosts={fetchPosts}
            setNotification={setNotification}
          />
        )}

        {activeTab === 'browse' && (
          <Browse 
            posts={posts}
            loading={loading}
            currentUser={currentUser}
            handleLike={handleLike}
            handleDislike={handleDislike}
            handleCopyLink={handleCopyLink}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'my-promotions' && (
        <MyPromotions 
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            setNotification={setNotification}
        />
        )}

      </div>
    </div>
  );
}