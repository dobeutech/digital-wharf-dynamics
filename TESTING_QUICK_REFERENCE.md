# Testing Quick Reference

**Quick reference for writing tests in Digital Wharf Dynamics**

---

## 🚀 Quick Start

### Create Test File

```bash
# Create test file next to component
touch src/components/__tests__/ComponentName.test.tsx
```

### Basic Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/__tests__/utils/test-utils';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('renders component', () => {
    renderWithProviders(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
});
```

---

## 🔍 Common Queries

```typescript
// By Role (Preferred)
screen.getByRole('button')
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })

// By Label
screen.getByLabelText('Email')
screen.getByLabelText(/password/i)

// By Text
screen.getByText('Submit')
screen.getByText(/loading/i)

// By Placeholder
screen.getByPlaceholderText('Enter email')

// Query variants
screen.getBy...()      // Throws if not found
screen.queryBy...()    // Returns null if not found
screen.findBy...()     // Async, waits for element
```

---

## 👆 User Interactions

```typescript
const user = userEvent.setup();

// Click
await user.click(button);

// Type
await user.type(input, 'Hello World');

// Clear and type
await user.clear(input);
await user.type(input, 'New text');

// Keyboard
await user.keyboard('{Enter}');
await user.keyboard('{Escape}');
await user.keyboard('{ArrowDown}');

// Tab navigation
await user.tab();
await user.tab({ shift: true }); // Shift+Tab

// Select
await user.selectOptions(select, 'option1');

// Checkbox/Radio
await user.click(checkbox);
```

---

## ⏳ Async Testing

```typescript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();
});

// Find (async query)
const element = await screen.findByText('Loaded');

// Custom timeout
await waitFor(() => {
  expect(screen.getByText('Done')).toBeInTheDocument();
}, { timeout: 5000 });
```

---

## ✅ Assertions

```typescript
// Existence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Text content
expect(element).toHaveTextContent('Hello');
expect(element).toHaveTextContent(/hello/i);

// Attributes
expect(element).toHaveAttribute('href', '/home');
expect(element).toHaveClass('active');

// Form elements
expect(input).toHaveValue('test');
expect(checkbox).toBeChecked();
expect(button).toBeDisabled();

// Accessibility
expect(button).toHaveAccessibleName('Submit');
expect(button).toHaveAccessibleDescription('Submit form');

// Focus
expect(element).toHaveFocus();
```

---

## 🎭 Mocking

```typescript
// Mock function
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
mockFn.mockRejectedValue(new Error('error'));

// Mock module
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock implementation
vi.mocked(api.get).mockResolvedValue({ data: [] });

// Mock Supabase
const supabase = createMockSupabaseClient();

// Mock localStorage
mockLocalStorage();
localStorage.setItem('key', 'value');

// Mock matchMedia
mockMatchMedia(true);
```

---

## 🧪 Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      // Test
    });
  });

  describe('User Interactions', () => {
    it('handles clicks', async () => {
      // Test
    });
  });

  describe('Accessibility', () => {
    it('has ARIA labels', () => {
      // Test
    });
  });

  describe('Edge Cases', () => {
    it('handles null props', () => {
      // Test
    });
  });
});
```

---

## ♿ Accessibility Testing

```typescript
// Check role
expect(screen.getByRole('button')).toBeInTheDocument();

// Check accessible name
expect(button).toHaveAccessibleName('Submit');

// Check ARIA attributes
expect(dialog).toHaveAttribute('aria-modal', 'true');
expect(button).toHaveAttribute('aria-label', 'Close');

// Check keyboard navigation
await user.tab();
expect(button).toHaveFocus();

await user.keyboard('{Enter}');
// Assert action occurred
```

---

## 🎯 Common Patterns

### Test Button Click

```typescript
it('handles button click', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  
  renderWithProviders(<Button onClick={onClick}>Click</Button>);
  
  await user.click(screen.getByRole('button'));
  
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### Test Form Input

```typescript
it('handles form input', async () => {
  const user = userEvent.setup();
  renderWithProviders(<Input />);
  
  const input = screen.getByRole('textbox');
  await user.type(input, 'test@example.com');
  
  expect(input).toHaveValue('test@example.com');
});
```

### Test Loading State

```typescript
it('shows loading state', async () => {
  renderWithProviders(<Component />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
```

### Test Error State

```typescript
it('shows error message', async () => {
  vi.mocked(api.get).mockRejectedValue(new Error('API Error'));
  
  renderWithProviders(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Test Conditional Rendering

```typescript
it('shows content when condition is true', () => {
  renderWithProviders(<Component show={true} />);
  expect(screen.getByText('Content')).toBeInTheDocument();
});

it('hides content when condition is false', () => {
  renderWithProviders(<Component show={false} />);
  expect(screen.queryByText('Content')).not.toBeInTheDocument();
});
```

---

## 🏃 Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch

# Run specific file
npm run test ComponentName.test.tsx

# Run with coverage
npm run test:ci

# UI mode
npm run test:ui
```

---

## 🐛 Debugging

```typescript
// Print DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Log queries
screen.logTestingPlaygroundURL();

// Check what's rendered
console.log(container.innerHTML);
```

---

## ✅ Checklist

Before submitting PR:

- [ ] Component renders without errors
- [ ] All props are tested
- [ ] User interactions work
- [ ] Keyboard navigation tested
- [ ] ARIA labels verified
- [ ] Loading states tested
- [ ] Error states handled
- [ ] Edge cases covered
- [ ] Tests pass locally
- [ ] Coverage meets target (>80%)

---

## 📚 Resources

- [Full Testing Guide](./TESTING_GUIDE.md)
- [Test Utilities](./src/__tests__/utils/test-utils.tsx)
- [Example Tests](./src/components/__tests__/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/react)

---

**Keep this handy while writing tests!**
