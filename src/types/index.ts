export type UserRole = 'creator' | 'brand' | 'admin';

export type PlatformType = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'podcast';

export type NicheType = 
  | 'Tech & AI'
  | 'Fitness & Wellness'
  | 'Beauty & Fashion'
  | 'Gaming & Esports'
  | 'Finance & Crypto'
  | 'Travel & Hospitality'
  | 'Food & Cooking'
  | 'Design & Creative'
  | 'Lifestyle & Family';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CreatorPortfolioItem {
  id: string;
  title: string;
  mediaUrl: string;
  platform: PlatformType;
  engagementRate?: string;
  impressions?: string;
  views?: string;
  brandClient?: string;
}

export interface InstagramStats {
  connected: boolean;
  handle?: string;
  followers?: number;
  avgEngagementRate?: number; // e.g. 4.8%
  avgImpressions?: number;
  topAudienceCountry?: string;
  syncStatus: 'synced' | 'pending_integration' | 'disconnected';
  lastSyncedAt?: string;
}

export interface CreatorProfile extends UserProfile {
  role: 'creator';
  handle: string;
  headline: string;
  niches: NicheType[];
  platforms: {
    platform: PlatformType;
    handle: string;
    followers: number;
    url?: string;
  }[];
  rates: {
    dedicatedVideo: number;
    sponsoredReel: number;
    storySet: number;
    customPackageMin: number;
  };
  rating: number; // e.g. 4.95
  reviewCount: number;
  totalCollaborations: number;
  completionRate: number; // e.g. 98%
  instagramData: InstagramStats;
  portfolio: CreatorPortfolioItem[];
  badges: string[];
}

export interface BrandOrganization {
  id: string;
  name: string;
  industry: string;
  website: string;
  logoUrl: string;
  description: string;
  verified: boolean;
  totalSpentDemo: number;
  activeCampaignsCount: number;
}

export interface BrandProfile extends UserProfile {
  role: 'brand';
  organization: BrandOrganization;
  jobTitle: string;
}

export type CampaignStatus = 
  | 'draft'
  | 'published'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'closed';

export interface CampaignDeliverableRequirement {
  id: string;
  title: string;
  format: 'Reel' | 'TikTok' | 'YouTube Video' | 'Story Sequence' | 'Static Post';
  quantity: number;
  guidelines: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  description: string;
  niche: NicheType;
  primaryPlatform: PlatformType;
  targetAudience: {
    locations: string[];
    ageRanges: string[];
    minFollowers?: number;
    minEngagementRate?: number;
  };
  budgetMin: number;
  budgetMax: number;
  currency: string;
  deadline: string;
  locationRequirement: string;
  deliverablesRequired: CampaignDeliverableRequirement[];
  status: CampaignStatus;
  proposalsCount: number;
  shortlistedCount: number;
  createdAt: string;
  featured?: boolean;
}

export type ProposalStatus = 
  | 'submitted'
  | 'shortlisted'
  | 'negotiating'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface Proposal {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorRating: number;
  creatorNiches: NicheType[];
  coverLetter: string;
  proposedRate: number;
  currency: string;
  estimatedDeliveryDays: number;
  proposedDeliverables: {
    title: string;
    description: string;
  }[];
  status: ProposalStatus;
  submittedAt: string;
}

export type QuotationStatus = 
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'counter_offered'
  | 'rejected'
  | 'expired';

export interface QuotationDeliverableItem {
  id: string;
  description: string;
  format: string;
  revisionsAllowed: number;
  price: number;
}

export interface Quotation {
  id: string;
  proposalId?: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  creatorId: string;
  sentBy: 'brand' | 'creator';
  deliverables: QuotationDeliverableItem[];
  amount: number;
  currency: string;
  expiresAt: string;
  status: QuotationStatus;
  notes?: string;
  counterOfferDetails?: {
    previousAmount: number;
    counterAmount: number;
    counterNotes: string;
    counteredBy: 'brand' | 'creator';
  };
  createdAt: string;
}

export type CollaborationMilestoneStatus = 
  | 'agreement_pending'
  | 'agreement_signed'
  | 'escrow_mock_funded'
  | 'in_production'
  | 'deliverables_submitted'
  | 'revision_requested'
  | 'approved'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface DeliverableSubmission {
  id: string;
  deliverableId: string;
  title: string;
  fileUrl?: string;
  previewUrl?: string;
  socialDraftLink?: string;
  notes: string;
  submittedAt: string;
  version: number;
  feedback?: string;
  status: 'pending_review' | 'revision_requested' | 'approved';
}

export interface CollaborationActivityItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details?: string;
}

export interface Collaboration {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  agreedAmount: number;
  currency: string;
  status: CollaborationMilestoneStatus;
  deadline: string;
  deliverables: {
    id: string;
    title: string;
    format: string;
    status: 'pending' | 'submitted' | 'revision_requested' | 'approved';
    submission?: DeliverableSubmission;
  }[];
  activityLog: CollaborationActivityItem[];
  paymentStatus: 'unfunded' | 'demo_escrow_held' | 'released_demo' | 'refunded_demo';
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  type: 'text' | 'quotation' | 'deliverable' | 'system';
  quotationData?: Quotation;
  deliverableData?: DeliverableSubmission;
  timestamp: string;
}

export interface Conversation {
  id: string;
  campaignId?: string;
  campaignTitle?: string;
  collaborationId?: string;
  brandId: string;
  brandName: string;
  brandAvatar: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'disputed';

export interface TransactionRecord {
  id: string;
  collaborationId: string;
  campaignTitle: string;
  brandName: string;
  creatorName: string;
  amount: number;
  platformFee: number; // e.g. 5%
  netPayout: number;
  currency: string;
  status: PaymentStatus;
  invoiceNumber: string;
  type: 'milestone_escrow_demo' | 'payout_demo' | 'refund_demo';
  createdAt: string;
  paidAt?: string;
  isDemoEscrow: true; // Explicitly marked as prototype/mock
}

export interface ModerationReport {
  id: string;
  targetType: 'creator' | 'brand' | 'campaign';
  targetId: string;
  targetName: string;
  reportedBy: string;
  reason: string;
  details: string;
  status: 'pending_review' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}
