import { adminApiFetch } from './api';

const CACHE_KEY = 'saborfit_settings';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getStoreSettings() {
  const cached = localStorage.getItem(CACHE_KEY);
  
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Return cached data if still valid
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
    } catch (error) {
      // Invalid cache, ignore and fetch fresh
      console.warn('Invalid cache, fetching fresh settings');
    }
  }
  
  // Fetch fresh settings
  try {
    const response = await adminApiFetch('/settings');
    const settings = response.data || response;
    
    // Cache the settings
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: settings,
      timestamp: Date.now(),
    }));
    
    return settings;
  } catch (error) {
    // If fetch fails, try to return cached data even if expired
    if (cached) {
      try {
        const { data } = JSON.parse(cached);
        console.warn('Using expired cache due to fetch error');
        return data;
      } catch (e) {
        // Cache is invalid, return default
        return {
          store_name: null,
          description: null,
          email: null,
          whatsapp: null,
          instagram: null,
          address: null,
        };
      }
    }
    
    throw error;
  }
}

export function clearSettingsCache() {
  localStorage.removeItem(CACHE_KEY);
}

export function getSettingsFromCache() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { data } = JSON.parse(cached);
      return data;
    } catch (error) {
      return null;
    }
  }
  return null;
}
