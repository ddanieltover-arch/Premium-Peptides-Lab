import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'bpc-157-tb-500-tb4-blend', filename: 'ppl_bpc_157_tb_500_tb4_blend_hero_1780227217674.png' },
  { slug: 'vip', filename: 'ppl_vip_hero_1780227230243.png' },
  { slug: 'melanoten-2', filename: 'ppl_melanoten_2_hero_1780227242053.png' },
  { slug: 'ghpr-2', filename: 'ppl_ghpr_2_hero_1780227254862.png' },
  { slug: 'cjc1295-with-dac', filename: 'ppl_cjc1295_with_dac_hero_1780227268197.png' },
  { slug: 'tb-500-10mg', filename: 'ppl_tb_500_10mg_hero_1780227280065.png' },
  { slug: 'cjc-ipa-no-dac', filename: 'ppl_cjc_ipa_no_dac_hero_1780227291753.png' },
  { slug: 'arimidex-1mg-50-tablets', filename: 'ppl_arimidex_1mg_hero_1780227304882.png' },
  { slug: 'winstrol-20mg-50-tablets', filename: 'ppl_winstrol_20mg_hero_1780227317900.png' },
  { slug: 'mgf', filename: 'ppl_mgf_hero_1780227331506.png' },
  { slug: 'superdrol-10mg-50-tablets', filename: 'ppl_superdrol_10mg_hero_1780227415119.png' },
  { slug: 'gonadorelin', filename: 'ppl_gonadorelin_hero_1780227349556.png' },
  { slug: 'clomid-50mg-50-tablets', filename: 'ppl_clomid_50mg_hero_1780227361464.png' },
  { slug: 'testosterone-cypionate-300mg', filename: 'ppl_testosterone_cypionate_hero_1780227373474.png' },
  { slug: 'travel-cold-case', filename: 'ppl_travel_cold_case_hero_1780227386204.png' }
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
