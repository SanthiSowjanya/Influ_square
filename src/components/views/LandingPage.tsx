import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/utils';
import { setStoredAuthUser, DEMO_CREDENTIALS } from '../../lib/supabaseAuth';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Lock,
  ChevronRight,
  CheckCircle2,
  FileCheck2,
  CreditCard,
  UserCheck,
  Building2,
  Scale
} from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';

export const LandingPage: React.FC = () => {
  const { setCurrentRole, setActiveView, campaigns, allCreators, addToast } = useApp();

  const handleEnterAsCreator = () => {
    setStoredAuthUser(DEMO_CREDENTIALS[0]);
    setCurrentRole('creator');
    addToast('success', 'Logged In as Alex Rivera', 'Creator Studio active with verified Instagram stats.');
    setActiveView('creator-dashboard');
  };

  const handleEnterAsBrand = () => {
    setStoredAuthUser(DEMO_CREDENTIALS[1]);
    setCurrentRole('brand');
    addToast('success', 'Logged In as Lumina Audio', 'Brand Workspace active with active campaigns and escrow orders.');
    setActiveView('brand-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Soft Violet Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>India's Marketplace for Influencers, Creators & Leading Brands</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span className="text-slate-500 font-normal">Razorpay Escrow & Meta Graph API</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 max-w-5xl mx-auto leading-[1.1] mb-6">
          Where High-Performing Creators & Brands <span className="gradient-text">Close Real Collaborations</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
          Stop negotiating over chaotic DMs. CreatorSphere provides structured quotations, Razorpay milestone escrow in Indian Rupees (₹), verified Meta Graph audience analytics, and structured deliverable revisions in one professional workspace.
        </p>

        {/* CTA Persona Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-4">
          <Button
            variant="gradient"
            size="lg"
            className="w-full sm:w-auto shadow-md shadow-purple-600/20"
            onClick={handleEnterAsCreator}
          >
            Enter as Creator (Alex Rivera)
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 shadow-xs"
            onClick={handleEnterAsBrand}
          >
            Enter as Brand (Lumina Audio)
            <Briefcase className="w-4 h-4 ml-1 text-purple-600" />
          </Button>
        </div>

        {/* Auth Secondary Links */}
        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 mb-12">
          <span>Need a new account?</span>
          <button
            onClick={() => setActiveView('register')}
            className="text-purple-600 font-bold hover:underline cursor-pointer"
          >
            Sign Up with Supabase →
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveView('how-it-works')}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            How It Works
          </button>
        </div>

        {/* Key Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-left">
          <div className="border-r border-slate-100 pr-4">
            <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-sm mb-1">
              <CreditCard className="w-4 h-4" /> Razorpay Escrow
            </div>
            <p className="text-xs text-slate-500">Milestone deposits held safely until brand deliverable approval.</p>
          </div>
          <div className="md:border-r border-slate-100 pr-4">
            <div className="flex items-center gap-1.5 text-indigo-700 font-extrabold text-sm mb-1">
              <InstagramIcon className="w-4 h-4" /> Meta Graph API
            </div>
            <p className="text-xs text-slate-500">Live audience demographics, engagement rate, and certified reel views.</p>
          </div>
          <div className="border-r border-slate-100 pr-4">
            <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-sm mb-1">
              <FileCheck2 className="w-4 h-4" /> Structured Quotes
            </div>
            <p className="text-xs text-slate-500">Formal deliverables, revision tracking, and commercial contracts.</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-sm mb-1">
              <Scale className="w-4 h-4" /> GST Invoicing
            </div>
            <p className="text-xs text-slate-500">10% commission + 18% GST invoicing complying with Indian tax laws.</p>
          </div>
        </div>
      </section>

      {/* Live Featured Campaigns Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="purple" size="sm" className="mb-2">Marketplace Opportunities</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Brand Campaigns Open for Pitching
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top brands are actively reviewing proposals and funding milestone contracts in INR.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentRole('creator');
              setActiveView('creator-campaigns');
            }}
          >
            View All Campaigns ({campaigns.length})
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.slice(0, 3).map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={campaign.brandLogo}
                      alt={campaign.brandName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {campaign.brandName}
                      </h4>
                      <p className="text-xs text-slate-500">{campaign.niche}</p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm" className="font-semibold text-purple-700 bg-purple-50 border-purple-200">
                    {campaign.primaryPlatform.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">
                  {campaign.title}
                </h3>
                <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {campaign.description}
                </p>

                <div className="space-y-1.5 mb-5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Deliverables:</span>
                    <span className="font-semibold text-slate-800">
                      {campaign.deliverablesRequired.length} Items ({campaign.deliverablesRequired[0]?.format})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Deadline:</span>
                    <span className="font-semibold text-slate-800">{campaign.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Budget Bracket</span>
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(campaign.budgetMin)} - {formatCurrency(campaign.budgetMax)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="gradient"
                  onClick={() => {
                    setCurrentRole('creator');
                    setActiveView('creator-campaigns');
                  }}
                >
                  Pitch Campaign
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Dual-Track Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="purple" size="sm" className="mb-2">Enterprise Workflow</Badge>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Built Specifically for High-Stakes Creator Partnerships
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Eliminate endless email threads and payment disputes with our end-to-end milestone lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Creator Track */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">For Content Creators</h3>
                <p className="text-xs text-slate-500">Monetize your craft with guaranteed milestone protection</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Connect Meta Profile & Portfolio</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Showcase verified audience engagement, past sponsor case studies, and transparent base rates in INR.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Pitch & Send Itemized Quotations</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Submit bids with specific deliverables, revision counts, and counteroffer negotiation inside chat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Deliver with Secured Escrow Settlement</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Work with confidence knowing the brand's funds are funded into milestone escrow before production.
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="mt-8 w-full"
              variant="gradient"
              onClick={() => {
                setCurrentRole('creator');
                setActiveView('creator-dashboard');
              }}
            >
              Explore Creator Dashboard
            </Button>
          </div>

          {/* Brand Track */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">For Direct-to-Consumer Brands</h3>
                <p className="text-xs text-slate-500">Scale verified influencer campaigns with zero friction</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Post Targeted Campaign Briefs</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Define deliverables (4K Reels, Story Sequences, Carousels), usage rights, and budget in INR.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Filter & Compare Real Metrics</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Eliminate fake follower fraud with authentic Meta Graph API analytics, demographics, and reviews.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Review Drafts & Razorpay Settlement</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Review drafts in private staging, request timestamped revisions, or approve to trigger creator payout.
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="mt-8 w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-900"
              variant="secondary"
              onClick={() => {
                setCurrentRole('brand');
                setActiveView('brand-dashboard');
              }}
            >
              Explore Brand Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Verified Creator Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge variant="purple" size="sm" className="mb-2">Top Talent</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Verified Creators
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentRole('brand');
              setActiveView('brand-creators');
            }}
          >
            Browse All Creators ({allCreators.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCreators.map((creator) => (
            <div key={creator.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative mb-4">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.fullName}
                    className="w-full h-44 rounded-xl object-cover border border-slate-100"
                  />
                  {creator.isVerified && (
                    <div className="absolute top-2 right-2 bg-white/95 text-purple-700 p-1.5 rounded-lg border border-purple-200 shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-base font-bold text-slate-900">{creator.fullName}</h4>
                  <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    ★ {creator.rating}
                  </span>
                </div>
                <p className="text-xs text-purple-700 font-medium mb-1.5">{creator.handle}</p>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{creator.headline}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {creator.niches.slice(0, 2).map((n) => (
                    <Badge key={n} variant="default" size="sm" className="bg-slate-100 text-slate-700 border-slate-200">
                      {n}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] font-medium">Reel Rate:</span>
                  <p className="font-bold text-slate-900">{formatCurrency(creator.rates.sponsoredReel)}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCurrentRole('brand');
                    setActiveView('brand-creators');
                  }}
                  className="text-purple-700 hover:bg-purple-50"
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety Architecture Callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-200/80 text-center relative overflow-hidden shadow-sm">
          <Lock className="w-10 h-10 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-3 tracking-tight">
            Designed for Compliance, Security & Trust
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            CreatorSphere is built on Supabase with PostgreSQL Row Level Security (RLS) isolating private client briefs and messages. Razorpay checkout facilitates compliant marketplace order authorization and payouts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="gradient"
              onClick={() => {
                setCurrentRole('creator');
                setActiveView('creator-dashboard');
              }}
            >
              Start Exploring as Creator
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentRole('admin');
                setActiveView('admin-dashboard');
              }}
              className="bg-white hover:bg-slate-50 border-slate-300"
            >
              View Admin & Trust Panel
            </Button>
          </div>
        </div>
      </section>

      {/* Comprehensive Marketplace Footer */}
      <footer className="border-t border-slate-200 bg-white pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 text-lg">
                  Creator<span className="text-purple-600">Sphere</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                India's authentic collaboration marketplace for creators, agencies, and brands. Engineered with Razorpay milestone escrow, Meta Graph API analytics, and 18% GST tax invoices.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                  ₹ INR Escrow
                </span>
                <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium border border-purple-200">
                  Meta Graph API
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                  Supabase RLS
                </span>
              </div>
            </div>

            {/* Col 2: Marketplace Discovery */}
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Marketplace Discovery
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <button
                    onClick={() => setActiveView('public-campaigns')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Find Public Brand Campaigns
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('public-creators')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Browse Creator Directory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('how-it-works')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    How the Workflow Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('how-it-works')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Razorpay Milestone Escrow Guide
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Portals & Workspaces */}
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Portals & Auth
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <button
                    onClick={handleEnterAsCreator}
                    className="hover:text-purple-700 transition-colors cursor-pointer font-medium"
                  >
                    Creator Studio (Alex Rivera)
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleEnterAsBrand}
                    className="hover:text-purple-700 transition-colors cursor-pointer font-medium"
                  >
                    Brand Workspace (Lumina Audio)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentRole('admin');
                      setActiveView('admin-dashboard');
                    }}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Trust & Safety Panel
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('login')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Sign In with Email & Password
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('register')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Register New Profile
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Compliance & Legal */}
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Legal & Compliance
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <button
                    onClick={() => setActiveView('terms-of-service')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Terms of Service (10% + 18% GST)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('privacy-policy')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('privacy-policy')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Meta Platform API Data Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('terms-of-service')}
                    className="hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    Indian IT Act & Dispute Mediation
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Tax Strip */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 CreatorSphere Technologies. Built for India's Digital Creator Economy.</p>
            <p>Milestone escrow settlement powered by Razorpay. All fees subject to 18% GST.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
