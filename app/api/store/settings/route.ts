import { NextResponse } from 'next/server';
import { getPublicStoreSettings } from '@/lib/data/store-settings';

export const dynamic = 'force-dynamic';

/** Public storefront settings (no secrets). */
export async function GET() {
  try {
    const settings = await getPublicStoreSettings();
    return NextResponse.json(settings);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
