import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  FileCheck,
  Lock,
  Search,
  MessageSquare,
  CreditCard,
  Building2,
  Video
} from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';

export const HowItWorksView: React.FC = () => {
  const { setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<'creators' | 'brands'>('creators');

  const creatorSteps = [
    {
      num: '01',
      title: 'Build Verified Profile & Sync Instagram',
      desc: 'Connect your Instagram Professional or Business account via Meta Graph API OAuth. Your engagement rate, average reel impressions, and verified audience demographics are automatically certified on your profile.',
      icon: InstagramIcon
    },
    {
      num: '02',
      title: 'Discover Briefs & Submit Structured Quotes',
      desc: 'Browse public campaign briefs matching your niche and audience. Submit transparent proposals with custom deliverables, timeline milestones, and fee breakdowns in Indian Rupees (₹).',
      icon: Search
    },
    {
      num: '03',
      title: 'Escrow Guarantee & Real-Time Chat',
      desc: 'Once the brand accepts your proposal, campaign funds are secured in escrow via Razorpay before you begin work. Discuss script drafts and creative angles in real-time messaging.',
      icon: Lock
    },
    {
      num: '04',
      title: 'Submit Deliverables & Instant Bank Payout',
      desc: 'Upload watermarked drafts or live published links directly in your collaboration workspace. Upon brand approval, escrow funds are automatically disbursed to your verified Indian bank account.',
      icon: DollarSign
    }
  ];

  const brandSteps = [
    {
      num: '01',
      title: 'Publish Detailed Campaign Briefs',
      desc: 'Specify your marketing objectives, target demographic, content formats (Reels, Carousels, Stories), timeline deadlines, and total campaign budget in ₹ INR.',
      icon: Building2
    },
    {
      num: '02',
      title: 'Receive & Compare Certified Proposals',
      desc: 'Review structured proposals from verified creators. Compare authentic Meta-certified engagement metrics, previous brand portfolio samples, and quoted milestone rates without agent markup.',
      icon: FileCheck
    },
    {
      num: '03',
      title: 'Safe Razorpay Escrow Protection',
      desc: 'Approve terms and fund milestones through secure Razorpay payment gateway (UPI, Cards, NetBanking). Funds remain protected in platform escrow until you review and approve satisfactory drafts.',
      icon: ShieldCheck
    },
    {
      num: '04',
      title: 'Review Content & Release Milestones',
      desc: 'Provide time-stamped feedback, request revisions, and approve final media rights. Receive compliant GST invoices with full business tax credits upon completion.',
      icon: CreditCard
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Collaboration Protocol
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
            How CreatorSphere Works
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A trusted marketplace connecting verified Indian creators with forward-thinking brands through secure milestone escrow and certified Meta analytics.
          </p>

          {/* Persona Toggle */}
          <div className="flex justify-center pt-4">
            <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300">
              <button
                onClick={() => setActiveTab('creators')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'creators'
                    ? 'bg-white text-purple-700 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4" />
                For Creators & Influencers
              </button>
              <button
                onClick={() => setActiveTab('brands')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'brands'
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                For Brands & Agencies
              </button>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {(activeTab === 'creators' ? creatorSteps : brandSteps).map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    activeTab === 'creators' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-purple-200 transition-colors">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Trust & Escrow Guarantee Box */}
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl mb-16 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Indian Marketplace Financial Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Zero Payment Risk with Razorpay Milestone Escrow
            </h2>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-6">
              Brands never have to worry about ghosting or incomplete deliverables, and creators never have to chase invoices after publishing. All milestone payments are deposited upfront in platform escrow, tracked transparently in Indian Rupees (₹), and only released upon mutual satisfaction or verified arbitration.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/15 text-xs">
              <div>
                <span className="font-bold text-purple-300 block mb-0.5">Transparent Fee:</span>
                10% Platform fee + 18% GST with compliant tax invoicing
              </div>
              <div>
                <span className="font-bold text-purple-300 block mb-0.5">Arbitration Window:</span>
                Admin dispute resolution panel with 7-day review SLA
              </div>
              <div>
                <span className="font-bold text-purple-300 block mb-0.5">Meta Data Certified:</span>
                Official Graph API webhook verification for analytics
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">Ready to Get Started?</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Join thousands of creators and brand marketers driving authentic organic engagement across India.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setActiveView('register')}
              className="px-8 shadow-lg shadow-purple-600/20"
            >
              Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setActiveView('public-campaigns')}
              className="px-6"
            >
              Explore Public Campaigns
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
