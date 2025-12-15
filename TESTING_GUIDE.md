# Testing Guide

**Comprehensive guide to testing React components in Digital Wharf Dynamics**

---

## 📚 Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project uses **Vitest** and **React Testing Library** for unit and integration testing. All components should have comprehensive test coverage including:

- ✅ Happy path scenarios
- ✅ Error states
- ✅ Edge cases (null/undefined/empty)
- ✅ User interactions
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Loading states

---

## 🛠️ Testing Stack

| Tool | Purpose |
|------|---------|
| **Vitest** | Test runner and assertion library |
| **React Testing Library** | Component testing utilities |
| **@testing-library/user-event** | User interaction simulation |
| **@testing-library/jest-dom** | Custom matchers for DOM |
| **jsdom** | DOM implementation for Node.js |

---

## 📁 Test Structure

### File Organization

```
src/
├── components/
│   ├── ComponentName.tsx
│   └── __tests__/
│       └── ComponentName.test.tsx
├── pages/
│   ├── PageName.tsx
│   └── __tests__/
│       └── PageName.test.tsx
└── __tests__/
    └── utils/
        └── test-utils.tsx
```

### Test File Naming

- **Component tests:** `ComponentName.test.tsx`
- **Hook tests:** `useHookName.test.ts`
- **Utility tests:** `utilityName.test.ts`

---

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/__tests__/utils/test-utils';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders component', () => {
      renderWithProviders(<ComponentName />);
      expect(screen.getByRole('...')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ComponentName />);
      
      await user.click(screen.getByRole('button'));
      
      expect(/* assertion */).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderWithProviders(<ComponentName />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });
  });

  describe('Edge Cases', () => {
    it('handles null props', () => {
      expect(() => {
        renderWithProviders(<ComponentName prop={null} />);
      }).not.toThrow();
    });
  });
});
```

---

## 🧰 Test Utilities

### Custom Render Function

Use `renderWithProviders` to wrap components with all necessary providers:

```typescript
import { renderWithProviders } from '@/__tests__/utils/test-utils';

// Renders with Auth0, React Query, and Router
renderWithProviders(<MyComponent />);
```

### Mock Utilities

```typescript
import {
  createMockUser,
  createMockSupabaseClient,
  mockLocalStorage,
  mockMatchMedia,
  mockIntersectionObserver,
} from '@/__tests__/utils/test-utils';

// Mock user
const user = createMockUser({ name: 'Test User' });

// Mock Supabase
const supabase = createMockSupabaseClient();

// Mock localStorage
mockLocalStorage();
localStorage.setItem('key', 'value');

// Mock matchMedia
mockMatchMedia(true); // matches = true

