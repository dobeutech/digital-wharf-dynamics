const LOGO_OVERLAP_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="42" cy="50" r="35" fill="#6B5CE7"/><circle cx="58" cy="50" r="35" fill="#4A3FA8"/><ellipse cx="50" cy="50" rx="19" ry="19" fill="#F4A261"/></svg>`;

const svgToDataUri = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;

export const BRAND_ASSETS = {
  logo: {
    primary: svgToDataUri(LOGO_OVERLAP_SVG),
    reverse: svgToDataUri(LOGO_OVERLAP_SVG),
  },
};
