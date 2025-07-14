import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from query string
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/backend/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Your password has been reset. You can now sign in.');
        setTimeout(() => navigate('/sign-in'), 2000);
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-white">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-white/40">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Password</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
              placeholder=" "
              required
              aria-label="New password"
            />
            <label
              htmlFor="password"
              className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                ${password ? '-top-5 left-10 text-xs text-pink-600' : 'top-3 text-gray-400'}
                peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-pink-600`
              }
            >
              New Password
            </label>
            <span className="absolute left-4 top-3 text-pink-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4h.01" /></svg>
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
              placeholder=" "
              required
              aria-label="Confirm new password"
            />
            <label
              htmlFor="confirmPassword"
              className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                ${confirmPassword ? '-top-5 left-10 text-xs text-pink-600' : 'top-3 text-gray-400'}
                peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-pink-600`
              }
            >
              Confirm New Password
            </label>
            <span className="absolute left-4 top-3 text-pink-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4h.01" /></svg>
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center text-lg cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
        {message && (
          <div className="mt-6 bg-green-100/80 text-green-700 p-3 rounded-lg text-sm text-center shadow-md animate-fade-in">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-6 bg-red-100/80 text-red-700 p-3 rounded-lg text-sm text-center shadow-md animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 