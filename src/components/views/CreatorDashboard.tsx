import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign, Quotation } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DashboardLayout } from '../common/DashboardLayout';
import { ProposalSubmissionModal } from '../modals/ProposalSubmissionModal';
import { InstagramConnectModal } from '../modals/InstagramConnectModal';
import { DeliverableSubmissionModal } from '../modals/DeliverableSubmissionModal';
import { CounterOfferModal } from '../modals/CounterOfferModal';
import { EditProfileModal } from '../modals/EditProfileModal';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  DollarSign,
  Briefcase,
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Send,
  Bookmark,
  Building2,
  Landmark,
  CreditCard,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  MessageSquare,
  User
} from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';

interface CreatorDashboardProps {
  initialTab?: 'overview' | 'campaigns' | 'collaborations' | 'proposals' | 'profile' | 'payments';
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ initialTab = 'overview' }) => {
  const {
    currentCreator,
    campaigns,
    proposals,
    quotations,
    collaborations,
    transactions,
    acceptQuotation,
    rejectQuotation,
    addToast,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'collaborations' | 'proposals' | 'profile' | 'payments'>(
    initialTab
  );

  // Modals state
  const [selectedCampaignForProposal, setSelectedCampaignForProposal] = useState<Campaign | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [selectedCollabForDeliverable, setSelectedCollabForDeliverable] = useState<any | null>(null);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [selectedQuoteForCounter, setSelectedQuoteForCounter] = useState<Quotation | null>(null);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Saved / Bookmarked campaigns state
  const [bookmarkedCampaignIds, setBookmarkedCampaignIds] = useState<string[]>(['camp-1']);

  // Campaign Discovery Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // Stats calculation
  const totalEarningsDemo = transactions
    .filter((t) => t.status === 'paid' && t.creatorName.includes('Maya'))
    .reduce((acc, t) => acc + t.netPayout, 0);

  const pendingEscrowDemo = transactions
    .filter((t) => t.status === 'pending' && t.creatorName.includes('Maya'))
    .reduce((acc, t) => acc + t.netPayout, 0);

  const myCollaborations = collaborations.filter((c) => c.creatorId === currentCreator.id);
  const myProposals = proposals.filter((p) => p.creatorId === currentCreator.id);
  const myQuotations = quotations.filter((q) => q.creatorId === currentCreator.id);

  const toggleBookmark = (id: string) => {
    if (bookmarkedCampaignIds.includes(id)) {
      setBookmarkedCampaignIds(bookmarkedCampaignIds.filter((bId) => bId !== id));
      addToast('info', 'Bookmark Removed', 'Campaign removed from your saved list.');
    } else {
      setBookmarkedCampaignIds([...bookmarkedCampaignIds, id]);
      addToast('success', 'Campaign Saved', 'Campaign saved to your bookmarks.');
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNiche = selectedNiche === 'all' || c.niche === selectedNiche;
    const matchesPlatform = selectedPlatform === 'all' || c.primaryPlatform === selectedPlatform;
    return matchesSearch && matchesNiche && matchesPlatform;
  });

  return (
    <DashboardLayout
      role="creator"
      currentTab={activeTab}
      onTabChange={(tabId) => {
        if (tabId === 'inbox') {
          setActiveView('creator-inbox');
        } else {
          setActiveTab(tabId as any);
        }
      }}
      items={[
        { id: 'overview', label: 'Overview', icon: Layers },
        { id: 'campaigns', label: 'Find Campaigns', icon: Search, badge: campaigns.length },
        { id: 'collaborations', label: 'Collaborations', icon: Briefcase, badge: myCollaborations.length },
        { id: 'proposals', label: 'Proposals & Quotes', icon: FileText, badge: myProposals.length + myQuotations.length },
        { id: 'inbox', label: 'Messages', icon: MessageSquare },
        { id: 'profile', label: 'Profile & IG', icon: User },
        { id: 'payments', label: 'Earnings & Escrow', icon: DollarSign }
      ]}
    >
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Dashboard Top Header & Persona Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <img
            src={currentCreator.avatarUrl}
            alt={currentCreator.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-300 shadow-md shadow-purple-600/10"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{currentCreator.fullName}</h1>
              <Badge variant="purple" size="sm">Creator Portal</Badge>
              {currentCreator.isVerified && (
                <span title="Verified Creator" className="text-purple-600">
                  <ShieldCheck className="w-5 h-5 inline" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentCreator.headline}</p>
          </div>
        </div>

        {/* Tab Navigation Pill Strip */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'campaigns' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('collaborations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'collaborations' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Collaborations ({myCollaborations.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'proposals' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Proposals & Quotes ({myProposals.length + myQuotations.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile & IG Sync
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'payments' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Earnings (₹)
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Prominent Meta Graph API Connection Status Strip */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-pink-50 border border-purple-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 flex items-center justify-center shrink-0 shadow-sm">
                <InstagramIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Official Meta Graph API Connection: {currentCreator.instagramData.handle}
                  </h4>
                  {currentCreator.instagramData.syncStatus === 'pending_integration' && (
                    <Badge variant="warning" size="sm">
                      ● Integration Pending
                    </Badge>
                  )}
                  {currentCreator.instagramData.syncStatus === 'synced' && (
                    <Badge variant="success" size="sm">
                      ● Verified API Synced
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Audience Metrics: {currentCreator.instagramData.followers?.toLocaleString()} Followers • {currentCreator.instagramData.avgEngagementRate}% Verified Engagement Rate
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInstagramModalOpen(true)}
              className="shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Manage Meta OAuth
            </Button>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Disbursed Earnings (INR)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                {formatCurrency(totalEarningsDemo)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Direct via Razorpay Payouts</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Locked in Escrow (INR)</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600 tracking-tight">
                {formatCurrency(pendingEscrowDemo)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Disbursed upon deliverable approval</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Active Collaborations</span>
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {myCollaborations.length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Signed contracts in production</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Submitted Bids</span>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {myProposals.length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Active client negotiations</p>
            </div>
          </div>

          {/* Active Collaborations Quick View */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Current Collaborations Under Milestone Protection
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('collaborations')}
              >
                View Full Workspaces
              </Button>
            </div>

            {myCollaborations.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs shadow-xs">
                No active collaborations yet. Pitch on open campaigns to start!
              </div>
            ) : (
              <div className="space-y-3">
                {myCollaborations.map((collab) => (
                  <div
                    key={collab.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={collab.brandLogo}
                        alt={collab.brandName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">{collab.campaignTitle}</h4>
                          <Badge variant="purple" size="sm">
                            {collab.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Brand: {collab.brandName} • Due: {collab.deadline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-[11px] text-slate-500 font-medium">Agreed Fee</span>
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(collab.agreedAmount)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="gradient"
                        onClick={() => {
                          setSelectedCollabForDeliverable(collab);
                          setIsDeliverableModalOpen(true);
                        }}
                      >
                        <UploadCloud className="w-3.5 h-3.5" /> Submit Deliverables
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CAMPAIGN DISCOVERY */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Campaign Discovery & Bidding</h2>
              <p className="text-xs text-slate-500 mt-1">
                Filter verified brand briefs, inspect deliverables, and pitch your custom quotations in INR.
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-medium shadow-xs">
              {filteredCampaigns.length} Opportunities Available
            </span>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns, brands, deliverables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
              >
                <option value="all">All Niches</option>
                <option value="Tech & AI">Tech & AI</option>
                <option value="Fitness & Wellness">Fitness & Wellness</option>
                <option value="Beauty & Fashion">Beauty & Fashion</option>
                <option value="Lifestyle & Family">Lifestyle & Family</option>
                <option value="Design & Creative">Design & Creative</option>
              </select>
            </div>

            <div>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => {
              const isSaved = bookmarkedCampaignIds.includes(camp.id);
              const alreadyPitched = myProposals.some((p) => p.campaignId === camp.id);

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={camp.brandLogo}
                          alt={camp.brandName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{camp.brandName}</h4>
                          <p className="text-xs text-slate-500">{camp.niche}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleBookmark(camp.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-purple-50 border-purple-200 text-purple-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Save Campaign'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                      {camp.description}
                    </p>

                    <div className="space-y-1.5 mb-5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Deliverables:</span>
                        <span className="font-semibold text-slate-800">
                          {camp.deliverablesRequired.length} Items ({camp.deliverablesRequired[0]?.format})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Application Deadline:</span>
                        <span className="font-semibold text-slate-800">{camp.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium">Budget Bracket</span>
                      <p className="text-sm font-bold text-slate-900">
                        {formatCurrency(camp.budgetMin)} - {formatCurrency(camp.budgetMax)}
                      </p>
                    </div>

                    {alreadyPitched ? (
                      <Badge variant="success" size="sm">
                        ✓ Bid Submitted
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="gradient"
                        onClick={() => {
                          setSelectedCampaignForProposal(camp);
                          setIsProposalModalOpen(true);
                        }}
                      >
                        Submit Bid
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: COLLABORATIONS & WORKSPACE */}
      {activeTab === 'collaborations' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Collaboration Workspaces</h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage agreed deliverables, upload high-res media drafts, track revisions, and complete agreements.
            </p>
          </div>

          <div className="space-y-4">
            {myCollaborations.map((collab) => (
              <div key={collab.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={collab.brandLogo}
                      alt={collab.brandName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{collab.campaignTitle}</h3>
                      <p className="text-xs text-slate-500">Brand Partner: {collab.brandName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-medium">Milestone Protection</span>
                      <p className="text-base font-bold text-slate-900">
                        {formatCurrency(collab.agreedAmount)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => {
                        setSelectedCollabForDeliverable(collab);
                        setIsDeliverableModalOpen(true);
                      }}
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Submit Assets
                    </Button>
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-3">Milestone Progression Status</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                      ✓ Agreement Signed
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                      ✓ Escrow Funded
                    </div>
                    <div className={`p-2.5 rounded-lg border font-semibold ${
                      collab.status === 'deliverables_submitted'
                        ? 'bg-purple-50 border-purple-300 text-purple-700'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                      3. Review Staging
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-500 font-semibold">
                      4. Disbursed Payout
                    </div>
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Agreed Scope Items</h4>
                  {collab.deliverables.map((del) => (
                    <div key={del.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{del.title}</p>
                        <p className="text-slate-500">Format: {del.format}</p>
                      </div>
                      <Badge variant={del.status === 'submitted' ? 'purple' : 'outline'} size="sm">
                        {del.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROPOSALS & QUOTES */}
      {activeTab === 'proposals' && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Proposals & Quotation Negotiations</h2>
            <p className="text-xs text-slate-500 mt-1">
              Review received counteroffers, accept formal quotations, or withdraw submitted pitches.
            </p>
          </div>

          {/* Quotations Received */}
          {myQuotations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Formal Brand Quotations ({myQuotations.length})
              </h3>
              {myQuotations.map((quote) => (
                <div key={quote.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{quote.campaignTitle}</h4>
                        <Badge variant="purple" size="sm">
                          Quote #{quote.id.slice(-6).toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Received from Brand • Expires: {formatDate(quote.expiresAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-medium">Offered Rate</span>
                      <p className="text-xl font-extrabold text-slate-900">
                        {formatCurrency(quote.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                    <p className="font-semibold text-slate-800">Specified Deliverables & Revisions:</p>
                    {quote.deliverables.map((d) => (
                      <div key={d.id} className="flex justify-between text-slate-700 border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                        <span>• {d.description} ({d.revisionsAllowed} revision allowances)</span>
                        <span className="font-bold text-slate-900">{formatCurrency(d.price)}</span>
                      </div>
                    ))}
                  </div>

                  {quote.status === 'sent' && (
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                      <Button size="sm" variant="ghost" onClick={() => rejectQuotation(quote.id)}>
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedQuoteForCounter(quote);
                          setIsCounterModalOpen(true);
                        }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Counteroffer
                      </Button>
                      <Button size="sm" variant="gradient" onClick={() => acceptQuotation(quote.id)}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept Quotation
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Proposals Sent */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Submitted Proposals History ({myProposals.length})
            </h3>
            <div className="space-y-3">
              {myProposals.map((prop) => (
                <div key={prop.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{prop.campaignTitle}</h4>
                      <p className="text-xs text-slate-500">
                        Brand: {prop.brandName} • Submitted: {formatDate(prop.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-slate-900">
                        {formatCurrency(prop.proposedRate)}
                      </p>
                      <Badge variant="purple" size="sm">
                        {prop.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    "{prop.coverLetter}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROFILE & INSTAGRAM */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Creator Profile & Meta Graph API Sync</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your content niches, standard rate cards in INR, verified Meta audience analytics, and portfolio.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(true)}>
              Edit Profile & Rate Cards
            </Button>
          </div>

          {/* Meta Graph API Card */}
          <div className="p-6 rounded-2xl bg-white border border-purple-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 flex items-center justify-center shadow-xs">
                  <InstagramIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Official Meta Instagram Graph API</h3>
                    <Badge variant="purple" size="sm">Verified OAuth</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Account: <span className="font-semibold text-purple-700">{currentCreator.instagramData.handle}</span>
                  </p>
                </div>
              </div>
              <Button variant="gradient" size="sm" onClick={() => setIsInstagramModalOpen(true)}>
                Configure Meta OAuth
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">Followers</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">
                  {currentCreator.instagramData.followers?.toLocaleString() || '185,420'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">Avg Engagement</span>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">
                  {currentCreator.instagramData.avgEngagementRate}%
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">Avg Reel Impressions</span>
                <p className="text-lg font-bold text-purple-600 mt-0.5">
                  {currentCreator.instagramData.avgImpressions?.toLocaleString() || '215,000'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">Audience Base</span>
                <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                  {currentCreator.instagramData.topAudienceCountry || 'India (68%)'}
                </p>
              </div>
            </div>
          </div>

          {/* Rate Card (INR) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Standard Rate Card (INR ₹)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Sponsored 4K Reel</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {formatCurrency(currentCreator.rates.sponsoredReel)}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">60s product hook & tagging</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Dedicated Video</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {formatCurrency(currentCreator.rates.dedicatedVideo)}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Full integration tutorial</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">3-Story Sequence</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {formatCurrency(currentCreator.rates.storySet)}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Link sticker + direct CTA</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Custom Package Min</span>
                <p className="text-xl font-extrabold text-purple-600 mt-1">
                  {formatCurrency(currentCreator.rates.customPackageMin)}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Multi-asset brand campaign</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PAYMENTS & RAZORPAY PAYOUTS */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payments, Invoices & Razorpay Payouts</h2>
            <p className="text-xs text-slate-500 mt-1">
              Transparent milestone accounting with automated platform fee deduction and instant bank disbursement.
            </p>
          </div>

          {/* Razorpay Indian Payouts Onboarding Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Razorpay Payouts Onboarding</h3>
                  <Badge variant="success" size="sm">✓ Bank Verified</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct Bank Account (HDFC Bank •••• 4192) & UPI VPA (maya@okhdfcbank) linked for auto-settlement.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update Bank Details
            </Button>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Tax Invoices & Payout Records</h3>
              <span className="text-xs text-slate-500">{transactions.length} Total Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Invoice #</th>
                    <th className="py-3 px-4 font-semibold">Campaign / Client</th>
                    <th className="py-3 px-4 font-semibold">Gross Amount</th>
                    <th className="py-3 px-4 font-semibold">Platform Fee (10%)</th>
                    <th className="py-3 px-4 font-semibold">Net Payout</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                        {tx.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {tx.campaignTitle}
                        <span className="block text-[11px] text-slate-500">{tx.brandName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        -{formatCurrency(tx.platformFee)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {formatCurrency(tx.netPayout)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={tx.status === 'paid' ? 'success' : tx.status === 'pending' ? 'warning' : 'outline'}
                          size="sm"
                        >
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
      <ProposalSubmissionModal
        campaign={selectedCampaignForProposal}
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      />

      <InstagramConnectModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
      />

      <DeliverableSubmissionModal
        collaboration={selectedCollabForDeliverable}
        isOpen={isDeliverableModalOpen}
        onClose={() => setIsDeliverableModalOpen(false)}
      />

      <CounterOfferModal
        quotation={selectedQuoteForCounter}
        isOpen={isCounterModalOpen}
        onClose={() => setIsCounterModalOpen(false)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
      </div>
    </DashboardLayout>
  );
};
