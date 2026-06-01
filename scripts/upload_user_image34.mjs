import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\c2c445db-f284-408a-9a12-682492d0552f';
const filename = 'media__1780311851102.jpg';
const targetSlug = 'drostanolone-propionate-100mg';

async function main() {
  const imagePath = path.join(DIR, filename);
  if (!fs.existsSync(imagePath)) {
    console.error(`File missing: ${imagePath}`);
    return;
  }
  const fileBuffer = fs.readFileSync(imagePath);
  const targetName = `ppl-${targetSlug}-hero-${Date.now()}.jpg`;

  console.log(`Uploading ${targetName} to catalog-heroes bucket...`);
  const { error: uploadError } = await supabase.storage.from('catalog-heroes').upload(targetName, fileBuffer, {
    contentType: 'image/jpeg',
    upsert: true
  });
  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage.from('catalog-heroes').getPublicUrl(targetName);
  const publicUrl = publicUrlData.publicUrl;

  console.log(`Updating DB for slug: ${targetSlug}`);
  const { error: updateError } = await supabase.from('products').update({ thumbnail_url: publicUrl }).eq('slug', targetSlug);
  if (updateError) throw new Error(`DB update failed: ${updateError.message}`);
  console.log(`Success: ${targetSlug} -> ${publicUrl}\n`);
}

main();
