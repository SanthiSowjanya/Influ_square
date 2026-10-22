import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Shield, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';

export const PrivacyPolicyView: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <span className="text-xs text-slate-500">Last Revised: October 2026</span>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Shield className="w-4 h-4 text-emerald-700" />
              Meta Platform Policy & Data Privacy
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              CreatorSphere ("we", "us", or "our") is dedicated to protecting the privacy of creators, brands, and visitors. This Privacy Policy details how we collect, store, and safeguard your personal details and social media metrics in compliance with Indian Information Technology laws and Meta Platform API Terms.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
              <p>We collect only the data necessary to deliver verified marketplace operations:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Account Credentials:</strong> Full name, verified email address, encrypted authentication password tokens managed via Supabase Auth.</li>
                <li><strong>Creator Commercial Profile:</strong> Social handles, portfolio media, public rates, bio, and niche tags.</li>
                <li><strong>Brand Profile:</strong> Legal company name, GST registration number, website URL, and primary contact details.</li>
                <li><strong>Payment Transaction Data:</strong> Razorpay order IDs, escrow milestone states, and bank payout records. We do not store raw credit card numbers or banking PINs.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                2. Meta Graph API Data Usage
              </h2>
              <p>
                When a creator connects their Instagram account via Meta OAuth:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>We request read-only scopes: <code>instagram_basic</code> and <code>instagram_manage_insights</code>.</li>
                <li>We read follower counts, aggregate engagement rates, average reel impressions, and top demographic countries.</li>
                <li>We do NOT read private direct messages (DMs), user passwords, or post comments.</li>
                <li>We do NOT sell, lease, or transfer your social analytics to third-party data brokers.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">3. Data Storage & Supabase Security</h2>
              <p>
                All marketplace databases are managed with enterprise-grade PostgreSQL with Row Level Security (RLS). Database policies strictly prevent creators from reading other creators' private proposals or banking accounts, and restrict brands to viewing applicants only for their own campaigns.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">4. User Data Deletion Rights</h2>
              <p>
                In compliance with Meta Platform Terms and Indian Digital Personal Data Protection guidelines, any user may revoke Meta permissions or request immediate deletion of their account and associated analytics.
              </p>
              <p>
                To request data deletion, email <code>privacy@creatorsphere.in</code> or click "Disconnect Instagram" in your Creator Profile settings. Your cached analytics and tokens will be permanently scrubbed within 48 hours.
              </p>
            </section>

          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Data Protection Officer: privacy@creatorsphere.in
            </span>
            <Button variant="outline" size="sm" onClick={() => setActiveView('terms-of-service')}>
              View Terms of Service
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
