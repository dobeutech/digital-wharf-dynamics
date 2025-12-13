/**
 * Centralized validation schemas using Zod
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address').max(255, 'Email too long');

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Username validation schema
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username too long')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

/**
 * Phone number validation schema (US format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/, 'Invalid phone number format')
  .max(20, 'Phone number too long')
  .optional()
  .or(z.literal(''));

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: emailSchema,
  phone: phoneSchema,
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message too long'),
  smsConsent: z.boolean().optional(),
  marketingConsent: z.boolean().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * CCPA request validation schema
 */
export const ccpaRequestSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().max(500, 'Address too long').optional().or(z.literal('')),
  requestTypes: z
    .array(z.enum(['opt-out', 'delete', 'access', 'correction']))
    .min(1, 'At least one request type must be selected'),
  additionalInfo: z.string().max(1000, 'Additional information too long').optional().or(z.literal('')),
  confirmIdentity: z.boolean().refine((val) => val === true, {
    message: 'You must confirm your identity',
  }),
});

export type CCPARequestData = z.infer<typeof ccpaRequestSchema>;

/**
 * Sign up validation schema
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export type SignUpData = z.infer<typeof signUpSchema>;

/**
 * Sign in validation schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type SignInData = z.infer<typeof signInSchema>;

/**
 * Project validation schema
 */
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold']),
  start_date: z.string().datetime().optional().nullable(),
  end_date: z.string().datetime().optional().nullable(),
  progress_percentage: z.number().min(0).max(100).optional(),
});

export type ProjectData = z.infer<typeof projectSchema>;

/**
 * Generic string sanitization
 */
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  // In production, use DOMPurify
  if (typeof window !== 'undefined' && window.DOMPurify) {
    return window.DOMPurify.sanitize(html);
  }
  // Fallback basic sanitization
  return sanitizeString(html);
}

