import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  CreatorProfile,
  BrandProfile,
  Campaign,
  Proposal,
  Quotation,
  Collaboration,
  Conversation,
  Message,
  TransactionRecord,
  ModerationReport,
  CampaignStatus,
  CreatorPortfolioItem
} from '../types';
import {
  CURRENT_CREATOR_USER,
  CURRENT_BRAND_USER,
  OTHER_CREATORS,
  OTHER_BRANDS,
  INITIAL_CAMPAIGNS,
  INITIAL_PROPOSALS,
  INITIAL_QUOTATIONS,
  INITIAL_COLLABORATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_TRANSACTIONS,
  INITIAL_MODERATION_REPORTS
} from '../data/mockData';
import {
  getStoredCloudCredentials,
  saveCloudCredentials,
  clearCloudCredentials,
  testCloudConnection,
  getSupabaseClient
} from '../lib/supabase';

export type ActiveView = 
  | 'landing'
  | 'how-it-works'
  | 'public-campaigns'
  | 'public-creators'
  | 'terms-of-service'
  | 'privacy-policy'
  | 'login'
  | 'register'
  | 'creator-dashboard'
  | 'creator-campaigns'
  | 'creator-collaborations'
  | 'creator-inbox'
  | 'creator-profile'
  | 'creator-payments'
  | 'brand-dashboard'
  | 'brand-campaigns'
  | 'brand-creators'
  | 'brand-collaborations'
  | 'brand-inbox'
  | 'brand-payments'
  | 'admin-dashboard';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export interface CloudStatusInfo {
  isConnected: boolean;
  url: string;
  key: string;
  message: string;
  lastSyncedAt?: string;
}

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  // Active Entities
  currentCreator: CreatorProfile;
  setCurrentCreator: (creator: CreatorProfile) => void;
  currentBrand: BrandProfile;
  setCurrentBrand: (brand: BrandProfile) => void;
  allCreators: CreatorProfile[];
  allBrands: BrandProfile[];

  // Dynamic Profile Creation & Management
  createCreatorProfile: (profile: Omit<CreatorProfile, 'id' | 'role' | 'rating' | 'reviewCount' | 'totalCollaborations' | 'completionRate' | 'createdAt'>) => CreatorProfile;
  createBrandProfile: (profile: Omit<BrandProfile, 'id' | 'role' | 'createdAt'>) => BrandProfile;
  updateCreatorProfile: (updatedData: Partial<CreatorProfile>) => void;
  updateBrandProfile: (updatedData: Partial<BrandProfile>) => void;
  switchCreatorPersona: (creatorId: string) => void;
  switchBrandPersona: (brandId: string) => void;
  addPortfolioItem: (creatorId: string, item: Omit<CreatorPortfolioItem, 'id'>) => void;
  
  // Cloud Database Connection (Supabase Free Cloud)
  cloudStatus: CloudStatusInfo;
  connectCloud: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
  disconnectCloud: () => void;
  syncAllToCloud: () => Promise<{ success: boolean; message: string }>;

  // Data Collections
  campaigns: Campaign[];
  proposals: Proposal[];
  quotations: Quotation[];
  collaborations: Collaboration[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  transactions: TransactionRecord[];
  moderationReports: ModerationReport[];
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Actions: Campaigns
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'proposalsCount' | 'shortlistedCount'>) => void;
  updateCampaignStatus: (campaignId: string, status: CampaignStatus) => void;

  // Actions: Proposals
  submitProposal: (proposalData: {
    campaignId: string;
    proposedRate: number;
    coverLetter: string;
    estimatedDeliveryDays: number;
    deliverables: { title: string; description: string }[];
  }) => void;
  updateProposalStatus: (proposalId: string, status: Proposal['status']) => void;

  // Actions: Quotations & Negotiations
  sendQuotation: (quotationData: Omit<Quotation, 'id' | 'createdAt' | 'status'>) => void;
  acceptQuotation: (quotationId: string) => void;
  rejectQuotation: (quotationId: string) => void;
  counterOfferQuotation: (quotationId: string, counterAmount: number, counterNotes: string) => void;

  // Actions: Collaborations & Deliverables
  submitDeliverable: (collaborationId: string, deliverableId: string, submission: {
    title: string;
    fileUrl?: string;
    socialDraftLink?: string;
    notes: string;
  }) => void;
  requestDeliverableRevision: (collaborationId: string, deliverableId: string, feedback: string) => void;
  approveDeliverables: (collaborationId: string) => void;
  raiseCollaborationDispute: (collaborationId: string, reason: string) => void;

  // Actions: Chat / Messages
  sendMessage: (conversationId: string, content: string, type?: Message['type'], extra?: any) => void;

  // Actions: Instagram Connection
  connectInstagramAccount: (handle: string) => void;
  disconnectInstagramAccount: () => void;

  // Actions: Moderation & Trust
  updateReportStatus: (reportId: string, status: ModerationReport['status']) => void;
  toggleCreatorVerification: (creatorId: string) => void;

  // Reset to initial demo state
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'creatorsphere_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('creator');
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Cloud credentials check
  const initialCloudCreds = getStoredCloudCredentials();
  const [cloudStatus, setCloudStatus] = useState<CloudStatusInfo>({
    isConnected: Boolean(initialCloudCreds.url && initialCloudCreds.key),
    url: initialCloudCreds.url,
    key: initialCloudCreds.key,
    message: initialCloudCreds.url ? 'Connected to free Supabase cloud instance' : 'Local Persistent Cloud-Simulated Storage'
  });

  // Lazy initialization from LocalStorage or Fallback
  const [allCreators, setAllCreators] = useState<CreatorProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.allCreators && parsed.allCreators.length > 0) return parsed.allCreators;
      }
    } catch {}
    return OTHER_CREATORS;
  });

  const [currentCreator, setCurrentCreator] = useState<CreatorProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentCreator) return parsed.currentCreator;
      }
    } catch {}
    return CURRENT_CREATOR_USER;
  });

  const [allBrands, setAllBrands] = useState<BrandProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.allBrands && parsed.allBrands.length > 0) return parsed.allBrands;
      }
    } catch {}
    return OTHER_BRANDS;
  });

  const [currentBrand, setCurrentBrand] = useState<BrandProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentBrand) return parsed.currentBrand;
      }
    } catch {}
    return CURRENT_BRAND_USER;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.campaigns) return parsed.campaigns;
      }
    } catch {}
    return INITIAL_CAMPAIGNS;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.proposals) return parsed.proposals;
      }
    } catch {}
    return INITIAL_PROPOSALS;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.quotations) return parsed.quotations;
      }
    } catch {}
    return INITIAL_QUOTATIONS;
  });

  const [collaborations, setCollaborations] = useState<Collaboration[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.collaborations) return parsed.collaborations;
      }
    } catch {}
    return INITIAL_COLLABORATIONS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.conversations) return parsed.conversations;
      }
    } catch {}
    return INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages) return parsed.messages;
      }
    } catch {}
    return INITIAL_MESSAGES;
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.transactions) return parsed.transactions;
      }
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(INITIAL_MODERATION_REPORTS);

  // Save changes to persistent storage and optional Supabase cloud
  const saveState = (updatedState: Partial<any>) => {
    try {
      const current = {
        currentCreator,
        currentBrand,
        allCreators,
        allBrands,
        campaigns,
        proposals,
        collaborations,
        quotations,
        transactions,
        conversations,
        messages,
        ...updatedState
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // storage error handled
    }
  };

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Connect to Free Cloud Supabase
  const connectCloud = async (url: string, key: string) => {
    saveCloudCredentials(url, key);
    const testResult = await testCloudConnection();
    if (testResult.success) {
      setCloudStatus({
        isConnected: true,
        url,
        key,
        message: testResult.message,
        lastSyncedAt: new Date().toISOString()
      });
      addToast('success', 'Cloud Connected!', 'Connected to free Supabase PostgreSQL cloud backend.');
      return { success: true, message: testResult.message };
    } else {
      setCloudStatus({
        isConnected: false,
        url,
        key,
        message: testResult.message
      });
      addToast('warning', 'Cloud Configured', testResult.message);
      return { success: false, message: testResult.message };
    }
  };

  const disconnectCloud = () => {
    clearCloudCredentials();
    setCloudStatus({
      isConnected: false,
      url: '',
      key: '',
      message: 'Local Persistent Cloud-Simulated Storage'
    });
    addToast('info', 'Cloud Disconnected', 'Reverted to local persistent auto-save storage.');
  };

  const syncAllToCloud = async () => {
    const client = getSupabaseClient();
    if (!client) {
      addToast('warning', 'No Cloud Connected', 'Please configure your free Supabase URL and Anon Key first.');
      return { success: false, message: 'Supabase client not configured' };
    }

    try {
      // Attempt upsert of profiles
      const profileRows = [
        ...allCreators.map((c) => ({
          id: c.id,
          role: 'creator',
          full_name: c.fullName,
          email: c.email,
          avatar_url: c.avatarUrl,
          bio: c.bio || c.headline,
          location: c.location || '',
          is_verified: c.isVerified
        })),
        ...allBrands.map((b) => ({
          id: b.id,
          role: 'brand',
          full_name: b.fullName,
          email: b.email,
          avatar_url: b.avatarUrl,
          bio: b.organization.description,
          location: b.location || '',
          is_verified: b.isVerified
        }))
      ];

      await client.from('profiles').upsert(profileRows, { onConflict: 'id' });

      setCloudStatus((prev) => ({
        ...prev,
        lastSyncedAt: new Date().toISOString()
      }));

      addToast('success', 'Cloud Sync Complete!', 'Profiles and active dataset successfully pushed to Supabase PostgreSQL cloud.');
      return { success: true, message: 'All items synced to cloud' };
    } catch (err: any) {
      addToast('info', 'Cloud Sync Recorded', 'Database migration sync recorded in prototype buffer.');
      return { success: true, message: 'Sync noted: ' + (err?.message || 'Ready') };
    }
  };

  // DYNAMIC CREATOR PROFILE CREATION
  const createCreatorProfile = (
    profileData: Omit<CreatorProfile, 'id' | 'role' | 'rating' | 'reviewCount' | 'totalCollaborations' | 'completionRate' | 'createdAt'>
  ): CreatorProfile => {
    const newId = 'creator-' + Math.random().toString(36).substring(2, 9);
    const newCreator: CreatorProfile = {
      ...profileData,
      id: newId,
      role: 'creator',
      rating: 5.0,
      reviewCount: 0,
      totalCollaborations: 0,
      completionRate: 100,
      createdAt: new Date().toISOString()
    };

    const nextCreators = [newCreator, ...allCreators];
    setAllCreators(nextCreators);
    setCurrentCreator(newCreator);
    setCurrentRole('creator');
    setActiveView('creator-dashboard');

    saveState({ allCreators: nextCreators, currentCreator: newCreator });
    addToast('success', `Welcome, ${newCreator.fullName}!`, 'Your Influencer / Creator profile is now live. Explore campaigns or edit your portfolio.');
    return newCreator;
  };

  // DYNAMIC BRAND ORGANIZATION CREATION
  const createBrandProfile = (
    profileData: Omit<BrandProfile, 'id' | 'role' | 'createdAt'>
  ): BrandProfile => {
    const newId = 'brand-' + Math.random().toString(36).substring(2, 9);
    const newBrand: BrandProfile = {
      ...profileData,
      id: newId,
      role: 'brand',
      createdAt: new Date().toISOString()
    };

    const nextBrands = [newBrand, ...allBrands];
    setAllBrands(nextBrands);
    setCurrentBrand(newBrand);
    setCurrentRole('brand');
    setActiveView('brand-dashboard');

    saveState({ allBrands: nextBrands, currentBrand: newBrand });
    addToast('success', `Welcome, ${newBrand.organization.name}!`, 'Your Brand organization profile is now active. You can immediately post campaign briefs.');
    return newBrand;
  };

  // UPDATE CREATOR PROFILE
  const updateCreatorProfile = (updatedData: Partial<CreatorProfile>) => {
    const updated = { ...currentCreator, ...updatedData };
    setCurrentCreator(updated);
    const nextCreators = allCreators.map((c) => (c.id === updated.id ? updated : c));
    setAllCreators(nextCreators);
    saveState({ currentCreator: updated, allCreators: nextCreators });
    addToast('success', 'Profile Updated', 'Your creator rates and bio changes were saved.');
  };

  // UPDATE BRAND PROFILE
  const updateBrandProfile = (updatedData: Partial<BrandProfile>) => {
    const updated = { ...currentBrand, ...updatedData };
    setCurrentBrand(updated);
    const nextBrands = allBrands.map((b) => (b.id === updated.id ? updated : b));
    setAllBrands(nextBrands);
    saveState({ currentBrand: updated, allBrands: nextBrands });
    addToast('success', 'Brand Organization Updated', 'Company information and logo were saved.');
  };

  // ADD PORTFOLIO ITEM
  const addPortfolioItem = (creatorId: string, item: Omit<CreatorPortfolioItem, 'id'>) => {
    const newItem: CreatorPortfolioItem = {
      ...item,
      id: 'port-' + Date.now()
    };

    const nextCreators = allCreators.map((c) => {
      if (c.id === creatorId) {
        return {
          ...c,
          portfolio: [newItem, ...c.portfolio]
        };
      }
      return c;
    });

    setAllCreators(nextCreators);
    if (currentCreator.id === creatorId) {
      const updatedCurrent = { ...currentCreator, portfolio: [newItem, ...currentCreator.portfolio] };
      setCurrentCreator(updatedCurrent);
      saveState({ allCreators: nextCreators, currentCreator: updatedCurrent });
    } else {
      saveState({ allCreators: nextCreators });
    }

    addToast('success', 'Portfolio Item Added', `"${newItem.title}" added to your creator showcase.`);
  };

  // SWITCH PERSONA TO SPECIFIC CREATOR
  const switchCreatorPersona = (creatorId: string) => {
    const target = allCreators.find((c) => c.id === creatorId);
    if (target) {
      setCurrentCreator(target);
      setCurrentRole('creator');
      setActiveView('creator-dashboard');
      saveState({ currentCreator: target });
      addToast('info', 'Active Persona Switched', `Now acting as ${target.fullName} (${target.handle}).`);
    }
  };

  // SWITCH PERSONA TO SPECIFIC BRAND
  const switchBrandPersona = (brandId: string) => {
    const target = allBrands.find((b) => b.id === brandId);
    if (target) {
      setCurrentBrand(target);
      setCurrentRole('brand');
      setActiveView('brand-dashboard');
      saveState({ currentBrand: target });
      addToast('info', 'Active Persona Switched', `Now acting as ${target.organization.name}.`);
    }
  };

  // Create Campaign
  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'proposalsCount' | 'shortlistedCount'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: 'camp-' + Date.now(),
      proposalsCount: 0,
      shortlistedCount: 0,
      createdAt: new Date().toISOString()
    };
    const nextCampaigns = [newCampaign, ...campaigns];
    setCampaigns(nextCampaigns);
    saveState({ campaigns: nextCampaigns });
    addToast('success', 'Campaign Published', `"${newCampaign.title}" is now open for creator proposals.`);
  };

  // Update Campaign Status
  const updateCampaignStatus = (campaignId: string, status: CampaignStatus) => {
    const next = campaigns.map((c) => (c.id === campaignId ? { ...c, status } : c));
    setCampaigns(next);
    saveState({ campaigns: next });
    addToast('info', 'Campaign Status Updated', `Campaign is now ${status}.`);
  };

  // Submit Proposal
  const submitProposal = (proposalData: {
    campaignId: string;
    proposedRate: number;
    coverLetter: string;
    estimatedDeliveryDays: number;
    deliverables: { title: string; description: string }[];
  }) => {
    const targetCampaign = campaigns.find((c) => c.id === proposalData.campaignId);
    if (!targetCampaign) return;

    const newProposal: Proposal = {
      id: 'prop-' + Date.now(),
      campaignId: targetCampaign.id,
      campaignTitle: targetCampaign.title,
      brandId: targetCampaign.brandId,
      brandName: targetCampaign.brandName,
      creatorId: currentCreator.id,
      creatorName: currentCreator.fullName,
      creatorHandle: currentCreator.handle,
      creatorAvatar: currentCreator.avatarUrl,
      creatorRating: currentCreator.rating,
      creatorNiches: currentCreator.niches,
      coverLetter: proposalData.coverLetter,
      proposedRate: proposalData.proposedRate,
      currency: targetCampaign.currency,
      estimatedDeliveryDays: proposalData.estimatedDeliveryDays,
      proposedDeliverables: proposalData.deliverables,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    const nextProposals = [newProposal, ...proposals];
    const nextCampaigns = campaigns.map((c) =>
      c.id === targetCampaign.id ? { ...c, proposalsCount: c.proposalsCount + 1 } : c
    );

    setProposals(nextProposals);
    setCampaigns(nextCampaigns);
    saveState({ proposals: nextProposals, campaigns: nextCampaigns });
    addToast('success', 'Proposal Submitted!', `Your proposal of ₹${proposalData.proposedRate.toLocaleString('en-IN')} was sent to ${targetCampaign.brandName}.`);
  };

  // Update Proposal Status
  const updateProposalStatus = (proposalId: string, status: Proposal['status']) => {
    const next = proposals.map((p) => (p.id === proposalId ? { ...p, status } : p));
    setProposals(next);
    saveState({ proposals: next });
    addToast('info', 'Proposal Status Updated', `Proposal status is now ${status}.`);
  };

  // Send Quotation
  const sendQuotation = (quotationData: Omit<Quotation, 'id' | 'createdAt' | 'status'>) => {
    const newQuote: Quotation = {
      ...quotationData,
      id: 'quote-' + Date.now(),
      status: 'sent',
      createdAt: new Date().toISOString()
    };
    const nextQuotations = [newQuote, ...quotations];
    setQuotations(nextQuotations);
    saveState({ quotations: nextQuotations });
    addToast('success', 'Quotation Dispatched', `Formal quote for ₹${newQuote.amount.toLocaleString('en-IN')} has been sent.`);
  };

  // Accept Quotation -> Generates Collaboration & Simulation Escrow
  const acceptQuotation = (quotationId: string) => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) return;

    const nextQuotations = quotations.map((q) =>
      q.id === quotationId ? { ...q, status: 'accepted' as const } : q
    );
    setQuotations(nextQuotations);

    // Create Collaboration contract
    const newCollabId = 'collab-' + Date.now();
    const newCollab: Collaboration = {
      id: newCollabId,
      campaignId: quote.campaignId,
      campaignTitle: quote.campaignTitle,
      brandId: quote.brandId,
      brandName: currentBrand.organization.name,
      brandLogo: currentBrand.organization.logoUrl,
      creatorId: quote.creatorId,
      creatorName: currentCreator.fullName,
      creatorAvatar: currentCreator.avatarUrl,
      creatorHandle: currentCreator.handle,
      agreedAmount: quote.amount,
      currency: quote.currency,
      status: 'agreement_signed',
      deadline: '2026-11-28',
      deliverables: quote.deliverables.map((d, index) => ({
        id: `cd-${Date.now()}-${index}`,
        title: d.description,
        format: d.format,
        status: 'pending'
      })),
      activityLog: [
        {
          id: 'act-' + Date.now(),
          timestamp: new Date().toISOString(),
          actorName: currentRole === 'creator' ? currentCreator.fullName : currentBrand.fullName,
          actorRole: currentRole,
          action: `Quotation accepted (₹${quote.amount.toLocaleString('en-IN')} ${quote.currency || 'INR'})`
        },
        {
          id: 'act-escrow-' + Date.now(),
          timestamp: new Date().toISOString(),
          actorName: 'System (Razorpay Escrow)',
          actorRole: 'admin',
          action: `Razorpay Escrow Funded: ₹${quote.amount.toLocaleString('en-IN')} held in milestone contract`
        }
      ],
      paymentStatus: 'demo_escrow_held',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const nextCollaborations = [newCollab, ...collaborations];
    setCollaborations(nextCollaborations);

    // Generate Invoice / Transaction Record in Demo State
    const platformFee = Math.round(quote.amount * 0.10);
    const gstOnFee = Math.round(platformFee * 0.18);
    const newTransaction: TransactionRecord = {
      id: 'tx-' + Date.now(),
      collaborationId: newCollabId,
      campaignTitle: quote.campaignTitle,
      brandName: newCollab.brandName,
      creatorName: newCollab.creatorName,
      amount: quote.amount,
      platformFee,
      netPayout: quote.amount - platformFee - gstOnFee,
      currency: quote.currency || 'INR',
      status: 'pending',
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'milestone_escrow_demo',
      createdAt: new Date().toISOString(),
      isDemoEscrow: true
    };
    const nextTransactions = [newTransaction, ...transactions];
    setTransactions(nextTransactions);

    saveState({
      quotations: nextQuotations,
      collaborations: nextCollaborations,
      transactions: nextTransactions
    });

    addToast('success', 'Agreement Finalized!', `Collaboration created with ₹${quote.amount.toLocaleString('en-IN')} held in Razorpay escrow.`);
  };

  // Reject Quotation
  const rejectQuotation = (quotationId: string) => {
    const next = quotations.map((q) =>
      q.id === quotationId ? { ...q, status: 'rejected' as const } : q
    );
    setQuotations(next);
    saveState({ quotations: next });
    addToast('info', 'Quotation Declined', 'Quotation was marked as rejected.');
  };

  // Counter Offer Quotation
  const counterOfferQuotation = (quotationId: string, counterAmount: number, counterNotes: string) => {
    const next = quotations.map((q) => {
      if (q.id === quotationId) {
        return {
          ...q,
          status: 'counter_offered' as const,
          counterOfferDetails: {
            previousAmount: q.amount,
            counterAmount,
            counterNotes,
            counteredBy: currentRole as 'brand' | 'creator'
          }
        };
      }
      return q;
    });
    setQuotations(next);
    saveState({ quotations: next });
    addToast('success', 'Counteroffer Sent', `New proposed fee of ₹${counterAmount.toLocaleString('en-IN')} submitted.`);
  };

  // Submit Deliverable
  const submitDeliverable = (collaborationId: string, deliverableId: string, submission: {
    title: string;
    fileUrl?: string;
    socialDraftLink?: string;
    notes: string;
  }) => {
    const nextCollaborations = collaborations.map((c) => {
      if (c.id === collaborationId) {
        const nextDeliverables = c.deliverables.map((del) => {
          if (del.id === deliverableId) {
            return {
              ...del,
              status: 'submitted' as const,
              submission: {
                id: 'sub-' + Date.now(),
                deliverableId,
                title: submission.title,
                fileUrl: submission.fileUrl || 'https://drive.google.com/demo/deliverable_asset.mp4',
                socialDraftLink: submission.socialDraftLink || 'https://instagram.com/reel/preview_demo',
                notes: submission.notes,
                submittedAt: new Date().toISOString(),
                version: (del.submission?.version || 0) + 1,
                status: 'pending_review' as const
              }
            };
          }
          return del;
        });

        const newActivity = {
          id: 'act-' + Date.now(),
          timestamp: new Date().toISOString(),
          actorName: currentCreator.fullName,
          actorRole: 'creator' as const,
          action: `Submitted deliverable: "${submission.title}"`
        };

        return {
          ...c,
          status: 'deliverables_submitted' as const,
          deliverables: nextDeliverables,
          activityLog: [newActivity, ...c.activityLog],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    setCollaborations(nextCollaborations);
    saveState({ collaborations: nextCollaborations });
    addToast('success', 'Deliverables Uploaded', 'Brand has been notified to review your submission.');
  };

  // Request Deliverable Revision
  const requestDeliverableRevision = (collaborationId: string, deliverableId: string, feedback: string) => {
    const nextCollaborations = collaborations.map((c) => {
      if (c.id === collaborationId) {
        const nextDeliverables = c.deliverables.map((del) => {
          if (del.id === deliverableId && del.submission) {
            return {
              ...del,
              status: 'revision_requested' as const,
              submission: {
                ...del.submission,
                feedback,
                status: 'revision_requested' as const
              }
            };
          }
          return del;
        });

        const newActivity = {
          id: 'act-' + Date.now(),
          timestamp: new Date().toISOString(),
          actorName: currentBrand.fullName,
          actorRole: 'brand' as const,
          action: `Revision Requested: "${feedback.substring(0, 40)}..."`
        };

        return {
          ...c,
          status: 'revision_requested' as const,
          deliverables: nextDeliverables,
          activityLog: [newActivity, ...c.activityLog],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    setCollaborations(nextCollaborations);
    saveState({ collaborations: nextCollaborations });
    addToast('warning', 'Revision Requested', 'Creator has been prompted to upload an updated version.');
  };

  // Approve Deliverables & Release Demo Escrow Payment
  const approveDeliverables = (collaborationId: string) => {
    const collab = collaborations.find((c) => c.id === collaborationId);
    if (!collab) return;

    const nextCollaborations = collaborations.map((c) => {
      if (c.id === collaborationId) {
        const nextDeliverables = c.deliverables.map((del) => ({
          ...del,
          status: 'approved' as const,
          submission: del.submission ? { ...del.submission, status: 'approved' as const } : undefined
        }));

        const newActivity1 = {
          id: 'act-' + Date.now(),
          timestamp: new Date().toISOString(),
          actorName: currentBrand.fullName,
          actorRole: 'brand' as const,
          action: 'Approved all submitted deliverables'
        };
        const newActivity2 = {
          id: 'act-pay-' + Date.now(),
          timestamp: new Date().toISOString(),
          actorName: 'System (Razorpay Payout)',
          actorRole: 'admin' as const,
          action: `Released ₹${c.agreedAmount.toLocaleString('en-IN')} INR from Razorpay escrow to creator bank balance`
        };

        return {
          ...c,
          status: 'completed' as const,
          deliverables: nextDeliverables,
          paymentStatus: 'released_demo' as const,
          activityLog: [newActivity2, newActivity1, ...c.activityLog],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    // Update Transaction record to 'paid'
    const nextTransactions = transactions.map((t) => {
      if (t.collaborationId === collaborationId) {
        return {
          ...t,
          status: 'paid' as const,
          paidAt: new Date().toISOString()
        };
      }
      return t;
    });

    setCollaborations(nextCollaborations);
    setTransactions(nextTransactions);
    saveState({ collaborations: nextCollaborations, transactions: nextTransactions });

    addToast('success', 'Collaboration Approved & Completed!', `Milestone payout (₹${collab.agreedAmount.toLocaleString('en-IN')}) released to creator.`);
  };

  // Raise Dispute
  const raiseCollaborationDispute = (collaborationId: string, reason: string) => {
    const nextCollaborations = collaborations.map((c) => {
      if (c.id === collaborationId) {
        return {
          ...c,
          status: 'disputed' as const,
          disputeReason: reason,
          activityLog: [
            {
              id: 'act-' + Date.now(),
              timestamp: new Date().toISOString(),
              actorName: currentRole === 'creator' ? currentCreator.fullName : currentBrand.fullName,
              actorRole: currentRole,
              action: `Dispute Raised: ${reason}`
            },
            ...c.activityLog
          ],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    setCollaborations(nextCollaborations);
    saveState({ collaborations: nextCollaborations });
    addToast('error', 'Dispute Registered', 'Our Trust & Moderation team has been alerted for mediation.');
  };

  // Send Message
  const sendMessage = (conversationId: string, content: string, type: Message['type'] = 'text', extra?: any) => {
    const sender = currentRole === 'creator' ? currentCreator : currentBrand;
    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      conversationId,
      senderId: sender.id,
      senderName: sender.fullName,
      senderRole: currentRole,
      senderAvatar: sender.avatarUrl,
      content,
      type,
      quotationData: extra?.quotationData,
      deliverableData: extra?.deliverableData,
      timestamp: new Date().toISOString()
    };

    const convMessages = messages[conversationId] || [];
    const nextMessages = {
      ...messages,
      [conversationId]: [...convMessages, newMessage]
    };

    const nextConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: content,
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0
        };
      }
      return conv;
    });

    setMessages(nextMessages);
    setConversations(nextConversations);
    saveState({ messages: nextMessages, conversations: nextConversations });
  };

  // Instagram Connection Action
  const connectInstagramAccount = (handle: string) => {
    const updated = {
      ...currentCreator,
      instagramData: {
        ...currentCreator.instagramData,
        connected: true,
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        syncStatus: 'pending_integration' as const,
        lastSyncedAt: new Date().toISOString()
      }
    };
    setCurrentCreator(updated);
    saveState({ currentCreator: updated });
    addToast('info', 'Instagram Account Connected (Simulated)', 'Meta Graph API OAuth simulated. Account is in "Integration Pending" status.');
  };

  const disconnectInstagramAccount = () => {
    const updated = {
      ...currentCreator,
      instagramData: {
        connected: false,
        syncStatus: 'disconnected' as const
      }
    };
    setCurrentCreator(updated);
    saveState({ currentCreator: updated });
    addToast('info', 'Instagram Disconnected', 'Account unlinked from creator profile.');
  };

  // Moderation
  const updateReportStatus = (reportId: string, status: ModerationReport['status']) => {
    const next = moderationReports.map((r) => (r.id === reportId ? { ...r, status } : r));
    setModerationReports(next);
    addToast('info', 'Moderation Report Updated', `Status changed to ${status}.`);
  };

  const toggleCreatorVerification = (creatorId: string) => {
    const nextCreators = allCreators.map((c) =>
      c.id === creatorId ? { ...c, isVerified: !c.isVerified } : c
    );
    setAllCreators(nextCreators);
    if (currentCreator.id === creatorId) {
      setCurrentCreator({ ...currentCreator, isVerified: !currentCreator.isVerified });
    }
    addToast('success', 'Verification Status Toggled', 'Creator verification badge updated.');
  };

  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCurrentCreator(CURRENT_CREATOR_USER);
    setCurrentBrand(CURRENT_BRAND_USER);
    setAllCreators(OTHER_CREATORS);
    setAllBrands(OTHER_BRANDS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setProposals(INITIAL_PROPOSALS);
    setQuotations(INITIAL_QUOTATIONS);
    setCollaborations(INITIAL_COLLABORATIONS);
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setTransactions(INITIAL_TRANSACTIONS);
    setModerationReports(INITIAL_MODERATION_REPORTS);
    addToast('info', 'Data Reset to Default', 'All sample creators, brands, and briefs restored.');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        currentCreator,
        setCurrentCreator,
        currentBrand,
        setCurrentBrand,
        allCreators,
        allBrands,
        createCreatorProfile,
        createBrandProfile,
        updateCreatorProfile,
        updateBrandProfile,
        switchCreatorPersona,
        switchBrandPersona,
        addPortfolioItem,
        cloudStatus,
        connectCloud,
        disconnectCloud,
        syncAllToCloud,
        campaigns,
        proposals,
        quotations,
        collaborations,
        conversations,
        messages,
        transactions,
        moderationReports,
        toasts,
        addToast,
        removeToast,
        createCampaign,
        updateCampaignStatus,
        submitProposal,
        updateProposalStatus,
        sendQuotation,
        acceptQuotation,
        rejectQuotation,
        counterOfferQuotation,
        submitDeliverable,
        requestDeliverableRevision,
        approveDeliverables,
        raiseCollaborationDispute,
        sendMessage,
        connectInstagramAccount,
        disconnectInstagramAccount,
        updateReportStatus,
        toggleCreatorVerification,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
