import { getSupabaseClient, getStoredCloudCredentials } from './supabase';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  isEmailVerified?: boolean;
}

const AUTH_STORAGE_KEY = 'creatorsphere_auth_user';

export function getStoredAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuthUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function isLiveSupabaseConfigured(): boolean {
  const { url, key } = getStoredCloudCredentials();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('YOUR_PROJECT') &&
    !url.includes('your-project-id')
  );
}

// Pre-configured demo credentials for testing
export const DEMO_CREDENTIALS = [
  {
    role: 'creator' as UserRole,
    label: 'Alex Rivera (Fitness & Tech Creator)',
    email: 'alex.rivera@creatorsphere.in',
    password: 'Password123!',
    id: 'creator-alex-rivera',
    fullName: 'Alex Rivera'
  },
  {
    role: 'brand' as UserRole,
    label: 'Sarah Chen (Lumina Audio Brand Manager)',
    email: 'sarah.chen@luminaaudio.com',
    password: 'Password123!',
    id: 'brand-sarah-chen',
    fullName: 'Sarah Chen'
  },
  {
    role: 'admin' as UserRole,
    label: 'Platform Trust & Safety Admin',
    email: 'security@creatorsphere.in',
    password: 'Password123!',
    id: 'admin-trust-officer',
    fullName: 'Aditi Sharma (Trust Officer)'
  }
];

export async function signInWithEmailPassword(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  const client = getSupabaseClient();

  // If live Supabase client is connected, execute real Supabase Auth
  if (client && isLiveSupabaseConfigured()) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: pass
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data?.user) {
        const metadata = data.user.user_metadata || {};
        const role = (metadata.role as UserRole) || 'creator';
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: metadata.full_name || email.split('@')[0],
          role,
          avatarUrl: metadata.avatar_url,
          isEmailVerified: Boolean(data.user.email_confirmed_at)
        };

        setStoredAuthUser(authUser);
        return { success: true, user: authUser };
      }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Authentication failed' };
    }
  }

  // Fallback demo authentication when Supabase cloud is not configured
  const matchedDemo = DEMO_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (matchedDemo) {
    if (pass !== matchedDemo.password && pass !== 'Password123!') {
      return { success: false, message: 'Invalid password. (Use Password123! for demo accounts)' };
    }

    const authUser: AuthUser = {
      id: matchedDemo.id,
      email: matchedDemo.email,
      fullName: matchedDemo.fullName,
      role: matchedDemo.role,
      isEmailVerified: true
    };
    setStoredAuthUser(authUser);
    return { success: true, user: authUser };
  }

  // Allow registration logins in local prototype mode
  const localRegisteredRaw = localStorage.getItem('creatorsphere_local_registered_' + email.trim().toLowerCase());
  if (localRegisteredRaw) {
    try {
      const stored = JSON.parse(localRegisteredRaw);
      if (stored.password === pass) {
        const authUser: AuthUser = {
          id: stored.id,
          email: stored.email,
          fullName: stored.fullName,
          role: stored.role,
          isEmailVerified: true
        };
        setStoredAuthUser(authUser);
        return { success: true, user: authUser };
      } else {
        return { success: false, message: 'Incorrect password for this account.' };
      }
    } catch {
      // ignore
    }
  }

  return {
    success: false,
    message: 'Account not found. Sign up or select one of the Quick Demo accounts below.'
  };
}

export async function signUpWithEmailPassword(params: {
  fullName: string;
  email: string;
  password: string;
  role: 'creator' | 'brand';
  metadata?: Record<string, any>;
}): Promise<{ success: boolean; user?: AuthUser; requiresEmailVerification?: boolean; message?: string }> {
  // Prevent public user from selecting admin
  if ((params.role as any) === 'admin') {
    return { success: false, message: 'Administrator accounts cannot be self-registered.' };
  }

  const client = getSupabaseClient();

  if (client && isLiveSupabaseConfigured()) {
    try {
      const { data, error } = await client.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            role: params.role,
            ...params.metadata
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data?.user) {
        const requiresVerification = !data.session;
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || params.email,
          fullName: params.fullName.trim(),
          role: params.role,
          isEmailVerified: !requiresVerification
        };

        if (!requiresVerification) {
          setStoredAuthUser(authUser);
        }

        return {
          success: true,
          user: authUser,
          requiresEmailVerification: requiresVerification,
          message: requiresVerification
            ? 'Registration successful! Please check your email inbox to confirm your account.'
            : 'Account registered and logged in.'
        };
      }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Registration failed' };
    }
  }

  // Local persistent registration fallback
  const newId = (params.role === 'creator' ? 'creator-' : 'brand-') + Math.random().toString(36).substring(2, 9);
  const authUser: AuthUser = {
    id: newId,
    email: params.email.trim(),
    fullName: params.fullName.trim(),
    role: params.role,
    isEmailVerified: true
  };

  try {
    localStorage.setItem(
      'creatorsphere_local_registered_' + params.email.trim().toLowerCase(),
      JSON.stringify({
        ...authUser,
        password: params.password,
        registeredAt: new Date().toISOString(),
        metadata: params.metadata
      })
    );
  } catch {
    // ignore
  }

  setStoredAuthUser(authUser);
  return {
    success: true,
    user: authUser,
    requiresEmailVerification: false,
    message: 'Account successfully registered and active.'
  };
}

export async function signOutUser(): Promise<void> {
  const client = getSupabaseClient();
  if (client && isLiveSupabaseConfigured()) {
    try {
      await client.auth.signOut();
    } catch {
      // ignore
    }
  }
  setStoredAuthUser(null);
}

export async function resetPassword(email: string): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (client && isLiveSupabaseConfigured()) {
    try {
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/#/reset-password'
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return {
        success: true,
        message: 'Password reset link dispatched! Please check your inbox for instructions.'
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Password reset request failed' };
    }
  }

  // Local fallback explanation
  return {
    success: true,
    message: 'Demo Password Reset: Instructions simulated for ' + email + '. (Use Password123! for demo accounts)'
  };
}
