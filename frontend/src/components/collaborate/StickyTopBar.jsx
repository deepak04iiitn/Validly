import React from 'react';
import { Users, UserPlus, X, Award } from 'lucide-react';

export default function StickyTopBar({ activeFeature, setActiveFeature, filters, setFilters, sort, setSort, searchQuery, setSearchQuery, user }) {
  // Helper to render active filter chips
  const filterChips = [];
  if (activeFeature === 'hackathon' || activeFeature === 'myposts') {
    if (filters.status) filterChips.push({ label: filters.status, key: 'status' });
    if (filters.location) filterChips.push({ label: filters.location, key: 'location' });
  } else {
    if (filters.role) filterChips.push({ label: filters.role, key: 'role' });
    if (filters.type) filterChips.push({ label: filters.type, key: 'type' });
  }

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-lg px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      {/* Feature Switch */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-0">
        <button
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${activeFeature === 'hackathon' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow' : 'text-slate-700 hover:bg-violet-50'}`}
          onClick={() => setActiveFeature('hackathon')}
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Hackathons</span><span className="sm:hidden">Hacks</span>
        </button>
        <button
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${activeFeature === 'founder' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow' : 'text-slate-700 hover:bg-blue-50'}`}
          onClick={() => setActiveFeature('founder')}
        >
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Founders</span><span className="sm:hidden">Founders</span>
        </button>

        {user && (
          <button
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${activeFeature === 'myposts' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow' : 'text-slate-700 hover:bg-green-50'}`}
            onClick={() => setActiveFeature('myposts')}
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">My Hackathons</span><span className="sm:hidden">My Hacks</span>
          </button>
        )}

      </div>
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder={
          activeFeature === 'hackathon' ? 'Search hackathons...' : 
          activeFeature === 'myposts' ? 'Search my hackathons...' : 
          'Search founders...'
        }
        className="flex-1 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white/80 text-sm sm:text-base lg:text-lg focus:ring-2 focus:ring-violet-400"
      />
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {filterChips.map(chip => (
          <span key={chip.key} className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-semibold text-xs sm:text-sm">
            {chip.label}
            <button
              className="ml-1 text-violet-400 hover:text-violet-700 cursor-pointer"
              onClick={() => setFilters(f => { const copy = { ...f }; delete copy[chip.key]; return copy; })}
              aria-label={`Remove ${chip.label}`}
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </span>
        ))}
      </div>
      {/* Sort Dropdown */}
      <select
        value={sort}
        onChange={e => setSort(e.target.value)}
        className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white/80 text-sm sm:text-base focus:ring-2 focus:ring-violet-400"
      >
        {(activeFeature === 'hackathon' || activeFeature === 'myposts') ? (
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
      {/* TODO: Add search suggestions and advanced filter logic */}
    </div>
  );
} 