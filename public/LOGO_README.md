# Company Logo

## Logo File Location

Place your company logo image file in this `public` folder with one of these names:

- `logo.png` (recommended - best quality)
- `logo.svg` (scalable vector format)
- `logo.webp` (modern format, smaller file size)
- `logo.jpg` or `logo.jpeg` (fallback option)

## Logo Specifications

The logo component will automatically try these formats in order. The logo should be:

- **Format**: PNG, SVG, WebP, or JPG
- **Background**: Transparent (PNG/SVG) or black background
- **Aspect Ratio**: Flexible (will maintain aspect ratio)
- **Recommended Size**: At least 240x60px or higher resolution for crisp display

## Current Logo

The current logo is a 3D stylized letter "D" with blue gradient effects on a black/transparent background.

## Usage

The logo is automatically used throughout the website via the `Logo` component located at:
`src/components/layout/Logo.tsx`

If the image file is not found, the component will fall back to an SVG text-based logo.
