import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'peptide-t', filename: 'ppl_peptide_t_hero_1780189888828.png' },
  { slug: 'aod9604', filename: 'ppl_aod9604_hero_1780189902756.png' },
  { slug: 'melanotan-i', filename: 'ppl_melanotan_i_hero_1780189914855.png' },
  { slug: 'proviron-25mg-50-tablets', filename: 'ppl_proviron_25mg_hero_1780189926585.png' },
  { slug: 'peg-mgf', filename: 'ppl_peg_mgf_hero_1780189940062.png' },
  { slug: 'win-depot-50mg', filename: 'ppl_win_depot_hero_1780189954125.png' },
  { slug: 'teso-ns2330', filename: 'ppl_teso_ns2330_hero_1780189968600.png' },
  { slug: 'methylene-blue', filename: 'ppl_methylene_blue_hero_1780189981541.png' },
  { slug: 'klow-10mg-10mg-10mg-50mg', filename: 'ppl_klow_10mg_hero_1780189995682.png' },
  { slug: 'tesamorelin', filename: 'ppl_tesamorelin_hero_1780190009374.png' },
  { slug: 'gdf-8', filename: 'ppl_gdf_8_hero_1780190024283.png' },
  { slug: 'mt-2-melanotan-2-acetate', filename: 'ppl_mt_2_hero_1780190036790.png' },
  { slug: 'cjc-1295-without-dac', filename: 'ppl_cjc_1295_without_dac_hero_1780190048657.png' },
  { slug: 'primo-200mg', filename: 'ppl_primo_200mg_hero_1780190060001.png' },
  { slug: 'retatrutide', filename: 'ppl_retatrutide_hero_1780190073766.png' }
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
