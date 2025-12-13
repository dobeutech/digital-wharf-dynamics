import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy": mode === "development" 
        ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.mxpnl.com https://www.googletagmanager.com https://us.i.posthog.com; connect-src 'self' https://*.supabase.co https://cdn.mxpnl.com https://*.posthog.com https://*.intercom.io wss://*.intercom.io; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src 'self' https://*.intercom.io;"
        : "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.mxpnl.com https://www.googletagmanager.com https://us.i.posthog.com; connect-src 'self' https://*.supabase.co https://cdn.mxpnl.com https://*.posthog.com https://*.intercom.io wss://*.intercom.io; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src 'self' https://*.intercom.io;",
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'supabase': ['@supabase/supabase-js'],
          'analytics': ['posthog-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
