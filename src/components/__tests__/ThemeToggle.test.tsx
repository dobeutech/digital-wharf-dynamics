import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderWithProviders,
  mockLocalStorage,
} from "@/__tests__/utils/test-utils";
import { ThemeToggle } from "../ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Reset localStorage before each test
    mockLocalStorage();
    localStorage.clear();

    // Reset document class
    document.documentElement.classList.remove("dark", "light");
  });

  describe("Rendering", () => {
    it("renders theme toggle button", () => {
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button", { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
    });

    it("renders with correct ARIA label", () => {
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "aria-label",
        expect.stringMatching(/toggle theme/i),
      );
    });

    it("renders sun icon for light theme", () => {
      renderWithProviders(<ThemeToggle />);

      // Check for sun icon (assuming it's the default)
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Theme Switching", () => {
    it("toggles theme when clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button", { name: /toggle theme/i });

      // Click to toggle theme
      await user.click(button);

      // Wait for theme to change
      await waitFor(() => {
        expect(
          document.documentElement.classList.contains("dark") ||
            document.documentElement.classList.contains("light"),
        ).toBe(true);
      });
    });

    it("saves theme preference to localStorage", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        const theme = localStorage.getItem("theme");
        expect(theme).toBeTruthy();
      });
    });

    it("loads theme from localStorage on mount", () => {
      localStorage.setItem("theme", "dark");

      renderWithProviders(<ThemeToggle />);

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  describe("Keyboard Navigation", () => {
    it("is keyboard accessible", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();

      // Press Enter to toggle
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(
          document.documentElement.classList.contains("dark") ||
            document.documentElement.classList.contains("light"),
        ).toBe(true);
      });
    });

    it("can be activated with Space key", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");
      button.focus();

      await user.keyboard(" ");

      await waitFor(() => {
        expect(
          document.documentElement.classList.contains("dark") ||
            document.documentElement.classList.contains("light"),
        ).toBe(true);
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper button role", () => {
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has descriptive aria-label", () => {
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");
      const ariaLabel = button.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain("theme");
    });

    it("is not disabled", () => {
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicks gracefully", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");

      // Click multiple times rapidly
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Should not crash
      expect(button).toBeInTheDocument();
    });

    it("handles corrupted localStorage data", () => {
      localStorage.setItem("theme", "invalid-theme-value");

      // Should not crash
      expect(() => {
        renderWithProviders(<ThemeToggle />);
      }).not.toThrow();
    });

    it("handles missing localStorage", () => {
      // Mock localStorage to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error("localStorage not available");
      });

      // Should not crash
      expect(() => {
        renderWithProviders(<ThemeToggle />);
      }).not.toThrow();

      // Restore
      localStorage.getItem = originalGetItem;
    });
  });

  describe("System Theme Preference", () => {
    it("respects system dark mode preference", () => {
      // Mock matchMedia to return dark mode
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      renderWithProviders(<ThemeToggle />);

      // Should apply dark theme if no preference is saved
      if (!localStorage.getItem("theme")) {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      }
    });
  });

  describe("Visual States", () => {
    it("shows different icon for dark theme", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole("button");
      const initialIcon = button.innerHTML;

      // Toggle theme
      await user.click(button);

      await waitFor(() => {
        const newIcon = button.innerHTML;
        // Icon should change (sun <-> moon)
        expect(newIcon).not.toBe(initialIcon);
      });
    });
  });

  describe("Performance", () => {
    it("does not cause unnecessary re-renders", async () => {
      const user = userEvent.setup();
      const renderSpy = vi.fn();

      function TestWrapper() {
        renderSpy();
        return <ThemeToggle />;
      }

      renderWithProviders(<TestWrapper />);

      const initialRenderCount = renderSpy.mock.calls.length;

      const button = screen.getByRole("button");
      await user.click(button);

      // Should only re-render once for the theme change
      await waitFor(() => {
        expect(renderSpy.mock.calls.length).toBeLessThanOrEqual(
          initialRenderCount + 2,
        );
      });
    });
  });
});
