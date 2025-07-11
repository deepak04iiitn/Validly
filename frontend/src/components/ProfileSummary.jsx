import React from 'react';
import { MapPin, Briefcase, FileText, Globe, Github, Award, GraduationCap, Target, CheckCircle, User, Building, Calendar, ExternalLink, Mail, Phone, Trash2, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const getInitials = (name) => {
  return name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'U';
};

const ProfilePage = ({ profile, onEditProfile, onDeleteAccount, deleteLoading }) => {
  // If no profile data provided, show empty state
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Profile Data</h2>
          <p className="text-gray-500">Please provide profile data to display the profile</p>
        </div>
      </div>
    );
  }

  const isProfileComplete = profile.isProfileCompleted;
  const hasSkills = profile.skills && profile.skills.length > 0;
  const hasBestWorks = profile.bestWorks && profile.bestWorks.length > 0;
  const hasLinks = profile.portfolio || profile.github || profile.resume;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {profile.profilePicture && profile.profilePicture !== "https://www.pngall.com/wp-content/uploads/5/Profile.png" ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  getInitials(profile.fullName || profile.username)
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.fullName || profile.username}</h1>
                <p className="text-gray-600">@{profile.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* More menu for Edit/Delete */}
              {!profile.isUserAdmin && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
                    aria-label="More options"
                  >
                    <MoreVertical size={22} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
                      <button
                        onClick={() => { setMenuOpen(false); onEditProfile && onEditProfile(); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                      >
                        <User size={16} /> Edit Profile
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); onDeleteAccount && onDeleteAccount(); }}
                        disabled={deleteLoading}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition text-left cursor-pointer ${deleteLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <Trash2 size={16} /> {deleteLoading ? 'Deleting...' : 'Delete Account'}
                      </button>
                    </div>
                  )}
                </div>
              )}
              {profile.isUserAdmin && (
                <div className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  <Award size={16} className="mr-1" />
                  Admin
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Mail size={16} className="mr-3 text-gray-400" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                {profile.location && (
                  <div className="flex items-center text-gray-700">
                    <MapPin size={16} className="mr-3 text-gray-400" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                {profile.role && (
                  <div className="flex items-center text-gray-700">
                    <Briefcase size={16} className="mr-3 text-gray-400" />
                    <span className="text-sm">{profile.role}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <Calendar size={16} className="mr-3 text-gray-400" />
                  <span className="text-sm">
                    Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            {hasLinks && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  {profile.portfolio && (
                    <a 
                      href={profile.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Globe size={16} className="mr-3 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Portfolio</span>
                      </div>
                      <ExternalLink size={14} className="text-blue-500 group-hover:text-blue-700" />
                    </a>
                  )}
                  {profile.github && (
                    <a 
                      href={profile.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Github size={16} className="mr-3 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">GitHub</span>
                      </div>
                      <ExternalLink size={14} className="text-gray-500 group-hover:text-gray-700" />
                    </a>
                  )}
                  {profile.resumeLink && (
                    <a 
                      href={profile.resumeLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center">
                        <FileText size={16} className="mr-3 text-green-600" />
                        <span className="text-sm font-medium text-green-700">View Resume (Drive Link)</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {hasSkills && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* About Section */}
            {profile.bio && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </div>
            )}

            {/* Background Information */}
            {(profile.userType || profile.degree || profile.companyName) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Background</h2>
                
                {profile.userType === 'Student' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.organizationName && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Building size={18} className="text-blue-600 mr-2" />
                          <h4 className="font-medium text-blue-900">Organization</h4>
                        </div>
                        <p className="text-blue-800 text-sm">{profile.organizationName}</p>
                      </div>
                    )}
                    {profile.degree && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <GraduationCap size={18} className="text-blue-600 mr-2" />
                          <h4 className="font-medium text-blue-900">Education</h4>
                        </div>
                        <p className="text-blue-800 text-sm">
                          {profile.degree}
                          {profile.branch && ` - ${profile.branch}`}
                        </p>
                      </div>
                    )}
                    {profile.year && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Calendar size={18} className="text-blue-600 mr-2" />
                          <h4 className="font-medium text-blue-900">Academic Year</h4>
                        </div>
                        <p className="text-blue-800 text-sm">Year {profile.year}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {profile.userType === 'Working Professional' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.companyName && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Building size={18} className="text-gray-600 mr-2" />
                          <h4 className="font-medium text-gray-900">Company</h4>
                        </div>
                        <p className="text-gray-700 text-sm">{profile.companyName}</p>
                      </div>
                    )}
                    {profile.position && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Briefcase size={18} className="text-gray-600 mr-2" />
                          <h4 className="font-medium text-gray-900">Position</h4>
                        </div>
                        <p className="text-gray-700 text-sm">{profile.position}</p>
                      </div>
                    )}
                    {profile.yoe && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Award size={18} className="text-gray-600 mr-2" />
                          <h4 className="font-medium text-gray-900">Experience</h4>
                        </div>
                        <p className="text-gray-700 text-sm">{profile.yoe} years</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Looking For */}
            {profile.lookingFor && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Currently Looking For</h2>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Target size={20} className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-purple-800">{profile.lookingFor}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Best Works */}
            {hasBestWorks && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio & Projects</h2>
                <div className="grid gap-4">
                  {profile.bestWorks.map((work, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 text-lg mb-3">{work.description}</h3>
                      <div className="flex items-center space-x-4">
                        {work.github && (
                          <a 
                            href={work.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors cursor-pointer"
                          >
                            <Github size={14} className="mr-2" />
                            View Code
                          </a>
                        )}
                        {work.live && (
                          <a 
                            href={work.live} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
                          >
                            <ExternalLink size={14} className="mr-2" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;