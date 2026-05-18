import { cache } from 'react';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import {
  DEFAULT_STORE_SETTINGS,
  mergeStoreSettings,
  toPublicStoreSettings,
  type StoreSettingsBundle,
} from '@/lib/admin/store-settings';

async function loadSettingsRows(): Promise<{ key: string; value: unknown }[]> {
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.from('store_settings').select('key, value');
    if (error) throw error;
    return (data ?? []).map((r) => ({ key: r.key as string, value: r.value }));
  } catch {
    return [];
  }
}

/** Full settings bundle (server-only). Falls back to defaults if table missing. */
export const getStoreSettings = cache(async (): Promise<StoreSettingsBundle> => {
  const rows = await loadSettingsRows();
  if (rows.length === 0) return DEFAULT_STORE_SETTINGS;
  return mergeStoreSettings(rows);
});

/** Public fields for checkout and marketing pages. */
export const getPublicStoreSettings = cache(async () => {
  const bundle = await getStoreSettings();
  return toPublicStoreSettings(bundle);
});
