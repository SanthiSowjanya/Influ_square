import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  ShieldCheck,
  UserCheck,
  FileWarning,
  CheckCircle2,
  XCircle,
  Scale
} from 'lucide-react';

export const AdminTrustDashboard: React.FC = () => {
  const {
    allCreators,
    moderationReports,
    updateReportStatus,
    toggleCreatorVerification,
    collaborations
  } = useApp();

  const disputedCollabs = collaborations.filter((c) => c.status === 'disputed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trust & Safety Console</h1>
            <Badge variant="warning" size="sm">Admin Role</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Platform moderation queue, creator verification badge approvals, and dispute mediation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="md">
            ● Platform Shield Active
          </Badge>
        </div>
      </div>

      {/* Trust & Safety KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Reports</span>
            <FileWarning className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {moderationReports.filter((r) => r.status === 'pending_review' || r.status === 'investigating').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Requires human review</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Verified Talent</span>
            <UserCheck className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {allCreators.filter((c) => c.isVerified).length} / {allCreators.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Badge granted creators</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Open Disputes</span>
            <Scale className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600">
            {disputedCollabs.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Arbitration cases pending</p>
        </div>
      </div>

      {/* Moderation Reports Queue */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-amber-500" /> Moderation & Safety Reports Queue
          </h2>
          <span className="text-xs text-slate-500">{moderationReports.length} Total Cases</span>
        </div>

        <div className="space-y-3">
          {moderationReports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{report.targetName}</span>
                    <Badge variant="purple" size="sm">
                      {report.targetType.toUpperCase()}
                    </Badge>
                    <Badge
                      variant={
                        report.status === 'resolved'
                          ? 'success'
                          : report.status === 'dismissed'
                          ? 'outline'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {report.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Flagged by: <span className="text-slate-900 font-medium">{report.reportedBy}</span> • Reason: <span className="text-rose-600 font-semibold">{report.reason}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {report.status !== 'resolved' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                    </Button>
                  )}
                  {report.status !== 'dismissed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateReportStatus(report.id, 'dismissed')}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </Button>
                  )}
                </div>
              </div>

              <p className="p-3 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-inner">
                {report.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Verification Badges Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-600" /> Creator Verification Badges
          </h2>
          <span className="text-xs text-slate-500">Click toggle to grant or revoke badge</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {allCreators.map((creator) => (
            <div
              key={creator.id}
              className="py-3 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={creator.avatarUrl}
                  alt={creator.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-slate-900 text-sm">{creator.fullName}</p>
                    <span className="text-slate-500">({creator.handle})</span>
                    {creator.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-violet-600 inline" />
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {creator.niches.join(', ')} • Rating: ★ {creator.rating} ({creator.reviewCount} reviews)
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant={creator.isVerified ? 'outline' : 'primary'}
                onClick={() => toggleCreatorVerification(creator.id)}
              >
                {creator.isVerified ? 'Revoke Verification' : 'Verify Creator'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
