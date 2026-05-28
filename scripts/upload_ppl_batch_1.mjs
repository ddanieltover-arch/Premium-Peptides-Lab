import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'peptide-s', filename: 'ppl_peptide_s_hero_1779701397923.png' },
  { slug: 'peptide-t-30mg', filename: 'ppl_peptide_t_30mg_hero_1779701409508.png' },
  { slug: 'glp-2-t', filename: 'ppl_glp_2_t_hero_1779701425644.png' },
  { slug: 'testosterone-trenbolone-400mg', filename: 'ppl_test_tren_400mg_hero_1779701437703.png' },
  { slug: 'nad-plus', filename: 'ppl_nad_plus_hero_1779701449022.png' },
  { slug: 'lgd-4033-10mg-50-tablets', filename: 'ppl_lgd_4033_hero_1779701465291.png' },
  { slug: 'nad-nicotinamide-adenine-dinucleotide', filename: 'ppl_nad_nicotinamide_hero_1779701482820.png' },
  { slug: 'aicar-10mg-50-tablets', filename: 'ppl_aicar_10mg_hero_1779701497295.png' },
  { slug: 'hgh-fragment-176-191', filename: 'ppl_hgh_frag_hero_1779701512812.png' },
  { slug: 'test-propionate-100mg', filename: 'ppl_test_propionate_hero_1779701525689.png' }
];

const DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\c2c445db-f284-408a-9a12-682492d0552f';

async function main() {
  for (const asset of ASSETS) {
    try {
      const imagePath = path.join(DIR, asset.filename);
      if (!fs.existsSync(imagePath)) {
        console.error(`File missing: ${imagePath}`);
        continue;
      }
      const fileBuffer = fs.readFileSync(imagePath);
      const targetName = `ppl-${asset.slug}-hero-${Date.now()}.png`;

      console.log(`Uploading ${targetName} to catalog-heroes bucket...`);
      const { error: uploadError } = await supabase.storage.from('catalog-heroes').upload(targetName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage.from('catalog-heroes').getPublicUrl(targetName);
      const publicUrl = publicUrlData.publicUrl;

      console.log(`Updating DB for slug: ${asset.slug}`);
      const { error: updateError } = await supabase.from('products').update({ thumbnail_url: publicUrl }).eq('slug', asset.slug);
      if (updateError) throw new Error(`DB update failed: ${updateError.message}`);
      console.log(`Success: ${asset.slug} -> ${publicUrl}\n`);

    } catch (error) {
      console.error(`Error processing ${asset.slug}:`, error);
    }
  }
}

main();
