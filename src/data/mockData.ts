import {
  CreatorProfile,
  BrandProfile,
  Campaign,
  Proposal,
  Quotation,
  Collaboration,
  Conversation,
  Message,
  TransactionRecord,
  ModerationReport
} from '../types';

export const CURRENT_CREATOR_USER: CreatorProfile = {
  id: 'creator-maya-chen',
  role: 'creator',
  fullName: 'Maya Chen',
  email: 'maya@mayachencreative.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  handle: '@mayacreates',
  headline: 'Tech, AI & Aesthetic Productivity Creator | 185K+ Engaged Community',
  bio: 'Silicon Valley based creator specializing in high-converting, visually cinematic content around AI tools, premium audio, and daily productivity hardware. Featured in Wired and Forbes 30u30.',
  location: 'Bengaluru, India',
  isVerified: true,
  createdAt: '2023-01-15T00:00:00Z',
  niches: ['Tech & AI', 'Lifestyle & Family', 'Design & Creative'],
  platforms: [
    { platform: 'instagram', handle: 'mayacreates', followers: 185400, url: 'https://instagram.com' },
    { platform: 'tiktok', handle: 'mayacreates.tech', followers: 92300, url: 'https://tiktok.com' },
    { platform: 'youtube', handle: 'MayaChenTech', followers: 48000, url: 'https://youtube.com' }
  ],
  rates: {
    dedicatedVideo: 55000,
    sponsoredReel: 25000,
    storySet: 10000,
    customPackageMin: 35000
  },
  rating: 4.98,
  reviewCount: 42,
  totalCollaborations: 38,
  completionRate: 100,
  instagramData: {
    connected: true,
    handle: '@mayacreates',
    followers: 185420,
    avgEngagementRate: 4.85,
    avgImpressions: 215000,
    topAudienceCountry: 'United States (68%)',
    syncStatus: 'pending_integration', // Clearly labeled integration pending state
    lastSyncedAt: '2026-10-20T14:30:00Z'
  },
  portfolio: [
    {
      id: 'port-1',
      title: 'Spatial Audio Studio Tour & Unboxing',
      mediaUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      platform: 'instagram',
      engagementRate: '5.2%',
      impressions: '298K',
      views: '184K',
      brandClient: 'SoundPulse Labs'
    },
    {
      id: 'port-2',
      title: '7 AI Workflows That Saved Me 20 Hours',
      mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      platform: 'tiktok',
      engagementRate: '6.4%',
      impressions: '412K',
      views: '320K',
      brandClient: 'Kore AI'
    },
    {
      id: 'port-3',
      title: 'Minimalist Ergonomic Workspace Makeover',
      mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      platform: 'instagram',
      engagementRate: '4.9%',
      impressions: '190K',
      views: '115K',
      brandClient: 'ErgoDesk Pro'
    }
  ],
  badges: ['Top Rated Plus', 'Fast Responder (< 1hr)', '100% On-Time Delivery']
};

