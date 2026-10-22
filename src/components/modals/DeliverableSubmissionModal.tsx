import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Collaboration } from '../../types';
import { UploadCloud, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface DeliverableSubmissionModalProps {
  collaboration: Collaboration | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeliverableSubmissionModal: React.FC<DeliverableSubmissionModalProps> = ({
  collaboration,
  isOpen,
  onClose
}) => {
  const { submitDeliverable } = useApp();

  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string>(
    collaboration?.deliverables[0]?.id || ''
  );
  const [submissionTitle, setSubmissionTitle] = useState('Final 4K Edit - Version 1');
  const [fileUrl, setFileUrl] = useState('https://drive.google.com/demo/4k_deliverable_export.mov');
  const [socialDraftLink, setSocialDraftLink] = useState('https://instagram.com/reel/preview_92817');
  const [notes, setNotes] = useState(
    'Includes color graded master in DCI 4K. Sound effects mixed at -14 LUFS. Brand product features demonstrated clearly in 9:16 vertical framing.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (collaboration && collaboration.deliverables.length > 0) {
      setSelectedDeliverableId(collaboration.deliverables[0].id);
    }
  }, [collaboration]);

  if (!collaboration) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverableId) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitDeliverable(collaboration.id, selectedDeliverableId, {
        title: submissionTitle,
        fileUrl,
        socialDraftLink,
        notes
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Collaboration Deliverables"
      description={`Upload assets for brand review on "${collaboration.campaignTitle}"`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Target Deliverable Requirement <span className="text-violet-600">*</span>
          </label>
          <select
            value={selectedDeliverableId}
            onChange={(e) => setSelectedDeliverableId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-violet-600"
            required
          >
            {collaboration.deliverables.map((del) => (
              <option key={del.id} value={del.id}>
                {del.title} ({del.format}) — [{del.status.replace('_', ' ')}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Submission Title / Version Label
          </label>
          <input
            type="text"
            value={submissionTitle}
            onChange={(e) => setSubmissionTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-violet-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            High-Res Master Asset URL (Cloud / Drive / Frame.io)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <LinkIcon className="w-3.5 h-3.5" />
            </span>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
              placeholder="https://drive.google.com/..."
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Social Preview / Draft Post Link (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <LinkIcon className="w-3.5 h-3.5" />
            </span>
            <input
              type="url"
              value={socialDraftLink}
              onChange={(e) => setSocialDraftLink(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
              placeholder="https://instagram.com/reel/preview/..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Creator Production Notes & Caption Text
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-violet-600"
            placeholder="Draft caption, hashtags, music credits or editing notes for the brand reviewer..."
            required
          />
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Once submitted, the brand will review and either request revisions or approve. Brand approval settles the milestone payment of <span className="font-bold">{formatCurrency(collaboration.agreedAmount)}</span> funded via Razorpay escrow.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            <UploadCloud className="w-4 h-4" /> Submit for Brand Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
