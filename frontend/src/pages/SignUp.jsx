import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all details!');
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.securityQuestion || !formData.securityAnswer) {
      return setErrorMessage('Please fill out all details!');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/backend/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-white relative overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-300 to-purple-300 opacity-20 rounded-full blur-3xl animate-pulse delay-1000 -z-10" />
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-12 mt-16">
        {/* Left: Branding/Hero */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <Link to="/" className="flex justify-center md:justify-start w-full cursor-pointer">
            <img
              src="/Validly.png"
              alt="Validly Logo"
              className="h-24 w-24 object-contain mb-4 drop-shadow-lg hover:scale-105 transition-transform cursor-pointer"
            />
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Create Account
          </h1>
          <p className="text-lg md:text-xl text-gray-700/80 font-light italic max-w-md">
            The social platform for startup builders. Validate ideas, find collaborators, and build communities around your startups.
          </p>
          <ul className="mt-4 space-y-2 text-gray-700/90 text-base">
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-pink-100 rounded-full mr-2">
                {/* Target icon for Real Validation */}
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              </span>
              <span className="font-semibold">Real Validation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-2">
                {/* Users icon for Find Collaborators */}
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </span>
              <span className="font-semibold">Find Collaborators</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mr-2">
                {/* Rocket icon for Promote Business */}
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M12 19v2m0-2a7 7 0 100-14 7 7 0 000 14z" /></svg>
              </span>
              <span className="font-semibold">Promote Business</span>
            </li>
          </ul>
        </div>
        {/* Right: Glassmorphic Form Card */}
        <div className="md:w-1/2 w-full flex justify-center">
          <div className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-white/40 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up for Validly</h2>
            {errorMessage && (
              <div className="mb-4 bg-red-100/80 text-red-700 p-3 rounded-lg text-sm text-center shadow-md animate-fade-in">
                {errorMessage}
              </div>
            )}
            {step === 1 && (
              <form className="space-y-6" onSubmit={handleNext} autoComplete="off">
                {/* Username Field */}
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={formData.username || ''}
                    onChange={handleChange}
                    className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
                    placeholder=" "
                    autoComplete="username"
                    required
                    aria-label="Username"
                  />
                  <label
                    htmlFor="username"
                    className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                      ${formData.username ? '-top-5 left-10 text-xs text-purple-600' : 'top-3 text-gray-400'}
                      peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-purple-600`
                    }
                  >
                    Username
                  </label>
                  <span className="absolute left-4 top-3 text-purple-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                </div>
                {/* Email Field */}
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
                    placeholder=" "
                    autoComplete="email"
                    required
                    aria-label="Email address"
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                      ${formData.email ? '-top-5 left-10 text-xs text-pink-600' : 'top-3 text-gray-400'}
                      peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-pink-600`
                    }
                  >
                    Email
                  </label>
                  <span className="absolute left-4 top-3 text-pink-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
                  </span>
                </div>
                {/* Password Field */}
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
                    placeholder=" "
                    autoComplete="new-password"
                    required
                    aria-label="Password"
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                      ${formData.password ? '-top-5 left-10 text-xs text-yellow-600' : 'top-3 text-gray-400'}
                      peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-yellow-600`
                    }
                  >
                    Password
                  </label>
                  <span className="absolute left-4 top-3 text-yellow-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4h.01" /></svg>
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center text-lg cursor-pointer"
                >
                  Next
                </button>
                {/* Divider */}
                <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="mx-4 text-gray-400 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>
                {/* OAuth Section */}
                <OAuth />
              </form>
            )}
            {step === 2 && (
              <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
                {/* Security Question Field */}
                <div className="relative">
                  <input
                    type="text"
                    id="securityQuestion"
                    value={formData.securityQuestion || ''}
                    onChange={handleChange}
                    className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
                    placeholder=" "
                    required
                    aria-label="Security Question"
                  />
                  <label
                    htmlFor="securityQuestion"
                    className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                      ${formData.securityQuestion ? '-top-5 left-10 text-xs text-purple-600' : 'top-3 text-gray-400'}
                      peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-purple-600`
                    }
                  >
                    Security Question (e.g. What is your favorite color?)
                  </label>
                  <span className="absolute left-4 top-3 text-purple-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
                  </span>
                </div>
                {/* Security Answer Field */}
                <div className="relative">
                  <input
                    type="text"
                    id="securityAnswer"
                    value={formData.securityAnswer || ''}
                    onChange={handleChange}
                    className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
                    placeholder=" "
                    required
                    aria-label="Security Answer"
                  />
                  <label
                    htmlFor="securityAnswer"
                    className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                      ${formData.securityAnswer ? '-top-5 left-10 text-xs text-pink-600' : 'top-3 text-gray-400'}
                      peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-pink-600`
                    }
                  >
                    Security Answer
                  </label>
                  <span className="absolute left-4 top-3 text-pink-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4h.01" /></svg>
                  </span>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-200 text-gray-700 cursor-pointer py-2 px-6 rounded-lg font-semibold shadow hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-6 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center text-lg cursor-pointer"
                  >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </div>
              </form>
            )}
            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-gray-700">
              Have an account?{' '}
              <Link to="/sign-in" className="font-semibold text-purple-600 hover:text-pink-500 transition-colors cursor-pointer">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}