import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, AlertCircle, ArrowLeft, Mail, Lock } from 'lucide-react';

interface SimpleAuthProps {
  onSuccess: (identifier: string, userData?: { name?: string; photoURL?: string }) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function SimpleAuth({ onSuccess, onCancel, isModal = false }: SimpleAuthProps) {
  const [step, setStep] = useState<'identifier' | 'otp' | 'password'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (phone: string) => {
    let formatted = phone.trim();
    if (formatted.startsWith('01')) {
      return '+88' + formatted;
    }
    return formatted;
  };

  const handleNext = async (e: FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter your phone number or email.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (identifier.includes('@')) {
        setStep('password');
      } else {
        // Phone verification flow (demo OTP sent to user)
        setStep('otp');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to proceed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP code.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // In self-hosted store, any 4-6 digit code logs the customer in
      localStorage.setItem('customer_session_phone', identifier);
      onSuccess(formatPhone(identifier));
    } catch (err: any) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      localStorage.setItem('customer_session_email', identifier);
      onSuccess(identifier);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    onSuccess('customer@gmail.com', { name: 'Google Customer' });
  };

  const handleFacebookLogin = () => {
    onSuccess('customer@facebook.com', { name: 'Facebook Customer' });
  };

  return (
    <div className={`w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 ${isModal ? 'p-6' : 'p-8'}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Welcome to FANTINE</h2>
        <p className="text-sm text-slate-500 mt-1">Sign in to track orders and save your favorites</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 text-red-600 text-xs border border-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'identifier' && (
          <motion.form 
            key="identifier"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleNext}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Phone Number or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="01XXXXXXXXX or email@domain.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  autoFocus
                />
                <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Checking...' : 'Continue'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Facebook
              </button>
            </div>
          </motion.form>
        )}

        {step === 'otp' && (
          <motion.form
            key="otp"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleVerifyOtp}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-600">
              <button type="button" onClick={() => setStep('identifier')} className="p-1 hover:bg-slate-100 rounded-lg">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-slate-500">Sent to {identifier}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Enter Verification Code (OTP)
              </label>
              <input
                type="text"
                placeholder="Enter 4-6 digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-center tracking-widest text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </motion.form>
        )}

        {step === 'password' && (
          <motion.form
            key="password"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleEmailAuth}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-600">
              <button type="button" onClick={() => setStep('identifier')} className="p-1 hover:bg-slate-100 rounded-lg">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-slate-500">{identifier}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  autoFocus
                />
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors text-center"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
