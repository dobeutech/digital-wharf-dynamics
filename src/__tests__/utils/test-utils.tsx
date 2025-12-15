/**
 * Test Utilities
 * 
 * Reusable utilities for testing React components with all necessary providers.
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth0Provider } from '@auth0/auth0-react';

/**
 * Create a new QueryClient for each test to ensure isolation
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Mock Auth0 configuration
 */
const mockAuth0Config = {
  domain: 'test.auth0.com',
  clientId: 'test-client-id',
  authorizationParams: {
    redirect_uri: 'http://localhost:3000',
  },
};

/**
 * All Providers Wrapper
 * Wraps components with all necessary providers for testing
 */
interface AllProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function AllProviders({ children, queryClient }: AllProvidersProps) {
  const client = queryClient || createTestQueryClient();

  return (
    <Auth0Provider {...mockAuth0Config}>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Auth0Provider>
  );
}

/**
 * Custom render function that includes all providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders queryClient={queryClient}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

/**
 * Wait for loading states to complete
 */
export async function waitForLoadingToFinish() {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(() => {
    expect(document.querySelector('[data-loading="true"]')).not.toBeInTheDocument();
  }, { timeout: 3000 });
}

/**
 * Mock window.matchMedia for responsive tests
 */
export function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Mock IntersectionObserver for lazy loading tests
 */
export function mockIntersectionObserver() {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  return localStorageMock;
}

/**
 * Create mock user for Auth0
 */
export function createMockUser(overrides = {}) {
  return {
    sub: 'auth0|123456',
    name: 'Test User',
    email: 'test@example.com',
    email_verified: true,
    picture: 'https://example.com/avatar.jpg',
    updated_at: '2023-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/**
 * Mock Supabase client
 */
export function createMockSupabaseClient() {
  return {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          data: [],
          error: null,
        })),
        data: [],
        error: null,
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signIn: vi.fn(() => Promise.resolve({ data: null, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ data: null, error: null })),
        download: vi.fn(() => Promise.resolve({ data: null, error: null })),
        remove: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    },
  };
}

/**
 * Wait for async updates
 */
export async function waitForAsync() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Create mock API response
 */
export function createMockApiResponse<T>(data: T, success = true) {
  return {
    success,
    data,
    error: success ? null : 'Mock error',
  };
}

/**
 * Mock console methods to avoid noise in tests
 */
export function mockConsole() {
  const originalConsole = { ...console };
  
  beforeAll(() => {
    console.error = vi.fn();
    console.warn = vi.fn();
  });

  afterAll(() => {
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
  });

  return {
    error: console.error as ReturnType<typeof vi.fn>,
    warn: console.warn as ReturnType<typeof vi.fn>,
  };
}

// Re-export everything from Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
