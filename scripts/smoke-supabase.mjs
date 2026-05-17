/**
 * Smoke-test Supabase connectivity and public.products row count.
 * Usage: npm run db:smoke
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
config({ path: resolve(root, '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('\nMissing env in pharma-ecommerce-rebrand/.env.local');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('\nGet the anon key: Supabase Dashboard → your project → Settings → API → anon public\n');
  process.exit(1);
}

const supabase = createClient(url, key);

const tables = ['products', 'categories', 'orders', 'customers'];

console.log('\nSupabase smoke test');
console.log('  URL:', url);

for (const table of tables) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });

  if (error) {
    console.error(`  ${table}: ERROR —`, error.message);
    if (error.message.includes('JWT') || error.code === 'PGRST301') {
      console.error('    → Anon key may not match this project URL. Update .env.local from Dashboard → API.');
    }
    process.exit(1);
  }

  console.log(`  ${table}:`, count ?? 0, 'rows');
}

console.log('\nOK — database reachable with anon key.\n');
