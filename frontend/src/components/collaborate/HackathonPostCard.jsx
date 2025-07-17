import React from 'react';
import { Users, Award, Group, MapPin, Calendar, ExternalLink } from 'lucide-react';

export default function HackathonPostCard({ post, currentUser, onEdit, onDelete, showOwnerActions }) {
  const isOwner = currentUser && post.user && post.user._id === currentUser._id;
  return (
    <div
      className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:border-slate-300/80 transition-all duration-500 transform hover:scale-[1.02] animate-fadeIn"
      style={{ margin: '0.5rem', minWidth: 400, maxWidth: 600 }}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-violet-700 truncate">{post.hackathonName}</h2>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${post.status === 'Open' ? 'bg-green-100 text-green-700' : post.status === 'Full' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{post.status}</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <a href={post.hackathonLink} target="_blank" rel="noopener" className="flex items-center text-slate-500 hover:text-violet-600 transition-colors text-xs font-medium cursor-pointer">
            <ExternalLink className="w-4 h-4 mr-1" />
            Official Page
          </a>
        </div>
        <div className="flex items-center space-x-2 mb-2 text-slate-600 text-sm">
          <Group className="w-4 h-4 text-violet-400" />
          <span>{post.teammatesRequired} teammate{post.teammatesRequired > 1 ? 's' : ''} needed</span>
        </div>
        <div className="flex items-center space-x-2 mb-2 text-slate-600 text-sm">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>{post.location}{post.city ? `, ${post.city}` : ''}</span>
        </div>
        <div className="flex items-center space-x-2 mb-2 text-slate-600 text-sm">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>{post.startDate} - {post.endDate}</span>
        </div>
        {post.prize && (
          <div className="flex items-center space-x-2 mb-2 text-yellow-700 text-sm">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">{post.prize}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          {post.skills.map((skill) => (
            <span key={skill} className="px-2 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold shadow-sm">{skill}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm mb-2 line-clamp-3">{post.description}</p>
        <div className="flex items-center space-x-2 mt-6">
          <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover border-2 border-violet-200" />
          <a href={post.userProfile} target="_blank" rel="noopener" className="font-semibold text-slate-700 hover:text-violet-700 transition-colors text-base cursor-pointer">{post.userName}</a>
        </div>
      </div>
      <div className="relative z-10 px-8 pb-6 flex justify-end gap-4">
        {isOwner && showOwnerActions ? (
          <div className="flex w-full gap-4 justify-between">
            <button
              className="flex-1 px-3 py-2 rounded-xl font-semibold border border-blue-500 text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-900 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              onClick={() => onEdit(post)}
            >
              Edit
            </button>
            <button
              className="flex-1 px-3 py-2 rounded-xl font-semibold border border-red-500 text-red-700 bg-white hover:bg-red-50 hover:text-red-900 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
              onClick={() => onDelete(post)}
            >
              Delete
            </button>
            <button
              className="flex-1 px-4 py-2 rounded-xl font-semibold border border-violet-500 text-violet-700 bg-white hover:bg-violet-50 hover:text-violet-900 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
            >
              Request to Join
            </button>
          </div>
        ) : (
          <button
            className="w-full px-4 py-2 rounded-xl font-semibold border border-violet-500 text-violet-700 bg-white hover:bg-violet-50 hover:text-violet-900 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
          >
            Request to Join
          </button>
        )}
      </div>
    </div>
  );
} 