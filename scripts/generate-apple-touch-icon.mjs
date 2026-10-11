/**
 * generate-apple-touch-icon.mjs
 *
 * Generates public/icons/apple-touch-icon.png (180x180) as a PNG built
 * from raw pixels, using only Node's built-in `zlib` module — no image
 * libraries, no pasted/decoded binary data. This sidesteps the corruption
 * that happened twice when a pre-made PNG was transported through chat
 * (both as base64 text and as a direct file upload came back with
 * 0xEF 0xBF 0xBD byte sequences — the UTF-8 "replacement character" —
 * meaning the bytes were being run through a text/UTF-8 layer somewhere
 * in that pipeline). Because this script produces the file locally, in
 * this environment, there is no transport step to corrupt.
 *
 * Run with: node generate-apple-touch-icon.mjs
 * (from the project root — it writes to public/icons/apple-touch-icon.png)
 */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SIZE = 180;
const BG = [0x0b, 0x0c, 0x0c];      // #0B0C0C
const BORDER = [0x25, 0x28, 0x27];  // #252827
const ACCENT = [0xb5, 0x45, 0x3d];  // #B5453D

const OUT_PATH = 'public/icons/apple-touch-icon.png';

// --- Build the pixel grid -------------------------------------------------

const pixels = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => BG));

function fillRect(x0, y0, x1, y1, color) {
  for (let y = Math.max(0, y0); y < Math.min(SIZE, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(SIZE, x1); x++) {
      pixels[y][x] = color;
    }
  }
}

// Thin border, matching the SVG icon's frame
const b = 6;
fillRect(b, b, SIZE - b, b + 2, BORDER); // top
fillRect(b, SIZE - b - 2, SIZE - b, SIZE - b, BORDER); // bottom
fillRect(b, b, b + 2, SIZE - b, BORDER); // left
fillRect(SIZE - b - 2, b, SIZE - b, SIZE - b, BORDER); // right

// "E" glyph, built from three horizontal bars + one vertical spine —
// deliberately geometric (no font rendering needed) but reads clearly as E
const gx0 = 62, gx1 = 130;      // glyph horizontal extent
const gy0 = 46, gy1 = 134;      // glyph vertical extent
const barH = 16;                 // horizontal bar thickness
const spineW = 16;                // vertical spine thickness

fillRect(gx0, gy0, gx0 + spineW, gy1, ACCENT); // vertical spine
fillRect(gx0, gy0, gx1, gy0 + barH, ACCENT); // top bar
fillRect(gx0, (gy0 + gy1) / 2 - barH / 2, gx1 - 10, (gy0 + gy1) / 2 + barH / 2, ACCENT); // middle bar
fillRect(gx0, gy1 - barH, gx1, gy1, ACCENT); // bottom bar

// --- Encode as PNG ---------------------------------------------------------

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(SIZE, 0); // width
ihdrData.writeUInt32BE(SIZE, 4); // height
ihdrData.writeUInt8(8, 8);       // bit depth
ihdrData.writeUInt8(2, 9);       // color type: 2 = RGB truecolor
ihdrData.writeUInt8(0, 10);      // compression
ihdrData.writeUInt8(0, 11);      // filter
ihdrData.writeUInt8(0, 12);      // interlace

const raw = Buffer.alloc(SIZE * (1 + SIZE * 3));
let offset = 0;
for (let y = 0; y < SIZE; y++) {
  raw[offset++] = 0; // filter type: None
  for (let x = 0; x < SIZE; x++) {
    const [r, g, bl] = pixels[y][x];
    raw[offset++] = r;
    raw[offset++] = g;
    raw[offset++] = bl;
  }
}

const idatData = deflateSync(raw);

const png = Buffer.concat([
  SIGNATURE,
  chunk('IHDR', ihdrData),
  chunk('IDAT', idatData),
  chunk('IEND', Buffer.alloc(0)),
]);

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, png);

console.log(`Wrote ${OUT_PATH} (${png.length} bytes, ${SIZE}x${SIZE})`);
