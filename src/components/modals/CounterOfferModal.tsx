import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Quotation } from '../../types';
import { RefreshCw, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface CounterOfferModalProps {
  quotation: Quotation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  quotation,
  isOpen,
  onClose
}) => {
  const { counterOfferQuotation } = useApp();

  const [counterAmount, setCounterAmount] = useState<number>(
    quotation ? Math.round(quotation.amount * 1.15) : 35000
  );
  const [counterNotes, setCounterNotes] = useState(
    'Based on production complexity, 4K camera gear, and 2 rounds of guaranteed fast-turnaround revisions, we propose this updated rate.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (quotation) {
      setCounterAmount(Math.round(quotation.amount * 1.15));
    }
  }, [quotation]);

  if (!quotation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (counterAmount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      counterOfferQuotation(quotation.id, counterAmount, counterNotes);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Counteroffer"
      description={`Negotiate terms for quotation on "${quotation.campaignTitle}"`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-medium">Current Quote Amount:</p>
            <p className="text-base font-bold text-slate-900">
              {formatCurrency(quotation.amount)}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-100 text-violet-700 border border-violet-200">
            Counter Proposal
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            New Proposed Amount (₹ INR) <span className="text-violet-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
            <input
              type="number"
              min="1000"
              step="500"
              value={counterAmount}
              onChange={(e) => setCounterAmount(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-violet-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Reasoning & Scope Clarification <span className="text-violet-600">*</span>
          </label>
          <textarea
            rows={3}
            value={counterNotes}
            onChange={(e) => setCounterNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            <RefreshCw className="w-4 h-4" /> Send Counteroffer
          </Button>
        </div>
      </form>
    </Modal>
  );
};
