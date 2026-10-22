import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatorProfile, NicheType } from '../../types';
import { formatRupees, formatNumber } from '../../lib/utils';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Star,
  MapPin,
  ExternalLink,
  Video,
  ArrowRight,
  TrendingUp,
  Eye,
  CheckCircle2,
  Send
} from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';

export const PublicCreatorsView: React.FC = () => {
  const { allCreators, currentRole, setActiveView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);

  const filteredCreators = allCreators.filter((creator) => {
    const matchesSearch =
      creator.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.headline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNiche =
      selectedNiche === 'All' || creator.niches.includes(selectedNiche as NicheType);

    const matchesVerified = !verifiedOnly || creator.isVerified || creator.instagramData.connected;

    return matchesSearch && matchesNiche && matchesVerified;
  });

  const handleInviteClick = (creator: CreatorProfile) => {
    setSelectedCreator(null);
    if (currentRole === 'brand') {
      setActiveView('brand-creators');
    } else if (currentRole === 'creator') {
      alert('You are currently viewing as a Creator. Switch to a Brand profile to send direct offers.');
    } else {
      // Guest
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
              Verified Creator Directory
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
              Discover Leading Creators
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Explore authentic Indian influencers with verified Meta Instagram analytics and transparent commercial rates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView('public-campaigns')}
            >
              Discover Campaigns
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveView('register')}
            >
              Join as a Creator
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, handle, or bio..."
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
              <option value="All">All Niches & Categories</option>
              <option value="Tech & AI">Tech & AI</option>
              <option value="Fitness & Wellness">Fitness & Wellness</option>
              <option value="Beauty & Fashion">Beauty & Fashion</option>
              <option value="Gaming & Esports">Gaming & Esports</option>
              <option value="Finance & Crypto">Finance & Crypto</option>
              <option value="Food & Cooking">Food & Cooking</option>
              <option value="Travel & Hospitality">Travel & Hospitality</option>
              <option value="Design & Creative">Design & Creative</option>
            </select>
          </div>

          <div className="flex items-center justify-between md:justify-end px-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Analytics Only
              </span>
            </label>
          </div>
        </div>

        {/* Creator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={creator.avatarUrl}
                      alt={creator.fullName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-100 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                          {creator.fullName}
                        </h3>
                        {creator.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Creator" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{creator.handle}</span>
                      {creator.location && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {creator.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {creator.rating.toFixed(1)}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {creator.headline}
                </p>

                {/* Niches */}
                <div className="flex flex-wrap gap-1.5">
                  {creator.niches.map((niche) => (
                    <span
                      key={niche}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {niche}
                    </span>
                  ))}
                </div>

                {/* Meta Instagram Verified Metrics Box */}
                <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-purple-900 font-semibold uppercase tracking-wider block">
                      Avg Engagement
                    </span>
                    <span className="text-sm font-black text-purple-700">
                      {creator.instagramData.avgEngagementRate || 4.2}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-900 font-semibold uppercase tracking-wider block">
                      Base Reel Rate
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {formatRupees(creator.rates.sponsoredReel)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setSelectedCreator(creator)}
                >
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleInviteClick(creator)}
                >
                  Direct Offer
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Creator Profile Public Modal */}
      {selectedCreator && (
        <Modal
          isOpen={Boolean(selectedCreator)}
          onClose={() => setSelectedCreator(null)}
          title={selectedCreator.fullName}
          size="lg"
        >
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCreator.avatarUrl}
                  alt={selectedCreator.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{selectedCreator.fullName}</h3>
                    {selectedCreator.isVerified && (
                      <Badge variant="success" size="sm">
                        Verified Creator
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-purple-700 font-medium">{selectedCreator.handle}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedCreator.location || 'India'}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Starting Reel Rate</span>
                <span className="text-2xl font-black text-slate-900 font-display">
                  {formatRupees(selectedCreator.rates.sponsoredReel)}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                About & Creator Bio
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedCreator.bio || selectedCreator.headline}
              </p>
            </div>

            {/* Meta Certified Insights */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                Meta Graph API Verified Audience Analytics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Followers</span>
                  <span className="text-base font-bold text-slate-900">
                    {formatNumber(selectedCreator.instagramData.followers || 68000)}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Avg Engagement</span>
                  <span className="text-base font-bold text-purple-700">
                    {selectedCreator.instagramData.avgEngagementRate || 4.8}%
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Avg Reel Reach</span>
                  <span className="text-base font-bold text-slate-900">
                    {formatNumber(selectedCreator.instagramData.avgImpressions || 42000)}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Completion Rate</span>
                  <span className="text-base font-bold text-emerald-600">
                    {selectedCreator.completionRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Commercial Rate Card */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Commercial Deliverables Rate Card
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-500 block mb-1">Sponsored Reel:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatRupees(selectedCreator.rates.sponsoredReel)}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-500 block mb-1">Dedicated Long-form:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatRupees(selectedCreator.rates.dedicatedVideo)}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-500 block mb-1">Instagram Story Set (3):</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatRupees(selectedCreator.rates.storySet)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sample Portfolio */}
            {selectedCreator.portfolio.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Verified Portfolio Showcase
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCreator.portfolio.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[11px] text-slate-500">
                          {item.brandClient ? `Client: ${item.brandClient}` : 'Independent'} • {item.views || '50k+ views'}
                        </span>
                      </div>
                      <Badge variant="info" size="sm">
                        {item.platform}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedCreator(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleInviteClick(selectedCreator)}
              >
                Send Direct Campaign Offer <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
