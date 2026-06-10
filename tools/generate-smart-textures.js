const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const outDir = path.resolve(__dirname, "..", "assets", "smart");
fs.mkdirSync(outDir, { recursive:true });

function hash(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0;
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function writePng(file, width, height, pixelFn) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a = 255] = pixelFn(x, y, width, height);
      const i = row + 1 + x * 4;
      raw[i] = clamp(r);
      raw[i + 1] = clamp(g);
      raw[i + 2] = clamp(b);
      raw[i + 3] = clamp(a);
    }
  }

  const chunks = [];
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
    return (c ^ 0xffffffff) >>> 0;
  }
  function chunk(type, data) {
    const name = Buffer.from(type);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([name, data])), 0);
    chunks.push(Buffer.concat([len, name, data, crc]));
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  chunk("IHDR", ihdr);
  chunk("IDAT", zlib.deflateSync(raw, { level:9 }));
  chunk("IEND", Buffer.alloc(0));
  fs.writeFileSync(path.join(outDir, file), Buffer.concat([signature, ...chunks]));
}

function stoneNoise(x, y, seed, scale = 1) {
  const n1 = hash(Math.floor(x / 5), Math.floor(y / 5), seed);
  const n2 = hash(Math.floor(x / 19), Math.floor(y / 19), seed + 17);
  const n3 = hash(x, y, seed + 31);
  return (n1 * 0.45 + n2 * 0.45 + n3 * 0.10 - 0.5) * scale;
}

writePng("stone_floor_light.png", 256, 256, (x, y) => {
  const slabW = 64;
  const slabH = 64;
  const seam = (x % slabW <= 1 || y % slabH <= 1) ? -28 : 0;
  const hairline = (x % slabW === 63 || y % slabH === 63) ? -12 : 0;
  const n = stoneNoise(x, y, 11, 50);
  const cx = (Math.sin((x + 13) / 21) + Math.cos((y - 7) / 27)) * 4;
  return [190 + n + seam + hairline + cx, 193 + n + seam + hairline + cx, 184 + n + seam + hairline + cx];
});

writePng("wall_stone_mass.png", 256, 256, (x, y) => {
  const joint = (x % 52 <= 1 || y % 38 <= 1) ? -28 : 0;
  const n = stoneNoise(x, y, 23, 64);
  const grain = Math.sin((x + y) / 9) * 6 + Math.cos((x - y) / 17) * 5;
  return [113 + n + grain + joint, 116 + n + grain + joint, 111 + n + grain + joint];
});

writePng("wall_edge_dark.png", 256, 256, (x, y) => {
  const n = stoneNoise(x, y, 37, 38);
  const scrape = hash(Math.floor(x / 9), Math.floor(y / 9), 41) > 0.88 ? 34 : 0;
  return [42 + n + scrape, 42 + n + scrape, 38 + n + scrape];
});

writePng("rubble_noise.png", 256, 256, (x, y) => {
  const speck = hash(x, y, 53);
  const dust = hash(Math.floor(x / 3), Math.floor(y / 3), 59);
  const a = speck > 0.965 ? 150 : dust > 0.88 ? 70 : 0;
  return [58, 56, 51, a];
});

writePng("shadow_soft.png", 256, 256, (x, y) => {
  const dx = x / 255;
  const dy = y / 255;
  const a = Math.max(0, 130 * (1 - Math.hypot(dx - 0.12, dy - 0.12) / 0.9));
  return [0, 0, 0, a];
});

writePng("crack_detail.png", 256, 256, (x, y) => {
  const lineA = Math.abs((y - 40) - Math.sin(x / 11) * 8 - x * 0.18) < 1.1;
  const lineB = Math.abs((y - 180) + Math.cos(x / 15) * 10 + x * 0.11) < 0.9;
  const small = hash(Math.floor(x / 16), Math.floor(y / 16), 71) > 0.93 && hash(x, y, 73) > 0.78;
  const a = lineA || lineB ? 92 : small ? 70 : 0;
  return [30, 28, 24, a];
});

console.log(`Generated smart texture atlas in ${outDir}`);
