import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSETS = [
  { slug: 'kpv', filename: 'ppl_kpv_hero_1780122125707.png' },
  { slug: 'adipotide', filename: 'ppl_adipotide_hero_1780122138057.png' },
  { slug: 'bam15', filename: 'ppl_bam15_hero_1780122151413.png' },
  { slug: 'yk11-10mg-50-tablets', filename: 'ppl_yk11_hero_1780122166005.png' },
  { slug: 'thymogen', filename: 'ppl_thymogen_hero_1780122180925.png' },
  { slug: 'peptide-r', filename: 'ppl_peptide_r_hero_1780122194346.png' },
  { slug: 'vesugen', filename: 'ppl_vesugen_hero_1780122207192.png' },
  { slug: 'pt-141-10mg', filename: 'ppl_pt_141_hero_1780122219884.png' },
  { slug: 'primobolan-100mg', filename: 'ppl_primobolan_100mg_hero_1780122237333.png' },
  { slug: 'mk-677-10mg-50-tablets', filename: 'ppl_mk_677_hero_1780122250229.png' },
  { slug: 'dhx-pnb-0408', filename: 'ppl_dhx_pnb_0408_hero_1780122264884.png' },
  { slug: 'peptide-m-15mg', filename: 'ppl_peptide_m_15mg_hero_1780122277546.png' },
  { slug: 'peptide-s-15mg', filename: 'ppl_peptide_s_15mg_hero_1780122289881.png' },
  { slug: 'mk-2866-10mg-50-tablets', filename: 'ppl_mk_2866_hero_1780122304525.png' }
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
