import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Plus, Trash2, Upload, User, MapPin, Briefcase, Code, Github, Globe, FileText, Award, GraduationCap, Building2, X as LucideX, AlertTriangle } from 'lucide-react';
import ProfileSummary from '../components/ProfileSummary';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

// --- Reusable Input Components ---
const FloatingInput = ({ name, value, onChange, type = 'text', required = false, placeholder, icon: Icon, className = '' }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 ml-1">
      {placeholder} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-violet-500 z-10">
        <Icon size={18} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all duration-300 text-slate-700 shadow-sm hover:border-slate-300/80 ${className}`}
        placeholder={`Enter ${placeholder.toLowerCase()}`}
      />
    </div>
  </div>
);

const FloatingTextarea = ({ name, value, onChange, required = false, placeholder, icon: Icon, rows = 4 }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 ml-1">
      {placeholder} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-4 text-slate-400 transition-colors group-focus-within:text-violet-500 z-10">
        <Icon size={18} />
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all duration-300 text-slate-700 shadow-sm hover:border-slate-300/80 resize-none"
        placeholder={`Enter ${placeholder.toLowerCase()}`}
      />
    </div>
  </div>
);

const FloatingSelect = ({ name, value, onChange, required = false, placeholder, icon: Icon, options }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 ml-1">
      {placeholder} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-violet-500 z-10">
        <Icon size={18} />
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all duration-300 text-slate-700 shadow-sm hover:border-slate-300/80 appearance-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

const BestWorkCard = ({ bw, onChange, onRemove, canRemove }) => (
  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100 relative">
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
      aria-label="Remove Best Work"
    >
      <LucideX size={18} />
    </button>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <FloatingInput
          name="description"
          value={bw.description}
          onChange={e => onChange('description', e.target.value)}
          placeholder="Project Description"
          icon={Award}
          required={true}
        />
      </div>
      <div className="md:col-span-1">
        <FloatingInput
          name="github"
          value={bw.github}
          onChange={e => onChange('github', e.target.value)}
          placeholder="GitHub Repository"
          icon={Github}
          type="url"
        />
      </div>
      <div className="md:col-span-1">
        <FloatingInput
          name="live"
          value={bw.live}
          onChange={e => onChange('live', e.target.value)}
          placeholder="Live Demo URL"
          icon={Globe}
          type="url"
        />
      </div>
    </div>
  </div>
);

// --- Skills Input as Tags ---
const SkillsInput = ({ skills, setSkills }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => setInput(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!skills.includes(input.trim())) {
        setSkills([...skills, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && skills.length > 0) {
      // Remove last skill if input is empty and backspace is pressed
      setSkills(skills.slice(0, -1));
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 ml-1">
        Skills <span className="text-red-400">*</span>
      </label>
      <div className="relative group">
        <div
          className="flex flex-wrap items-center min-h-[56px] w-full pl-12 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500/50 transition-all duration-300 shadow-sm hover:border-slate-300/80 cursor-pointer"
        >
          {skills.map(skill => (
            <span key={skill} className="flex items-center bg-violet-100 text-violet-700 px-3 py-1 mr-2 mb-1 rounded-full text-sm font-medium cursor-pointer">
              {skill}
              <button type="button" className="ml-1 p-1 hover:bg-violet-200 rounded-full" onClick={() => removeSkill(skill)}>
                <LucideX size={14} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none py-2 text-slate-700 placeholder-slate-400 focus:ring-0 focus:outline-none cursor-pointer"
            placeholder={skills.length === 0 ? 'Add a skill and press Enter' : ''}
          />
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
          <Code size={18} />
        </div>
      </div>
    </div>
  );
};

// --- Main Profile Page ---
export default function Profile() {
  const user = useSelector(state => state.user.currentUser);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ skills: [] });
  const [resumeFile, setResumeFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bestWorks, setBestWorks] = useState([{ id: 1, description: '', github: '', live: '' }]);
  const [nextId, setNextId] = useState(2);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const navigate = useNavigate();
  const [mode, setMode] = useState('form'); // 'form' | 'summary'
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const [profilePicError, setProfilePicError] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  // Auto-hide update success message after 3 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch('/backend/auth/profile', { credentials: 'include' });
        const data = await res.json();
        // Ensure resume is always an object for compatibility
        let resumeObj = data.resume;
        if (resumeObj && typeof resumeObj === 'string') {
          resumeObj = { path: data.resume, originalName: 'resume.pdf' };
        }
        setProfile({ ...data, resume: resumeObj });
        if (!isFormInitialized) {
          setForm({
            ...form,
            fullName: data.fullName || '',
            skills: Array.isArray(data.skills) ? data.skills : (typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
            location: data.location || '',
            bio: data.bio || '',
            role: data.role || '',
            portfolio: data.portfolio || '',
            github: data.github || '',
            userType: data.userType || '',
            degree: data.degree || '',
            branch: data.branch || '',
            year: data.year || '',
            companyName: data.companyName || '',
            position: data.position || '',
            yoe: data.yoe || '',
            lookingFor: data.lookingFor || '',
            organizationName: data.organizationName || '',
            profilePicture: data.profilePicture || '',
            resumeLink: data.resumeLink || '',
          });
          if (Array.isArray(data.bestWorks) && data.bestWorks.length > 0) {
            const worksWithIds = data.bestWorks.map((bw, index) => ({
              id: bw.id || (index + 1),
              description: bw.description || '',
              github: bw.github || '',
              live: bw.live || '',
            }));
            setBestWorks(worksWithIds);
            setNextId(Math.max(...worksWithIds.map(w => w.id)) + 1);
          } else {
            setBestWorks([{ id: 1, description: '', github: '', live: '' }]);
            setNextId(2);
          }
          setIsFormInitialized(true);
        }
        // If profile is completed, show summary mode
        if (data.isProfileCompleted) setMode('summary');
      } catch (err) {
        setError('Failed to load profile.');
      }
      setLoading(false);
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // --- Handlers ---
  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBestWorkChange = useCallback((id, field, value) => {
    setBestWorks(prev => prev.map(bw => bw.id === id ? { ...bw, [field]: value } : bw));
  }, []);

  const addBestWork = useCallback(() => {
    if (bestWorks.length < 3) {
      setBestWorks(prev => [...prev, { id: nextId, description: '', github: '', live: '' }]);
      setNextId(prev => prev + 1);
    }
  }, [bestWorks.length, nextId]);

  const removeBestWork = useCallback(id => {
    setBestWorks(prev => prev.filter(bw => bw.id !== id));
  }, []);

  // Handler for skills
  const setSkills = useCallback((skillsArr) => {
    setForm(prev => ({ ...prev, skills: skillsArr }));
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(URL.createObjectURL(file));
    setShowCropper(true);
  };
  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleCropAndUpload = async () => {
    setProfilePicUploading(true);
    setProfilePicError('');
    try {
      const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);
      const formData = new FormData();
      formData.append('file', croppedBlob, 'profile.jpg');
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm(prev => ({ ...prev, profilePicture: data.secure_url }));
        setShowCropper(false);
        setSelectedImage(null);
      } else {
        setProfilePicError('Failed to upload image.');
      }
    } catch (err) {
      setProfilePicError('Failed to upload image.');
    }
    setProfilePicUploading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'skills') {
        formData.append(key, value); // value is now an array
      } else {
        formData.append(key, value);
      }
    });
    formData.append('bestWorks', JSON.stringify(bestWorks.filter(bw => bw.description.trim() !== '')));
    if (resumeFile) formData.append('resume', resumeFile);
    try {
      const res = await fetch('/backend/auth/profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
        setProfile({ ...profile, ...form, bestWorks, isProfileCompleted: true });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  // Edit Profile handler
  const handleEditProfile = () => {
    setMode('form');
    setUpdateSuccess(false);
    // Restore form values from profile when switching to edit mode
    if (profile) {
      setForm({
        ...form,
        fullName: profile.fullName || '',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        location: profile.location || '',
        bio: profile.bio || '',
        role: profile.role || '',
        portfolio: profile.portfolio || '',
        github: profile.github || '',
        userType: profile.userType || '',
        degree: profile.degree || '',
        branch: profile.branch || '',
        year: profile.year || '',
        companyName: profile.companyName || '',
        position: profile.position || '',
        yoe: profile.yoe || '',
        lookingFor: profile.lookingFor || '',
        organizationName: profile.organizationName || '',
        profilePicture: profile.profilePicture || '',
        resumeLink: profile.resumeLink || '',
      });
      setBestWorks(Array.isArray(profile.bestWorks) ? profile.bestWorks : [{ id: 1, description: '', github: '', live: '' }]);
    }
  };

  // Cancel edit handler
  const handleCancelEdit = () => {
    setMode('summary');
    setUpdateSuccess(false);
    // Optionally reset form to profile values
    if (profile) {
      setForm({
        ...form,
        fullName: profile.fullName || '',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        location: profile.location || '',
        bio: profile.bio || '',
        role: profile.role || '',
        portfolio: profile.portfolio || '',
        github: profile.github || '',
        userType: profile.userType || '',
        degree: profile.degree || '',
        branch: profile.branch || '',
        year: profile.year || '',
        companyName: profile.companyName || '',
        position: profile.position || '',
        yoe: profile.yoe || '',
        lookingFor: profile.lookingFor || '',
        organizationName: profile.organizationName || '',
        profilePicture: profile.profilePicture || '',
        resumeLink: profile.resumeLink || '',
      });
      setBestWorks(Array.isArray(profile.bestWorks) ? profile.bestWorks : [{ id: 1, description: '', github: '', live: '' }]);
    }
  };

  // Save/Update handler (reuse handleSubmit)
  const handleUpdateSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setUpdateSuccess(false);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'skills') {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });
    formData.append('bestWorks', JSON.stringify(bestWorks.filter(bw => bw.description.trim() !== '')));
    if (resumeFile) formData.append('resume', resumeFile);
    try {
      const res = await fetch('/backend/auth/profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
        setUpdateSuccess(true);
        setMode('summary');
        const updated = { ...profile, ...form, bestWorks, isProfileCompleted: true };
        setProfile(updated);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  // --- Delete Account Handler ---
  const handleDeleteAccount = () => {
    setDeleteModalOpen(true);
  };
  const confirmDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    dispatch(deleteUserStart());
    try {
      const res = await fetch('/backend/auth/profile', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        dispatch(deleteUserSuccess());
        setDeleteLoading(false);
        setDeleteModalOpen(false);
        navigate('/');
      } else {
        const data = await res.json();
        setDeleteError(data.message || 'Failed to delete account.');
        dispatch(deleteUserFailure(data.message || 'Failed to delete account.'));
        setDeleteLoading(false);
      }
    } catch (err) {
      setDeleteError('Failed to delete account.');
      dispatch(deleteUserFailure('Failed to delete account.'));
      setDeleteLoading(false);
    }
  };

  // --- Render ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (profile && profile.isProfileCompleted && mode === 'summary') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 p-4 pt-28">
        {updateSuccess && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>Profile updated successfully!</span>
          </div>
        )}
        {deleteError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{deleteError}</span>
          </div>
        )}
        <ProfileSummary profile={profile} onEditProfile={handleEditProfile} onDeleteAccount={handleDeleteAccount} deleteLoading={deleteLoading} />
        {/* Delete Account Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-red-200 flex flex-col items-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">Delete Account?</h2>
              <p className="text-slate-700 mb-6 text-center">This action cannot be undone. All your profile data will be permanently deleted. Are you sure you want to continue?</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-6 py-3 rounded-2xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition cursor-pointer"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  className={`px-6 py-3 rounded-2xl bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer ${deleteLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Edit mode (form) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 py-8 px-4 pt-28 flex flex-col items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12 mt-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">{profile && profile.isProfileCompleted ? 'Edit Your Profile' : 'Complete Your Profile'}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {profile && profile.isProfileCompleted ? 'Update your details below and save changes.' : 'Tell us about yourself to unlock all features and connect with the right opportunities'}
          </p>
        </div>
        {/* Form */}
        <form onSubmit={profile && profile.isProfileCompleted ? handleUpdateSubmit : handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12 space-y-8 transition-all duration-500">
          {/* Alert Messages */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && !profile?.isProfileCompleted && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="profile-pic-upload" className="relative cursor-pointer group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {form.profilePicture ? (
                  <img src={form.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow group-hover:bg-violet-100 transition">
                  <Upload className="w-5 h-5 text-violet-600" />
                </div>
              </div>
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
                disabled={profilePicUploading}
              />
            </label>
            {profilePicUploading && <span className="text-violet-600 mt-2">Uploading...</span>}
            {profilePicError && <span className="text-red-500 mt-2">{profilePicError}</span>}
          </div>
          {/* Cropper Modal */}
          {showCropper && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Crop your profile picture</h2>
                <div className="relative w-64 h-64 bg-slate-100 rounded-xl overflow-hidden mb-4">
                  <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
                <div className="flex gap-4 w-full justify-center mb-2">
                  <button
                    onClick={() => { setShowCropper(false); setSelectedImage(null); }}
                    className="px-6 py-3 rounded-2xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition cursor-pointer"
                    disabled={profilePicUploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropAndUpload}
                    className={`px-6 py-3 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition cursor-pointer ${profilePicUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={profilePicUploading}
                  >
                    {profilePicUploading ? 'Uploading...' : 'Crop & Upload'}
                  </button>
                </div>
                <span className="text-slate-500 text-sm">Drag to crop, then click 'Crop & Upload'</span>
              </div>
            </div>
          )}
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" icon={User} required />
              <FloatingInput name="location" value={form.location} onChange={handleChange} placeholder="Location" icon={MapPin} required />
              {/* Skills as tags */}
              <SkillsInput skills={form.skills || []} setSkills={setSkills} />
              {/* Your Role select */}
              <FloatingSelect name="role" value={form.role} onChange={handleChange} icon={Briefcase} required placeholder="Your Role" options={[
                { value: '', label: 'Select your role' },
                { value: 'Founder', label: 'Founder' },
                { value: 'Co-Founder', label: 'Co-Founder' },
                { value: 'Hustler', label: 'Hustler' },
              ]} />
            </div>
            <FloatingTextarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself" icon={FileText} required />
          </div>
          {/* Links & Resume */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-3">Links & Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="Portfolio URL" icon={Globe} type="url" />
              <FloatingInput name="github" value={form.github} onChange={handleChange} placeholder="GitHub Profile" icon={Github} type="url" />
            </div>
            {/* Resume Upload replaced with Resume Drive Link */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Resume Drive Link</label>
              <FloatingInput
                name="resumeLink"
                value={form.resumeLink || ''}
                onChange={handleChange}
                placeholder="Paste your Google Drive (or other) resume link"
                icon={FileText}
                type="url"
                required={false}
              />
            </div>
          </div>
          {/* Best Works */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-3 flex-1">Best Works <span className="text-sm font-normal text-slate-500">(max 3, optional)</span></h3>
            </div>
            <div className="space-y-6">
              {bestWorks.map((bw, idx) => (
                <BestWorkCard
                  key={bw.id}
                  bw={bw}
                  onChange={(field, value) => handleBestWorkChange(bw.id, field, value)}
                  onRemove={() => removeBestWork(bw.id)}
                  canRemove={bestWorks.length > 1}
                />
              ))}
              {bestWorks.length < 3 && (
                <button type="button" onClick={addBestWork} className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <Plus className="w-5 h-5 mr-2" />Add Best Work
                </button>
              )}
            </div>
          </div>
          {/* Background Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-3">Background Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* You are a select */}
              <FloatingSelect name="userType" value={form.userType} onChange={handleChange} icon={User} required placeholder="You are a" options={[
                { value: '', label: 'Select your status' },
                { value: 'Student', label: 'Student' },
                { value: 'Working Professional', label: 'Working Professional' },
              ]} />
              {form.userType === 'Student' && (
                <>
                  <FloatingInput name="degree" value={form.degree} onChange={handleChange} placeholder="Degree" icon={GraduationCap} />
                  <FloatingInput name="branch" value={form.branch} onChange={handleChange} placeholder="Branch/Field of Study" icon={Code} />
                  <FloatingInput name="year" value={form.year} onChange={handleChange} placeholder="Current Year" icon={GraduationCap} />
                  <FloatingInput name="organizationName" value={form.organizationName || ''} onChange={handleChange} placeholder="Organization Name" icon={Building2} />
                </>
              )}
              {form.userType === 'Working Professional' && (
                <>
                  <FloatingInput name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                  <FloatingInput name="position" value={form.position} onChange={handleChange} placeholder="Current Position" icon={Briefcase} />
                  <FloatingInput name="yoe" value={form.yoe} onChange={handleChange} placeholder="Years of Experience" icon={Award} />
                </>
              )}
            </div>
          </div>
          {/* Looking For */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-3">What are you looking for?</h3>
            <FloatingInput name="lookingFor" value={form.lookingFor} onChange={handleChange} placeholder="Co-founder, opportunities, partnerships, etc." icon={Briefcase} />
          </div>
          {/* Submit Button */}
          <div className="pt-6 flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg cursor-pointer"
            >
              {profile && profile.isProfileCompleted ? 'Save Changes' : 'Complete Profile'}
            </button>
            {profile && profile.isProfileCompleted && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full md:w-auto bg-gradient-to-r from-slate-400 to-slate-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}