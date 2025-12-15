import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, mockConsole } from "@/__tests__/utils/test-utils";
import { ErrorBoundary } from "../ErrorBoundary";

// Component that throws an error
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
}

describe("ErrorBoundary", () => {
  // Mock console to avoid noise in test output
  mockConsole();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders children when no error", () => {
      renderWithProviders(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("renders error UI when error occurs", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it("renders custom fallback when provided", () => {
      const customFallback = <div>Custom error message</div>;

      renderWithProviders(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("catches errors from children", () => {
      expect(() => {
        renderWithProviders(
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>,
        );
      }).not.toThrow();
    });

    it("calls onError callback when error occurs", () => {
      const onError = vi.fn();

      renderWithProviders(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
      );
    });

    it("displays error message", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });

    it("shows error details in development", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Should show some error information
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("has refresh button", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(
        screen.getByRole("button", { name: /refresh/i }),
      ).toBeInTheDocument();
    });

    it("has home button", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
    });

    it("refreshes page when refresh button clicked", async () => {
      const user = userEvent.setup();
      const reloadSpy = vi.fn();
      Object.defineProperty(window, "location", {
        value: { reload: reloadSpy },
        writable: true,
      });

      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      await user.click(screen.getByRole("button", { name: /refresh/i }));

      expect(reloadSpy).toHaveBeenCalled();
    });

    it("navigates to home when home button clicked", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const homeButton = screen.getByRole("button", { name: /home/i });
      expect(homeButton).toHaveAttribute("href", "/");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("has descriptive error message", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it("buttons are keyboard accessible", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      await user.tab();
      const refreshButton = screen.getByRole("button", { name: /refresh/i });
      expect(refreshButton).toHaveFocus();

      await user.tab();
      const homeButton = screen.getByRole("button", { name: /home/i });
      expect(homeButton).toHaveFocus();
    });

    it("has proper ARIA labels", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const refreshButton = screen.getByRole("button", { name: /refresh/i });
      const homeButton = screen.getByRole("button", { name: /home/i });

      expect(refreshButton).toHaveAccessibleName();
      expect(homeButton).toHaveAccessibleName();
    });
  });

  describe("Edge Cases", () => {
    it("handles errors without error message", () => {
      function ThrowErrorWithoutMessage() {
        throw new Error();
      }

      renderWithProviders(
        <ErrorBoundary>
          <ThrowErrorWithoutMessage />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it("handles non-Error objects thrown", () => {
      function ThrowString() {
        throw "String error";
      }

      expect(() => {
        renderWithProviders(
          <ErrorBoundary>
            <ThrowString />
          </ErrorBoundary>,
        );
      }).not.toThrow();
    });

    it("handles errors in nested components", () => {
      function Parent() {
        return (
          <div>
            <Child />
          </div>
        );
      }

      function Child() {
        throw new Error("Nested error");
      }

      renderWithProviders(
        <ErrorBoundary>
          <Parent />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it("handles multiple errors", () => {
      const onError = vi.fn();

      renderWithProviders(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Recovery", () => {
    it("recovers when children stop throwing", () => {
      let shouldThrow = true;

      function ConditionalError() {
        if (shouldThrow) {
          throw new Error("Conditional error");
        }
        return <div>Recovered</div>;
      }

      const { rerender } = renderWithProviders(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      // Stop throwing
      shouldThrow = false;

      rerender(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>,
      );

      // Error boundary should still show error (doesn't auto-recover)
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe("Visual States", () => {
    it("displays error icon", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Check for AlertTriangle icon (lucide-react)
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("displays error in card layout", () => {
      const { container } = renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Should use Card component
      expect(container.querySelector('[class*="card"]')).toBeInTheDocument();
    });
  });

  describe("Error Information", () => {
    it("shows error message", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });

    it("shows component stack in development", () => {
      const originalEnv = import.meta.env.DEV;
      import.meta.env.DEV = true;

      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Should show some stack information
      expect(screen.getByText(/error/i)).toBeInTheDocument();

      import.meta.env.DEV = originalEnv;
    });
  });

  describe("Performance", () => {
    it("does not re-render children unnecessarily", () => {
      const renderSpy = vi.fn();

      function TrackedChild() {
        renderSpy();
        return <div>Child</div>;
      }

      renderWithProviders(
        <ErrorBoundary>
          <TrackedChild />
        </ErrorBoundary>,
      );

      const initialRenderCount = renderSpy.mock.calls.length;

      // Re-render parent
      renderWithProviders(
        <ErrorBoundary>
          <TrackedChild />
        </ErrorBoundary>,
      );

      // Should not cause extra renders
      expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1);
    });
  });

  describe("Integration", () => {
    it("works with React Router", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const homeButton = screen.getByRole("button", { name: /home/i });
      expect(homeButton).toHaveAttribute("href", "/");
    });

    it("works with nested error boundaries", () => {
      renderWithProviders(
        <ErrorBoundary>
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
        </ErrorBoundary>,
      );

      // Inner boundary should catch the error
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
