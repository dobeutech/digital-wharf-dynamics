#!/usr/bin/env node

/**
 * Generate sitemap.xml for SEO
 */

const fs = require("fs");
const path = require("path");

const DOMAIN = "https://dobeu.net";
const OUTPUT_PATH = path.join(__dirname, "../public/sitemap.xml");

// Define all public routes with their priorities and change frequencies
const routes = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/services", priority: 0.9, changefreq: "weekly" },
  { path: "/pricing", priority: 0.9, changefreq: "weekly" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/contact", priority: 0.8, changefreq: "monthly" },
  { path: "/schedule", priority: 0.7, changefreq: "monthly" },
  { path: "/news", priority: 0.7, changefreq: "daily" },
  { path: "/privacy", priority: 0.5, changefreq: "yearly" },
  { path: "/privacy/sms", priority: 0.5, changefreq: "yearly" },
  { path: "/terms", priority: 0.5, changefreq: "yearly" },
  { path: "/ccpa-optout", priority: 0.5, changefreq: "yearly" },
];

function generateSitemap() {
  const lastmod = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach((route) => {
    xml += "  <url>\n";
    xml += `    <loc>${DOMAIN}${route.path}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += "  </url>\n";
  });

  xml += "</urlset>";

  fs.writeFileSync(OUTPUT_PATH, xml, "utf8");
  console.log(`✓ Sitemap generated: ${OUTPUT_PATH}`);
  console.log(`  ${routes.length} URLs included`);
}

// Ensure public directory exists
const publicDir = path.join(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

generateSitemap();
