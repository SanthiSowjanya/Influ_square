-- ==============================================================================
-- CreatorSphere Marketplace: PostgreSQL Schema Migration
-- Designed for: Supabase PostgreSQL (Supports RLS, Integer Paise for INR, Meta APIs, Razorpay)
-- Timestamp: 2026-10-22
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES (Base user table linked to auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- ------------------------------------------------------------------------------
-- 2. CREATOR PROFILES
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. SOCIAL ACCOUNTS (Meta Graph API / Instagram integration)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 4. SOCIAL METRICS SNAPSHOTS (Immutable historical API sync snapshots)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_metrics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  followers_count INT NOT NULL DEFAULT 0,
  following_count INT DEFAULT 0,
  media_count INT DEFAULT 0,
  avg_engagement_rate NUMERIC(5, 2) DEFAULT 0.00,
  avg_impressions INT DEFAULT 0,
  avg_reach INT DEFAULT 0,
  top_locations JSONB DEFAULT '[]'::jsonb,
  top_demographics JSONB DEFAULT '{}'::jsonb,
  snapshot_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ORGANIZATIONS (Brand Entities)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. ORGANIZATION MEMBERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  job_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 7. CAMPAIGNS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  niche TEXT NOT NULL,
  primary_platform TEXT NOT NULL DEFAULT 'instagram' CHECK (primary_platform IN ('instagram', 'youtube', 'tiktok', 'x')),
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
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'paused', 'completed', 'closed')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. CAMPAIGN DELIVERABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('Reel', 'Story Sequence', 'Dedicated Video', 'Static Post', 'Carousel')),
  quantity INT NOT NULL DEFAULT 1,
  guidelines TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. PROPOSALS (Creator applications / bids)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  proposed_rate_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  estimated_delivery_days INT NOT NULL DEFAULT 7,
  proposed_deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  portfolio_links TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'shortlisted', 'negotiating', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, creator_id)
);

-- ------------------------------------------------------------------------------
-- 10. PROPOSAL VERSIONS (Audit trail for revised bids)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proposal_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  proposed_rate_paise BIGINT NOT NULL,
  cover_letter TEXT NOT NULL,
  proposed_deliverables JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. CONVERSATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, creator_id, campaign_id)
);

-- ------------------------------------------------------------------------------
-- 12. CONVERSATION MEMBERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  unread_count INT NOT NULL DEFAULT 0,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 13. MESSAGES (Text, quotations, deliverable reviews, system alerts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'quotation', 'counteroffer', 'deliverable_submission', 'contract_signed', 'system')),
  quotation_data JSONB,
  deliverable_data JSONB,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. CONTRACTS (Immutable legal commercial terms once accepted)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id),
  proposal_id UUID REFERENCES public.proposals(id),
  total_amount_paise BIGINT NOT NULL,
  platform_fee_paise BIGINT NOT NULL, -- e.g. 10%
  creator_net_payout_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  agreed_deliverables JSONB NOT NULL,
  usage_rights TEXT NOT NULL,
  revisions_allowed INT NOT NULL DEFAULT 2,
  deadline TIMESTAMPTZ NOT NULL,
  accepted_by_brand_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_by_creator_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  terms_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. COLLABORATIONS (Active Post-Acceptance Workspaces)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE RESTRICT,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE RESTRICT,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'payment_pending' CHECK (status IN (
    'payment_pending',
    'funded_in_escrow',
    'in_production',
    'deliverables_submitted',
    'revision_requested',
    'approved',
    'published',
    'settled',
    'disputed',
    'cancelled'
  )),
  total_amount_paise BIGINT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'unfunded' CHECK (payment_status IN ('unfunded', 'funded_escrow', 'released_to_creator', 'refunded_to_brand', 'disputed')),
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. COLLABORATION DELIVERABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collaboration_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  format TEXT NOT NULL,
  guidelines TEXT,
  file_url TEXT,
  preview_url TEXT,
  social_draft_link TEXT,
  publication_url TEXT,
  submission_notes TEXT,
  brand_feedback TEXT,
  version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'revision_requested', 'approved', 'published')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 17. PAYMENTS (Razorpay Orders and Captures)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE RESTRICT,
  payer_user_id UUID NOT NULL REFERENCES public.profiles(id),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  amount_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  provider TEXT NOT NULL DEFAULT 'razorpay' CHECK (provider IN ('razorpay', 'upi', 'direct_bank')),
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'authorized', 'captured', 'settled', 'failed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 18. PAYMENT EVENTS (Idempotent Webhook Log)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 19. PAYOUT RECORDS (Razorpay Route transfers to creator bank/UPI)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payout_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id),
  amount_paise BIGINT NOT NULL,
  platform_fee_paise BIGINT NOT NULL,
  tds_deduction_paise BIGINT NOT NULL DEFAULT 0, -- 1% TDS u/s 194-O where applicable
  net_disbursed_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  razorpay_payout_id TEXT UNIQUE,
  transfer_mode TEXT NOT NULL DEFAULT 'UPI' CHECK (transfer_mode IN ('UPI', 'NEFT', 'RTGS', 'IMPS')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'processed', 'reversed', 'failed')),
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 20. INVOICES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id),
  subtotal_paise BIGINT NOT NULL,
  platform_fee_paise BIGINT NOT NULL,
  gst_paise BIGINT NOT NULL DEFAULT 0,
  total_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('draft', 'issued', 'paid', 'voided')),
  pdf_storage_path TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 21. REVIEWS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) UNIQUE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  target_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  is_verified_collab BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 22. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('proposal', 'counteroffer', 'payment', 'deliverable', 'review', 'system')),
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 23. SAVED CAMPAIGNS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(creator_id, campaign_id)
);

