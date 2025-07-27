import React, { useState } from 'react';
import { Send, Link, FileText, ChartNoAxesCombined, Sparkles } from 'lucide-react';

export default function Form({ fetchPosts, setNotification }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/backend/promote/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create promotion');
      }

      const result = await response.json();
      
      setNotification({
        type: 'success',
        message: 'Your promotion has been submitted successfully!'
      });
      
      setFormData({ title: '', description: '', link: '' });
      // Refresh posts after successful submission
      fetchPosts();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to submit promotion. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.link.trim();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Promotion</h2>
              <p className="text-blue-100">Fill in the details to showcase your work</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-8">
          {/* Title Field */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-slate-700 font-semibold text-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              Title
            </label>
            <div className="relative group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging title for your promotion..."
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 group-hover:border-slate-300"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-slate-700 font-semibold text-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              Description
            </label>
            <div className="relative group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project, its impact, and why people should be interested..."
                rows="6"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 resize-none group-hover:border-slate-300"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Link Field */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-slate-700 font-semibold text-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg">
                <Link className="w-4 h-4 text-white" />
              </div>
              Link
            </label>
            <div className="relative group">
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://your-project-or-portfolio-link.com"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 group-hover:border-slate-300"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="cursor-pointer flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Create Promotion</span>
                  </>
                )}
              </div>
              
              {/* Button shine effect */}
              {isFormValid && !isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <ChartNoAxesCombined className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-800">Showcase Excellence</h3>
          </div>
          <p className="text-slate-600">Highlight your best work and achievements to gain recognition from the community.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-800">Gain Visibility</h3>
          </div>
          <p className="text-slate-600">Increase your project's reach and connect with potential collaborators and supporters.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Link className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-800">Drive Traffic</h3>
          </div>
          <p className="text-slate-600">Direct interested users to your portfolio, project, or any link you want to promote.</p>
        </div>
      </div>
    </div>
  );
}