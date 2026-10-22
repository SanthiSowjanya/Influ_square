import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const TermsOfServiceView: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <span className="text-xs text-slate-500">Effective Date: October 2026</span>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              CreatorSphere Legal Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Welcome to CreatorSphere. These Terms of Service ("Terms") govern your access to and use of CreatorSphere's platform, APIs, escrow settlement workflows, and related services under the laws of the Republic of India.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">1. Marketplace Ecosystem & User Eligibility</h2>
              <p>
                CreatorSphere operates as an intermediary platform facilitating commercial engagements between independent content creators ("Creators") and corporate advertisers, agencies, or brands ("Brands"). By registering, you confirm that you are at least 18 years of age and legally authorized to enter binding contracts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">2. Escrow Protections & Milestone Funding</h2>
              <p>
                To eliminate non-payment risk and delivery disputes, all accepted collaboration agreements must be funded in advance by the Brand through Razorpay into designated platform escrow.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Funds remain securely in escrow until milestones are completed and approved.</li>
                <li>Creators are under no obligation to deliver assets until escrow funding is verified.</li>
                <li>Brands have a 7-day review window upon deliverable submission to request reasonable revisions or approve the release of funds. If no revision or rejection is filed within 7 days, the milestone automatically releases.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">3. Commercial Fees & Indian Taxation (GST)</h2>
              <p>
                All pricing on CreatorSphere is denominated in Indian Rupees (₹).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Platform Commission:</strong> CreatorSphere charges a 10% platform facilitation fee on gross collaboration milestone values.</li>
                <li><strong>Goods & Services Tax (GST):</strong> In accordance with Indian tax laws, 18% GST is levied solely on the platform facilitation fee. Brands receive compliant GST invoices with full input tax credit entitlement.</li>
                <li><strong>TDS Withholding:</strong> Brands and creators are responsible for complying with applicable Tax Deducted at Source (TDS) under Section 194C or 194J of the Indian Income Tax Act.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">4. Intellectual Property & Usage Rights</h2>
              <p>
                Unless explicitly modified in a bilateral custom quotation agreement:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>The Creator retains inherent moral ownership and authorship of created content.</li>
                <li>Upon full milestone payout approval, the Brand receives a non-exclusive, worldwide digital commercial license for the agreed duration (default: 12 months) for organic social media distribution.</li>
                <li>Paid boosting or whitelisting of creator posts requires separate mutual agreement and line-item quotation.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">5. Meta Graph API & Analytics Transparency</h2>
              <p>
                Creators connecting Instagram accounts grant permission to query public engagement, reel impressions, and audience country breakdown through official Meta Graph API webhooks. Falsifying engagement statistics or using unauthorized bots results in immediate permanent termination and forfeiture of escrow balances.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">6. Dispute Arbitration & Resolution</h2>
              <p>
                In the event of an irreconcilable disagreement regarding deliverable specifications, either party may file a formal moderation report. CreatorSphere Trust Officers review submitted brief parameters, uploaded drafts, revision logs, and chat threads to issue a binding platform resolution within 7 business days.
              </p>
            </section>

          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Questions regarding these terms? Contact legal@creatorsphere.in
            </span>
            <Button variant="primary" size="sm" onClick={() => setActiveView('register')}>
              Accept & Register
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
