import React, { useState, useEffect } from 'react';
import { Users, UserPlus, X, Plus, User, Award } from 'lucide-react';

export default function FloatingActionPanel({ activeFeature, setActiveFeature, filters, setFilters, sort, setSort, user, onCreate }) {
  const [open, setOpen] = useState(false);

  // Set hackathon as default when panel opens for the first time
  useEffect(() => {
    if (open && activeFeature !== 'hackathon' && activeFeature !== 'founder') {
      setActiveFeature('hackathon');
    }
  }, [open, setActiveFeature]);

  // Example filter options
  const hackathonStatuses = ['Open', 'Full', 'In Progress'];
  const hackathonLocations = ['Online', 'Offline', 'Hybrid'];
  const founderRoles = ['Founder', 'Co-Founder', 'Hustler'];
  const founderTypes = ['Student', 'Working Professional'];

  return (
    <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-50 flex flex-col items-end">
      {/* Floating Action Button */}
      {!open && (
        <button
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:scale-110 transition-transform cursor-pointer"
          onClick={() => setOpen(true)}
          aria-label="Open actions"
        >
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        </button>
      )}
      {/* Glassmorphic Panel */}
      {open && (
        <div className="relative w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 animate-fadeIn">
          {/* Close Button */}
          <button
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 bg-white/80 rounded-full text-slate-400 hover:text-violet-600 shadow-lg hover:scale-110 transition-all cursor-pointer"
            onClick={() => setOpen(false)}
            aria-label="Close panel"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          {/* Feature Switch */}
          <div className="flex gap-2 mb-2">
            <button
              className={`flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${activeFeature === 'hackathon' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow' : 'text-slate-700 hover:bg-violet-50'}`}
              onClick={() => setActiveFeature('hackathon')}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Hackathons</span><span className="sm:hidden">Hacks</span>
            </button>
            <button
              className={`flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${activeFeature === 'founder' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow' : 'text-slate-700 hover:bg-blue-50'}`}
              onClick={() => setActiveFeature('founder')}
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Founders</span><span className="sm:hidden">Founders</span>
            </button>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {activeFeature === 'hackathon' ? (
              <>
                {hackathonStatuses.map(status => (
                  <button
                    key={status}
                    className={`px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm cursor-pointer ${filters.status === status ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    onClick={() => setFilters(f => ({ ...f, status }))}
                  >
                    {status}
                  </button>
                ))}
                {hackathonLocations.map(loc => (
                  <button
                    key={loc}
                    className={`px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm cursor-pointer ${filters.location === loc ? 'bg-violet-400 text-white' : 'bg-slate-100 text-slate-700'}`}
                    onClick={() => setFilters(f => ({ ...f, location: loc }))}
                  >
                    {loc}
                  </button>
                ))}
              </>
            ) : (
              <>
                {founderRoles.map(role => (
                  <button
                    key={role}
                    className={`px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm cursor-pointer ${filters.role === role ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    onClick={() => setFilters(f => ({ ...f, role }))}
                  >
                    {role}
                  </button>
                ))}
                {founderTypes.map(type => (
                  <button
                    key={type}
                    className={`px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm cursor-pointer ${filters.type === type ? 'bg-cyan-400 text-white' : 'bg-slate-100 text-slate-700'}`}
                    onClick={() => setFilters(f => ({ ...f, type }))}
                  >
                    {type}
                  </button>
                ))}
              </>
            )}
          </div>
          {/* Start/End Date Filters for Hackathons */}
          {activeFeature === 'hackathon' && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="font-semibold text-slate-700 text-sm">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
                className="w-full border-2 border-slate-200 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-white/80 text-sm sm:text-base cursor-pointer"
              />
              <label className="font-semibold text-slate-700 text-sm mt-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
                className="w-full border-2 border-slate-200 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-white/80 text-sm sm:text-base cursor-pointer"
              />
            </div>
          )}
          {/* Sort Dropdown */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1 text-sm sm:text-base">Sort by</label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white/80 text-sm sm:text-base focus:ring-2 focus:ring-violet-400"
            >
              {activeFeature === 'hackathon' ? (
                <>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="soonest">Soonest Start Date</option>
                  <option value="teammates">Most Teammates Required</option>
                </>
              ) : (
                <>
                  <option value="recent">Recently Joined</option>
                  <option value="nameaz">Name A-Z</option>
                  <option value="nameza">Name Z-A</option>
                </>
              )}
            </select>
          </div>
          
          {/* Post Hackathon Button */}
          {activeFeature === 'hackathon' && (
            <button
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={onCreate}
              aria-label="Post Hackathon"
              disabled={!user}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Post Hackathon</span><span className="sm:hidden">Post Hack</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
} 