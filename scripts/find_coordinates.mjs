import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const imagePath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\c2c445db-f284-408a-9a12-682492d0552f\\media__1779740331199.png';
  console.log('Loading base image...');
  const image = await loadImage(imagePath);
  
  const width = image.width;
  const height = image.height;
  console.log(`Image loaded. Size: ${width}x${height}`);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  // We need to cover "BACTERIOSTATIC WATER". 
  // Let's estimate the coordinates. The banner spans horizontally from edge to edge of the label.
  // The label is centered. Let's sample a pixel from the far left of the blue banner.
  // Assuming a 1024x1024 image, the blue banner is roughly from y=500 to y=650.
  // We'll output a few pixel colors to find the right blue color.
  
  const sampleY = Math.floor(height * 0.58); // Guessing the middle of the banner
  const sampleX = Math.floor(width * 0.35); // Left side, inside the label
  
  const pixel = ctx.getImageData(sampleX, sampleY, 1, 1).data;
  console.log(`Sampled pixel at (${sampleX}, ${sampleY}): rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]})`);

  // Let's just draw a red semi-transparent rectangle to figure out the exact coordinates of the blue strip text.
  // I will guess the bounding box and we can check the output image.
  
  const boxX = width * 0.30;
  const boxY = height * 0.53;
  const boxW = width * 0.40;
  const boxH = height * 0.12;

  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.fillRect(boxX, boxY, boxW, boxH);

  const outPath = path.join(process.cwd(), 'template_test.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
  console.log(`Saved template test to ${outPath}`);
}

main();
