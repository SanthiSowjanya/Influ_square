import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { NicheType } from '../../types';
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    currentRole,
    currentCreator,
    currentBrand,
    updateCreatorProfile,
    updateBrandProfile,
    addPortfolioItem
  } = useApp();

  // Creator state
  const [headline, setHeadline] = useState(currentCreator.headline);
  const [bio, setBio] = useState(currentCreator.bio || '');
  const [location, setLocation] = useState(currentCreator.location || '');
  const [niches, setNiches] = useState<NicheType[]>(currentCreator.niches);
  const [reelRate, setReelRate] = useState(currentCreator.rates.sponsoredReel);
  const [videoRate, setVideoRate] = useState(currentCreator.rates.dedicatedVideo);
  const [storyRate, setStoryRate] = useState(currentCreator.rates.storySet);
  const [minPackage, setMinPackage] = useState(currentCreator.rates.customPackageMin);

  // New portfolio item form
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortClient, setNewPortClient] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortReach, setNewPortReach] = useState('');

  // Brand state
  const [brandName, setBrandName] = useState(currentBrand.organization.name);
  const [brandIndustry, setBrandIndustry] = useState(currentBrand.organization.industry);
  const [brandWebsite, setBrandWebsite] = useState(currentBrand.organization.website);
  const [brandDesc, setBrandDesc] = useState(currentBrand.organization.description);
  const [brandContactName, setBrandContactName] = useState(currentBrand.fullName);
  const [brandContactTitle, setBrandContactTitle] = useState(currentBrand.jobTitle);

  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (currentRole === 'creator') {
      setHeadline(currentCreator.headline);
      setBio(currentCreator.bio || '');
      setLocation(currentCreator.location || '');
      setNiches(currentCreator.niches);
      setReelRate(currentCreator.rates.sponsoredReel);
      setVideoRate(currentCreator.rates.dedicatedVideo);
      setStoryRate(currentCreator.rates.storySet);
      setMinPackage(currentCreator.rates.customPackageMin);
    } else {
      setBrandName(currentBrand.organization.name);
      setBrandIndustry(currentBrand.organization.industry);
      setBrandWebsite(currentBrand.organization.website);
      setBrandDesc(currentBrand.organization.description);
      setBrandContactName(currentBrand.fullName);
      setBrandContactTitle(currentBrand.jobTitle);
    }
  }, [currentRole, currentCreator, currentBrand]);

  const toggleNiche = (n: NicheType) => {
    if (niches.includes(n)) {
      if (niches.length > 1) setNiches(niches.filter((item) => item !== n));
    } else {
      setNiches([...niches, n]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (currentRole === 'creator') {
        updateCreatorProfile({
          headline,
          bio,
          location,
          niches,
          rates: {
            sponsoredReel: reelRate,
            dedicatedVideo: videoRate,
            storySet: storyRate,
            customPackageMin: minPackage
          }
        });

        // Add portfolio item if user typed one
        if (newPortTitle.trim() && newPortClient.trim()) {
          addPortfolioItem(currentCreator.id, {
            title: newPortTitle.trim(),
            brandClient: newPortClient.trim(),
            mediaUrl: newPortUrl.trim() || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
            platform: 'instagram',
            engagementRate: '5.2%',
            impressions: newPortReach.trim() || '150K'
          });
          setNewPortTitle('');
          setNewPortClient('');
        }
      } else {
        updateBrandProfile({
          fullName: brandContactName,
          jobTitle: brandContactTitle,
          organization: {
            ...currentBrand.organization,
            name: brandName,
            industry: brandIndustry,
            website: brandWebsite,
            description: brandDesc
          }
        });
      }

      setIsSaving(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentRole === 'creator' ? 'Edit Creator Profile & Rates' : 'Edit Brand Organization'}
      description="Update your live profile information, rates, and portfolio"
      maxWidth="xl"
    >
      <form onSubmit={handleSave} className="space-y-5">
        {currentRole === 'creator' ? (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
              />
            </div>

            {/* Niches */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Content Niches</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_NICHES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggleNiche(n)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      niches.includes(n)
                        ? 'bg-violet-100 text-violet-700 border border-violet-300 font-semibold'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {niches.includes(n) ? '✓ ' : '+ '}{n}
                  </button>
                ))}
              </div>
            </div>

            {/* Rate Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900">Rate Card (₹ INR)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Reel (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={reelRate}
                    onChange={(e) => setReelRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-violet-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Video (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={videoRate}
                    onChange={(e) => setVideoRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-violet-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Story (₹)</label>
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
                  <label className="block text-[10px] text-slate-500 mb-1">Min Pkg (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={minPackage}
                    onChange={(e) => setMinPackage(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Quick Add Portfolio Item */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900">+ Add Case Study / Portfolio Item</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Case study title (e.g. 4K Studio Unboxing)"
                  value={newPortTitle}
                  onChange={(e) => setNewPortTitle(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-medium"
                />
                <input
                  type="text"
                  placeholder="Brand Client (e.g. Sony Audio)"
                  value={newPortClient}
                  onChange={(e) => setNewPortClient(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-medium"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  placeholder="Media / Image URL (optional)"
                  value={newPortUrl}
                  onChange={(e) => setNewPortUrl(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Reach / Impressions (e.g. 240K)"
                  value={newPortReach}
                  onChange={(e) => setNewPortReach(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={brandIndustry}
                  onChange={(e) => setBrandIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Website URL</label>
              <input
                type="url"
                value={brandWebsite}
                onChange={(e) => setBrandWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={brandDesc}
                onChange={(e) => setBrandDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={brandContactName}
                  onChange={(e) => setBrandContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={brandContactTitle}
                  onChange={(e) => setBrandContactTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
