import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { NicheType } from '../../types';
import { UserPlus, Sparkles, Building2, Check, IndianRupee } from 'lucide-react';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'creator' | 'brand';
}

const PRESET_CREATOR_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80'
];

const PRESET_BRAND_LOGOS = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=200&q=80'
];

const ALL_NICHES: NicheType[] = [
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

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'creator'
}) => {
  const { createCreatorProfile, createBrandProfile } = useApp();

  const [activeTab, setActiveTab] = useState<'creator' | 'brand'>(defaultRole);

  // Creator Form State
  const [creatorName, setCreatorName] = useState('');
  const [creatorHandle, setCreatorHandle] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorHeadline, setCreatorHeadline] = useState('');
  const [creatorBio, setCreatorBio] = useState('');
  const [creatorLocation, setCreatorLocation] = useState('Bengaluru, India');
  const [creatorAvatarUrl, setCreatorAvatarUrl] = useState(PRESET_CREATOR_AVATARS[0]);
  const [selectedNiches, setSelectedNiches] = useState<NicheType[]>(['Tech & AI', 'Design & Creative']);
  const [reelRate, setReelRate] = useState<number>(25000);
  const [videoRate, setVideoRate] = useState<number>(45000);
  const [storyRate, setStoryRate] = useState<number>(10000);
  const [minPackage, setMinPackage] = useState<number>(30000);
  const [igFollowers, setIgFollowers] = useState<number>(85000);

  // Brand Form State
  const [brandOrgName, setBrandOrgName] = useState('');
  const [brandIndustry, setBrandIndustry] = useState('Consumer Tech & Wearables');
  const [brandWebsite, setBrandWebsite] = useState('https://mybrand.in');
  const [brandLogoUrl, setBrandLogoUrl] = useState(PRESET_BRAND_LOGOS[0]);
  const [brandDescription, setBrandDescription] = useState('');
  const [brandContactName, setBrandContactName] = useState('');
  const [brandContactTitle, setBrandContactTitle] = useState('Head of Influencer Marketing');
  const [brandContactEmail, setBrandContactEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleNiche = (niche: NicheType) => {
    if (selectedNiches.includes(niche)) {
      if (selectedNiches.length > 1) {
        setSelectedNiches(selectedNiches.filter((n) => n !== niche));
      }
    } else {
      setSelectedNiches([...selectedNiches, niche]);
    }
  };

  const handleCreatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim() || !creatorHandle.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const cleanHandle = creatorHandle.startsWith('@') ? creatorHandle : `@${creatorHandle}`;

      createCreatorProfile({
        fullName: creatorName.trim(),
        handle: cleanHandle,
        email: creatorEmail.trim() || `${creatorHandle.replace('@', '')}@creatorsphere.demo`,
        avatarUrl: creatorAvatarUrl,
        headline: creatorHeadline.trim() || `${selectedNiches.join(' & ')} Creator | ${igFollowers.toLocaleString('en-IN')}+ Audience`,
        bio: creatorBio.trim() || `Passionate creator producing high-converting visual assets and storytelling campaigns.`,
        location: creatorLocation,
        isVerified: true,
        niches: selectedNiches,
        platforms: [
          {
            platform: 'instagram',
            handle: cleanHandle.replace('@', ''),
            followers: igFollowers,
            url: `https://instagram.com/${cleanHandle.replace('@', '')}`
          }
        ],
        rates: {
          sponsoredReel: reelRate,
          dedicatedVideo: videoRate,
          storySet: storyRate,
          customPackageMin: minPackage
        },
        instagramData: {
          connected: true,
          handle: cleanHandle,
          followers: igFollowers,
          avgEngagementRate: 4.6,
          avgImpressions: Math.round(igFollowers * 1.4),
          topAudienceCountry: 'India (78%)',
          syncStatus: 'pending_integration',
          lastSyncedAt: new Date().toISOString()
        },
        portfolio: [
          {
            id: 'demo-port-1',
            title: 'Cinematic Lifestyle & Hardware Showcase',
            mediaUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
            platform: 'instagram',
            engagementRate: '5.1%',
            impressions: `${Math.round(igFollowers * 0.9 / 1000)}K`,
            brandClient: 'Launch Partner'
          }
        ],
        badges: ['New Talent', 'Fast Responder (< 1hr)']
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandOrgName.trim() || !brandContactName.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const orgId = 'org-' + Math.random().toString(36).substring(2, 9);

      createBrandProfile({
        fullName: brandContactName.trim(),
        email: brandContactEmail.trim() || `partnerships@${brandOrgName.toLowerCase().replace(/\s+/g, '')}.demo`,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        jobTitle: brandContactTitle.trim() || 'Head of Creator Partnerships',
        location: 'Bengaluru, India',
        isVerified: true,
        organization: {
          id: orgId,
          name: brandOrgName.trim(),
          industry: brandIndustry.trim(),
          website: brandWebsite.trim(),
          logoUrl: brandLogoUrl,
          description: brandDescription.trim() || `Forward-thinking brand collaborating with top-tier verified creators.`,
          verified: true,
          totalSpentDemo: 0,
          activeCampaignsCount: 0
        }
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Profile"
      description="Register a new dynamic Influencer or Brand Organization on CreatorSphere"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('creator')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'creator'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Join as Content Creator / Influencer
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'brand'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" /> Join as Brand / Organization
          </button>
        </div>

        {/* CREATOR ONBOARDING FORM */}
        {activeTab === 'creator' && (
          <form onSubmit={handleCreatorSubmit} className="space-y-5 animate-fade-in">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Creator Name <span className="text-violet-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Lee"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Social Handle <span className="text-violet-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="@jordan.visuals"
                  value={creatorHandle}
                  onChange={(e) => setCreatorHandle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600 font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jordan@creatorsphere.in"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Location / Base
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, India"
                  value={creatorLocation}
                  onChange={(e) => setCreatorLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Headline / Positioning Statement
              </label>
              <input
                type="text"
                placeholder="e.g. Tech & Cinematic Storytelling Creator | 85K+ Engaged Community"
                value={creatorHeadline}
                onChange={(e) => setCreatorHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bio & Creative Pitch
              </label>
              <textarea
                rows={2}
                placeholder="Tell brands about your aesthetic style, camera equipment, and average video engagement..."
                value={creatorBio}
                onChange={(e) => setCreatorBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Choose Profile Photo Preset or Enter Image URL
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {PRESET_CREATOR_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCreatorAvatarUrl(url)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      creatorAvatarUrl === url ? 'border-violet-600 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    {creatorAvatarUrl === url && (
                      <div className="absolute inset-0 bg-violet-600/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={creatorAvatarUrl}
                onChange={(e) => setCreatorAvatarUrl(e.target.value)}
                placeholder="Or paste custom image URL: https://..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 mt-2"
              />
            </div>

            {/* Niches Multi-Select */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Select Your Content Niches ({selectedNiches.length} selected)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_NICHES.map((n) => {
                  const isSelected = selectedNiches.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => toggleNiche(n)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-violet-100 text-violet-700 border border-violet-300 font-semibold'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rate Card & Audience Size */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900">Rate Card (₹ INR) & Initial Instagram Audience</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Sponsored Reel (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={reelRate}
                    onChange={(e) => setReelRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-violet-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Dedicated Video (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={videoRate}
                    onChange={(e) => setVideoRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-violet-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Story Sequence (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={storyRate}
                    onChange={(e) => setStoryRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-violet-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Followers</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={igFollowers}
                    onChange={(e) => setIgFollowers(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                <UserPlus className="w-4 h-4" /> Create Creator Profile
              </Button>
            </div>
          </form>
        )}

        {/* BRAND ONBOARDING FORM */}
        {activeTab === 'brand' && (
          <form onSubmit={handleBrandSubmit} className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Company / Brand Name <span className="text-violet-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solace Kinetic"
                  value={brandOrgName}
                  onChange={(e) => setBrandOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Industry / Category <span className="text-violet-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart Wearables & Audio"
                  value={brandIndustry}
                  onChange={(e) => setBrandIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600 font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Name (Brand Representative) <span className="text-violet-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rachel Adams"
                  value={brandContactName}
                  onChange={(e) => setBrandContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Global Head of Influencer Marketing"
                  value={brandContactTitle}
                  onChange={(e) => setBrandContactTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Work / Contact Email
                </label>
                <input
                  type="email"
                  placeholder="partnerships@brand.com"
                  value={brandContactEmail}
                  onChange={(e) => setBrandContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  placeholder="https://solacekinetic.com"
                  value={brandWebsite}
                  onChange={(e) => setBrandWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company Overview & Creator Pitch
              </label>
              <textarea
                rows={2}
                placeholder="Describe what products you make and what creators you seek to partner with..."
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
              />
            </div>

            {/* Brand Logo Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Brand Logo Preset or Custom Image URL
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {PRESET_BRAND_LOGOS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBrandLogoUrl(url)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      brandLogoUrl === url ? 'border-violet-600 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Logo preset ${i}`} className="w-full h-full object-cover" />
                    {brandLogoUrl === url && (
                      <div className="absolute inset-0 bg-violet-600/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={brandLogoUrl}
                onChange={(e) => setBrandLogoUrl(e.target.value)}
                placeholder="Or paste custom logo URL: https://..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 mt-2"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                <Building2 className="w-4 h-4" /> Create Brand Profile
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
