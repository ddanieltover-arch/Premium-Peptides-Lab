import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'dianabol-20mg-50-tablets', filename: 'ppl_dianabol_20mg_hero_1780104011061.png' },
  { slug: 'primo-100mg', filename: 'ppl_primo_100mg_hero_1780104023870.png' },
  { slug: 'cerebrolysin', filename: 'ppl_cerebrolysin_hero_1780104039942.png' },
  { slug: 'ibutamorin', filename: 'ppl_ibutamorin_hero_1780104051429.png' },
  { slug: 'zio-shredz-20mg-50-tablets', filename: 'ppl_zio_shredz_20mg_hero_1780104064360.png' },
  { slug: 'sermorelin-acetate', filename: 'ppl_sermorelin_acetate_hero_1780104076282.png' },
  { slug: 'nolvadex-20mg-50-tablets', filename: 'ppl_nolvadex_20mg_hero_1780104090305.png' },
  { slug: 'thymosin-a1', filename: 'ppl_thymosin_a1_5mg_hero_1780104101833.png' },
  { slug: 'peptide-c', filename: 'ppl_peptide_c_5mg_hero_1780104115763.png' },
  { slug: 'sr9009-10mg-50-tablets', filename: 'ppl_sr9009_hero_1780104129469.png' },
  { slug: 'tesmorelin', filename: 'ppl_tesmorelin_hero_1780104142202.png' },
  { slug: 'bd-luer-lok-syringe-3ml-10-pack', filename: 'ppl_bd_syringes_hero_1780104160950.png' },
  { slug: 'ovagen', filename: 'ppl_ovagen_hero_1780104178010.png' },
  { slug: 'tudca', filename: 'ppl_tudca_hero_1780104191767.png' },
  { slug: 'dsip', filename: 'ppl_dsip_hero_1780104205163.png' }
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