// Mock IntersectionObserver
mockIntersectionObserver();
```

---

## 🎨 Common Patterns

### Testing Component Rendering

```typescript
describe('Rendering', () => {
  it('renders with default props', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('renders with all props', () => {
    renderWithProviders(
      <Button variant="primary" size="lg" disabled>
        Submit
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Submit');
  });

  it('applies custom className', () => {
    renderWithProviders(<Button className="custom">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });
});
```

### Testing User Interactions

```typescript
describe('User Interactions', () => {
  it('handles button clicks', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    renderWithProviders(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles form input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Input />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Button>Click</Button>);
    
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    
    await user.keyboard('{Enter}');
    // Assert action occurred
  });
});
```

### Testing Async Operations

```typescript
describe('Async Operations', () => {
  it('shows loading state', async () => {
    renderWithProviders(<AsyncComponent />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it('handles API success', async () => {
    const mockData = { id: 1, name: 'Test' };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });
    
    renderWithProviders(<DataComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<DataComponent />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Accessibility

```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels', () => {
    renderWithProviders(<Button>Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Submit');
  });

  it('has correct ARIA attributes', () => {
    renderWithProviders(<Dialog open>Content</Dialog>);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Menu />);
    
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem')).toHaveFocus();
  });

  it('has proper focus management', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Modal />);
    
    await user.click(screen.getByRole('button', { name: /open/i }));
    
    await waitFor(() => {
      const modal = screen.getByRole('dialog');
      expect(modal).toContainElement(document.activeElement);
    });
  });
});
```

### Testing Edge Cases

```typescript
describe('Edge Cases', () => {
  it('handles null props', () => {
    expect(() => {
      renderWithProviders(<Component data={null} />);
    }).not.toThrow();
  });

  it('handles undefined props', () => {
    expect(() => {
      renderWithProviders(<Component data={undefined} />);
    }).not.toThrow();
  });

  it('handles empty arrays', () => {
    renderWithProviders(<List items={[]} />);
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });

  it('handles empty strings', () => {
    renderWithProviders(<Input value="" />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('handles very long text', () => {
    const longText = 'A'.repeat(1000);
    renderWithProviders(<Text>{longText}</Text>);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('handles special characters', () => {
    const specialText = '<>&"\'';
    renderWithProviders(<Text>{specialText}</Text>);
    expect(screen.getByText(specialText)).toBeInTheDocument();
  });
});
```

### Testing Error States

```typescript
describe('Error States', () => {
  it('displays error message', () => {
    renderWithProviders(<Component error="Something went wrong" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('shows error boundary fallback', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    renderWithProviders(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });

  it('handles validation errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Form />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });
});
```

### Testing Loading States

```typescript
describe('Loading States', () => {
  it('shows loading spinner', () => {
    renderWithProviders(<Component loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('disables interactions while loading', () => {
    renderWithProviders(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows skeleton loader', () => {
    renderWithProviders(<DataList loading />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});
```

---

## ✅ Best Practices

### DO ✅

1. **Test user behavior, not implementation**
   ```typescript
   // ✅ Good
   await user.click(screen.getByRole('button', { name: /submit/i }));
   expect(screen.getByText(/success/i)).toBeInTheDocument();
   
   // ❌ Bad
   expect(component.state.submitted).toBe(true);
   ```

2. **Use accessible queries**
   ```typescript
   // ✅ Good - Accessible queries
   screen.getByRole('button')
   screen.getByLabelText('Email')
   screen.getByText('Submit')
   
   // ❌ Bad - Implementation details
   screen.getByClassName('btn')
   screen.getByTestId('submit-btn')
   ```

3. **Test from user's perspective**
   ```typescript
   // ✅ Good
   await user.type(screen.getByLabelText('Email'), 'test@example.com');
   
   // ❌ Bad
   fireEvent.change(input, { target: { value: 'test@example.com' } });
   ```

4. **Wait for async updates**
   ```typescript
   // ✅ Good
   await waitFor(() => {
     expect(screen.getByText('Loaded')).toBeInTheDocument();
   });
   
   // ❌ Bad
   expect(screen.getByText('Loaded')).toBeInTheDocument(); // May fail
   ```

5. **Clean up after tests**
   ```typescript
   afterEach(() => {
     vi.clearAllMocks();
     cleanup();
   });
   ```

### DON'T ❌

1. **Don't test implementation details**
2. **Don't use `act()` directly** (use userEvent instead)
3. **Don't query by class names or IDs**
4. **Don't test third-party libraries**
5. **Don't write brittle tests**

---

## 🏃 Running Tests

### Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:ci

# Run tests for specific file
npm run test -- ComponentName.test.tsx

# Run tests in UI mode
npm run test:ui

# Run E2E tests
npm run test:e2e
```

### Watch Mode

```bash
# Start watch mode
npm run test

# In watch mode:
# Press 'a' to run all tests
# Press 'f' to run only failed tests
# Press 'p' to filter by filename
# Press 't' to filter by test name
# Press 'q' to quit
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Cannot find module"

**Solution:** Check import paths and ensure file exists

```typescript
// ✅ Correct
import { Component } from '@/components/Component';

// ❌ Wrong
import { Component } from '../../../components/Component';
```

#### Issue: "Element not found"

**Solution:** Use `waitFor` for async elements

```typescript
// ✅ Correct
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ❌ Wrong
expect(screen.getByText('Loaded')).toBeInTheDocument();
```

#### Issue: "Unable to find accessible element"

**Solution:** Check ARIA roles and labels

```typescript
// ✅ Correct
screen.getByRole('button', { name: /submit/i })

// ❌ Wrong
screen.getByText('Submit') // May not be a button
```

#### Issue: "Act warnings"

**Solution:** Use `userEvent` instead of `fireEvent`

```typescript
// ✅ Correct
const user = userEvent.setup();
await user.click(button);

// ❌ Wrong
fireEvent.click(button);
```

#### Issue: "Tests timing out"

**Solution:** Increase timeout or check for infinite loops

```typescript
await waitFor(() => {
  expect(screen.getByText('Done')).toBeInTheDocument();
}, { timeout: 5000 }); // Increase timeout
```

---

## 📊 Coverage Goals

| Metric | Target |
|--------|--------|
| Statements | > 80% |
| Branches | > 75% |
| Functions | > 80% |
| Lines | > 80% |

### Check Coverage

```bash
npm run test:ci

# View coverage report
open coverage/index.html
```

---

## 📚 Additional Resources

### Documentation
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User Event](https://testing-library.com/docs/user-event/intro)

### Project Examples
- [ExampleForm.test.tsx](./src/components/forms/__tests__/ExampleForm.test.tsx)
- [ThemeToggle.test.tsx](./src/components/__tests__/ThemeToggle.test.tsx)
- [LoadingSpinner.test.tsx](./src/components/__tests__/LoadingSpinner.test.tsx)

### Test Utilities
- [test-utils.tsx](./src/__tests__/utils/test-utils.tsx)

---

## 🎓 Testing Checklist

Before submitting a PR with new components:

- [ ] Component renders without errors
- [ ] All props are tested
- [ ] User interactions work correctly
- [ ] Keyboard navigation is tested
- [ ] ARIA labels are verified
- [ ] Loading states are tested
- [ ] Error states are handled
- [ ] Edge cases are covered (null/undefined/empty)
- [ ] Async operations are tested
- [ ] Tests pass in CI
- [ ] Coverage meets targets (>80%)

---

**Last Updated:** 2025-12-15  
**Maintained By:** Engineering Team
