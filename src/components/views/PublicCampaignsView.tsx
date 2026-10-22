import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign, NicheType, PlatformType } from '../../types';
import { formatRupees } from '../../lib/utils';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  Video,
  Layers,
  LogIn
} from 'lucide-react';

export const PublicCampaignsView: React.FC = () => {
  const { campaigns, currentRole, setActiveView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Filter only published campaigns for public directory
  const publicCampaigns = campaigns.filter(
    (c) => c.status === 'published' || c.status === 'in_progress'
  );

  const filtered = publicCampaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNiche = selectedNiche === 'All' || c.niche === selectedNiche;
    const matchesPlatform =
      selectedPlatform === 'All' ||
      c.deliverables.some((d) => d.platform === selectedPlatform.toLowerCase());

    return matchesSearch && matchesNiche && matchesPlatform;
  });

  const handleApplyClick = (campaign: Campaign) => {
    setSelectedCampaign(null);

    if (currentRole === 'creator') {
      setSelectedCampaignForProposal(campaign);
      setIsProposalModalOpen(true);
      setActiveView('creator-campaigns');
    } else if (currentRole === 'brand') {
      alert('You are currently viewing as a Brand. To apply as a Creator, switch to a Creator profile.');
    } else {
      // Guest: redirect to login
      setActiveView('login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Public Briefs
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
              Discover Active Campaigns
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Explore funded brand campaigns looking for Indian content creators and influencers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView('public-creators')}
            >
              Browse Creators
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveView('register')}
            >
              Post a Campaign (Brands)
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, brand, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
            >
              <option value="All">All Categories / Niches</option>
              <option value="Tech & AI">Tech & AI</option>
              <option value="Fitness & Wellness">Fitness & Wellness</option>
              <option value="Beauty & Fashion">Beauty & Fashion</option>
              <option value="Gaming & Esports">Gaming & Esports</option>
              <option value="Finance & Crypto">Finance & Crypto</option>
              <option value="Food & Cooking">Food & Cooking</option>
              <option value="Travel & Hospitality">Travel & Hospitality</option>
            </select>
          </div>

          <div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
            >
              <option value="All">All Target Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="X">X (Twitter)</option>
              <option value="Podcast">Podcast</option>
            </select>
          </div>
        </div>

        {/* Campaign Briefs List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Matching Campaigns</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                No active briefs match your current filter parameters. Try clearing your filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedNiche('All');
                  setSelectedPlatform('All');
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            filtered.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                      {campaign.niche}
                    </span>
                    <Badge variant={campaign.status === 'published' ? 'success' : 'info'} size="sm">
                      {campaign.status === 'published' ? 'Accepting Bids' : 'In Progress'}
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Due {new Date(campaign.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 hover:text-purple-600 transition-colors cursor-pointer" onClick={() => setSelectedCampaign(campaign)}>
                    {campaign.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {campaign.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      {campaign.brandName}
                    </div>
                    <div>
                      {campaign.deliverables.length} Deliverable{campaign.deliverables.length > 1 ? 's' : ''}:{' '}
                      <span className="font-medium text-slate-800">
                        {campaign.deliverables.map((d) => d.title).join(', ')}
                      </span>
                    </div>
                    <div>
                      Applicants: <span className="font-semibold text-slate-700">{campaign.proposalsCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 gap-3">
                  <div>
                    <span className="text-xs text-slate-500 block md:text-right">Campaign Budget</span>
                    <span className="text-2xl font-black text-slate-900 font-display">
                      {formatRupees(campaign.budget)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      View Brief
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApplyClick(campaign)}
                    >
                      Submit Bid <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <Modal
          isOpen={Boolean(selectedCampaign)}
          onClose={() => setSelectedCampaign(null)}
          title={selectedCampaign.title}
          size="lg"
        >
          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-500">Brand / Organization</span>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  {selectedCampaign.brandName}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Allocated Budget</span>
                <div className="text-2xl font-black text-purple-700">
                  {formatRupees(selectedCampaign.budget)}
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Campaign Overview & Objectives
              </h5>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedCampaign.description}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Required Content Deliverables
              </h5>
              <div className="space-y-2.5">
                {selectedCampaign.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <h6 className="font-bold text-sm text-slate-900">{del.title}</h6>
                        <p className="text-xs text-slate-500">
                          Format: <span className="capitalize">{del.format}</span> on{' '}
                          <span className="capitalize">{del.platform}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">
                        {formatRupees(del.allocatedAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-purple-50/60 p-3.5 rounded-xl border border-purple-100">
              <div>
                <span className="text-purple-900 font-semibold block mb-0.5">Application Deadline:</span>
                <span className="text-slate-700">
                  {new Date(selectedCampaign.deadline).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="text-purple-900 font-semibold block mb-0.5">Escrow Protection:</span>
                <span className="text-slate-700">Milestone funds deposited via Razorpay</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleApplyClick(selectedCampaign)}
              >
                Apply for This Brief <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
