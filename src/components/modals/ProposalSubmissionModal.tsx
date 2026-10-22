import React, { useState } from 'react';
import { Campaign } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../lib/utils';
import { Sparkles, Calendar, IndianRupee, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ProposalSubmissionModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalSubmissionModal: React.FC<ProposalSubmissionModalProps> = ({
  campaign,
  isOpen,
  onClose
}) => {
  const { submitProposal, currentCreator } = useApp();

  const [proposedRate, setProposedRate] = useState<number>(campaign?.budgetMin || 25000);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState<number>(7);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [deliverables, setDeliverables] = useState<{ title: string; description: string }[]>([
    {
      title: 'Dedicated 60s 4K Instagram Reel',
      description: 'Full unboxing, aesthetic feature breakdown, and customized call-to-action.'
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync rate when campaign changes
  React.useEffect(() => {
    if (campaign) {
      setProposedRate(campaign.budgetMin || 25000);
      setCoverLetter(
        `Hi ${campaign.brandName} team! I'm ${currentCreator.fullName}. I have an engaged audience in ${campaign.niche} and would love to collaborate on the "${campaign.title}" campaign.`
      );
    }
  }, [campaign, currentCreator]);

  if (!campaign) return null;

  const handleAddDeliverable = () => {
    setDeliverables([
      ...deliverables,
      { title: 'Additional Story Sequence / Stills', description: 'Cross-promotion with trackable sticker link.' }
    ]);
  };

  const handleRemoveDeliverable = (index: number) => {
    if (deliverables.length === 1) return;
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleDeliverableChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...deliverables];
    updated[index][field] = value;
    setDeliverables(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim() || proposedRate <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitProposal({
        campaignId: campaign.id,
        proposedRate,
        coverLetter,
        estimatedDeliveryDays,
        deliverables
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const platformFee = Math.round(proposedRate * 0.10);
  const gstOnFee = Math.round(platformFee * 0.18);
  const netPayout = proposedRate - platformFee - gstOnFee;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Campaign Proposal"
      description={`Pitch your creative package to ${campaign.brandName}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{campaign.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <IndianRupee className="w-3.5 h-3.5 text-violet-600" />
                Budget: {formatCurrency(campaign.budgetMin)} - {formatCurrency(campaign.budgetMax)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Deadline: {campaign.deadline}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-violet-100 text-violet-700 border border-violet-200">
            {campaign.primaryPlatform.toUpperCase()}
          </span>
        </div>

        {/* Pricing & Timeline Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Your Proposed Bid (INR ₹) <span className="text-violet-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">₹</span>
              <input
                type="number"
                min="1000"
                step="500"
                value={proposedRate}
                onChange={(e) => setProposedRate(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 font-semibold"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              10% fee (₹{platformFee.toLocaleString('en-IN')}) + 18% GST (₹{gstOnFee.toLocaleString('en-IN')}) • <span className="font-semibold text-emerald-600">Net payout: ₹{netPayout.toLocaleString('en-IN')}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Estimated Delivery Turnaround <span className="text-violet-600">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="60"
                value={estimatedDeliveryDays}
                onChange={(e) => setEstimatedDeliveryDays(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 font-medium"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">Days</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">From quotation agreement to draft submission</p>
          </div>
        </div>

        {/* Cover Letter / Pitch */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Cover Letter & Creative Angle <span className="text-violet-600">*</span>
          </label>
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Explain why your audience matches this campaign, what unique visual concepts you bring, and your past performance metrics..."
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
            required
          />
        </div>

        {/* Deliverables Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">
              Proposed Deliverables & Assets ({deliverables.length})
            </label>
            <button
              type="button"
              onClick={handleAddDeliverable}
              className="text-xs text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {deliverables.map((item, index) => (
              <div key={index} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleDeliverableChange(index, 'title', e.target.value)}
                    placeholder="e.g. 1x 4K 60s Instagram Reel"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-medium"
                    required
                  />
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleDeliverableChange(index, 'description', e.target.value)}
                  placeholder="Details, hooks, resolution or rights specification..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Verification Checkmark */}
        <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
          <p className="text-xs text-violet-900">
            Applying as <span className="font-semibold">{currentCreator.fullName}</span> ({currentCreator.handle}) • Verified audience. Accepted proposals initiate Razorpay-backed escrow contracts.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            <Sparkles className="w-4 h-4" /> Submit Proposal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
