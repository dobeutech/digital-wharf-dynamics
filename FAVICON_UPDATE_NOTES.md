# Favicon Update Notes

## Completed Tasks

✅ **Updated icon.svg** - Replaced with DOBEU logo design featuring:

- Black rounded rectangle main body
- Yellow/Gold (#EAB308) bar on the left
- White dots for eyes
- White smile curve
- Proper viewBox and dimensions (512x512 with 40x40 viewBox)

✅ **Verified index.html** - Already correctly references:

- `/icon.svg` as primary icon
- `/favicon.ico` as alternate icon
- `/apple-touch-icon.png` for Apple devices

✅ **Verified manifest.json** - Already correctly configured with:

- icon.svg for scalable icon
- icon-192.png for 192x192 size
- icon-512.png for 512x512 size
- favicon.ico as fallback

## Pending Tasks

⚠️ **PNG Files Need Regeneration**

The following PNG files need to be regenerated from the new icon.svg:

1. **favicon.ico** (16x16, 32x32, 48x48 multi-resolution)
2. **icon-192.png** (192x192)
3. **icon-512.png** (512x512)
4. **apple-touch-icon.png** (180x180)

### How to Generate PNG Files

#### Option 1: Using Node.js (Recommended)

Install dependencies:

```bash
npm install sharp svg2img --save-dev
```

Create a script `scripts/generate-favicons.js`:

```javascript
const sharp = require("sharp");
const fs = require("fs");

const svgBuffer = fs.readFileSync("public/icon.svg");

// Generate PNG files
const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

sizes.forEach(({ name, size }) => {
  sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(`public/${name}`)
    .then(() => console.log(`Generated ${name}`))
    .catch((err) => console.error(`Error generating ${name}:`, err));
});

// Generate favicon.ico (requires additional library)
console.log("Note: favicon.ico requires manual conversion or use online tool");
```

Run:

```bash
node scripts/generate-favicons.js
```

#### Option 2: Using ImageMagick

```bash
# Install ImageMagick
sudo apt-get install imagemagick

# Generate PNGs
convert -background none public/icon.svg -resize 192x192 public/icon-192.png
convert -background none public/icon.svg -resize 512x512 public/icon-512.png
convert -background none public/icon.svg -resize 180x180 public/apple-touch-icon.png

# Generate favicon.ico (multi-resolution)
convert -background none public/icon.svg -define icon:auto-resize=16,32,48 public/favicon.ico
```

#### Option 3: Online Tools

Use these online converters:

- **SVG to PNG**: https://cloudconvert.com/svg-to-png
- **PNG to ICO**: https://www.icoconverter.com/
- **Favicon Generator**: https://realfavicongenerator.net/

Upload the icon.svg and download the generated files.

## Verification Checklist

After generating PNG files:

- [ ] Check icon-192.png displays correctly (192x192)
- [ ] Check icon-512.png displays correctly (512x512)
- [ ] Check apple-touch-icon.png displays correctly (180x180)
- [ ] Check favicon.ico displays in browser tab
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify PWA install icon looks correct
- [ ] Clear browser cache and test

## Current Status

- **icon.svg**: ✅ Updated with DOBEU logo
- **favicon.ico**: ⚠️ Needs regeneration (currently 362KB - likely old)
- **icon-192.png**: ⚠️ Needs regeneration
- **icon-512.png**: ⚠️ Needs regeneration
- **apple-touch-icon.png**: ⚠️ Needs regeneration

## Next Steps

1. Set up Node.js environment (currently not available)
2. Install image processing dependencies
3. Run favicon generation script
4. Verify all files are correct
5. Commit and deploy changes
