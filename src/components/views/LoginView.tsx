import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { signInWithEmailPassword, isLiveSupabaseConfigured, DEMO_CREDENTIALS } from '../../lib/supabaseAuth';
import { Button } from '../common/Button';
import { ForgotPasswordModal } from '../modals/ForgotPasswordModal';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Database,
  ArrowRight,
  UserCheck,
  Building2,
  Check
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { setActiveView, setCurrentRole, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const isCloudActive = isLiveSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await signInWithEmailPassword(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      setCurrentRole(result.user.role);
      addToast('success', `Welcome back, ${result.user.fullName}!`, 'You have successfully signed in.');
      
      // Redirect to correct dashboard based on role
      if (result.user.role === 'creator') {
        setActiveView('creator-dashboard');
      } else if (result.user.role === 'brand') {
        setActiveView('brand-dashboard');
      } else if (result.user.role === 'admin') {
        setActiveView('admin-dashboard');
      }
    } else {
      setErrorMessage(result.message || 'Invalid email or password.');
    }
  };

  const handleSelectDemo = (demo: (typeof DEMO_CREDENTIALS)[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-100/50 via-indigo-50/30 to-transparent pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black tracking-tight text-slate-900 font-display">
          Sign In to CreatorSphere
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          India's verified creator & brand collaboration marketplace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80 sm:px-10">
          
          {/* Supabase Cloud Connection Status Card */}
          <div className={`mb-6 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            isCloudActive 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/90 border-amber-200 text-amber-900'
          }`}>
            <Database className={`w-4 h-4 mt-0.5 shrink-0 ${isCloudActive ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <p className="font-semibold">
                {isCloudActive ? 'Supabase Cloud Auth Active' : 'Supabase Demo & Fallback Auth Mode'}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                {isCloudActive 
                  ? 'Authenticating securely against your connected Supabase PostgreSQL instance with Row Level Security.'
                  : 'Live cloud credentials not detected in .env. Click any demo role below for instant access, or configure VITE_SUPABASE_URL.'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Main Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <span className="text-xs text-slate-600">Remember session</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-sm font-semibold rounded-xl"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
              Quick Test Demo Credentials (1-Click Fill)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleSelectDemo(demo)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    email === demo.email
                      ? 'border-purple-600 bg-purple-50 text-purple-900 font-medium'
                      : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {demo.role === 'creator' && <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />}
                    {demo.role === 'brand' && <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    {demo.role === 'admin' && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                    <div>
                      <span className="font-semibold capitalize">{demo.role}: </span>
                      <span className="text-slate-600">{demo.fullName}</span>
                    </div>
                  </div>
                  {email === demo.email ? (
                    <Check className="w-4 h-4 text-purple-600" />
                  ) : (
                    <span className="text-[10px] text-slate-400">Fill</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Link to Registration */}
          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <button
              onClick={() => setActiveView('register')}
              className="font-semibold text-purple-600 hover:text-purple-700 cursor-pointer inline-flex items-center gap-1"
            >
              Create Account <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Public Navigation Links */}
        <div className="mt-6 text-center text-xs text-slate-500 space-x-4">
          <button onClick={() => setActiveView('landing')} className="hover:text-slate-800 cursor-pointer">
            Home
          </button>
          <span>•</span>
          <button onClick={() => setActiveView('how-it-works')} className="hover:text-slate-800 cursor-pointer">
            How It Works
          </button>
          <span>•</span>
          <button onClick={() => setActiveView('terms-of-service')} className="hover:text-slate-800 cursor-pointer">
            Terms
          </button>
          <span>•</span>
          <button onClick={() => setActiveView('privacy-policy')} className="hover:text-slate-800 cursor-pointer">
            Privacy
          </button>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
      />
    </div>
  );
};