export const OTHER_CREATORS: CreatorProfile[] = [
  CURRENT_CREATOR_USER,
  {
    id: 'creator-alex-rivera',
    role: 'creator',
    fullName: 'Alex Rivera',
    email: 'alex@alexperformance.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    handle: '@alex.riverafit',
    headline: 'High-Performance Athlete & Nutrition Coach | 320K Community',
    bio: 'Hybrid endurance athlete and NASM master coach. I partner with clean supplement and performance apparel brands that value science and durability.',
    location: 'Mumbai, India',
    isVerified: true,
    createdAt: '2023-04-10T00:00:00Z',
    niches: ['Fitness & Wellness', 'Lifestyle & Family'],
    platforms: [
      { platform: 'instagram', handle: 'alex.riverafit', followers: 320500 },
      { platform: 'youtube', handle: 'RiveraEndurance', followers: 85000 }
    ],
    rates: {
      dedicatedVideo: 65000,
      sponsoredReel: 30000,
      storySet: 12000,
      customPackageMin: 45000
    },
    rating: 4.94,
    reviewCount: 35,
    totalCollaborations: 29,
    completionRate: 98,
    instagramData: {
      connected: true,
      handle: '@alex.riverafit',
      followers: 320500,
      avgEngagementRate: 5.12,
      avgImpressions: 380000,
      topAudienceCountry: 'United States (74%)',
      syncStatus: 'synced',
      lastSyncedAt: '2026-10-21T09:15:00Z'
    },
    portfolio: [
      {
        id: 'port-alex-1',
        title: 'Sub-3 Hour Marathon Training Regimen & Recovery',
        mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        platform: 'instagram',
        engagementRate: '5.8%',
        impressions: '420K',
        brandClient: 'Apex Performance'
      }
    ],
    badges: ['Top Rated Plus', 'Verified Athlete']
  },
  {
    id: 'creator-elena-rostova',
    role: 'creator',
    fullName: 'Elena Rostova',
    email: 'elena@luxevoyage.co',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    handle: '@elena.wanderlust',
    headline: 'Luxury Travel Photographer & Architectural Curator | 510K',
    bio: 'Documenting the worlds most breathtaking boutique sanctuaries, high design hospitality, and conscious luxury travel across 45+ countries.',
    location: 'New York / Milan',
    isVerified: true,
    createdAt: '2022-09-01T00:00:00Z',
    niches: ['Travel & Hospitality', 'Beauty & Fashion', 'Design & Creative'],
    platforms: [
      { platform: 'instagram', handle: 'elena.wanderlust', followers: 512000 },
      { platform: 'tiktok', handle: 'elenarostova', followers: 230000 }
    ],
    rates: {
      dedicatedVideo: 4500,
      sponsoredReel: 2400,
      storySet: 1100,
      customPackageMin: 3500
    },
    rating: 4.96,
    reviewCount: 58,
    totalCollaborations: 51,
    completionRate: 100,
    instagramData: {
      connected: true,
      handle: '@elena.wanderlust',
      followers: 512000,
      avgEngagementRate: 4.65,
      avgImpressions: 610000,
      topAudienceCountry: 'United Kingdom & US (60%)',
      syncStatus: 'synced',
      lastSyncedAt: '2026-10-19T18:00:00Z'
    },
    portfolio: [
      {
        id: 'port-elena-1',
        title: 'Cinematic Dawn at Amangiri',
        mediaUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        platform: 'instagram',
        engagementRate: '6.1%',
        impressions: '780K',
        brandClient: 'Aman Resorts'
      }
    ],
    badges: ['Top Rated Plus', 'Global Ambassador', 'Cinematography Pro']
  },
  {
    id: 'creator-marcus-thorne',
    role: 'creator',
    fullName: 'Marcus Thorne',
    email: 'marcus@pixelarcade.gg',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    handle: '@thorne.gaming',
    headline: 'Next-Gen Gaming & Hardware Rig Builder | 140K Gen-Z Audience',
    bio: 'Custom liquid-cooled PC builds, eSports tournament breakdowns, and honest hardware reviews for gamers and creative power users.',
    location: 'Seattle, WA',
    isVerified: true,
    createdAt: '2023-08-20T00:00:00Z',
    niches: ['Gaming & Esports', 'Tech & AI'],
    platforms: [
      { platform: 'youtube', handle: 'MarcusThorneBuilds', followers: 142000 },
      { platform: 'tiktok', handle: 'thorne.tech', followers: 115000 }
    ],
    rates: {
      dedicatedVideo: 2200,
      sponsoredReel: 1100,
      storySet: 500,
      customPackageMin: 1500
    },
    rating: 4.89,
    reviewCount: 22,
    totalCollaborations: 19,
    completionRate: 95,
    instagramData: {
      connected: false,
      syncStatus: 'disconnected'
    },
    portfolio: [],
    badges: ['Hardware Expert', 'Rising Star']
  }
];

export const CURRENT_BRAND_USER: BrandProfile = {
  id: 'brand-lumina-audio',
  role: 'brand',
  fullName: 'Sarah Vance',
  email: 'sarah.vance@lumina-audio.com',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  jobTitle: 'Head of Creator Partnerships & Influencer Marketing',
  location: 'Los Angeles, CA',
  isVerified: true,
  createdAt: '2023-02-01T00:00:00Z',
  organization: {
    id: 'org-lumina-audio',
    name: 'Lumina Audio Technologies',
    industry: 'Consumer Tech & Hardware',
    website: 'https://lumina-audio.demo',
    logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
    description: 'Pioneering planar magnetic spatial audio headphones and microphones for creators and audiophiles.',
    verified: true,
    totalSpentDemo: 42500,
    activeCampaignsCount: 3
  }
};

