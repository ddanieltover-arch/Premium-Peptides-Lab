import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'pnc-27', filename: 'ppl_pnc_27_hero_1780086121799.png' },
  { slug: 'slu-pp-332', filename: 'ppl_slu_pp_332_hero_1780086135702.png' },
  { slug: 'clenbuterol-100mcg-50-tablets', filename: 'ppl_clenbuterol_100mcg_hero_1780086149350.png' },
  { slug: 't400-400mg', filename: 'ppl_t400_hero_1780086160996.png' },
  { slug: 'testosterone-undecanoate-250mg', filename: 'ppl_test_undecanoate_250mg_hero_1780086172051.png' },
  { slug: 'n-acetyl-selank-amidate', filename: 'ppl_n_acetyl_selank_amidate_hero_1780086184350.png' },
  { slug: 'tirzepatide', filename: 'ppl_tirzepatide_hero_1780086198096.png' },
  { slug: 'tb500', filename: 'ppl_tb500_hero_1780086210657.png' },
  { slug: 'kisspeptin-10', filename: 'ppl_kisspeptin_10_hero_1780086223768.png' },
  { slug: 'peptide-31-60mg', filename: 'ppl_peptide_31_60mg_hero_1780086236593.png' },
  { slug: 'anavar-25mg-50-tablets', filename: 'ppl_anavar_25mg_hero_1780086250036.png' },
  { slug: '5-amino-1mq-5mg', filename: 'ppl_5_amino_1mq_5mg_hero_1780086262527.png' },
  { slug: 'bpc-157-tb-500-5mg-5mg', filename: 'ppl_bpc_157_tb_500_5mg_hero_1780086274866.png' },
  { slug: 'klow', filename: 'ppl_klow_hero_1780086286831.png' },
  { slug: 'glow-plus-bpc-157-ghk-cu-tb-500-thymosin-alpha-1-blend', filename: 'ppl_glow_plus_blend_hero_1780086305258.png' }
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
