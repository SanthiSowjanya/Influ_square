import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { signUpWithEmailPassword, isLiveSupabaseConfigured } from '../../lib/supabaseAuth';
import { Button } from '../common/Button';
import { NicheType } from '../../types';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  Video,
  ArrowRight,
  Database,
  Globe,
  Tag,
  ShieldCheck
} from 'lucide-react';

const POPULAR_NICHES: NicheType[] = [
  'Tech & AI',
  'Fitness & Wellness',
  'Beauty & Fashion',
  'Gaming & Esports',
  'Finance & Crypto',
  'Travel & Hospitality',
  'Food & Cooking',
  'Design & Creative',
  'Lifestyle & Family'
];

export const RegisterView: React.FC = () => {
  const { setActiveView, setCurrentRole, addToast } = useApp();

  const [role, setRole] = useState<'creator' | 'brand'>('creator');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Creator specific
  const [handle, setHandle] = useState('');
  const [primaryNiche, setPrimaryNiche] = useState<NicheType>('Tech & AI');
  const [reelRate, setReelRate] = useState('15000');

  // Brand specific
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Consumer Electronics & Audio');
  const [website, setWebsite] = useState('');

  // Consent
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);

  const isCloudActive = isLiveSupabaseConfigured();

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: 'Empty', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!fullName.trim()) {
      setErrorMessage('Please provide your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    if (role === 'creator') {
      if (!handle.trim()) {
        setErrorMessage('Please enter your primary social handle (e.g. @yourname).');
        return;
      }
    } else {
      if (!companyName.trim()) {
        setErrorMessage('Please enter your company or brand organization name.');
        return;
      }
    }

    setIsLoading(true);

    const metadata: Record<string, any> = role === 'creator'
      ? {
          handle: handle.startsWith('@') ? handle : `@${handle}`,
          niches: [primaryNiche],
          starting_reel_rate: parseInt(reelRate) || 15000
        }
      : {
          company_name: companyName,
          industry,
          website: website || 'https://'
        };

    const result = await signUpWithEmailPassword({
      fullName,
      email,
      password,
      role,
      metadata
    });

    setIsLoading(false);

    if (result.success) {
      if (result.requiresEmailVerification) {
        setVerificationNotice(
          result.message || 'Please verify your email address to complete registration.'
        );
      } else if (result.user) {
        setCurrentRole(role);
        addToast(
          'success',
          `Welcome to CreatorSphere, ${fullName}!`,
          `Your ${role === 'creator' ? 'Creator' : 'Brand'} profile has been initialized.`
        );

        if (role === 'creator') {
          setActiveView('creator-dashboard');
        } else {
          setActiveView('brand-dashboard');
        }
      }
    } else {
      setErrorMessage(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black tracking-tight text-slate-900 font-display">
          Join CreatorSphere
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          The verified collaboration ecosystem for Indian creators and brands
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          
          {/* Supabase Cloud Connection Status Card */}
          <div className={`mb-6 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            isCloudActive 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/90 border-amber-200 text-amber-900'
          }`}>
            <Database className={`w-4 h-4 mt-0.5 shrink-0 ${isCloudActive ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <p className="font-semibold">
                {isCloudActive ? 'Supabase Cloud Auth Active' : 'Prototype Local Registration'}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                {isCloudActive
                  ? 'New profiles are provisioned directly into your live Supabase PostgreSQL database.'
                  : 'Account credentials and profile data will be persisted locally. Connect Supabase anytime for cloud sync.'}
              </p>
            </div>
          </div>

          {verificationNotice ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Confirm Your Email Address</h3>
              <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                {verificationNotice}
              </p>
              <Button
                variant="primary"
                onClick={() => setActiveView('login')}
                className="mt-4"
              >
                Go to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* Account Type Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  I Want To Join As:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('creator')}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      role === 'creator'
                        ? 'border-purple-600 bg-purple-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${role === 'creator' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Video className="w-5 h-5" />
                      </div>
                      {role === 'creator' && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Creator / Influencer</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">
                        Pitch campaigns, verify Instagram stats, receive secure milestone payouts in ₹ INR.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('brand')}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      role === 'brand'
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${role === 'brand' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      {role === 'brand' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Brand / Agency</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">
                        Post campaign briefs, review structured quotes, fund escrow via Razorpay.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Core Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Strength:</span>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${strength.color} transition-all`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium text-slate-700">{strength.text}</span>
                </div>
              )}

              {/* Role-Specific Fields */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  {role === 'creator' ? 'Creator Profile Details' : 'Brand Organization Details'}
                </h4>

                {role === 'creator' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Social Handle
                      </label>
                      <input
                        type="text"
                        placeholder="@handle"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Primary Niche
                      </label>
                      <select
                        value={primaryNiche}
                        onChange={(e) => setPrimaryNiche(e.target.value as NicheType)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
                      >
                        {POPULAR_NICHES.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Base Reel Rate (₹)
                      </label>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        placeholder="15000"
                        value={reelRate}
                        onChange={(e) => setReelRate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lumina Audio"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Consumer Electronics"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Website URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://brand.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Consent & Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setActiveView('terms-of-service')}
                      className="text-purple-600 underline font-medium hover:text-purple-700 cursor-pointer"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => setActiveView('privacy-policy')}
                      className="text-purple-600 underline font-medium hover:text-purple-700 cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                    . I acknowledge that fees (10% + 18% GST) and milestone releases are governed by platform escrow rules.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-sm font-semibold rounded-xl"
                isLoading={isLoading}
              >
                Create Account & Join
              </Button>
            </form>
          )}

          {/* Link to Login */}
          <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-200 pt-6">
            Already have an account?{' '}
            <button
              onClick={() => setActiveView('login')}
              className="font-semibold text-purple-600 hover:text-purple-700 cursor-pointer inline-flex items-center gap-1"
            >
              Sign In <ArrowRight className="w-3 h-3" />
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
    </div>
  );
};