export const OTHER_BRANDS: BrandProfile[] = [
  CURRENT_BRAND_USER,
  {
    id: 'brand-apex-wear',
    role: 'brand',
    fullName: 'Marcus Hayes',
    email: 'marcus@apexperformance.demo',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    jobTitle: 'VP of Growth & Athlete Marketing',
    location: 'Denver, CO',
    isVerified: true,
    createdAt: '2023-05-10T00:00:00Z',
    organization: {
      id: 'org-apex-wear',
      name: 'Apex Performance',
      industry: 'Technical Athletics & Apparel',
      website: 'https://apexwear.demo',
      logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80',
      description: 'Technical outerwear engineered for extreme high-altitude alpine training.',
      verified: true,
      totalSpentDemo: 68000,
      activeCampaignsCount: 2
    }
  },
  {
    id: 'brand-glow-botanics',
    role: 'brand',
    fullName: 'Clara Dubois',
    email: 'clara@glowbotanics.demo',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    jobTitle: 'Director of Brand Communications',
    location: 'Paris & NYC',
    isVerified: true,
    createdAt: '2023-07-15T00:00:00Z',
    organization: {
      id: 'org-glow-botanics',
      name: 'Glow Botanics',
      industry: 'Clean Skincare & Wellness',
      website: 'https://glowbotanics.demo',
      logoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
      description: 'Clean ceramide barrier repair formulations sourced organically.',
      verified: true,
      totalSpentDemo: 25000,
      activeCampaignsCount: 1
    }
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    brandId: 'org-lumina-audio',
    brandName: 'Lumina Audio',
    brandLogo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
    title: 'Lumina Wave Pro Launch: Immersive 3D Audio Experience',
    description: 'We are launching the flagship Lumina Wave Pro studio headphones with dynamic head tracking. Seeking tech, lifestyle, and music creators to produce 60-second Reels showing unboxing, aesthetic sound design workflow, and ANC sound tests.',
    niche: 'Tech & AI',
    primaryPlatform: 'instagram',
    targetAudience: {
      locations: ['United States', 'Canada', 'United Kingdom', 'Germany'],
      ageRanges: ['18-24', '25-34', '35-44'],
      minFollowers: 50000,
      minEngagementRate: 3.5
    },
    budgetMin: 45000,
    budgetMax: 85000,
    currency: 'INR',
    deadline: '2026-11-20',
    locationRequirement: 'Remote / India (Hardware shipped express)',
    deliverablesRequired: [
      {
        id: 'del-req-1',
        title: 'Dedicated 60s 4K Instagram Reel',
        format: 'Reel',
        quantity: 1,
        guidelines: 'Visual unboxing, 3 specific feature spotlights (ANC, 48hr battery, lossless planar drivers), and spoken personal review.'
      },
      {
        id: 'del-req-2',
        title: '3-Frame Instagram Story Sequence',
        format: 'Story Sequence',
        quantity: 1,
        guidelines: 'Behind the scenes + sticker link to early-bird VIP discount with trackable UTM.'
      }
    ],
    status: 'published',
    proposalsCount: 8,
    shortlistedCount: 3,
    createdAt: '2026-10-12T10:00:00Z',
    featured: true
  },
  {
    id: 'camp-2',
    brandId: 'org-apex-wear',
    brandName: 'Apex Performance',
    brandLogo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80',
    title: 'Apex Altitude Series: Technical Winter Outerwear Drop',
    description: 'Partnering with elite fitness, running, and outdoor adventure creators to showcase our waterproof, thermal-adaptive running shell in outdoor training conditions.',
    niche: 'Fitness & Wellness',
    primaryPlatform: 'instagram',
    targetAudience: {
      locations: ['United States', 'Canada', 'Europe'],
      ageRanges: ['20-40'],
      minFollowers: 75000,
      minEngagementRate: 4.0
    },
    budgetMin: 35000,
    budgetMax: 65000,
    currency: 'INR',
    deadline: '2026-11-30',
    locationRequirement: 'Remote / Outdoor shoot preferred',
    deliverablesRequired: [
      {
        id: 'del-req-apex-1',
        title: 'High-Energy Outdoor Training Reel',
        format: 'Reel',
        quantity: 1,
        guidelines: 'Weather resistance demonstration during rain or mist; athletic pace visuals.'
      },
      {
        id: 'del-req-apex-2',
        title: 'Carousel Post (5 High-Res Action Stills)',
        format: 'Static Post',
        quantity: 1,
        guidelines: 'Editorial sports photography with raw aesthetic.'
      }
    ],
    status: 'published',
    proposalsCount: 14,
    shortlistedCount: 4,
    createdAt: '2026-10-15T08:30:00Z',
    featured: true
  },
  {
    id: 'camp-3',
    brandId: 'org-glow-botanics',
    brandName: 'Glow Botanics',
    brandLogo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
    title: 'Clean Barrier Repair Serum: 14-Day Honest Skin Journey',
    description: 'Seeking skincare, clean beauty, and conscious lifestyle creators for a real before-and-after skin barrier transformation. Organic ceramide complex demonstration.',
    niche: 'Beauty & Fashion',
    primaryPlatform: 'tiktok',
    targetAudience: {
      locations: ['US', 'Canada'],
      ageRanges: ['18-35'],
      minFollowers: 30000,
      minEngagementRate: 4.5
    },
    budgetMin: 25000,
    budgetMax: 45000,
    currency: 'INR',
    deadline: '2026-12-05',
    locationRequirement: 'Remote (Product provided)',
    deliverablesRequired: [
      {
        id: 'del-req-glow-1',
        title: 'TikTok Day 1 vs Day 14 Skin Progress',
        format: 'TikTok',
        quantity: 1,
        guidelines: 'No beauty filters; authentic macro lens texture and routine breakdown.'
      }
    ],
    status: 'published',
    proposalsCount: 19,
    shortlistedCount: 5,
    createdAt: '2026-10-18T12:00:00Z',
    featured: false
  },
  {
    id: 'camp-4',
    brandId: 'org-neuralflow',
    brandName: 'NeuralFlow AI',
    brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    title: 'Autonomous Creator Studio: 2.0 Productivity Walkthrough',
    description: 'AI-assisted video editing & voice cloning workspace. Looking for digital creators and YouTubers to show their actual creative pipeline accelerated with NeuralFlow.',
    niche: 'Tech & AI',
    primaryPlatform: 'youtube',
    targetAudience: {
      locations: ['Global'],
      ageRanges: ['20-45'],
      minFollowers: 40000,
      minEngagementRate: 3.0
    },
    budgetMin: 60000,
    budgetMax: 120000,
    currency: 'INR',
    deadline: '2026-11-25',
    deliverablesRequired: [
      {
        id: 'del-req-neural-1',
        title: 'Dedicated YouTube Video Integration (10-15m)',
        format: 'YouTube Video',
        quantity: 1,
        guidelines: 'Workflow integration segment at start + dedicated deep-dive tutorial with workflow template download link.'
      }
    ],
    locationRequirement: 'Remote',
    status: 'published',
    proposalsCount: 11,
    shortlistedCount: 2,
    createdAt: '2026-10-10T16:00:00Z',
    featured: true
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    campaignId: 'camp-1',
    campaignTitle: 'Lumina Wave Pro Launch: Immersive 3D Audio Experience',
    brandId: 'org-lumina-audio',
    brandName: 'Lumina Audio',
    creatorId: 'creator-maya-chen',
    creatorName: 'Maya Chen',
    creatorHandle: '@mayacreates',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    creatorRating: 4.98,
    creatorNiches: ['Tech & AI', 'Design & Creative'],
    coverLetter: "Hi Sarah and the Lumina Audio team! I have been eagerly following the Wave Pro announcement. My audience is 68% US based, primarily tech creatives, video editors, and remote founders who invest heavily in premium audio hardware. In this Reel, I'll showcase a macro cinematic 4K unboxing, sync the audio to a custom beat demonstrating the active noise cancellation drop, and provide an honest assessment of spatial head tracking.",
    proposedRate: 4200,
    currency: 'USD',
    estimatedDeliveryDays: 7,
    proposedDeliverables: [
      {
        title: '1x 4K Instagram Reel (60s)',
        description: 'Cinematic color-graded video with sound design test and feature breakdown.'
      },
      {
        title: '1x 3-Story Sequence with Trackable Link',
        description: 'Interactive poll + VIP community discount code.'
      }
    ],
    status: 'shortlisted',
    submittedAt: '2026-10-14T11:20:00Z'
  },
  {
    id: 'prop-2',
    campaignId: 'camp-2',
    campaignTitle: 'Apex Altitude Series: Technical Winter Outerwear Drop',
    brandId: 'org-apex-wear',
    brandName: 'Apex Performance',
    creatorId: 'creator-alex-rivera',
    creatorName: 'Alex Rivera',
    creatorHandle: '@alex.riverafit',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    creatorRating: 4.94,
    creatorNiches: ['Fitness & Wellness'],
    coverLetter: 'Prepared to take the Altitude shell on a 15-mile trail run in sub-freezing morning conditions in Colorado. My audience demands technical scrutiny on breathability and seam sealing.',
    proposedRate: 3800,
    currency: 'USD',
    estimatedDeliveryDays: 10,
    proposedDeliverables: [
      {
        title: 'Outdoor High-Pace Reel',
        description: 'Real-time heart rate and weather overlay.'
      },
      {
        title: '5 Stills for Brand Social Repurposing',
        description: 'Commercial usage rights included for 6 months.'
      }
    ],
    status: 'accepted',
    submittedAt: '2026-10-16T14:00:00Z'
  },
  {
    id: 'prop-3',
    campaignId: 'camp-1',
    campaignTitle: 'Lumina Wave Pro Launch: Immersive 3D Audio Experience',
    brandId: 'org-lumina-audio',
    brandName: 'Lumina Audio',
    creatorId: 'creator-elena-rostova',
    creatorName: 'Elena Rostova',
    creatorHandle: '@elena.wanderlust',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    creatorRating: 4.96,
    creatorNiches: ['Travel & Hospitality', 'Design & Creative'],
    coverLetter: 'I would love to feature the Wave Pro during long-haul first class and airport lounge travel, illustrating how essential the ANC is for creative professionals on the move.',
    proposedRate: 5200,
    currency: 'USD',
    estimatedDeliveryDays: 12,
    proposedDeliverables: [
      {
        title: 'Travel Aesthetic Reel',
        description: 'Shot in Milan airport lounge and flight.'
      }
    ],
    status: 'submitted',
    submittedAt: '2026-10-17T09:45:00Z'
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-1',
    proposalId: 'prop-1',
    campaignId: 'camp-1',
    campaignTitle: 'Lumina Wave Pro Launch: Immersive 3D Audio Experience',
    brandId: 'brand-lumina-audio',
    creatorId: 'creator-maya-chen',
    sentBy: 'brand',
    deliverables: [
      {
        id: 'q-del-1',
        description: '1x 60s 4K Instagram Reel with Lumina Wave Pro branding and direct call-to-action',
        format: 'Reel',
        revisionsAllowed: 2,
        price: 38000
      },
      {
        id: 'q-del-2',
        description: '1x 3-Frame Instagram Story Sequence with swipe link to exclusive VIP preorder',
        format: 'Story Sequence',
        revisionsAllowed: 1,
        price: 10000
      }
    ],
    amount: 48000,
    currency: 'INR',
    expiresAt: '2026-11-05T23:59:59Z',
    status: 'sent',
    notes: 'Standard 30-day organic exclusivity in premium headphones category. Payment will be mock-funded into prototype milestone escrow upon acceptance.',
    createdAt: '2026-10-20T10:30:00Z'
  }
];

