import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { QuotationDeliverableItem } from '../../types';
import { Plus, Trash2, Send, IndianRupee } from 'lucide-react';

interface QuotationModalProps {
  campaignId: string;
  campaignTitle: string;
  recipientId: string;
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  campaignId,
  campaignTitle,
  recipientId,
  recipientName,
  isOpen,
  onClose
}) => {
  const { sendQuotation, currentRole, currentCreator, currentBrand } = useApp();

  const [deliverables, setDeliverables] = useState<QuotationDeliverableItem[]>([
    {
      id: 'qd-1',
      description: '1x 60s 4K Instagram Reel with brand tag and pinned comment',
      format: 'Reel',
      revisionsAllowed: 2,
      price: 32000
    },
    {
      id: 'qd-2',
      description: '1x 3-Frame Instagram Story sequence with trackable sticker link',
      format: 'Story Sequence',
      revisionsAllowed: 1,
      price: 8000
    }
  ]);

  const [expiresInDays, setExpiresInDays] = useState(14);
  const [notes, setNotes] = useState(
    'Deliverables subject to standard 30-day organic exclusivity in product category. Payment funded into Razorpay marketplace escrow upon formal contract acceptance.'
  );
  const [isSending, setIsSending] = useState(false);

  const totalAmount = deliverables.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const handleAddDeliverable = () => {
    setDeliverables([
      ...deliverables,
      {
        id: 'qd-' + Date.now(),
        description: 'Additional deliverable line item',
        format: 'Static Post',
        revisionsAllowed: 1,
        price: 5000
      }
    ]);
  };

  const handleRemoveDeliverable = (id: string) => {
    if (deliverables.length === 1) return;
    setDeliverables(deliverables.filter((d) => d.id !== id));
  };

  const handleItemChange = (id: string, field: keyof QuotationDeliverableItem, value: any) => {
    setDeliverables(
      deliverables.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAmount <= 0) return;

    setIsSending(true);
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + expiresInDays);

    setTimeout(() => {
      sendQuotation({
        campaignId,
        campaignTitle,
        brandId: currentRole === 'brand' ? currentBrand.organization.id : recipientId,
        creatorId: currentRole === 'creator' ? currentCreator.id : recipientId,
        sentBy: currentRole as 'brand' | 'creator',
        deliverables,
        amount: totalAmount,
        currency: 'INR',
        expiresAt: expiresDate.toISOString(),
        notes
      });
      setIsSending(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Formal Quotation"
      description={`Itemized quotation for ${recipientName} on "${campaignTitle}"`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Deliverables Table Builder */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">
              Contract Deliverables & Milestone Pricing
            </label>
            <button
              type="button"
              onClick={handleAddDeliverable}
              className="text-xs text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Deliverable
            </button>
          </div>

          <div className="space-y-2.5">
            {deliverables.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    placeholder="Deliverable description"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-medium"
                    required
                  />
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Format</label>
                    <input
                      type="text"
                      value={item.format}
                      onChange={(e) => handleItemChange(item.id, 'format', e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Revisions Allowed</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={item.revisionsAllowed}
                      onChange={(e) => handleItemChange(item.id, 'revisionsAllowed', Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Price (₹ INR)</label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs text-violet-700 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Expiry Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-violet-50 border border-violet-200">
          <div>
            <span className="text-xs text-violet-800 font-medium">Total Quotation Value:</span>
            <p className="text-2xl font-bold text-violet-900 mt-0.5">
              ₹{totalAmount.toLocaleString('en-IN')} <span className="text-xs text-violet-700 font-normal">INR</span>
            </p>
          </div>

          <div>
            <label className="block text-xs text-violet-800 font-medium mb-1">Quote Validity Window</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-lg bg-white border border-violet-300 text-xs text-slate-900 font-semibold"
              />
              <span className="text-xs text-violet-800">Days from dispatch</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Contract Terms & Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSending}>
            <Send className="w-4 h-4" /> Send Quotation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
