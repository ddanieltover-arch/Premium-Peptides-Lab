import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'bacteriostatic-water-30ml', filename: 'ppl_bac_water_hero_1779731792484.png' },
  { slug: 'glp-1-c-s', filename: 'ppl_glp_1_c_s_hero_1779731805926.png' },
  { slug: 'anavar-10mg-60-tablets', filename: 'ppl_anavar_10mg_60_hero_1779731819019.png' },
  { slug: 'epitalon', filename: 'ppl_epitalon_hero_1779731836044.png' },
  { slug: 'test-cypionate-250mg', filename: 'ppl_test_cyp_hero_1779731849630.png' },
  { slug: 'sermorlin', filename: 'ppl_sermorlin_hero_1779731863612.png' },
  { slug: 'anavar-20mg-50-tablets', filename: 'ppl_anavar_20mg_50_hero_1780049465884.png' },
  { slug: 'n-acetyl-semx-amidate', filename: 'ppl_n_acetyl_semx_hero_1780049478488.png' },
  { slug: 'hgh-191aa-somatropin', filename: 'ppl_hgh_191aa_hero_1780049491138.png' },
  { slug: 'peptide-cs', filename: 'ppl_peptide_cs_hero_1780049504604.png' },
  { slug: 'peptide-su', filename: 'ppl_peptide_su_hero_1780049517631.png' },
  { slug: 'ghk-cu', filename: 'ppl_ghk_cu_hero_1780049530884.png' },
  { slug: 'prostamax', filename: 'ppl_prostamax_hero_1780049544136.png' },
  { slug: 'cagrilintide', filename: 'ppl_cagrilintide_hero_1780049560453.png' },
  { slug: 'peptide-31', filename: 'ppl_peptide_31_hero_1780049573933.png' },
  { slug: 'peptide-t-15mg', filename: 'ppl_peptide_t_15mg_hero_1780049589435.png' },
  { slug: 'ipamorelin', filename: 'ppl_ipamorelin_hero_1780049603458.png' },
  { slug: 'peptide-c-20mg', filename: 'ppl_peptide_c_20mg_hero_1780049616271.png' },
  { slug: 'bpc-157', filename: 'ppl_bpc_157_hero_1780049629956.png' },
  { slug: 'hexarelin', filename: 'ppl_hexarelin_hero_1780049646867.png' },
  { slug: 'peptide-s-10mg', filename: 'ppl_peptide_s_10mg_hero_1780049657993.png' }
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
