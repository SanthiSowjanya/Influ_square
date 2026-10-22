import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Check, RefreshCw, Key, AlertTriangle } from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';

interface InstagramConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramConnectModal: React.FC<InstagramConnectModalProps> = ({ isOpen, onClose }) => {
  const { currentCreator, connectInstagramAccount, disconnectInstagramAccount } = useApp();
  const [handle, setHandle] = useState(currentCreator.instagramData.handle || '@mayacreates');
  const [isSimulatingOAuth, setIsSimulatingOAuth] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingOAuth(true);
    setTimeout(() => {
      connectInstagramAccount(handle);
      setIsSimulatingOAuth(false);
      onClose();
    }, 800);
  };

  const handleDisconnect = () => {
    disconnectInstagramAccount();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Meta Graph API & Instagram Connection"
      description="Authorize real-time follower verification and engagement metrics"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Transparent Prototype Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold text-amber-950">Prototype Notice:</span> This interface connects via simulated Meta Graph API OAuth. Real production syncing requires Meta App Review clearance, registered App Secret, and verified Instagram Business/Creator account token handshake.
          </div>
        </div>

        {/* Current Connection Status Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 flex items-center justify-center">
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {currentCreator.instagramData.connected
                  ? currentCreator.instagramData.handle
                  : 'Not Connected'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {currentCreator.instagramData.syncStatus === 'pending_integration' && (
                  <Badge variant="warning" size="sm">
                    ● Integration Pending
                  </Badge>
                )}
                {currentCreator.instagramData.syncStatus === 'synced' && (
                  <Badge variant="success" size="sm">
                    ● Synced
                  </Badge>
                )}
                {currentCreator.instagramData.syncStatus === 'disconnected' && (
                  <Badge variant="outline" size="sm">
                    Disconnected
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {currentCreator.instagramData.connected && (
            <Button variant="danger" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
        </div>

        {/* OAuth Simulation Form */}
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Instagram Creator / Business Handle
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
              <input
                type="text"
                value={handle.replace('@', '')}
                onChange={(e) => setHandle('@' + e.target.value.replace('@', ''))}
                placeholder="yourhandle"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-violet-600 font-medium"
                required
              />
            </div>
          </div>

          {/* Scopes Requested */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-violet-600" /> Meta Scopes Requested:
            </p>
            <div className="flex items-center gap-2 text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>instagram_basic (Public profile, media count)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>instagram_manage_insights (Impression & engagement verification)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>pages_show_list (Linked Meta creator account)</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSimulatingOAuth}
            >
              <RefreshCw className="w-4 h-4" />
              {currentCreator.instagramData.connected
                ? 'Re-Authorize Meta Token (Simulated)'
                : 'Connect via Meta OAuth (Simulated)'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