export const INITIAL_COLLABORATIONS: Collaboration[] = [
  {
    id: 'collab-1',
    campaignId: 'camp-2',
    campaignTitle: 'Apex Altitude Series: Technical Winter Outerwear Drop',
    brandId: 'brand-apex',
    brandName: 'Apex Performance',
    brandLogo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80',
    creatorId: 'creator-alex-rivera',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    creatorHandle: '@alex.riverafit',
    agreedAmount: 3800,
    currency: 'USD',
    status: 'deliverables_submitted',
    deadline: '2026-11-08',
    deliverables: [
      {
        id: 'cd-1',
        title: 'Outdoor High-Pace Technical Reel',
        format: 'Reel',
        status: 'submitted',
        submission: {
          id: 'sub-1',
          deliverableId: 'cd-1',
          title: 'Version 1 Draft - 4K High Elevation Trail Run',
          fileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-running-on-a-mountain-trail-41235-large.mp4',
          previewUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
          socialDraftLink: 'https://instagram.com/reel/demo_preview_9381',
          notes: 'Color graded in Rec.709. Featured the seam-sealing closeups at 0:18 and waterproof bead test at 0:34.',
          submittedAt: '2026-10-21T16:00:00Z',
          version: 1,
          status: 'pending_review'
        }
      },
      {
        id: 'cd-2',
        title: 'High-Res Action Stills (Bundle of 5)',
        format: 'Static Post',
        status: 'submitted',
        submission: {
          id: 'sub-2',
          deliverableId: 'cd-2',
          title: 'Color Graded Raw Stills (TIFF & JPG)',
          fileUrl: 'https://drive.google.com/demo/apex_stills_bundle.zip',
          notes: '5 commercial-licensed photos ready for print or Meta ads.',
          submittedAt: '2026-10-21T16:05:00Z',
          version: 1,
          status: 'pending_review'
        }
      }
    ],
    activityLog: [
      {
        id: 'act-1',
        timestamp: '2026-10-18T10:00:00Z',
        actorName: 'Apex Performance',
        actorRole: 'brand',
        action: 'Agreement accepted & created collaboration contract'
      },
      {
        id: 'act-2',
        timestamp: '2026-10-18T10:05:00Z',
        actorName: 'System (Razorpay Escrow)',
        actorRole: 'admin',
        action: 'Razorpay Escrow Funded: ₹55,000 held safely in marketplace contract'
      },
      {
        id: 'act-3',
        timestamp: '2026-10-21T16:05:00Z',
        actorName: 'Alex Rivera',
        actorRole: 'creator',
        action: 'Submitted Deliverables (v1) for brand review'
      }
    ],
    paymentStatus: 'demo_escrow_held',
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-21T16:05:00Z'
  },
  {
    id: 'collab-2',
    campaignId: 'camp-1',
    campaignTitle: 'Lumina Wave Pro Launch: Immersive 3D Audio Experience',
    brandId: 'brand-lumina-audio',
    brandName: 'Lumina Audio',
    brandLogo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
    creatorId: 'creator-maya-chen',
    creatorName: 'Maya Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    creatorHandle: '@mayacreates',
    agreedAmount: 45000,
    currency: 'INR',
    status: 'agreement_signed',
    deadline: '2026-11-15',
    deliverables: [
      {
        id: 'cd-maya-1',
        title: 'Dedicated 60s 4K Instagram Reel',
        format: 'Reel',
        status: 'pending'
      },
      {
        id: 'cd-maya-2',
        title: '3-Frame Instagram Story Sequence with Link',
        format: 'Story Sequence',
        status: 'pending'
      }
    ],
    activityLog: [
      {
        id: 'act-m-1',
        timestamp: '2026-10-20T11:00:00Z',
        actorName: 'Maya Chen',
        actorRole: 'creator',
        action: 'Agreed to Quotation #QT-9041 (₹45,000 INR)'
      },
      {
        id: 'act-m-2',
        timestamp: '2026-10-20T11:05:00Z',
        actorName: 'System (Razorpay Escrow)',
        actorRole: 'admin',
        action: 'Razorpay Escrow deposit initiated (₹45,000 INR locked in milestone contract)'
      }
    ],
    paymentStatus: 'demo_escrow_held',
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-10-20T11:05:00Z'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    campaignId: 'camp-1',
    campaignTitle: 'Lumina Wave Pro Launch',
    collaborationId: 'collab-2',
    brandId: 'brand-lumina-audio',
    brandName: 'Lumina Audio',
    brandAvatar: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
    creatorId: 'creator-maya-chen',
    creatorName: 'Maya Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    lastMessage: 'Quotation of ₹45,000 sent. Review deliverables and payment timeline.',
    lastMessageAt: '2026-10-21T14:20:00Z',
    unreadCount: 1
  },
  {
    id: 'conv-2',
    campaignId: 'camp-2',
    campaignTitle: 'Apex Altitude Series',
    collaborationId: 'collab-1',
    brandId: 'brand-apex',
    brandName: 'Apex Performance',
    brandAvatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80',
    creatorId: 'creator-alex-rivera',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    lastMessage: 'Submitted Deliverables (v1) for brand review. Let me know your thoughts!',
    lastMessageAt: '2026-10-21T16:10:00Z',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'brand-lumina-audio',
      senderName: 'Sarah Vance (Lumina Audio)',
      senderRole: 'brand',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      content: 'Hey Maya! We loved your proposal and your previous sound studio unboxing. The aesthetic was pristine. We would love to move forward with you on the Wave Pro launch.',
      type: 'text',
      timestamp: '2026-10-20T09:45:00Z'
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'creator-maya-chen',
      senderName: 'Maya Chen',
      senderRole: 'creator',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      content: 'Thank you Sarah! So excited about this. I will prepare a high-fidelity script focusing on the planar drivers and the spatial audio test with logic pro.',
      type: 'text',
      timestamp: '2026-10-20T10:15:00Z'
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'brand-lumina-audio',
      senderName: 'Sarah Vance (Lumina Audio)',
      senderRole: 'brand',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      content: 'Here is the formal quotation with our deliverable timeline and agreed milestone fee. Take a look and let us know if you want to proceed!',
      type: 'quotation',
      quotationData: INITIAL_QUOTATIONS[0],
      timestamp: '2026-10-20T10:30:00Z'
    }
  ]
};

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-101',
    collaborationId: 'collab-1',
    campaignTitle: 'Apex Altitude Series: Technical Winter Drop',
    brandName: 'Apex Performance',
    creatorName: 'Alex Rivera',
    amount: 48000,
    platformFee: 4800, // 10%
    netPayout: 43200,
    currency: 'INR',
    status: 'pending', // Pending approval of deliverables
    invoiceNumber: 'INV-2026-0881',
    type: 'milestone_escrow_demo',
    createdAt: '2026-10-18T10:05:00Z',
    isDemoEscrow: true
  },
  {
    id: 'tx-102',
    collaborationId: 'collab-2',
    campaignTitle: 'Lumina Wave Pro Launch: Immersive 3D Audio',
    brandName: 'Lumina Audio',
    creatorName: 'Maya Chen',
    amount: 48000,
    platformFee: 4800,
    netPayout: 43200,
    currency: 'INR',
    status: 'pending',
    invoiceNumber: 'INV-2026-0882',
    type: 'milestone_escrow_demo',
    createdAt: '2026-10-20T11:05:00Z',
    isDemoEscrow: true
  },
  {
    id: 'tx-103',
    collaborationId: 'collab-archived-99',
    campaignTitle: 'ErgoDesk Studio Makeover Series',
    brandName: 'ErgoDesk Pro',
    creatorName: 'Maya Chen',
    amount: 35000,
    platformFee: 3500,
    netPayout: 31500,
    currency: 'INR',
    status: 'paid',
    invoiceNumber: 'INV-2026-0714',
    type: 'payout_demo',
    createdAt: '2026-09-12T14:00:00Z',
    paidAt: '2026-09-18T16:30:00Z',
    isDemoEscrow: true
  },
  {
    id: 'tx-104',
    collaborationId: 'collab-archived-98',
    campaignTitle: 'Kore AI Workflow Productivity Sprint',
    brandName: 'Kore AI',
    creatorName: 'Maya Chen',
    amount: 42000,
    platformFee: 4200,
    netPayout: 37800,
    currency: 'INR',
    status: 'paid',
    invoiceNumber: 'INV-2026-0689',
    type: 'payout_demo',
    createdAt: '2026-08-04T11:00:00Z',
    paidAt: '2026-08-10T12:00:00Z',
    isDemoEscrow: true
  }
];

export const INITIAL_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    targetType: 'creator',
    targetId: 'creator-marcus-thorne',
    targetName: 'Marcus Thorne (@thorne.gaming)',
    reportedBy: 'Brand Safety Automated Scanner',
    reason: 'Sudden anomalous engagement spike detected',
    details: 'Automated scan flagged 42% sudden jump in follower velocity over 48 hours. Requires verification check.',
    status: 'investigating',
    createdAt: '2026-10-20T08:12:00Z'
  },
  {
    id: 'rep-2',
    targetType: 'campaign',
    targetId: 'camp-3',
    targetName: 'Clean Barrier Repair Serum Campaign',
    reportedBy: 'User #creator-492',
    reason: 'Unclear deliverable scope',
    details: 'Brand requested raw uncompressed footage buyout without separate licensing fee stated in brief.',
    status: 'pending_review',
    createdAt: '2026-10-21T11:45:00Z'
  }
];
