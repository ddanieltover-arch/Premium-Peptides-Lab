import { createCanvas, loadImage, registerFont } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const imagePath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\c2c445db-f284-408a-9a12-682492d0552f\\media__1779740331199.png';
  const image = await loadImage(imagePath);
  const width = image.width;
  const height = image.height;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  // The text bounding box for "BACTERIOSTATIC WATER"
  // Let's cover it with a solid blue color. We sample from the left edge of the banner.
  const bgPixel = ctx.getImageData(325, 595, 1, 1).data; 
  ctx.fillStyle = `rgb(${bgPixel[0]}, ${bgPixel[1]}, ${bgPixel[2]})`;
  
  // Draw the rectangle over the text
  const boxX = 320; 
  const boxY = 540;
  const boxW = 384; 
  const boxH = 108;
  
  // Fill the box
  ctx.fillRect(boxX, boxY, boxW, boxH);

  // Now, let's write the new text centered
  const testProduct = "GLP-1 (C/S)";
  
  // Try to use Arial Black or a standard heavy font available on Windows
  ctx.font = 'bold 45px "Arial", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add a subtle drop shadow to match the original text style
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // If the product name is long, we can scale down the font size
  const maxTextWidth = boxW - 20;
  let fontSize = 45;
  while (ctx.measureText(testProduct).width > maxTextWidth && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px "Arial", sans-serif`;
  }

  // Draw the text in the middle of the box
  ctx.fillText(testProduct, boxX + boxW / 2, boxY + boxH / 2);

  const outPath = path.join(process.cwd(), 'programmatic_test.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
  console.log(`Saved programmatic test to ${outPath}`);
}

main();
