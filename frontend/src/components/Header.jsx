import React, { useState, useEffect } from 'react';
import { Menu, X, Lightbulb, Zap } from 'lucide-react';
import { useRef } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      desc: 'Find co-founders, team up for hackathons, or join projects that match your skills and interests.',
      actions: [
        'Find collaborators & co-founders',
        'Join hackathon squads',
        'Post or apply for roles',
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
    Progress: {
      title: 'Progress',
      desc: 'Track your startup milestones, validation checkpoints, and team progress in one place.',
      actions: [
        'View your roadmap',
        'Set milestones & tasks',
        'Track validation & feedback',
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

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <nav className="hidden md:flex items-center space-x-8 relative z-20">
            {Object.keys(allDropdowns).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setHoveredNav(key)}
                onMouseLeave={() => setHoveredNav(null)}
                tabIndex={0}
              >
                <a
                  href={`#${key.toLowerCase()}`}
                  className={`text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-1 rounded cursor-pointer focus:outline-none focus:text-purple-700 ${key === 'Promote' ? 'font-bold text-blue-700' : ''}`}
                  aria-haspopup="true"
                  aria-expanded={hoveredNav === key}
                >
                  {key}
                </a>
                {/* Dropdown */}
                {hoveredNav === key && (
                  <div
                    className="fixed left-1/2 top-20 z-40 -translate-x-1/2 mt-0 w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-purple-100 px-12 py-8 transition-all duration-300 animate-fadeInDropdown flex flex-col items-start"
                    style={{ minWidth: '320px' }}
                  >
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

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold cursor-pointer">
              Sign In
            </button>
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
          className={`fixed top-0 right-0 z-[110] h-screen w-80 max-w-full bg-white/70 backdrop-blur-xl shadow-2xl border-l border-purple-100 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
          style={{ transitionProperty: 'transform, box-shadow' }}
          aria-hidden={!isMenuOpen}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
            <a href="/" className="flex items-center cursor-pointer">
              <img src="/Validly.png" alt="Validly Logo" className="w-20 h-12 object-contain" />
            </a>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2 px-6 py-8 overflow-y-auto">
            <a href="#ideas" className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors py-2 cursor-pointer">Ideas</a>
            <a href="#collaborate" className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors py-2 cursor-pointer">Collaborate</a>
            <a href="#mentorship" className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors py-2 cursor-pointer">Mentorship</a>
            <a href="#communities" className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors py-2 cursor-pointer">Communities</a>
            <a href="#progress" className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors py-2 cursor-pointer">Progress</a>
            <a href="#promote" className="text-lg font-semibold text-blue-700 hover:text-purple-600 transition-colors py-2 cursor-pointer">Promote</a>
          </nav>
          <div className="px-6 pb-8 pt-2">
            <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg cursor-pointer">
              Sign In
            </button>
          </div>
        </aside>
        {/* End Mobile Sidebar */}
      </div>
    </header>
  );
}