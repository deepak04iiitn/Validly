import React from 'react';
import { Edit, Trash2, User, Users, Calendar, MapPin, Plus } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function HackathonCard({ post, user, onEdit, onDelete, onApply }) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const popoverTimeout = React.useRef();
  const isOwner = user && post.user?._id === user._id;
  const statusColors = {
    'Open': 'bg-green-400',
    'Full': 'bg-red-400',
    'In Progress': 'bg-yellow-400',
  };

  // Popover handlers
  const handleAvatarEnter = () => {
    popoverTimeout.current = setTimeout(() => setPopoverOpen(true), 120);
  };
  const handleAvatarLeave = () => {
    clearTimeout(popoverTimeout.current);
    setPopoverOpen(false);
  };

  // Format date range
  const dateRange = post.startDate && post.endDate
    ? `${formatDate(post.startDate)} – ${formatDate(post.endDate)}`
    : '';

  return (
    <div className="w-[380px] h-[440px] flex flex-col justify-between break-inside-avoid m-3 rounded-3xl bg-gradient-to-br from-white/90 to-indigo-50/80 shadow-2xl hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.035] transition-all p-8 relative group cursor-pointer border border-slate-100 overflow-hidden">
      {/* Animated Status Bar */}
      <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${statusColors[post.status] || 'bg-slate-300'} animate-fadeIn`}></div>
      <div className="flex-1 flex flex-col">
        {/* Hackathon Info */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-bold text-2xl text-slate-900 truncate flex-1">{post.hackathonName}</span>
        </div>
        {/* Hackathon Link */}
        {post.hackathonLink && (
          <a
            href={post.hackathonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-violet-700 hover:underline font-semibold mb-2"
          >
            Visit Hackathon
          </a>
        )}
        {/* Timeline Ribbon */}
        {dateRange && (
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-2 text-sm bg-violet-50 text-violet-700 px-4 py-2 rounded-xl font-semibold shadow-sm">
              <Calendar className="w-5 h-5" />
              {dateRange}
            </span>
          </div>
        )}
        <div className="text-slate-700 text-base mb-4 line-clamp-3 min-h-[3.5rem]">{post.description}</div>
        {/* Tag Clouds */}
        <div className="flex flex-wrap gap-3 mb-5">
          {post.skills && post.skills.map(skill => (
            <span key={skill} className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">{skill}</span>
          ))}
          {post.location && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              <MapPin className="w-4 h-4" /> {post.location}
            </span>
          )}
          {typeof post.teammatesRequired === 'number' && (
            <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              <Users className="w-4 h-4" /> {post.teammatesRequired} needed
            </span>
          )}
        </div>
      </div>
      {/* User Avatar & Profile Peek */}
      <div className="flex items-center gap-3 mt-4">
        <div
          className="relative group/avatar"
          onMouseEnter={handleAvatarEnter}
          onMouseLeave={handleAvatarLeave}
          tabIndex={0}
          aria-label="Show profile preview"
        >
          <img
            src={post.user?.profilePicture || 'https://www.pngall.com/wp-content/uploads/5/Profile.png'}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-violet-200 shadow"
          />
          {/* Profile popover */}
          {popoverOpen && (
            <div className="absolute left-16 top-0 z-20 w-56 bg-white/95 border border-slate-200 rounded-2xl shadow-2xl p-4 animate-fadeIn flex flex-col items-center text-center">
              <img
                src={user?.profilePicture || 'https://www.pngall.com/wp-content/uploads/5/Profile.png'}
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover border-2 border-violet-200 shadow mb-2"
              />
              <div className="font-bold text-slate-800 text-base">{post.user?.fullName || post.user?.username || 'User'}</div>
              <div className="text-slate-500 text-xs mb-1">{post.user?.role || 'Member'}</div>
              <a href={`/profile/${post.user?._id || ''}`} className="text-violet-600 hover:underline text-xs font-semibold">View Profile</a>
            </div>
          )}
        </div>
        <div className="flex flex-col ml-2">
          <span className="font-semibold text-slate-800 text-base">{user?.fullName || user?.username || 'User'}</span>
          <a href={`/profile/${post.user?._id || ''}`} className="text-sm text-blue-600 hover:underline">View Profile</a>
        </div>
      </div>
      {/* Floating Action Icons (Edit/Delete/Apply) */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {isOwner && (
          <>
            <button
              className="p-3 rounded-full bg-white/90 shadow hover:bg-violet-100"
              title="Edit"
              aria-label="Edit post"
              onClick={() => onEdit && onEdit(post)}
            >
              <Edit className="w-5 h-5 text-violet-700" />
            </button>
            <button
              className="p-3 rounded-full bg-white/90 shadow hover:bg-red-100"
              title="Delete"
              aria-label="Delete post"
              onClick={() => onDelete && onDelete(post)}
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </>
        )}
        {!isOwner && (
          <button
            className="p-3 rounded-full bg-white/90 shadow hover:bg-green-100"
            title="Apply"
            aria-label="Apply to post"
            onClick={() => onApply && onApply(post)}
          >
            <Plus className="w-5 h-5 text-green-600" />
          </button>
        )}
      </div>
    </div>
  );
} 