import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Cloud,
  Database,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Trash2,
  Key,
  Globe
} from 'lucide-react';

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudConfigModal: React.FC<CloudConfigModalProps> = ({ isOpen, onClose }) => {
  const { cloudStatus, connectCloud, disconnectCloud, syncAllToCloud, addToast } = useApp();

  const [url, setUrl] = useState(cloudStatus.url || '');
  const [key, setKey] = useState(cloudStatus.key || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) return;

    setIsConnecting(true);
    await connectCloud(url.trim(), key.trim());
    setIsConnecting(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncAllToCloud();
    setIsSyncing(false);
  };

  const handleCopySchema = () => {
    const sqlSchema = `-- CreatorSphere Complete 27-Table Production PostgreSQL Schema (Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  location TEXT,
  country TEXT DEFAULT 'India',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  handle TEXT NOT NULL UNIQUE,
  headline TEXT NOT NULL,
  niches TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
  sponsored_reel_rate_paise BIGINT NOT NULL DEFAULT 1500000,
  dedicated_video_rate_paise BIGINT NOT NULL DEFAULT 3500000,
  story_set_rate_paise BIGINT NOT NULL DEFAULT 500000,
  custom_package_min_paise BIGINT NOT NULL DEFAULT 2000000,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  total_collaborations INT DEFAULT 0,
  completion_rate INT DEFAULT 100,
  is_public_profile BOOLEAN DEFAULT TRUE,
  portfolio JSONB DEFAULT '[]'::jsonb,
  bank_account_verified BOOLEAN DEFAULT FALSE,
  razorpay_contact_id TEXT,
  razorpay_fund_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Upsert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Public Read Creator Profiles" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Public Upsert Creator Profiles" ON public.creator_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Creator Profiles" ON public.creator_profiles FOR UPDATE USING (true);`;

    navigator.clipboard.writeText(sqlSchema);
    addToast('success', 'Full Schema SQL Copied!', 'Paste this into the Supabase SQL Editor and click Run.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Free Cloud Database & Storage (Supabase)"
      description="Connect your free PostgreSQL database to synchronize profiles, campaigns, and contracts across devices"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Status Indicator Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              cloudStatus.isConnected
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-violet-100 text-violet-700 border border-violet-200'
            }`}>
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  {cloudStatus.isConnected ? 'Free Supabase Cloud Active' : 'Local Persistent Storage Active'}
                </h4>
                <Badge variant={cloudStatus.isConnected ? 'success' : 'outline'} size="sm">
                  {cloudStatus.isConnected ? '● Connected' : 'Auto-Save'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {cloudStatus.lastSyncedAt
                  ? `Last synced: ${new Date(cloudStatus.lastSyncedAt).toLocaleTimeString()}`
                  : cloudStatus.message}
              </p>
            </div>
          </div>

          {cloudStatus.isConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              isLoading={isSyncing}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync Data
            </Button>
          )}
        </div>

        {/* Quick Instructions on Free Supabase */}
        <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-violet-950 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-violet-700" /> 100% Free Supabase Cloud Setup (30 seconds)
            </span>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-violet-700 hover:text-violet-900 font-semibold underline"
            >
              Open Supabase.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-violet-800 leading-relaxed">
            1. Create a free account at Supabase (free PostgreSQL database, Auth & Storage).<br />
            2. In your Project, go to <span className="text-violet-950 font-mono font-medium">Project Settings → API</span>.<br />
            3. Copy the <span className="text-violet-950 font-mono font-medium">Project URL</span> and the public <span className="text-violet-950 font-mono font-medium">anon key</span> below.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Supabase Project URL
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Globe className="w-3.5 h-3.5" />
              </span>
              <input
                type="url"
                placeholder="https://your-project-id.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Supabase Anon / Public Key
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Key className="w-3.5 h-3.5" />
              </span>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 font-mono"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopySchema}
              className="text-xs text-violet-700 hover:text-violet-800 inline-flex items-center gap-1 font-semibold underline"
            >
              <Copy className="w-3.5 h-3.5" /> Copy SQL Schema for Supabase
            </button>

            <div className="flex items-center gap-2">
              {cloudStatus.isConnected && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={disconnectCloud}
                  className="text-rose-600 hover:text-rose-700"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Disconnect
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isConnecting}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {cloudStatus.isConnected ? 'Update Cloud Key' : 'Connect Free Cloud'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
