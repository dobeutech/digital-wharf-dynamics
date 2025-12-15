import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExampleForm } from "../ExampleForm";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ExampleForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all form fields", () => {
      render(<ExampleForm />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/agree to the terms/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/subscribe to newsletter/i),
      ).toBeInTheDocument();
    });

    it("renders submit and reset buttons", () => {
      render(<ExampleForm />);

      expect(
        screen.getByRole("button", { name: /submit/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset/i }),
      ).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<ExampleForm className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Validation", () => {
    it("shows error when name is too short", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "A");
      await user.tab(); // Trigger blur validation

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i),
        ).toBeInTheDocument();
      });
    });

    it("shows error for invalid email", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email address/i),
        ).toBeInTheDocument();
      });
    });

    it("shows error when age is below minimum", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      const ageInput = screen.getByLabelText(/age/i);
      await user.clear(ageInput);
      await user.type(ageInput, "17");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/you must be at least 18 years old/i),
        ).toBeInTheDocument();
      });
    });

    it("shows error when message is too short", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, "Short");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/message must be at least 10 characters/i),
        ).toBeInTheDocument();
      });
    });

    it("shows error when terms are not agreed", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      // Fill all required fields
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "This is a test message",
      );

      // Select category
      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const generalOption = await screen.findByRole("option", {
        name: /general inquiry/i,
      });
      await user.click(generalOption);

      // Submit without agreeing to terms
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/you must agree to the terms and conditions/i),
        ).toBeInTheDocument();
      });
    });

    it("shows error when category is not selected", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      // Try to submit without selecting category
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/please select a category/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      render(<ExampleForm onSuccess={onSuccess} />);

      // Fill all required fields
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "This is a test message with enough characters",
      );

      // Select category
      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const generalOption = await screen.findByRole("option", {
        name: /general inquiry/i,
      });
      await user.click(generalOption);

      // Agree to terms
      const termsCheckbox = screen.getByLabelText(/agree to the terms/i);
      await user.click(termsCheckbox);

      // Submit form
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      // Wait for submission
      await waitFor(
        () => {
          expect(onSuccess).toHaveBeenCalledWith(
            expect.objectContaining({
              name: "John Doe",
              email: "john@example.com",
              message: "This is a test message with enough characters",
              category: "general",
              agreeToTerms: true,
            }),
          );
        },
        { timeout: 3000 },
      );
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      // Fill required fields
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Test message here");

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const generalOption = await screen.findByRole("option", {
        name: /general inquiry/i,
      });
      await user.click(generalOption);

      await user.click(screen.getByLabelText(/agree to the terms/i));

      // Submit
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it("resets form after successful submission", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

      // Fill and submit
      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Test message here");

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const generalOption = await screen.findByRole("option", {
        name: /general inquiry/i,
      });
      await user.click(generalOption);

      await user.click(screen.getByLabelText(/agree to the terms/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      // Wait for form to reset
      await waitFor(
        () => {
          expect(nameInput.value).toBe("");
          expect(emailInput.value).toBe("");
        },
        { timeout: 3000 },
      );
    });

    it("calls onError callback on submission failure", async () => {
      const user = userEvent.setup();
      const onError = vi.fn();

      // Mock Math.random to force error
      const originalRandom = Math.random;
      Math.random = () => 0.05; // Will trigger error in onSubmit

      render(<ExampleForm onError={onError} />);

      // Fill and submit
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Test message here");

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const generalOption = await screen.findByRole("option", {
        name: /general inquiry/i,
      });
      await user.click(generalOption);

      await user.click(screen.getByLabelText(/agree to the terms/i));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(
        () => {
          expect(onError).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );

      // Restore Math.random
      Math.random = originalRandom;
    });
  });

  describe("Reset Functionality", () => {
    it("resets form when reset button is clicked", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

      // Fill form
      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");

      expect(nameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");

      // Click reset
      const resetButton = screen.getByRole("button", { name: /reset/i });
      await user.click(resetButton);

      // Check form is reset
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", () => {
      render(<ExampleForm />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute("aria-invalid", "false");
    });

    it("marks invalid fields with aria-invalid", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "A");
      await user.tab();

      await waitFor(() => {
        expect(nameInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("associates error messages with fields", async () => {
      const user = userEvent.setup();
      render(<ExampleForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "A");
      await user.tab();

      await waitFor(() => {
        const errorMessage = screen.getByText(
          /name must be at least 2 characters/i,
        );
        expect(errorMessage).toBeInTheDocument();
        expect(nameInput).toHaveAttribute(
          "aria-describedby",
          expect.stringContaining("message"),
        );
      });
    });
  });

  describe("Optional Fields", () => {
    it("allows submission without newsletter checkbox", async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      render(<ExampleForm onSuccess={onSuccess} />);

      // Fill required fields only
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Test message here");

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const generalOption = await screen.findByRole("option", {
        name: /general inquiry/i,
      });
      await user.click(generalOption);

      await user.click(screen.getByLabelText(/agree to the terms/i));

      // Don't check newsletter
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(onSuccess).toHaveBeenCalledWith(
            expect.objectContaining({
              newsletter: false,
            }),
          );
        },
        { timeout: 3000 },
      );
    });

    it("includes newsletter value when checked", async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      render(<ExampleForm onSuccess={onSuccess} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Test message here");

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const generalOption = await screen.findByRole("option", {
        name: /general inquiry/i,
      });
      await user.click(generalOption);

      await user.click(screen.getByLabelText(/agree to the terms/i));

      // Check newsletter
      await user.click(screen.getByLabelText(/subscribe to newsletter/i));

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(
        () => {
          expect(onSuccess).toHaveBeenCalledWith(
            expect.objectContaining({
              newsletter: true,
            }),
          );
        },
        { timeout: 3000 },
      );
    });
  });
});
