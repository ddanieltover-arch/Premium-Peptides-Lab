/**
 * Verify Auth-adjacent data, Storage URLs, and checkout RLS on the new Supabase project.
 * Usage: npm run db:verify
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
config({ path: resolve(root, '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const projectRef = url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? 'unknown';

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

const OLD_REF = 'tbgmkqklkshkjfhcqtzz';
const NEW_REF = projectRef;

console.log('\n=== Migration extras check ===');
console.log('Project:', NEW_REF);
console.log('');

// ─── 1. Catalog images (thumbnail_url / images.url hosts) ───
const { data: products, error: prodErr } = await supabase
  .from('products')
  .select('id, slug, thumbnail_url')
  .eq('is_active', true)
  .limit(500);

if (prodErr) {
  console.error('Products read failed:', prodErr.message);
} else {
  let oldHost = 0;
  let newHost = 0;
  let otherHost = 0;
  let empty = 0;
  const samples = { old: [], new: [], other: [], broken: [] };

  for (const p of products ?? []) {
    const u = p.thumbnail_url ?? '';
    if (!u) {
      empty++;
      continue;
    }
    if (u.includes(OLD_REF)) {
      oldHost++;
      if (samples.old.length < 2) samples.old.push(u);
    } else if (u.includes(NEW_REF) || u.includes('supabase.co/storage')) {
      newHost++;
      if (samples.new.length < 2) samples.new.push(u);
    } else {
      otherHost++;
      if (samples.other.length < 2) samples.other.push(u);
    }
  }

  console.log('1) Product images (thumbnail_url)');
  console.log(`   Active products sampled: ${products?.length ?? 0}`);
  console.log(`   Empty thumbnail: ${empty}`);
  console.log(`   Still pointing at OLD project (${OLD_REF}): ${oldHost}`);
  console.log(`   New Supabase storage / new ref: ${newHost}`);
  console.log(`   External / other hosts: ${otherHost}`);
  if (oldHost > 0) {
    console.log('   ⚠ Migrate storage files OR run URL replace — old URLs will 404 on new project.');
    samples.old.forEach((u) => console.log('     e.g.', u.slice(0, 90) + '...'));
  }
  if (newHost > 0) samples.new.forEach((u) => console.log('   ✓', u.slice(0, 90) + '...'));
  if (otherHost > 0) samples.other.forEach((u) => console.log('   · other:', u.slice(0, 70) + '...'));
}

// ─── 2. Storage bucket (catalog-heroes) ───
console.log('\n2) Storage bucket `catalog-heroes`');
const { data: bucketList, error: bucketErr } = await supabase.storage.listBuckets();
if (bucketErr) {
  console.log('   Cannot list buckets with anon key:', bucketErr.message);
  console.log('   → Check Dashboard → Storage manually; re-run storage_catalog_heroes.sql if missing.');
} else {
  const hero = bucketList?.find((b) => b.id === 'catalog-heroes');
  if (hero) {
    console.log('   ✓ Bucket exists, public:', hero.public);
    const { data: files, error: listErr } = await supabase.storage.from('catalog-heroes').list('', { limit: 5 });
    if (listErr) console.log('   List objects:', listErr.message);
    else console.log(`   Sample object count (root): ${files?.length ?? 0} (first page only)`);
  } else {
    console.log('   ⚠ Bucket `catalog-heroes` not found — run precision-health-store/supabase/storage_catalog_heroes.sql');
  }
}

// ─── 3. RLS: anon cannot read orders (expected) ───
console.log('\n3) RLS — orders/customers (anon read)');
const { count: orderCount, error: orderReadErr } = await supabase
  .from('orders')
  .select('*', { count: 'exact', head: true });
const { count: custCount, error: custReadErr } = await supabase
  .from('customers')
  .select('*', { count: 'exact', head: true });

if (orderReadErr) console.log('   orders:', orderReadErr.message);
else console.log(`   orders visible to anon: ${orderCount ?? 0} (0 is normal — admin uses authenticated JWT)`);

if (custReadErr) console.log('   customers:', custReadErr.message);
else console.log(`   customers visible to anon: ${custCount ?? 0} (0 is normal)`);

// ─── 4. Checkout RLS — test insert + cleanup ───
console.log('\n4) Checkout RLS — test order insert (anon)');
const testOrderNumber = `MIGRATION-TEST-${Date.now()}`;
const { data: inserted, error: insertErr } = await supabase
  .from('orders')
  .insert({
    order_number: testOrderNumber,
    status: 'PENDING',
    subtotal: 1,
    shipping_cost: 0,
    total: 1,
    payment_status: 'UNPAID',
    contact_email: 'migration-test@example.invalid',
    shipping_address_json: { fullName: 'Migration Test' },
  })
  .select('id')
  .single();

if (insertErr) {
  console.log('   ✗ Insert failed:', insertErr.message);
  console.log('   → Run fix_checkout_orders_rls.sql on the NEW project if policies were not copied.');
} else {
  console.log('   ✓ Order insert OK, id:', inserted.id);
  const { error: delErr } = await supabase.from('orders').delete().eq('id', inserted.id);
  if (delErr) console.log('   ⚠ Cleanup delete failed (remove test order manually):', delErr.message);
  else console.log('   ✓ Test order deleted');
}

// ─── 5. Auth (cannot fully verify without users / service role) ───
console.log('\n5) Auth (Supabase Auth users)');
console.log('   Public schema copy does NOT migrate auth.users.');
console.log('   Admin login (/admin/login) needs users recreated in THIS project, or Auth import.');
console.log('   Storefront checkout is mostly anon — unaffected if only admin used Auth.');

console.log('\n=== Done ===\n');
