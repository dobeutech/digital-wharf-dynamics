import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Also include process.env variables prefixed with VITE_
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY),
    },
    server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy":
        mode === "development"
          ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.mxpnl.com https://www.googletagmanager.com https://us.i.posthog.com https://assets.apollo.io https://embed.typeform.com https://js.intercomcdn.com https://widget.intercom.io; connect-src 'self' ws: wss: https://*.supabase.co https://cdn.mxpnl.com https://*.mixpanel.com https://*.posthog.com https://*.intercom.io https://*.apollo.io https://*.typeform.com wss://*.intercom.io https://api-iam.intercom.io https://www.google-analytics.com https://*.google-analytics.com; img-src 'self' data: https: blob: https://*.intercomassets.com https://static.intercomassets.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src 'self' https://*.intercom.io https://*.typeform.com;"
          : "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.mxpnl.com https://www.googletagmanager.com https://us.i.posthog.com https://assets.apollo.io https://embed.typeform.com https://js.intercomcdn.com https://widget.intercom.io; connect-src 'self' https://*.supabase.co https://cdn.mxpnl.com https://*.mixpanel.com https://*.posthog.com https://*.intercom.io https://*.apollo.io https://*.typeform.com wss://*.intercom.io https://api-iam.intercom.io https://www.google-analytics.com https://*.google-analytics.com; img-src 'self' data: https: blob: https://*.intercomassets.com https://static.intercomassets.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src 'self' https://*.intercom.io https://*.typeform.com;",
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: true,
        pure_funcs:
          mode === "production" ? ["console.log", "console.info"] : [],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
          ],
          form: ["react-hook-form", "@hookform/resolvers", "zod"],
          supabase: ["@supabase/supabase-js"],
          analytics: ["posthog-js"],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2/.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
  },
}));
