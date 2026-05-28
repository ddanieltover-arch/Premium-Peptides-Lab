import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'tb-500-tb4', filename: 'ppl_tb_500_tb4_hero_1779713438397.png' },
  { slug: 'ahk-cu', filename: 'ppl_ahk_cu_hero_1779713453883.png' },
  { slug: 'glutathione', filename: 'ppl_glutathione_hero_1779713469496.png' },
  { slug: 'accutane-20mg-50-tablets', filename: 'ppl_accutane_20mg_hero_1779713486464.png' },
  { slug: 'sustanon-250mg', filename: 'ppl_sustanon_250mg_hero_1779713501022.png' },
  { slug: 'acetic-acid', filename: 'ppl_acetic_acid_hero_1779713513867.png' },
  { slug: 't-bol-25mg-50-tablets', filename: 'ppl_t_bol_25mg_hero_1779713527077.png' },
  { slug: 'halo-10mg-50-tablets', filename: 'ppl_halo_10mg_hero_1779713539970.png' },
  { slug: 'fat-blaster-lc526', filename: 'ppl_fat_blaster_hero_1779713554199.png' },
  { slug: 'bpc-157-tb-500-tb4', filename: 'ppl_bpc_tb500_tb4_hero_1779713567601.png' },
  { slug: 'drostanolone-enanthate-200mg', filename: 'ppl_drostanolone_enanthate_hero_1779713583731.png' },
  { slug: 'glp-1-c', filename: 'ppl_glp_1_c_hero_1779713597386.png' },
  { slug: 'masteron-p-100mg', filename: 'ppl_masteron_p_hero_1779713611398.png' },
  { slug: 'cjc-1295', filename: 'ppl_cjc_1295_hero_1779713625495.png' },
  { slug: 'bpc-157-tb-500-blend', filename: 'ppl_bpc_tb500_blend_hero_1779713641113.png' }
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
