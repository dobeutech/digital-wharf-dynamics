import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      sans: ["Nunito", "Quicksand", "system-ui", "-apple-system", "sans-serif"],
      mono: ["JetBrains Mono", "Fira Code", "monospace"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6B5CE7",
          hover: "#4A3FA8",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E8E5FA",
          foreground: "#4A3FA8",
        },
        accent: {
          DEFAULT: "#F4A261",
          foreground: "#1A1A2E",
        },
        cream: "#FFF8F0",
        "dark-surface": "#1A1A2E",
        "dark-elevated": "#242440",
        destructive: {
          DEFAULT: "#E07A5F",
          foreground: "#FFFFFF",
        },
        success: "#4CAF50",
        muted: {
          DEFAULT: "#F5F5F7",
          foreground: "#6B7280",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "#6B5CE7",
          "primary-foreground": "#FFFFFF",
          accent: "#E8E5FA",
          "accent-foreground": "#4A3FA8",
          border: "#E0DFF5",
          ring: "#6B5CE7",
        },
        dobeu: {
          indigo: "#6B5CE7",
          deep: "#4A3FA8",
          amber: "#F4A261",
          cream: "#FFF8F0",
          dark: "#1A1A2E",
          gray: "#2D2D3A",
          "tint-indigo": "#E8E5FA",
          "tint-amber": "#FEF0E0",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 3s ease infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
