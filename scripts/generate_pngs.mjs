import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function generatePng(width, height) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image lines
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowStride);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded squircle / gradient
      const t = y / height;
      let r = Math.round(8 + t * (14 - 8)); // #082f49 to dark cyan
      let g = Math.round(47 + t * (116 - 47));
      let b = Math.round(73 + t * (144 - 73));
      let a = 255;

      // Draw outer circle accent
      if (Math.abs(dist - radius * 0.88) < (width > 200 ? 5 : 2)) {
        r = 14; g = 116; b = 144;
      }

      // Draw Water Droplet Shape
      // Center of droplet at cx, 0.55 * height
      const dropCy = height * 0.54;
      const dropY = (y - dropCy) / (height * 0.32);
      const dropX = (x - cx) / (width * 0.28);

      // Droplet formula: x^2 + (y - sqrt(|x|)*0.5)^2 <= 1 approx
      const inLowerCircle = (dropX * dropX + dropY * dropY <= 0.65) && (dropY >= -0.1);
      const inTopCone = (dropY < -0.1) && (dropY > -0.9) && (Math.abs(dropX) <= (1 + dropY * 1.1) * 0.45);

      if (inLowerCircle || inTopCone) {
        // Bright cyan/water gradient
        const dropT = (y - (dropCy - height * 0.3)) / (height * 0.5);
        r = Math.round(6 + dropT * (3 - 6));
        g = Math.round(182 + dropT * (105 - 182));
        b = Math.round(212 + dropT * (161 - 212));

        // Core white water drop accent
        const cdx = x - cx;
        const cdy = y - (dropCy + height * 0.05);
        if (Math.sqrt(cdx * cdx + cdy * cdy) < width * 0.09) {
          r = 255; g = 255; b = 255;
        } else if (Math.sqrt(cdx * cdx + cdy * cdy) < width * 0.14) {
          r = 2; g = 132; b = 199;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const idatChunk = makeChunk('IDAT', zlib.deflateSync(rawData));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate all standard PWA sizes
fs.writeFileSync('public/pwa-192x192.png', generatePng(192, 192));
fs.writeFileSync('public/pwa-512x512.png', generatePng(512, 512));
fs.writeFileSync('public/pwa-maskable-512x512.png', generatePng(512, 512));
fs.writeFileSync('public/apple-touch-icon.png', generatePng(180, 180));
console.log('Successfully created real PWA PNG icons: 192x192, 512x512, maskable, and 180x180.');

