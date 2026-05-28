import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';

async function main() {
  const imagePath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\c2c445db-f284-408a-9a12-682492d0552f\\media__1779740331199.png';
  const image = await loadImage(imagePath);
  const width = image.width;
  const height = image.height;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  // We scan the middle column (x = width / 2) to find the blue banner.
  // The banner is blue, which means B > R and B > G significantly.
  let bannerStartY = -1;
  let bannerEndY = -1;
  
  const centerX = Math.floor(width / 2);
  
  for (let y = 0; y < height; y++) {
    const data = ctx.getImageData(centerX, y, 1, 1).data;
    const r = data[0];
    const g = data[1];
    const b = data[2];
    
    // Check if pixel is prominently blue
    if (b > r + 30 && b > g + 10 && b > 100) { // bright blue criteria
      if (bannerStartY === -1) {
        bannerStartY = y;
      }
      bannerEndY = y;
    }
  }

  // The text is roughly vertically centered in the banner.
  console.log(`Blue banner detected from y=${bannerStartY} to y=${bannerEndY} (Height: ${bannerEndY - bannerStartY})`);

  // Now we need the left and right edges. We scan horizontally in the middle of the banner.
  const centerY = Math.floor((bannerStartY + bannerEndY) / 2);
  let bannerStartX = -1;
  let bannerEndX = -1;

  for (let x = 0; x < width; x++) {
    const data = ctx.getImageData(x, centerY, 1, 1).data;
    const r = data[0];
    const g = data[1];
    const b = data[2];
    
    // We also want to include white pixels, because the text is white
    const isWhite = (r > 200 && g > 200 && b > 200);
    const isBlue = (b > r + 30 && b > g + 10 && b > 100);

    if (isBlue || isWhite) {
      if (bannerStartX === -1) {
        bannerStartX = x;
      }
      bannerEndX = x;
    }
  }

  console.log(`Blue banner detected horizontally from x=${bannerStartX} to x=${bannerEndX} (Width: ${bannerEndX - bannerStartX})`);

  // Let's get the exact blue color to fill
  // Sample a few pixels near the edge where there's no text
  const safeX = bannerStartX + 10;
  const safeY = centerY;
  const bgPixel = ctx.getImageData(safeX, safeY, 1, 1).data;
  console.log(`Background color sampled: rgb(${bgPixel[0]}, ${bgPixel[1]}, ${bgPixel[2]})`);

}

main();
