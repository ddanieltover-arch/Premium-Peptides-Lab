import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'anadrol-50mg-50-tablets', filename: 'ppl_anadrol_50mg_hero_1780207951175.png' },
  { slug: 'foxo4-dri', filename: 'ppl_foxo4_dri_hero_1780207963374.png' },
  { slug: 'glp-3-r', filename: 'ppl_glp_3_r_hero_1780207975887.png' },
  { slug: 'humanin', filename: 'ppl_humanin_hero_1780207987673.png' },
  { slug: 'testosterone-400-400mg', filename: 'ppl_testosterone_400_hero_1780208000790.png' },
  { slug: 'semax', filename: 'ppl_semax_hero_1780208013512.png' },
  { slug: 'oxytocin', filename: 'ppl_oxytocin_hero_1780208026250.png' },
  { slug: 'testosterone-propionate-100mg', filename: 'ppl_testosterone_propionate_hero_1780208038401.png' },
  { slug: 'peptide-r-50mg', filename: 'ppl_peptide_r_hero_1780208051576.png' },
  { slug: 'lipo-c', filename: 'ppl_lipo_c_hero_1780208063207.png' },
  { slug: 'glp-1-s', filename: 'ppl_glp_1_s_hero_1780208076171.png' },
  { slug: 'boldenone-undecylenate-300mg', filename: 'ppl_boldenone_undecylenate_hero_1780208089067.png' },
  { slug: 'hexarelin-acetate', filename: 'ppl_hexarelin_acetate_hero_1780208102912.png' },
  { slug: 'cjc-1295-with-dac', filename: 'ppl_cjc_1295_with_dac_hero_1780208115347.png' },
  { slug: 'reconstitution-solution-30ml', filename: 'ppl_reconstitution_solution_hero_1780208128270.png' }
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
