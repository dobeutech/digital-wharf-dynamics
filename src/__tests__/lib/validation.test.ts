import { describe, it, expect } from "vitest";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
  contactFormSchema,
  signUpSchema,
} from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("emailSchema", () => {
    it("should accept valid email addresses", () => {
      expect(() => emailSchema.parse("test@example.com")).not.toThrow();
      expect(() =>
        emailSchema.parse("user.name+tag@example.co.uk"),
      ).not.toThrow();
    });

    it("should reject invalid email addresses", () => {
      expect(() => emailSchema.parse("invalid")).toThrow();
      expect(() => emailSchema.parse("@example.com")).toThrow();
      expect(() => emailSchema.parse("test@")).toThrow();
    });

    it("should reject emails longer than 255 characters", () => {
      const longEmail = "a".repeat(250) + "@example.com";
      expect(() => emailSchema.parse(longEmail)).toThrow();
    });
  });

  describe("passwordSchema", () => {
    it("should accept valid passwords", () => {
      expect(() => passwordSchema.parse("Password123!")).not.toThrow();
      expect(() => passwordSchema.parse("MyP@ssw0rd")).not.toThrow();
    });

    it("should reject passwords without uppercase", () => {
      expect(() => passwordSchema.parse("password123!")).toThrow();
    });

    it("should reject passwords without lowercase", () => {
      expect(() => passwordSchema.parse("PASSWORD123!")).toThrow();
    });

    it("should reject passwords without numbers", () => {
      expect(() => passwordSchema.parse("Password!")).toThrow();
    });

    it("should reject passwords without special characters", () => {
      expect(() => passwordSchema.parse("Password123")).toThrow();
    });

    it("should reject passwords shorter than 8 characters", () => {
      expect(() => passwordSchema.parse("Pass1!")).toThrow();
    });
  });

  describe("usernameSchema", () => {
    it("should accept valid usernames", () => {
      expect(() => usernameSchema.parse("username")).not.toThrow();
      expect(() => usernameSchema.parse("user_name")).not.toThrow();
      expect(() => usernameSchema.parse("user-name")).not.toThrow();
      expect(() => usernameSchema.parse("user123")).not.toThrow();
    });

    it("should reject usernames with spaces", () => {
      expect(() => usernameSchema.parse("user name")).toThrow();
    });

    it("should reject usernames with special characters", () => {
      expect(() => usernameSchema.parse("user@name")).toThrow();
      expect(() => usernameSchema.parse("user.name")).toThrow();
    });

    it("should reject usernames shorter than 3 characters", () => {
      expect(() => usernameSchema.parse("ab")).toThrow();
    });
  });

  describe("contactFormSchema", () => {
    it("should accept valid contact form data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        message: "This is a test message with enough characters",
      };
      expect(() => contactFormSchema.parse(validData)).not.toThrow();
    });

    it("should reject messages shorter than 10 characters", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Short",
      };
      expect(() => contactFormSchema.parse(invalidData)).toThrow();
    });
  });

  describe("signUpSchema", () => {
    it("should accept valid sign up data", () => {
      const validData = {
        email: "user@example.com",
        password: "Password123!",
        username: "username",
      };
      expect(() => signUpSchema.parse(validData)).not.toThrow();
    });
  });
});
