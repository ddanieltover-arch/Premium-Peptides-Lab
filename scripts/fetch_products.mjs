import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await supabase.from('products').select('slug, name, category_id');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  fs.writeFileSync('C:\\\\Users\\\\User\\\\Desktop\\\\Premium Peptides Lab\\\\pharma-ecommerce-rebrand\\\\products.json', JSON.stringify(data, null, 2));
  console.log(`Saved ${data.length} products to products.json`);
}

main();
