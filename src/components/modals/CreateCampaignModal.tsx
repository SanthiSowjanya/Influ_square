import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { NicheType, PlatformType } from '../../types';
import { Plus, Trash2, Rocket, IndianRupee } from 'lucide-react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose }) => {
  const { createCampaign, currentBrand } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [niche, setNiche] = useState<NicheType>('Tech & AI');
  const [primaryPlatform, setPrimaryPlatform] = useState<PlatformType>('instagram');
  const [budgetMin, setBudgetMin] = useState<number>(35000);
  const [budgetMax, setBudgetMax] = useState<number>(75000);
  const [deadline, setDeadline] = useState('2026-11-30');
  const [locationRequirement, setLocationRequirement] = useState('Remote / Pan-India (Product Shipped)');
  const [deliverables, setDeliverables] = useState<
    { id: string; title: string; format: 'Reel' | 'TikTok' | 'YouTube Video' | 'Story Sequence' | 'Static Post'; quantity: number; guidelines: string }[]
  >([
    {
      id: 'd-1',
      title: 'Dedicated 60s Reel Spotlight',
      format: 'Reel',
      quantity: 1,
      guidelines: 'Demonstrate product unboxing and unique feature workflow.'
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const niches: NicheType[] = [
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

  const handleAddDeliverable = () => {
    setDeliverables([
      ...deliverables,
      {
        id: 'd-' + Date.now(),
        title: 'Story Sequence or Stills',
        format: 'Story Sequence',
        quantity: 1,
        guidelines: 'Behind the scenes + link to product checkout.'
      }
    ]);
  };

  const handleRemoveDeliverable = (id: string) => {
    if (deliverables.length === 1) return;
    setDeliverables(deliverables.filter((d) => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createCampaign({
        brandId: currentBrand.organization.id,
        brandName: currentBrand.organization.name,
        brandLogo: currentBrand.organization.logoUrl,
        title,
        description,
        niche,
        primaryPlatform,
        budgetMin,
        budgetMax,
        currency: 'INR',
        deadline,
        locationRequirement,
        targetAudience: {
          locations: ['India', 'Bengaluru', 'Mumbai', 'Delhi-NCR'],
          ageRanges: ['18-34'],
          minFollowers: 25000,
          minEngagementRate: 3.5
        },
        deliverablesRequired: deliverables,
        status: 'published'
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Campaign Brief"
      description={`Post a collaboration opportunity for ${currentBrand.organization.name}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Campaign Title <span className="text-violet-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Next-Gen Active Earbuds Launch: High-Energy Fitness Creators"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Campaign Overview & Objectives <span className="text-violet-600">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your brand goals, talking points, key value props, and target audience persona..."
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Target Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value as NicheType)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-violet-600 font-medium"
            >
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Primary Platform</label>
            <select
              value={primaryPlatform}
              onChange={(e) => setPrimaryPlatform(e.target.value as PlatformType)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-violet-600 font-medium"
            >
              <option value="instagram">Instagram (Reels / Stories)</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube (Video / Shorts)</option>
              <option value="x">X / Twitter</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Min Budget (₹ INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
              <input
                type="number"
                min="5000"
                step="1000"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Max Budget (₹ INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
              <input
                type="number"
                min="5000"
                step="1000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Deadline Date</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Location & Logistics</label>
          <input
            type="text"
            value={locationRequirement}
            onChange={(e) => setLocationRequirement(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-medium"
          />
        </div>

        {/* Deliverables Required */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">
              Required Deliverable Specs ({deliverables.length})
            </label>
            <button
              type="button"
              onClick={handleAddDeliverable}
              className="text-xs text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Requirement
            </button>
          </div>

          <div className="space-y-2.5">
            {deliverables.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={d.title}
                    onChange={(e) => {
                      const updated = deliverables.map((item) =>
                        item.id === d.id ? { ...item, title: e.target.value } : item
                      );
                      setDeliverables(updated);
                    }}
                    placeholder="Deliverable title"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-medium"
                    required
                  />
                  <select
                    value={d.format}
                    onChange={(e) => {
                      const updated = deliverables.map((item) =>
                        item.id === d.id ? { ...item, format: e.target.value as any } : item
                      );
                      setDeliverables(updated);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-700 font-medium"
                  >
                    <option value="Reel">Reel</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube Video">YouTube Video</option>
                    <option value="Story Sequence">Story Sequence</option>
                    <option value="Static Post">Static Post</option>
                  </select>
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(d.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={d.guidelines}
                  onChange={(e) => {
                    const updated = deliverables.map((item) =>
                      item.id === d.id ? { ...item, guidelines: e.target.value } : item
                    );
                    setDeliverables(updated);
                  }}
                  placeholder="Creative guidelines, dos and don'ts..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            <Rocket className="w-4 h-4" /> Publish Campaign
          </Button>
        </div>
      </form>
    </Modal>
  );
};
