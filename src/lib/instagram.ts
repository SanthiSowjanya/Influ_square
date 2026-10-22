// ==============================================================================
// Official Meta Instagram Graph API Integration
// Supports: Instagram Professional Accounts (Creators & Businesses) via Facebook Login
// Permissions: instagram_basic, instagram_manage_insights, pages_show_list, pages_read_engagement
// ==============================================================================

export interface MetaConfig {
  appId: string;
  redirectUri: string;
  apiVersion: string;
  isConfigured: boolean;
}

export interface VerifiedInstagramMetrics {
  isVerifiedByMeta: true;
  connectedAt: string;
  lastSyncedAt: string;
  instagramUserId: string;
  username: string;
  fullName?: string;
  profilePictureUrl?: string;
  biography?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  mediaCount: number;
  avgEngagementRate: number; // Computed strictly from recent post likes+comments / followers
  impressions28d?: number;
  reach28d?: number;
  recentMedia: {
    id: string;
    caption?: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    mediaUrl: string;
    permalink: string;
    likeCount: number;
    commentsCount: number;
    timestamp: string;
  }[];
  tokenExpiresAt: string;
}

export interface UnverifiedManualInstagramData {
  isVerifiedByMeta: false;
  handle: string;
  selfReportedFollowers: number;
  note: string;
}

export type InstagramAccountState = 
  | { status: 'unconnected' }
  | { status: 'not_configured'; missingKeys: string[] }
  | { status: 'connected_verified'; data: VerifiedInstagramMetrics }
  | { status: 'self_reported_manual'; data: UnverifiedManualInstagramData }
  | { status: 'token_expired'; expiredAt: string; username: string }
  | { status: 'sync_error'; error: string; lastSyncedAt?: string };

const META_STORAGE_TOKEN_KEY = 'creatorsphere_meta_access_token';
const META_STORAGE_OAUTH_STATE_KEY = 'creatorsphere_meta_oauth_state';
const META_STORAGE_PROFILE_KEY = 'creatorsphere_meta_ig_profile';

export function getMetaConfig(): MetaConfig {
  const appId = (import.meta.env.VITE_META_APP_ID || '').trim();
  const redirectUri = (
    import.meta.env.VITE_META_REDIRECT_URI || 
    (typeof window !== 'undefined' ? `${window.location.origin}/auth/instagram/callback` : '')
  ).trim();
  const apiVersion = (import.meta.env.VITE_META_API_VERSION || 'v19.0').trim();

  const isConfigured = Boolean(appId && appId !== 'YOUR_META_APP_ID' && redirectUri);

  return {
    appId,
    redirectUri,
    apiVersion,
    isConfigured
  };
}

/**
 * Generates the official Meta OAuth Authorization URL for Instagram Professional Accounts.
 * Follows Meta's official Graph API specifications.
 */
export function buildMetaOAuthUrl(): { url: string; state: string } | null {
  const config = getMetaConfig();
  if (!config.isConfigured) return null;

  const state = 'meta_state_' + Math.random().toString(36).substring(2, 15);
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(META_STORAGE_OAUTH_STATE_KEY, state);
  }

  const scopes = [
    'instagram_basic',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement'
  ].join(',');

  const params = new URLSearchParams({
    client_id: config.appId,
    redirect_uri: config.redirectUri,
    state,
    scope: scopes,
    response_type: 'code',
    auth_type: 'rerequest'
  });

  return {
    url: `https://www.facebook.com/${config.apiVersion}/dialog/oauth?${params.toString()}`,
    state
  };
}

/**
 * Validates the state parameter returned from Meta OAuth callback to prevent CSRF attacks.
 */
export function validateMetaOAuthState(returnedState: string): boolean {
  if (typeof window === 'undefined') return false;
  const stored = sessionStorage.getItem(META_STORAGE_OAUTH_STATE_KEY);
  return Boolean(stored && stored === returnedState);
}

/**
 * Saves verified Instagram metrics received from official Meta API sync.
 */
export function saveVerifiedInstagramProfile(metrics: VerifiedInstagramMetrics) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(META_STORAGE_PROFILE_KEY, JSON.stringify(metrics));
}

export function getStoredInstagramMetrics(): VerifiedInstagramMetrics | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(META_STORAGE_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function disconnectInstagramProfile() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(META_STORAGE_PROFILE_KEY);
  localStorage.removeItem(META_STORAGE_TOKEN_KEY);
  sessionStorage.removeItem(META_STORAGE_OAUTH_STATE_KEY);
}

/**
 * Step-by-step documentation for users or admins configuring Meta Developer Portal.
 */
export const META_SETUP_INSTRUCTIONS = [
  'Go to developers.facebook.com and create or open your Meta Developer App.',
  'Select "Business" as the App Type to enable Instagram Graph API.',
  'Add "Instagram Graph API" and "Facebook Login for Business" to your app products.',
  'In App Settings > Basic, copy your App ID and App Secret into .env (VITE_META_APP_ID & META_APP_SECRET).',
  'In Facebook Login > Settings, add your valid OAuth Redirect URI (e.g. http://localhost:5173/auth/instagram/callback).',
  'Ensure the creator\'s Instagram account is converted to a Professional/Creator account and connected to a Facebook Page.'
];
