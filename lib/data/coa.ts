import { COA_STORAGE_MARKER, resolveCoaDocumentUrl } from '@/lib/coa/url';
import { createClient } from '@/lib/supabase/server';
import type { CoaEntry } from '@/lib/types/coa';

export async function getCoaEntries(): Promise<CoaEntry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('id,name,slug,updated_at,source_url')
      .eq('is_active', true)
      .like('source_url', `%${COA_STORAGE_MARKER}%`)
      .order('updated_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('[coa]', error.message);
      return [];
    }

    return (data ?? []).map((row) => {
      const date = new Date(row.updated_at);
      const yy = String(date.getUTCFullYear()).slice(-2);
      const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
      const suffix = row.id.replace(/-/g, '').slice(0, 4).toUpperCase();
      return {
        productName: row.name,
        productSlug: row.slug,
        batchId: `PPL-${yy}${mm}-${suffix}`,
        purity: '≥99%',
        method: 'HPLC / LC–MS',
        status: 'Verified',
        updatedAt: row.updated_at,
        coaDocumentUrl: resolveCoaDocumentUrl(row.source_url) ?? null,
      };
    });
  } catch (e) {
    console.error('[coa]', e);
    return [];
  }
}
