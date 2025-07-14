import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/backend/auth/security-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.message || 'User not found.');
        setLoading(false);
        return;
      }
      setSecurityQuestion(data.securityQuestion);
      setStep(2);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Something went wrong.');
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/backend/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityAnswer, newPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.message || 'Incorrect answer or error.');
        setLoading(false);
        return;
      }
      setSuccessMessage('Password reset successful! Redirecting to sign in...');
      setTimeout(() => navigate('/sign-in'), 2000);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-300 to-purple-300 opacity-20 rounded-full blur-3xl animate-pulse delay-1000 -z-10" />
      <div className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-white/40 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h2>
        {errorMessage && (
          <div className="mb-4 bg-red-100/90 text-red-700 p-3 rounded-lg text-sm text-center shadow-md animate-fade-in">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 bg-green-100/90 text-green-700 p-3 rounded-lg text-sm text-center shadow-md animate-fade-in">{successMessage}</div>
        )}
        {step === 1 && (
          <form className="space-y-6" onSubmit={handleEmailSubmit} autoComplete="off">
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
                placeholder=" "
                required
                aria-label="Email address"
              />
              <label
                htmlFor="email"
                className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                  ${email ? '-top-5 left-10 text-xs text-purple-600' : 'top-3 text-gray-400'}
                  peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-purple-600`
                }
              >
                Enter your email
              </label>
              <span className="absolute left-4 top-3 text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center text-lg cursor-pointer"
            >
              {loading ? 'Loading...' : 'Next'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="space-y-6" onSubmit={handleResetSubmit} autoComplete="off">
            <div className="mb-2 text-gray-700 text-base font-semibold">{securityQuestion}</div>
            <div className="relative">
              <input
                type="text"
                id="securityAnswer"
                value={securityAnswer}
                onChange={e => setSecurityAnswer(e.target.value)}
                className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
                placeholder=" "
                required
                aria-label="Security Answer"
              />
              <label
                htmlFor="securityAnswer"
                className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                  ${securityAnswer ? '-top-5 left-10 text-xs text-pink-600' : 'top-3 text-gray-400'}
                  peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-pink-600`
                }
              >
                Security Answer
              </label>
              <span className="absolute left-4 top-3 text-pink-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4h.01" /></svg>
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="peer w-full px-12 py-3 rounded-lg border border-gray-300 bg-white/70 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none placeholder-transparent text-gray-900 shadow-sm"
                placeholder=" "
                required
                aria-label="New Password"
              />
              <label
                htmlFor="newPassword"
                className={`absolute left-12 bg-white/60 px-1 rounded pointer-events-none text-gray-500 text-sm transition-all
                  ${newPassword ? '-top-5 left-10 text-xs text-yellow-600' : 'top-3 text-gray-400'}
                  peer-focus:-top-5 peer-focus:left-10 peer-focus:text-xs peer-focus:text-yellow-600`
                }
              >
                New Password
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 