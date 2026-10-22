import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'creatorsphere_supabase_url';
const STORAGE_KEY_KEY = 'creatorsphere_supabase_key';

export function getStoredCloudCredentials(): { url: string; key: string } {
  try {
    const storedUrl = localStorage.getItem(STORAGE_KEY_URL);
    const storedKey = localStorage.getItem(STORAGE_KEY_KEY);

    const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    return {
      url: storedUrl || envUrl,
      key: storedKey || envKey
    };
  } catch {
    return { url: '', key: '' };
  }
}

export function saveCloudCredentials(url: string, key: string): boolean {
  try {
    if (url && key) {
      localStorage.setItem(STORAGE_KEY_URL, url.trim());
      localStorage.setItem(STORAGE_KEY_KEY, key.trim());
      activeSupabaseClient = createClient(url.trim(), key.trim());
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function clearCloudCredentials() {
  try {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    activeSupabaseClient = null;
  } catch {
    // ignore
  }
}

let activeSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (activeSupabaseClient) return activeSupabaseClient;

  const { url, key } = getStoredCloudCredentials();
  if (url && key && url.startsWith('https://') && !url.includes('YOUR_SUPABASE')) {
    try {
      activeSupabaseClient = createClient(url, key);
      return activeSupabaseClient;
    } catch {
      return null;
    }
  }
  return null;
}

export async function testCloudConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'No cloud Supabase credentials configured. Using Local Persistent Cloud-Simulated Storage.'
    };
  }

  try {
    // Attempt a light ping by querying public profiles or checking auth health
    const { error } = await client.from('profiles').select('id').limit(1);
    if (error) {
      // If table does not exist yet, connection itself to project was still made!
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase project! (Tables not yet initialized — click "Copy Schema SQL" to run migration)'
        };
      }
      return {
        success: false,
        message: `Supabase Cloud response: ${error.message} (Code: ${error.code})`
      };
    }
    return {
      success: true,
      message: 'Successfully connected to free Supabase PostgreSQL Cloud database!'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Connection failed. Please check your project URL and Anon Key.'
    };
  }
}

export const SUPABASE_STATUS = {
  isConfigured: () => Boolean(getSupabaseClient()),
  getUrl: () => {
    const { url } = getStoredCloudCredentials();
    return url ? `${url.substring(0, 24)}...` : 'Local Persistent Storage';
  }
};
