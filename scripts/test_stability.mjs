import * as fs from 'fs';
import * as path from 'path';

const STABILITY_API_KEY = 'sk-2TRwmF6X3ijBaqawEsgNDduamy6iXwdJlEK7PUkypolKuoP7';

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const remainingProducts = products.slice(27);

function buildPrompt(name) {
  const isTablets = name.toUpperCase().includes('TABLET');
  const container = isTablets ? 'white pharmaceutical pill bottle' : '10mL glass vial';
  const capEntity = isTablets ? 'bottle' : 'vial';
  
  return `A professional, clinical studio shot of a ${container} containing ${name} for research use. The ${capEntity} has an electric blue cap. The label is clean, modern, and clinical, featuring the 'Premium Peptides Lab' logo (an electric blue DNA helix with spectrum colors and gold lightning energy) on a dark navy background. The label clearly states '${name}' in large bold electric blue letters. Below that, 'FOR RESEARCH USE ONLY'. The text 'Not for human or veterinary use' is visible. The background is pure white. photorealistic, highly detailed, dramatic studio lighting.`;
}

async function main() {
  const product = remainingProducts[0]; // test with the next product in line
  console.log(`\nTesting Stability AI on: ${product.name} (${product.slug})`);
  const prompt = buildPrompt(product.name);
  
  try {
    console.log('Generating test image with Stability AI (Core)...');
    
    // We use FormData for the Stability AI v2beta API
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'png');

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*'
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const testPath = path.join(process.cwd(), `test_image_${product.slug}_stability.png`);
    fs.writeFileSync(testPath, fileBuffer);
    
    console.log(`\nSuccess! Test image saved to: ${testPath}`);
    console.log(`Review it, and if it looks good, we can run the full batch.`);

  } catch (error) {
    console.error(`\nError generating test image:`);
    console.error(error.message);
  }
}

main();
