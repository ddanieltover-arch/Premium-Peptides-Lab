import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await supabase.from('products').select('slug, name, thumbnail_url');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  const pendingProducts = data.filter(p => !p.thumbnail_url || !p.thumbnail_url.includes('ppl-'));
  console.log(`Found ${pendingProducts.length} products remaining to rebrand.`);
  
  const nextBatch = pendingProducts.slice(0, 20);
  console.log('Next up:');
  nextBatch.forEach(p => console.log(`${p.slug} - ${p.name}`));
}

main();
