import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'livagen', filename: 'ppl_livagen_hero_1780139522261.png' },
  { slug: 'lipo-b', filename: 'ppl_lipo_b_hero_1780139536595.png' },
  { slug: 'cortagen', filename: 'ppl_cortagen_hero_1780139548213.png' },
  { slug: 'cialis-30mg-50-tablets', filename: 'ppl_cialis_30mg_hero_1780139561801.png' },
  { slug: 'peptide-m', filename: 'ppl_peptide_m_hero_1780139574522.png' },
  { slug: 'ara-290', filename: 'ppl_ara_290_hero_1780139589865.png' },
  { slug: 'hmg', filename: 'ppl_hmg_hero_1780139601131.png' },
  { slug: 'melanotan-ii', filename: 'ppl_melanotan_ii_hero_1780139614406.png' },
  { slug: 'tnt-200-200mg', filename: 'ppl_tnt_200_hero_1780139627418.png' },
  { slug: 'mots-c', filename: 'ppl_mots_c_hero_1780139639647.png' },
  { slug: 'ss-31', filename: 'ppl_ss_31_hero_1780139654622.png' },
  { slug: 'vilon', filename: 'ppl_vilon_hero_1780139667942.png' },
  { slug: 'aicar', filename: 'ppl_aicar_hero_1780139681719.png' },
  { slug: 'pt-141', filename: 'ppl_pt_141_hero_1780139694322.png' },
  { slug: 'll-37', filename: 'ppl_ll_37_hero_1780139710243.png' }
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