-- ------------------------------------------------------------------------------
-- 24. SAVED CREATORS (Brand Wishlists)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, creator_id)
);

-- ------------------------------------------------------------------------------
-- 25. DISPUTES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id),
  initiated_by UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  evidence_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'opened' CHECK (status IN ('opened', 'under_investigation', 'resolved_brand_refund', 'resolved_creator_payout', 'dismissed')),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 26. REPORTS (Trust & Safety Moderation)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID NOT NULL REFERENCES public.profiles(id),
  target_type TEXT NOT NULL CHECK (target_type IN ('creator', 'brand', 'campaign', 'message')),
  target_id UUID NOT NULL,
  category TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'action_taken', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 27. AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_campaigns_status_deadline ON public.campaigns(status, application_deadline);
CREATE INDEX IF NOT EXISTS idx_campaigns_niche ON public.campaigns(niche);
CREATE INDEX IF NOT EXISTS idx_proposals_campaign_id ON public.proposals(campaign_id);
CREATE INDEX IF NOT EXISTS idx_proposals_creator_id ON public.proposals(creator_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_collaborations_creator ON public.collaborations(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_collaborations_org ON public.collaborations(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_collab ON public.payments(collaboration_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self write
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Self Profile Update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Self Profile Insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Creator Profiles: Public read, owner update
CREATE POLICY "Public Creator Profiles Read" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Owner Creator Profile Update" ON public.creator_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Owner Creator Profile Insert" ON public.creator_profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Campaigns: Anyone can read published campaigns, organization owners edit
CREATE POLICY "Public Campaigns Read" ON public.campaigns FOR SELECT USING (status = 'published' OR auth.uid() = created_by);
CREATE POLICY "Brand Campaign Insert" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = created_by OR auth.uid() IS NULL);
CREATE POLICY "Brand Campaign Update" ON public.campaigns FOR UPDATE USING (auth.uid() = created_by);

-- Proposals: Creators can see their own proposals; Brands see proposals for their campaigns
CREATE POLICY "Proposal Creator Read" ON public.proposals FOR SELECT USING (
  auth.uid() = creator_id OR 
  EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = proposals.campaign_id AND campaigns.created_by = auth.uid())
);
CREATE POLICY "Proposal Creator Insert" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = creator_id OR auth.uid() IS NULL);
CREATE POLICY "Proposal Update" ON public.proposals FOR UPDATE USING (
  auth.uid() = creator_id OR 
  EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = proposals.campaign_id AND campaigns.created_by = auth.uid())
);

-- Conversations & Messages: Only members can read/write
CREATE POLICY "Conversation Members Read" ON public.conversations FOR SELECT USING (
  auth.uid() = creator_id OR 
  EXISTS (SELECT 1 FROM public.organization_members WHERE organization_members.organization_id = conversations.organization_id AND organization_members.user_id = auth.uid())
);
CREATE POLICY "Messages Access" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = messages.conversation_id AND (
    conversations.creator_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.organization_members WHERE organization_members.organization_id = conversations.organization_id AND organization_members.user_id = auth.uid())
  ))
);
CREATE POLICY "Messages Insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id OR auth.uid() IS NULL);

-- Collaborations: Only participating brand members and creator can view/update
CREATE POLICY "Collaborations Read" ON public.collaborations FOR SELECT USING (
  auth.uid() = creator_id OR 
  EXISTS (SELECT 1 FROM public.organization_members WHERE organization_members.organization_id = collaborations.organization_id AND organization_members.user_id = auth.uid())
);
