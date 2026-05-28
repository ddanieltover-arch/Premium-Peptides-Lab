import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';

const SUPABASE_URL = 'https://fwzantgfbvtfpzujgmjr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3emFudGdmYnZ0ZnB6dWpnbWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MDA3MSwiZXhwIjoyMDk0NDY2MDcxfQ.DTC8pSRZBaGnqm9aU8r6HINeB3gE-5wfURwwB1I8oWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const OPENAI_KEY = 'BirgxVUdhmmysU1RkHGm7g1XfH7rNWtAdK4vKFcfViIPpKJLNsRdnDo73T8Y04-dAUZEHVQ0IT3BlbkFJB9FNFxtOJeGuuQ9cXFkVVdUbltQOVtthb0GEWm-9L9hw-1AIhVGPJH9Ap1Q7gs2oACcYDE58UA';

const openai = new OpenAI({
  apiKey: OPENAI_KEY.startsWith('sk-') ? OPENAI_KEY : `sk-${OPENAI_KEY}`
});

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const remainingProducts = products.slice(27); // Skip the 27 already completed

function buildPrompt(name) {
  const isTablets = name.toUpperCase().includes('TABLET');
  const container = isTablets ? 'white pharmaceutical pill bottle' : '10mL glass vial';
  const capEntity = isTablets ? 'bottle' : 'vial';
  
  return `A professional, clinical studio shot of a ${container} containing ${name} for research use. The ${capEntity} has an electric blue cap. The label is clean, modern, and clinical, featuring the 'Premium Peptides Lab' logo (an electric blue DNA helix with spectrum colors and gold lightning energy) on a dark navy background. The label clearly states '${name}' in large bold electric blue letters. Below that, 'FOR RESEARCH USE ONLY'. The text 'Not for human or veterinary use' is visible. The background is pure white. photorealistic, highly detailed, dramatic studio lighting.`;
}

async function main() {
  console.log(`Starting generation for ${remainingProducts.length} products...`);
  
  for (const product of remainingProducts) {
    try {
      console.log(`\nProcessing: ${product.name} (${product.slug})`);
      const prompt = buildPrompt(product.name);
      
      console.log('Generating image with DALL-E 3...');
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
      
      const imageUrl = response.data[0].url;
      console.log('Downloading image...');
      const imageRes = await fetch(imageUrl);
      const arrayBuffer = await imageRes.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const targetName = `ppl-${product.slug}-hero-${Date.now()}.png`;

      console.log(`Uploading ${targetName} to catalog-heroes bucket...`);
      const { error: uploadError } = await supabase.storage.from('catalog-heroes').upload(targetName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage.from('catalog-heroes').getPublicUrl(targetName);
      const publicUrl = publicUrlData.publicUrl;

      console.log(`Updating DB for slug: ${product.slug}`);
      const { error: updateError } = await supabase.from('products').update({ thumbnail_url: publicUrl }).eq('slug', product.slug);
      if (updateError) throw new Error(`DB update failed: ${updateError.message}`);
      
      console.log(`Success: ${product.slug} -> ${publicUrl}`);
      
      // Add a slight delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error processing ${product.slug}:`, error);
      // Stop the script if we hit a severe error like an invalid API key or out of credits
      if (error.message.includes('401') || error.message.includes('429')) {
        console.error('Stopping script due to auth or rate limit error.');
        break;
      }
    }
  }
}

main();
