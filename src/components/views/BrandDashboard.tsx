import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatorProfile, Campaign } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DashboardLayout } from '../common/DashboardLayout';
import { CreateCampaignModal } from '../modals/CreateCampaignModal';
import { QuotationModal } from '../modals/QuotationModal';
import { EditProfileModal } from '../modals/EditProfileModal';
import { formatCurrency, formatDate } from '../../lib/utils';
import { generateMarketplaceOrder, launchRazorpayCheckout } from '../../lib/razorpay';
import {
  Briefcase,
  Users,
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  ShieldCheck,
  Play,
  Pause,
  Star,
  FileCheck,
  CreditCard,
  Building2,
  Bookmark,
  Layers,
  MessageSquare,
  Compass,
  FileText
} from 'lucide-react';

interface BrandDashboardProps {
  initialTab?: 'overview' | 'campaigns' | 'creators' | 'proposals' | 'collaborations' | 'payments';
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({ initialTab = 'overview' }) => {
  const {
    currentBrand,
    campaigns,
    allCreators,
    proposals,
    collaborations,
    transactions,
    updateCampaignStatus,
    updateProposalStatus,
    approveDeliverables,
    requestDeliverableRevision,
    addToast,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'creators' | 'proposals' | 'collaborations' | 'payments'>(
    initialTab
  );

  // Modals
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [selectedCreatorForQuote, setSelectedCreatorForQuote] = useState<CreatorProfile | null>(null);
  const [quoteCampaignContext, setQuoteCampaignContext] = useState<Campaign | null>(null);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isEditBrandModalOpen, setIsEditBrandModalOpen] = useState(false);

  // Creator Search & Filter state
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');
  const [creatorNicheFilter, setCreatorNicheFilter] = useState('all');
  const [creatorPlatformFilter, setCreatorPlatformFilter] = useState('all');

  // Revision Feedback state
  const [revisionFeedback, setRevisionFeedback] = useState<Record<string, string>>({});

  // Filtered lists
  const brandCampaigns = campaigns.filter(
    (c) => c.brandId === currentBrand.organization.id || c.brandName.includes('Lumina')
  );

  const brandCollaborations = collaborations;

  const totalSpentDemo = transactions
    .filter((t) => t.status === 'paid')
    .reduce((acc, t) => acc + t.amount, 0);

  const activeEscrowHeld = brandCollaborations
    .filter((c) => c.status !== 'completed' && c.status !== 'cancelled')
    .reduce((acc, c) => acc + c.agreedAmount, 0);

  const filteredCreators = allCreators.filter((creator) => {
    const matchesSearch =
      creator.fullName.toLowerCase().includes(creatorSearchQuery.toLowerCase()) ||
      creator.handle.toLowerCase().includes(creatorSearchQuery.toLowerCase()) ||
      creator.headline.toLowerCase().includes(creatorSearchQuery.toLowerCase());
    const matchesNiche =
      creatorNicheFilter === 'all' || creator.niches.includes(creatorNicheFilter as any);
    const matchesPlatform =
      creatorPlatformFilter === 'all' ||
      creator.platforms.some((p) => p.platform === creatorPlatformFilter);
    return matchesSearch && matchesNiche && matchesPlatform;
  });

  const handleFundEscrowWithRazorpay = (collab: any) => {
    const order = generateMarketplaceOrder(
      collab.id,
      collab.campaignTitle,
      currentBrand.organization.name,
      collab.creatorName,
      collab.agreedAmount
    );

    launchRazorpayCheckout({
      order,
      prefill: {
        name: currentBrand.fullName,
        email: currentBrand.email
      },
      onSuccess: (res) => {
        addToast('success', 'Payment Successful!', `Razorpay Order ${res.razorpay_order_id} funded. Agreement is now active in production.`);
      },
      onFailure: (err) => {
        addToast('info', 'Checkout Closed', err.description || 'Payment dismissed.');
      }
    });
  };

  return (
    <DashboardLayout
      role="brand"
      currentTab={activeTab}
      onTabChange={(tabId) => {
        if (tabId === 'inbox') {
          setActiveView('brand-inbox');
        } else {
          setActiveTab(tabId as any);
        }
      }}
      items={[
        { id: 'overview', label: 'Overview', icon: Layers },
        { id: 'campaigns', label: 'My Campaigns', icon: Briefcase, badge: brandCampaigns.length },
        { id: 'creators', label: 'Find Creators', icon: Search, badge: allCreators.length },
        { id: 'collaborations', label: 'Workspaces', icon: Compass, badge: brandCollaborations.length },
        { id: 'proposals', label: 'Proposals & Pitches', icon: FileText, badge: proposals.length },
        { id: 'inbox', label: 'Messages', icon: MessageSquare },
        { id: 'payments', label: 'Invoices & Escrow', icon: DollarSign }
      ]}
    >
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <img
            src={currentBrand.organization.logoUrl}
            alt={currentBrand.organization.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-md shadow-indigo-600/10"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentBrand.organization.name}
              </h1>
              <Badge variant="purple" size="sm">Brand Organization</Badge>
              {currentBrand.organization.verified && (
                <span title="Verified Brand" className="text-indigo-600">
                  <ShieldCheck className="w-5 h-5 inline" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Representative: {currentBrand.fullName} • {currentBrand.jobTitle} • {currentBrand.organization.industry}
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill Strip */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'campaigns' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Campaigns ({brandCampaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'creators' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Creators ({allCreators.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'proposals' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Received Bids ({proposals.length})
          </button>
          <button
            onClick={() => setActiveTab('collaborations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'collaborations' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Workspaces ({brandCollaborations.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'payments' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Billing & Invoices
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-200/80 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Need to Launch a New Campaign?</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Publish a targeted brief with custom deliverables, audience niches, and INR budget brackets.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditBrandModalOpen(true)}>
                Edit Brand Profile
              </Button>
              <Button variant="gradient" size="sm" onClick={() => setIsCreateCampaignOpen(true)}>
                <Plus className="w-4 h-4" /> Create Campaign Brief
              </Button>
            </div>
          </div>

          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Total Campaign Spend</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                {formatCurrency(totalSpentDemo)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Disbursed for completed assets</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Locked in Escrow</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600 tracking-tight">
                {formatCurrency(activeEscrowHeld)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Authorized via Razorpay Route</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Active Campaigns</span>
                <Briefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {brandCampaigns.length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Accepting creator pitches</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Active Collaborations</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {brandCollaborations.length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Creators currently producing</p>
            </div>
          </div>

          {/* Deliverables Staging Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Deliverables Ready for Review & Approval
            </h3>

            {brandCollaborations.filter((c) => c.status === 'deliverables_submitted').length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs shadow-xs">
                No deliverables currently pending review. Creators in active collaborations will submit drafts here.
              </div>
            ) : (
              <div className="space-y-4">
                {brandCollaborations
                  .filter((c) => c.status === 'deliverables_submitted')
                  .map((collab) => (
                    <div
                      key={collab.id}
                      className="p-6 rounded-2xl bg-white border border-purple-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={collab.creatorAvatar}
                            alt={collab.creatorName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{collab.creatorName}</h4>
                            <p className="text-xs text-slate-500">
                              Campaign: {collab.campaignTitle} • Handled: {collab.creatorHandle}
                            </p>
                          </div>
                        </div>
                        <Badge variant="purple" size="sm">
                          Deliverables Submitted (v1)
                        </Badge>
                      </div>

                      {/* Submitted Assets Preview */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                        <p className="font-bold text-slate-800">Submitted Asset Links:</p>
                        {collab.deliverables.map((del) => (
                          <div key={del.id} className="flex items-center justify-between text-slate-700">
                            <span>• {del.title} ({del.format})</span>
                            {del.submission?.socialDraftLink && (
                              <a
                                href={del.submission.socialDraftLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-1 underline"
                              >
                                Preview Reel Draft <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Revision Feedback Form & Approval Action */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
                        <input
                          type="text"
                          placeholder="Optional revision notes (e.g. adjust logo brightness at 0:15)..."
                          value={revisionFeedback[collab.id] || ''}
                          onChange={(e) =>
                            setRevisionFeedback({ ...revisionFeedback, [collab.id]: e.target.value })
                          }
                          className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              requestDeliverableRevision(
                                collab.id,
                                'cd-1',
                                revisionFeedback[collab.id] || 'Please review pacing and add product tag.'
                              );
                              setRevisionFeedback({ ...revisionFeedback, [collab.id]: '' });
                            }}
                          >
                            Request Revision
                          </Button>
                          <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => approveDeliverables(collab.id)}
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve & Disburse Payout
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Brand Campaign Briefs</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your active briefs, pause recruitment, or publish new campaign briefs for Indian creators.
              </p>
            </div>
            <Button variant="gradient" size="sm" onClick={() => setIsCreateCampaignOpen(true)}>
              <Plus className="w-4 h-4" /> New Campaign Brief
            </Button>
          </div>

          <div className="space-y-4">
            {brandCampaigns.map((camp) => (
              <div key={camp.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{camp.title}</h3>
                      <Badge variant={camp.status === 'published' ? 'success' : 'outline'} size="sm">
                        {camp.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Niche: {camp.niche} • Platform: {camp.primaryPlatform.toUpperCase()} • Deadline: {camp.deadline}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 font-medium">Budget Bracket</span>
                    <p className="text-base font-bold text-slate-900">
                      {formatCurrency(camp.budgetMin)} - {formatCurrency(camp.budgetMax)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {camp.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    {camp.proposalsCount} Proposals Received • {camp.shortlistedCount} Shortlisted
                  </span>
                  <div className="flex items-center gap-2">
                    {camp.status === 'published' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateCampaignStatus(camp.id, 'paused')}
                      >
                        <Pause className="w-3.5 h-3.5" /> Pause
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateCampaignStatus(camp.id, 'published')}
                      >
                        <Play className="w-3.5 h-3.5" /> Resume
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab('proposals')}
                    >
                      Review Bids ({camp.proposalsCount})
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FIND CREATORS */}
      {activeTab === 'creators' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Discover & Scout Verified Creators</h2>
            <p className="text-xs text-slate-500 mt-1">
              Filter creators with official Meta Graph API verified audience engagement, rate cards, and location.
            </p>
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by creator name, handle, keyword..."
                value={creatorSearchQuery}
                onChange={(e) => setCreatorSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
            <div>
              <select
                value={creatorNicheFilter}
                onChange={(e) => setCreatorNicheFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              >
                <option value="all">All Content Niches</option>
                <option value="Tech & AI">Tech & AI</option>
                <option value="Fitness & Wellness">Fitness & Wellness</option>
                <option value="Beauty & Fashion">Beauty & Fashion</option>
                <option value="Lifestyle & Family">Lifestyle & Family</option>
              </select>
            </div>
            <div>
              <select
                value={creatorPlatformFilter}
                onChange={(e) => setCreatorPlatformFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <div key={creator.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between">
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
                    variant="gradient"
                    onClick={() => {
                      setSelectedCreatorForQuote(creator);
                      setQuoteCampaignContext(brandCampaigns[0] || campaigns[0]);
                      setIsQuotationModalOpen(true);
                    }}
                  >
                    Send Direct Offer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROPOSALS RECEIVED */}
      {activeTab === 'proposals' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Received Creator Bids & Proposals</h2>
            <p className="text-xs text-slate-500 mt-1">
              Compare pitches, evaluate proposed turnaround times, counteroffer, or accept to trigger Razorpay checkout.
            </p>
          </div>

          <div className="space-y-4">
            {proposals.map((prop) => (
              <div key={prop.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={prop.creatorAvatar}
                      alt={prop.creatorName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{prop.creatorName}</h4>
                        <span className="text-xs text-purple-700 font-medium">{prop.creatorHandle}</span>
                        <Badge variant="purple" size="sm">★ {prop.creatorRating}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Applied for: <span className="font-semibold text-slate-800">{prop.campaignTitle}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 font-medium">Proposed Rate</span>
                    <p className="text-xl font-extrabold text-slate-900">
                      {formatCurrency(prop.proposedRate)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  "{prop.coverLetter}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    Estimated Delivery: {prop.estimatedDeliveryDays} days
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateProposalStatus(prop.id, 'rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProposalStatus(prop.id, 'shortlisted')}
                    >
                      Shortlist
                    </Button>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => {
                        updateProposalStatus(prop.id, 'accepted');
                        addToast('success', 'Bid Accepted!', `Accepted bid from ${prop.creatorName}. Initializing Razorpay escrow funding.`);
                      }}
                    >
                      Accept & Fund Milestone
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ACTIVE COLLABORATION WORKSPACES */}
      {activeTab === 'collaborations' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Collaboration Workspaces</h2>
            <p className="text-xs text-slate-500 mt-1">
              Review deliverables, inspect staging links, fund agreements, and manage live contract milestones.
            </p>
          </div>

          <div className="space-y-4">
            {brandCollaborations.map((collab) => (
              <div key={collab.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={collab.creatorAvatar}
                      alt={collab.creatorName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{collab.campaignTitle}</h3>
                      <p className="text-xs text-slate-500">
                        Creator: {collab.creatorName} ({collab.creatorHandle}) • Due: {collab.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-medium">Milestone Fee</span>
                      <p className="text-base font-bold text-slate-900">
                        {formatCurrency(collab.agreedAmount)}
                      </p>
                    </div>
                    {collab.paymentStatus === 'unfunded' && (
                      <Button
                        size="sm"
                        variant="gradient"
                        onClick={() => handleFundEscrowWithRazorpay(collab)}
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Fund with Razorpay
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Agreed Scope Items</h4>
                  {collab.deliverables.map((del) => (
                    <div key={del.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{del.title}</p>
                        <p className="text-slate-500">Format: {del.format}</p>
                      </div>
                      <Badge variant={del.status === 'approved' ? 'success' : 'purple'} size="sm">
                        {del.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PAYMENTS & BILLING */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Campaign Billing & GST Invoices</h2>
            <p className="text-xs text-slate-500 mt-1">
              Compliant Indian marketplace payment orders processed through Razorpay with formal tax receipts.
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Payment Transaction Records</h3>
              <span className="text-xs text-slate-500">{transactions.length} Total Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Invoice #</th>
                    <th className="py-3 px-4 font-semibold">Creator</th>
                    <th className="py-3 px-4 font-semibold">Gross Campaign Amount</th>
                    <th className="py-3 px-4 font-semibold">GST on Commission</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                        {tx.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {tx.creatorName}
                        <span className="block text-[11px] text-slate-500">{tx.campaignTitle}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatCurrency(Math.round(tx.platformFee * 0.18))}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={tx.status === 'paid' ? 'success' : 'warning'} size="sm">
                          {tx.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
      />

      <QuotationModal
        creator={selectedCreatorForQuote}
        campaignContext={quoteCampaignContext}
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
      />

      <EditProfileModal
        isOpen={isEditBrandModalOpen}
        onClose={() => setIsEditBrandModalOpen(false)}
      />
      </div>
    </DashboardLayout>
  );
};
