import * as fs from 'fs';
import * as path from 'path';

const STABILITY_API_KEY = 'sk-2TRwmF6X3ijBaqawEsgNDduamy6iXwdJlEK7PUkypolKuoP7';

async function main() {
  const testProduct = "GLP-1 (C/S)";
  console.log(`\nTesting Stability AI Image-to-Image on: ${testProduct}`);
  
  try {
    const formData = new FormData();
    // Use the user's uploaded image as the base
    const imagePath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\c2c445db-f284-408a-9a12-682492d0552f\\media__1779740331199.png';
    const imageBuffer = fs.readFileSync(imagePath);
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('image', blob, 'sample.jpg');
    
    // We instruct it to keep the structure but change the text
    formData.append('prompt', `A photorealistic clear glass vial with a blue cap. Keep the exact same label design and logo, but change the large white text inside the blue strip to "${testProduct}". The text must read exactly "${testProduct}".`);
    formData.append('mode', 'image-to-image');
    formData.append('model', 'sd3-large');
    formData.append('strength', '0.75'); // 0 to 1, higher means more change
    formData.append('output_format', 'png');

    console.log('Sending request to SD3 API...');
    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
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

    const testPath = path.join(process.cwd(), `test_image_glp_1_sd3_i2i.png`);
    fs.writeFileSync(testPath, fileBuffer);
    
    console.log(`\nSuccess! Test image saved to: ${testPath}`);

  } catch (error) {
    console.error(`\nError generating test image:`);
    console.error(error.message);
  }
}

main();
