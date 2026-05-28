import * as fs from 'fs';
import * as path from 'path';

const STABILITY_API_KEY = 'sk-2TRwmF6X3ijBaqawEsgNDduamy6iXwdJlEK7PUkypolKuoP7';

function buildPrompt(name) {
  const isTablets = name.toUpperCase().includes('TABLET');
  const container = isTablets ? 'white pharmaceutical pill bottle' : '10mL clear glass vial';
  const capEntity = isTablets ? 'bottle' : 'vial';
  
  return `A highly photorealistic studio shot of a ${container} with a metallic electric blue cap. The ${capEntity} has a dark navy blue label. On the top half of the label is a logo of an electric blue DNA helix with spectrum colors and gold lightning, with the text "PREMIUM PEPTIDES LAB" below it. Below the logo is a bright electric blue horizontal rectangular strip stretching across the label. Inside this bright blue strip, the text "${name.toUpperCase()}" is written in large, bold, clean white sans-serif font. Below the blue strip, on the dark navy background, is smaller white text reading "FOR RESEARCH USE ONLY" and "NOT FOR HUMAN OR VETERINARY USE". Pure white background, dramatic studio lighting, 8k resolution, centered composition.`;
}

async function main() {
  const testProduct = "GLP-1 (C/S)"; // Test with something different than Bacteriostatic Water
  console.log(`\nTesting Stability AI on: ${testProduct}`);
  const prompt = buildPrompt(testProduct);
  
  try {
    console.log('Generating test image with Stability AI (Core)...');
    
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

    const testPath = path.join(process.cwd(), `test_image_glp_1_stability_v2.png`);
    fs.writeFileSync(testPath, fileBuffer);
    
    console.log(`\nSuccess! Test image saved to: ${testPath}`);

  } catch (error) {
    console.error(`\nError generating test image:`);
    console.error(error.message);
  }
}

main();
