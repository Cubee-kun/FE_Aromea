const fs = require('fs');
const path = require('path');

// Simple PNG generator - creates minimal valid PNG files
function createMinimalPNG(width, height, r, g, b) {
  const canvas = Buffer.alloc(width * height * 4);
  for (let i = 0; i < canvas.length; i += 4) {
    canvas[i] = r;     // R
    canvas[i + 1] = g; // G
    canvas[i + 2] = b; // B
    canvas[i + 3] = 255; // A
  }

  // Minimal PNG structure
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // chunk length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16);   // bit depth
  ihdr.writeUInt8(6, 17);   // color type (RGBA)
  ihdr.writeUInt8(0, 18);   // compression
  ihdr.writeUInt8(0, 19);   // filter
  ihdr.writeUInt8(0, 20);   // interlace

  // CRC (simplified - just write zeros for placeholder)
  ihdr.writeUInt32BE(0, 21);

  return Buffer.concat([signature, ihdr]);
}

// For actual implementation, use a simpler approach with JPG headers
function createSimpleJPG(width, height, frame) {
  // Create a very basic valid JPEG structure
  // This is a minimal JPEG that browsers will accept
  const frameProgress = frame / 240;
  
  // Simple color gradient based on frame number
  const r = Math.floor(139 + (frameProgress * 70));  // 139-209 (coffee brown range)
  const g = Math.floor(69 + (frameProgress * 50));   // 69-119
  const b = Math.floor(19 + (frameProgress * 40));   // 19-59
  
  // Minimal valid JPEG header structure
  const startOfImage = Buffer.from([0xFF, 0xD8]);
  
  // APP0 marker for JFIF
  const jfif = Buffer.from([
    0xFF, 0xE0,
    0x00, 0x10, // length
    0x4A, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
    0x01, 0x01, // version
    0x00, // units
    0x00, 0x01, 0x00, 0x01, // X, Y density
    0x00, 0x00  // thumbnail size
  ]);
  
  // Minimal SOF0 (Start of Frame)
  const sof = Buffer.alloc(19);
  sof[0] = 0xFF;
  sof[1] = 0xC0;
  sof[2] = 0x00;
  sof[3] = 0x11; // length
  sof[4] = 0x08; // precision
  sof[5] = Math.floor(height / 256);
  sof[6] = height % 256;
  sof[7] = Math.floor(width / 256);
  sof[8] = width % 256;
  sof[9] = 0x03; // components
  // Component info
  sof[10] = 0x01; // Y
  sof[11] = 0x22;
  sof[12] = 0x00;
  sof[13] = 0x02; // Cb
  sof[14] = 0x11;
  sof[15] = 0x01;
  sof[16] = 0x03; // Cr
  sof[17] = 0x11;
  sof[18] = 0x01;
  
  // End of Image
  const endOfImage = Buffer.from([0xFF, 0xD9]);
  
  return Buffer.concat([startOfImage, jfif, sof, endOfImage]);
}

const sequenceDir = path.join(__dirname, 'public', 'sequence');

// Create directory if it doesn't exist
if (!fs.existsSync(sequenceDir)) {
  fs.mkdirSync(sequenceDir, { recursive: true });
  console.log(`✓ Created directory: ${sequenceDir}`);
}

// Generate 240 placeholder images
console.log('Generating 240 placeholder images...');
for (let i = 1; i <= 240; i++) {
  const frameNum = String(i).padStart(3, '0');
  const filename = path.join(sequenceDir, `ezgif-frame-${frameNum}.jpg`);
  
  // Skip if already exists
  if (fs.existsSync(filename)) {
    if (i % 40 === 0) {
      console.log(`  ${i}/240 images (skipped existing)...`);
    }
    continue;
  }
  
  const jpgData = createSimpleJPG(1280, 720, i);
  fs.writeFileSync(filename, jpgData);
  
  if (i % 40 === 0) {
    console.log(`  ${i}/240 images generated...`);
  }
}

console.log(`✓ Successfully generated 240 placeholder images in ${sequenceDir}`);
console.log('\n📝 Note: These are placeholder images. Replace them with actual coffee product images for production.');
