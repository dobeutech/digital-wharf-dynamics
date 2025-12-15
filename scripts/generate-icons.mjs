import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = process.cwd();
const publicDir = path.join(root, "public");

const svgPath = path.join(publicDir, "icon.svg");
const svg = await fs.readFile(svgPath);

// favicon.ico (multi-size)
const icoSizes = [16, 32, 48, 64, 128, 256];
const icoPngs = await Promise.all(
  icoSizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

const ico = await pngToIco(icoPngs);
await fs.writeFile(path.join(publicDir, "favicon.ico"), ico);

// PWA + iOS icons
await sharp(svg)
  .resize(192, 192)
  .png()
  .toFile(path.join(publicDir, "icon-192.png"));
await sharp(svg)
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, "icon-512.png"));
await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, "apple-touch-icon.png"));

console.log(
  "Generated favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png",
);
