-- ==============================================================================
-- CreatorSphere Marketplace: Complete Production PostgreSQL Schema
-- Compatible with Supabase Free Cloud Tier, Row Level Security, Integer Paise, Meta APIs & Razorpay
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
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

-- 2. CREATOR PROFILES
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  handle TEXT NOT NULL UNIQUE,
  headline TEXT NOT NULL,
  niches TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
  sponsored_reel_rate_paise BIGINT NOT NULL DEFAULT 1500000, -- ₹15,000 in paise
  dedicated_video_rate_paise BIGINT NOT NULL DEFAULT 3500000, -- ₹35,000
  story_set_rate_paise BIGINT NOT NULL DEFAULT 500000,       -- ₹5,000
  custom_package_min_paise BIGINT NOT NULL DEFAULT 2000000,   -- ₹20,000
  rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
  review_count INT DEFAULT 0,
  total_collaborations INT DEFAULT 0,
  completion_rate INT DEFAULT 100 CHECK (completion_rate >= 0 AND completion_rate <= 100),
  is_public_profile BOOLEAN DEFAULT TRUE,
  portfolio JSONB DEFAULT '[]'::jsonb,
  bank_account_verified BOOLEAN DEFAULT FALSE,
  razorpay_contact_id TEXT,
  razorpay_fund_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SOCIAL ACCOUNTS (Meta Instagram Graph API)
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'youtube', 'tiktok', 'x')),
  platform_user_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  access_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  is_verified_oauth BOOLEAN DEFAULT FALSE,
  sync_status TEXT NOT NULL DEFAULT 'unconnected' CHECK (sync_status IN ('synced', 'pending_integration', 'error', 'expired', 'unconnected')),
  last_synced_at TIMESTAMPTZ,
  raw_profile_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(creator_id, platform)
);

-- 4. ORGANIZATIONS (Brand Entities)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  industry TEXT NOT NULL,
  website TEXT,
  description TEXT,
  business_location TEXT DEFAULT 'Mumbai, India',
  gstin TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  niche TEXT NOT NULL,
  primary_platform TEXT NOT NULL DEFAULT 'instagram',
  target_audience JSONB NOT NULL DEFAULT '{"locations": ["India"], "ageRanges": ["18-34"]}'::jsonb,
  budget_min_paise BIGINT NOT NULL DEFAULT 2000000, -- ₹20,000
  budget_max_paise BIGINT NOT NULL DEFAULT 8000000, -- ₹80,000
  currency TEXT NOT NULL DEFAULT 'INR',
  creators_needed INT NOT NULL DEFAULT 1,
  creators_accepted_count INT NOT NULL DEFAULT 0,
  application_deadline TIMESTAMPTZ NOT NULL,
  content_deadline TIMESTAMPTZ NOT NULL,
  publication_date TIMESTAMPTZ,
  usage_rights TEXT NOT NULL DEFAULT 'Digital organic usage for 6 months',
  exclusivity_requirements TEXT,
  revisions_limit INT NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'in_progress', 'paused', 'completed', 'closed')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROPOSALS
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  proposed_rate_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  estimated_delivery_days INT NOT NULL DEFAULT 7,
  proposed_deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'shortlisted', 'negotiating', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, creator_id)
);

-- 7. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  quotation_data JSONB,
  deliverable_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CONTRACTS & COLLABORATIONS
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id),
  total_amount_paise BIGINT NOT NULL,
  platform_fee_paise BIGINT NOT NULL,
  creator_net_payout_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  agreed_deliverables JSONB NOT NULL,
  usage_rights TEXT NOT NULL,
  revisions_allowed INT NOT NULL DEFAULT 2,
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id),
  status TEXT NOT NULL DEFAULT 'funded_in_escrow',
  total_amount_paise BIGINT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'funded_escrow',
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PAYMENTS (Razorpay Orders)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id),
  payer_user_id UUID NOT NULL REFERENCES public.profiles(id),
  amount_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  provider TEXT NOT NULL DEFAULT 'razorpay',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'captured',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Enablement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- Permissive Development Policies
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Upsert Profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public Read Creator Profiles" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Public Upsert Creator Profiles" ON public.creator_profiles FOR ALL USING (true);
CREATE POLICY "Public Read Organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Public Upsert Organizations" ON public.organizations FOR ALL USING (true);
CREATE POLICY "Public Read Campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Public Upsert Campaigns" ON public.campaigns FOR ALL USING (true);
CREATE POLICY "Public Read Proposals" ON public.proposals FOR SELECT USING (true);
CREATE POLICY "Public Upsert Proposals" ON public.proposals FOR ALL USING (true);
CREATE POLICY "Public Read Conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Public Upsert Conversations" ON public.conversations FOR ALL USING (true);
CREATE POLICY "Public Read Messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Public Upsert Messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Public Read Collaborations" ON public.collaborations FOR SELECT USING (true);
CREATE POLICY "Public Upsert Collaborations" ON public.collaborations FOR ALL USING (true);
