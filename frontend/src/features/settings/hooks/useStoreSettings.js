import { useEffect, useState } from 'react';
import { fetchStoreSettings } from '../services/settingsService';

const EMPTY_SETTINGS = {
  store_name: null,
  description: null,
  email: null,
  whatsapp: null,
  instagram: null,
  address: null,
  updated_at: null,
};

function hasVisibleSettings(data) {
  if (!data) {
    return false;
  }

  return Boolean(
    data.store_name
    || data.description
    || data.email
    || data.whatsapp
    || data.instagram
    || data.address,
  );
}

export function useStoreSettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        setIsLoading(true);
        const data = await fetchStoreSettings();
        if (!cancelled) {
          setSettings(data);
        }
      } catch {
        if (!cancelled) {
          setSettings(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedSettings = settings ?? EMPTY_SETTINGS;

  return {
    settings: resolvedSettings,
    hasSettings: settings !== null,
    hasVisibleSettings: hasVisibleSettings(settings),
    isLoading,
  };
}
