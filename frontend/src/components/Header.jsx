import React, { useState, useEffect } from 'react';
import { Menu, X, Lightbulb, Zap, LogOut, User as UserIcon } from 'lucide-react';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const user = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Dropdown content for each nav item
  const navDropdowns = {
    Ideas: {
      title: 'Ideas',
      desc: 'Share, validate, and refine your startup ideas. Get real feedback, run polls, and see what resonates with the community.',
      actions: [
        'Post a new idea',
        'Get feedback & validation',
        'Participate in weekly idea competitions',
        'See trending ideas',
      ],
    },
    Collaborate: {
      title: 'Collaborate',
      desc: 'Find co-founders, team up for hackathons, or join projects that match your skills and interests. Build your team and work together on exciting projects.',
      actions: [
        'Find collaborators & co-founders',
        'Join hackathon squads',
        'Work on open-source startup projects',
      ],
    },
    Mentorship: {
      title: 'Mentorship',
      desc: 'Book 1:1 sessions with experienced founders and experts. Get guidance, advice, and support for your journey.',
      actions: [
        'Book a mentor session',
        'Offer mentorship',
        'Browse expert mentors',
      ],
    },
    Communities: {
      title: 'Communities',
      desc: 'Join or create groups for founders, niche interests, or local meetups. Grow your network and support system.',
      actions: [
        'Join a community',
        'Create your own group',
        'Participate in discussions',
      ],
    },
    Hiring: {
      title: 'Hiring',
      desc: 'Post jobs, gigs, or small help requests for your startup. Find talent for short-term tasks, freelance work, or long-term roles. Apply to work with other founders and startups.',
      actions: [
        'Post a job, gig, or help request',
        'Browse available opportunities',
        'Apply for startup work',
        'Connect with founders needing help',
      ],
    },
  };

  // Add Promote to navDropdowns
  const promoteDropdown = {
    Promote: {
      title: 'Promote',
      desc: 'Spotlight your business, startup, website, or app to the Validly community. Create promotion posts with visuals, CTAs, and links, target your audience, collect feedback, and track real engagement—all within Validly.',
      actions: [
        'Create a promotion post',
        'Add screenshots, demo video, or mockups',
        'Set a clear call-to-action (e.g., sign up, try beta)',
        'Target your audience (community-wide or niche)',
        'Collect feedback and track engagement',
        'Earn or buy promotion credits for extra reach',
      ],
    }
  };
  const allDropdowns = { ...navDropdowns, ...promoteDropdown };

  // Map nav keys to routes
  const navRoutes = {
    Ideas: '/ideas',
    Collaborate: '/collaborate',
    Mentorship: '/mentorship',
    Communities: '/communities',
    Hiring: '/hiring',
    Promote: '/promote',
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100`}>
      <div className="max-w-7xl mx-auto pl-0 pr-6 sm:pr-10 lg:pr-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center cursor-pointer">
            <img
              src="/Validly.png"
              alt="Validly Logo"
              className="w-24 h-20 object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10 relative z-20 text-lg font-semibold">
            {Object.keys(allDropdowns).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setHoveredNav(key)}
                onMouseLeave={() => setHoveredNav(null)}
                tabIndex={0}
              >
                <button
                  type="button"
                  onClick={() => navigate(navRoutes[key])}
                  className={`group px-3 py-1 rounded transition-colors font-semibold focus:outline-none focus:text-purple-700 relative text-gray-700 hover:text-purple-600 cursor-pointer`}
                  aria-haspopup="true"
                  aria-expanded={hoveredNav === key}
                  style={{ background: 'none', border: 'none' }}
                >
                  {key}
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
                </button>
                {/* Dropdown */}
                {hoveredNav === key && (
                  <div
                    className="fixed left-1/2 top-20 z-40 -translate-x-1/2 mt-0 w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-purple-100 px-12 py-8 transition-all duration-300 animate-fadeInDropdown flex flex-col items-start"
                    style={{ minWidth: '320px' }}
                  >
                    <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 mb-4" />
                    <div className="mb-2 text-2xl font-bold text-purple-700 flex items-center gap-3">
                      {key === 'Promote' ? <Zap className="w-6 h-6 text-blue-500" /> : <Lightbulb className="w-6 h-6 text-yellow-400" />}
                      {allDropdowns[key].title}
                    </div>
                    <div className="text-gray-700 mb-6 text-base leading-relaxed max-w-2xl">{allDropdowns[key].desc}</div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 w-full">
                      {allDropdowns[key].actions.map((action, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 text-base">
                          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <style jsx>{`
              @keyframes fadeInDropdown {
                from { opacity: 0; transform: translateY(20px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .animate-fadeInDropdown {
                animation: fadeInDropdown 0.35s cubic-bezier(0.4,0,0.2,1) both;
              }
            `}</style>
          </nav>

          {/* CTA/Profile Dropdown */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 shadow-lg hover:shadow-xl border border-purple-100 hover:border-purple-300 transition-all duration-200 cursor-pointer focus:outline-none"
                  onClick={() => setDropdownOpen(v => !v)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-purple-300" />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-lg border-2 border-purple-300">
                      {user.username ? user.username[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : '?')}
                    </span>
                  )}
                  <span className="font-semibold text-gray-800 text-base max-w-[120px] truncate">
                    {user.username || user.email}
                  </span>
                  <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 py-5 z-50 animate-fadeInDropdown flex flex-col items-stretch" style={{boxShadow: '0 8px 32px 0 rgba(80,0,200,0.10)'}}>
                    {/* Gradient accent bar */}
                    <div className="h-1 w-full rounded-t-3xl bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 mb-4" />
                    {/* User info */}
                    <div className="flex items-center gap-3 px-5 pb-3">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="avatar" className="w-11 h-11 rounded-full object-cover border-2 border-purple-300" />
                      ) : (
                        <span className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-xl border-2 border-purple-300">
                          {user.username ? user.username[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : '?')}
                        </span>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base leading-tight truncate max-w-[120px]">{user.username || user.email}</span>
                        {user.email && user.username && (
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="my-2 border-t border-purple-100" />
                    <a
                      href="/profile"
                      className="block px-5 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-700 font-semibold rounded-2xl transition-all duration-200 cursor-pointer text-base flex items-center gap-3"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon className="w-5 h-5 text-purple-500" />
                      Profile
                    </a>

                    {user.isUserAdmin && (
                      <a
                        href="/dashboard"
                        className="block px-5 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-700 font-semibold rounded-2xl transition-all duration-200 cursor-pointer text-base flex items-center gap-3"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </a>
                    )}

                    {user.isMentor && (
                      <a
                        href="/mentordashboard"
                        className="block px-5 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-700 font-semibold rounded-2xl transition-all duration-200 cursor-pointer text-base flex items-center gap-3"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Mentor Dashboard
                      </a>
                    )}

                    <button
                      className="block w-full text-left px-5 py-3 text-gray-800 hover:bg-pink-50 hover:text-pink-600 font-semibold rounded-2xl transition-all duration-200 cursor-pointer text-base mt-1 flex items-center gap-3"
                      onClick={async () => {
                        setSigningOut(true);
                        try {
                          const res = await fetch('/backend/auth/logout', { method: 'POST', credentials: 'include' });
                          const data = await res.json();
                          if (res.ok && data.success) {
                            dispatch(signoutSuccess());
                            setDropdownOpen(false);
                            navigate('/sign-in');
                          } else {
                            alert(data.message || 'Sign out failed.');
                          }
                        } catch (err) {
                          alert('Sign out failed.');
                        }
                        setSigningOut(false);
                      }}
                      disabled={signingOut}
                    >
                      <LogOut className="w-5 h-5 text-pink-500" />
                      {signingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold cursor-pointer"
                onClick={() => { window.location.href = '/sign-in'; }}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Sidebar Menu */}
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-[100] transition-all duration-300 ${isMenuOpen ? 'bg-black/30 pointer-events-auto' : 'bg-transparent pointer-events-none'}`}
          style={{ backdropFilter: isMenuOpen ? 'blur(2px)' : 'none' }}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden={!isMenuOpen}
        />
        {/* Sidebar - starts below header, glassmorphism, scrollable */}
        <aside
          className={`fixed top-0 right-0 z-[110] h-screen w-80 max-w-full bg-white/95 backdrop-blur-xl shadow-2xl border-l border-purple-100 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col rounded-l-3xl`}
          style={{ transitionProperty: 'transform, box-shadow' }}
          aria-hidden={!isMenuOpen}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-xl z-10 rounded-tl-3xl">
            <a href="/" className="flex items-center cursor-pointer">
              <img src="/Validly.png" alt="Validly Logo" className="w-20 h-12 object-contain" />
            </a>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2 px-6 py-8 overflow-y-auto">
            {Object.keys(navRoutes).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => { setIsMenuOpen(false); navigate(navRoutes[key]); }}
                className={`text-lg font-semibold ${key === 'Promote' ? 'text-blue-700' : 'text-gray-800'} hover:text-purple-600 transition-colors py-2 cursor-pointer text-left w-full`}
                style={{ background: 'none', border: 'none' }}
              >
                {key}
              </button>
            ))}
          </nav>
          <div className="px-6 pb-8 pt-2">
            {user ? (
              <div className="flex flex-col items-center w-full gap-4">
                <div className="flex flex-col items-center w-full mb-2">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="avatar" className="w-14 h-14 rounded-full object-cover border-2 border-purple-300 mb-2" />
                  ) : (
                    <span className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-2xl border-2 border-purple-300 mb-2">
                      {user.username ? user.username[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : '?')}
                    </span>
                  )}
                  <span className="font-semibold text-gray-800 text-base max-w-[160px] truncate text-center">
                    {user.username || user.email}
                  </span>
                </div>
                <a
                  href="/profile"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg border border-purple-300 hover:from-purple-600 hover:to-blue-600 transition-colors duration-200 cursor-pointer text-center mb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </a>

                {user.isUserAdmin && (
                  <a
                    href="/dashboard"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg border border-green-300 hover:from-green-600 hover:to-teal-600 transition-colors duration-200 cursor-pointer text-center mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                )}

                {user.isMentor && (
                  <a
                    href="/mentordashboard"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg border border-green-300 hover:from-green-600 hover:to-teal-600 transition-colors duration-200 cursor-pointer text-center mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mentor Dashboard
                  </a>
                )}

                <button
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg border border-pink-300 hover:from-pink-600 hover:to-purple-600 transition-colors duration-200 cursor-pointer text-center"
                  onClick={async () => {
                    setSigningOut(true);
                    try {
                      const res = await fetch('/backend/auth/logout', { method: 'POST', credentials: 'include' });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        dispatch(signoutSuccess());
                        setIsMenuOpen(false);
                        navigate('/sign-in');
                      } else {
                        alert(data.message || 'Sign out failed.');
                      }
                    } catch (err) {
                      alert('Sign out failed.');
                    }
                    setSigningOut(false);
                  }}
                  disabled={signingOut}
                >
                  {signingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            ) : (
              <button
                className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg cursor-pointer text-center"
                onClick={() => { window.location.href = '/sign-in'; }}
              >
                Sign In
              </button>
            )}
          </div>
        </aside>
        {/* End Mobile Sidebar */}
      </div>
    </header>
  );
}