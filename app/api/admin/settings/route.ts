import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import {
  DEFAULT_STORE_SETTINGS,
  mergeStoreSettings,
  STORE_SETTING_KEYS,
  validateSettingsPatch,
  type StoreSettingKey,
} from '@/lib/admin/store-settings';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  if (!(await getUserFromAdminBearer(token))) return unauthorizedResponse();

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const { data, error } = await admin.from('store_settings').select('key, value, updated_at');
  if (error) {
    console.error('[api/admin/settings GET]', error);
    if (error.code === '42P01') {
      return NextResponse.json({ settings: DEFAULT_STORE_SETTINGS, tableMissing: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings = mergeStoreSettings((data ?? []).map((r) => ({ key: r.key, value: r.value })));
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  if (!(await getUserFromAdminBearer(token))) return unauthorizedResponse();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const keys = Object.keys(body).filter((k) =>
    STORE_SETTING_KEYS.includes(k as StoreSettingKey),
  ) as StoreSettingKey[];
  if (keys.length === 0) {
    return NextResponse.json({ error: 'No valid settings keys in body' }, { status: 400 });
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const upserts: { key: string; value: Record<string, unknown> }[] = [];
  for (const key of keys) {
    const validated = validateSettingsPatch(key, body[key]);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    upserts.push({ key, value: validated.value });
  }

  for (const row of upserts) {
    const { error } = await admin
      .from('store_settings')
      .upsert({ key: row.key, value: row.value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) {
      console.error('[api/admin/settings PATCH]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const { data } = await admin.from('store_settings').select('key, value');
  const settings = mergeStoreSettings((data ?? []).map((r) => ({ key: r.key, value: r.value })));
  return NextResponse.json({ settings });
}
