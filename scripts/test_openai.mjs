import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';

const OPENAI_KEY = 'BirgxVUdhmmysU1RkHGm7g1XfH7rNWtAdK4vKFcfViIPpKJLNsRdnDo73T8Y04-dAUZEHVQ0IT3BlbkFJB9FNFxtOJeGuuQ9cXFkVVdUbltQOVtthb0GEWm-9L9hw-1AIhVGPJH9Ap1Q7gs2oACcYDE58UA';

const openai = new OpenAI({
  apiKey: OPENAI_KEY.startsWith('sk-') ? OPENAI_KEY : `sk-${OPENAI_KEY}`
});

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const remainingProducts = products.slice(27);

function buildPrompt(name) {
  const isTablets = name.toUpperCase().includes('TABLET');
  const container = isTablets ? 'white pharmaceutical pill bottle' : '10mL glass vial';
  const capEntity = isTablets ? 'bottle' : 'vial';
  
  return `A professional, clinical studio shot of a ${container} containing ${name} for research use. The ${capEntity} has an electric blue cap. The label is clean, modern, and clinical, featuring the 'Premium Peptides Lab' logo (an electric blue DNA helix with spectrum colors and gold lightning energy) on a dark navy background. The label clearly states '${name}' in large bold electric blue letters. Below that, 'FOR RESEARCH USE ONLY'. The text 'Not for human or veterinary use' is visible. The background is pure white. photorealistic, highly detailed, dramatic studio lighting.`;
}

async function main() {
  const product = remainingProducts[0];
  console.log(`\nTesting DALL-E 3 on: ${product.name} (${product.slug})`);
  const prompt = buildPrompt(product.name);
  
  try {
    console.log('Generating test image with DALL-E 3...');
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    
    const imageUrl = response.data[0].url;
    console.log('Downloading test image...');
    const imageRes = await fetch(imageUrl);
    const arrayBuffer = await imageRes.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const testPath = path.join(process.cwd(), `test_image_${product.slug}.png`);
    fs.writeFileSync(testPath, fileBuffer);
    
    console.log(`\nSuccess! Test image saved to: ${testPath}`);
    console.log(`Review it, and if it looks good, we can run the full batch.`);

  } catch (error) {
    console.error(`\nError generating test image:`);
    console.error(error.message);
  }
}

main();
