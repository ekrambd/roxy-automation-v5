import React, { useState, FormEvent } from 'react';
import { auth, isFirebaseEnabled } from '../lib/firebase';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, AlertCircle, ArrowLeft, Mail, Lock, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier?: any;
  }
}

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
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  // To handle email: sign in or sign up
  const [isSignUp, setIsSignUp] = useState(false);

  const formatPhone = (phone: string) => {
    let formatted = phone.trim();
    if (formatted.startsWith('01')) {
      return '+88' + formatted;
    }
    return formatted;
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier && auth) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  };

  const handleNext = async (e: FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter your phone number or email.');
      return;
    }

    if (!isFirebaseEnabled || !auth) {
      setError('Firebase is not fully configured.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (identifier.includes('@')) {
        // Email Flow
        try {
          const methods = await fetchSignInMethodsForEmail(auth, identifier);
          setIsSignUp(methods.length === 0);
        } catch (err) {
          // If fetchSignInMethods fails (e.g. privacy setting), we default to try sign-in, then sign-up.
          setIsSignUp(false);
        }
        setStep('password');
      } else {
        // Phone Flow
        setupRecaptcha();
        const phoneNumber = formatPhone(identifier);
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setConfirmationResult(result);
        setStep('otp');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to proceed. Try again.');
      if (window.recaptchaVerifier) {
         window.recaptchaVerifier.clear();
         window.recaptchaVerifier = undefined;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    
    setError('');
    setIsLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      onSuccess(user.phoneNumber || identifier);
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || !auth) return;

    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, identifier, password);
        onSuccess(result.user.email || identifier);
      } else {
        const result = await signInWithEmailAndPassword(auth, identifier, password);
        onSuccess(result.user.email || identifier);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/user-not-found') {
        // Fallback to sign up
        try {
          const result = await createUserWithEmailAndPassword(auth, identifier, password);
          onSuccess(result.user.email || identifier);
        } catch (signUpErr: any) {
          setError(signUpErr.message || 'Failed to create account.');
        }
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseEnabled || !auth) {
      setError('Firebase is not configured for Google Login.');
      return;
    }
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onSuccess(user.email || user.phoneNumber || 'user@google.com', {
        name: user.displayName || undefined,
        photoURL: user.photoURL || undefined
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    if (!isFirebaseEnabled || !auth) {
      setError('Firebase is not configured for Facebook Login.');
      return;
    }
    setError('');
    setIsLoading(true);
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onSuccess(user.email || user.phoneNumber || 'user@facebook.com', {
        name: user.displayName || undefined,
        photoURL: user.photoURL || undefined
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Facebook Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="p-8">
      {step === 'identifier' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <h1 className="text-xl font-bold text-slate-800 tracking-wide text-center mb-8">
            LOGIN / SIGN UP
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full py-3 px-2 bg-[#3b5998] hover:bg-[#2d4373] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
              Facebook
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 px-2 bg-[#DB4437] hover:bg-[#c53829] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2 py-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-black text-slate-800 uppercase px-2">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded bg-red-50 p-3 mb-4 text-xs leading-relaxed text-red-600 border border-red-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleNext} className="space-y-8 mt-6">
            <div className="relative border-b-2 border-blue-400 focus-within:border-blue-600 transition-colors">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                <Smartphone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Phone or Email"
                className="block w-full bg-transparent py-3 pl-8 pr-3 text-sm text-slate-800 focus:outline-none"
              />
            </div>

            <div id="recaptcha-container"></div>

            <button
              type="submit"
              disabled={isLoading || !identifier}
              className="w-full py-4 px-4 bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold text-lg rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Next'}
            </button>
          </form>
        </motion.div>
      )}

      {step === 'otp' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => { setStep('identifier'); setError(''); }}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors -ml-2 text-slate-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-wide">
              Verify OTP
            </h1>
          </div>
          
          <div className="text-sm text-slate-600 mb-6">
            We have sent an OTP to {identifier}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded bg-red-50 p-3 mb-4 text-xs leading-relaxed text-red-600 border border-red-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="relative border-b-2 border-blue-400 focus-within:border-blue-600 transition-colors">
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="block w-full bg-transparent py-3 text-center text-lg tracking-widest text-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !otp}
              className="w-full py-4 px-4 bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold text-lg rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" /> Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        </motion.div>
      )}

      {step === 'password' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => { setStep('identifier'); setError(''); }}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors -ml-2 text-slate-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-wide">
              {isSignUp ? 'Create Password' : 'Enter Password'}
            </h1>
          </div>

          <div className="text-sm text-slate-600 mb-6">
            {identifier}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded bg-red-50 p-3 mb-4 text-xs leading-relaxed text-red-600 border border-red-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-8">
            <div className="relative border-b-2 border-blue-400 focus-within:border-blue-600 transition-colors">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="block w-full bg-transparent py-3 pl-8 pr-3 text-sm text-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-4 px-4 bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold text-lg rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="relative w-full max-w-[420px] bg-white rounded-[20px] shadow-2xl overflow-hidden"
        >
          {onCancel && (
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
          {content}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      {content}
    </div>
  );
}
