import React, { useState, useRef } from 'react';
import { MessageCircle, User, MapPin, Mail, Linkedin, Github } from 'lucide-react';

function formatJoined(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `Joined: ${date.toLocaleString(undefined, { month: 'long', year: 'numeric' })}`;
}

export default function UserCard({ user, onMessage }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverTimeout = useRef();

  // Popover handlers
  const handleAvatarEnter = () => {
    popoverTimeout.current = setTimeout(() => setPopoverOpen(true), 120);
  };
  const handleAvatarLeave = () => {
    clearTimeout(popoverTimeout.current);
    setPopoverOpen(false);
  };

  return (
    <div className="w-[380px] h-[440px] flex flex-col justify-between break-inside-avoid m-3 rounded-3xl bg-gradient-to-br from-white/90 to-indigo-50/80 shadow-2xl hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.035] transition-all p-8 relative group cursor-pointer border border-slate-100 overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* User Avatar & Profile Peek */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="relative group/avatar"
            onMouseEnter={handleAvatarEnter}
            onMouseLeave={handleAvatarLeave}
            tabIndex={0}
            aria-label="Show profile preview"
          >
            <img
              src={user.profilePicture || 'https://www.pngall.com/wp-content/uploads/5/Profile.png'}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow"
            />
            {/* Profile popover */}
            {popoverOpen && (
              <div className="absolute left-16 top-0 z-20 w-56 bg-white/95 border border-slate-200 rounded-2xl shadow-2xl p-4 animate-fadeIn flex flex-col items-center text-center">
                <img
                  src={user.profilePicture || 'https://www.pngall.com/wp-content/uploads/5/Profile.png'}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow mb-2"
                />
                <div className="font-bold text-slate-800 text-base">{user.fullName || user.username}</div>
                <div className="text-slate-500 text-xs mb-1">{user.role || 'Member'}</div>
                <a href={`/profile/${user._id}`} className="text-blue-600 hover:underline text-xs font-semibold">View Profile</a>
              </div>
            )}
          </div>
          <div className="flex flex-col ml-2">
            <span className="font-bold text-lg text-slate-900">{user.fullName || user.username}</span>
            <span className="text-slate-500 text-xs">{user.role || 'Member'}</span>
          </div>
        </div>
        {/* Location, User Type, Joined Date */}
        <div className="flex flex-wrap gap-3 mb-2 items-center">
          {user.location && (
            <span className="flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              <MapPin className="w-4 h-4" /> {user.location}
            </span>
          )}
          {user.userType && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">{user.userType}</span>
          )}
          {user.createdAt && (
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm">{formatJoined(user.createdAt)}</span>
          )}
        </div>
        {/* Email */}
        {user.email && (
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <a href={`mailto:${user.email}`} className="text-blue-700 hover:underline text-sm font-medium truncate">{user.email}</a>
          </div>
        )}
        {/* Tag Clouds (Skills) */}
        <div className="flex flex-wrap gap-3 mb-3">
          {user.skills && user.skills.map(skill => (
            <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">{skill}</span>
          ))}
        </div>
        {/* Bio */}
        <div className="text-slate-600 text-base mb-2 line-clamp-3 min-h-[3.5rem]">{user.bio}</div>
        {/* Social Links */}
        <div className="flex gap-3 mt-1">
          {user.linkedin && (
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900" title="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {user.github && (
            <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-black" title="GitHub">
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
      {/* Floating Action Icons (Message/View Profile) */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-3 rounded-full bg-white/90 shadow hover:bg-blue-100"
          title="Message"
          aria-label="Message user"
          onClick={() => onMessage && onMessage(user)}
        >
          <MessageCircle className="w-5 h-5 text-blue-600" />
        </button>
        <a href={`/profile/${user._id}`} className="p-3 rounded-full bg-white/90 shadow hover:bg-cyan-100" title="View Profile" aria-label="View profile">
          <User className="w-5 h-5 text-cyan-600" />
        </a>
      </div>
    </div>
  );
} 