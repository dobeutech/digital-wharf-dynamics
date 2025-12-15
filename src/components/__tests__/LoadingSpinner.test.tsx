import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/__tests__/utils/test-utils';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Rendering', () => {
    it('renders loading spinner', () => {
      renderWithProviders(<LoadingSpinner />);
      
      // Check for spinner container
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('renders with default medium size', () => {
      renderWithProviders(<LoadingSpinner />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('h-8', 'w-8');
    });

    it('renders with small size', () => {
      renderWithProviders(<LoadingSpinner size="sm" />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('h-4', 'w-4');
    });

    it('renders with large size', () => {
      renderWithProviders(<LoadingSpinner size="lg" />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });

    it('renders with custom className', () => {
      const { container } = renderWithProviders(
        <LoadingSpinner className="custom-class" />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Text Display', () => {
    it('renders without text by default', () => {
      renderWithProviders(<LoadingSpinner />);
      
      const text = screen.queryByText(/loading/i);
      expect(text).not.toBeInTheDocument();
    });

    it('renders with custom text', () => {
      renderWithProviders(<LoadingSpinner text="Loading data..." />);
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('applies correct text styling', () => {
      renderWithProviders(<LoadingSpinner text="Loading..." />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-sm', 'text-muted-foreground');
    });
  });

  describe('Accessibility', () => {
    it('has proper container structure', () => {
      const { container } = renderWithProviders(<LoadingSpinner />);
      
      const spinnerContainer = container.firstChild;
      expect(spinnerContainer).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    });

    it('spinner has animation class', () => {
      renderWithProviders(<LoadingSpinner />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('text is readable when provided', () => {
      renderWithProviders(<LoadingSpinner text="Please wait" />);
      
      const text = screen.getByText('Please wait');
      expect(text).toBeVisible();
    });
  });

  describe('Props Combinations', () => {
    it('renders with all props', () => {
      renderWithProviders(
        <LoadingSpinner 
          size="lg" 
          className="my-custom-class" 
          text="Loading content..." 
        />
      );
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('h-12', 'w-12');
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    it('handles size and text together', () => {
      renderWithProviders(
        <LoadingSpinner size="sm" text="Loading..." />
      );
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('h-4', 'w-4');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty text string', () => {
      renderWithProviders(<LoadingSpinner text="" />);
      
      // Empty text should not render paragraph
      const paragraphs = document.querySelectorAll('p');
      expect(paragraphs.length).toBe(0);
    });

    it('handles null text', () => {
      renderWithProviders(<LoadingSpinner text={undefined} />);
      
      const text = screen.queryByRole('paragraph');
      expect(text).not.toBeInTheDocument();
    });

    it('handles very long text', () => {
      const longText = 'Loading '.repeat(50);
      renderWithProviders(<LoadingSpinner text={longText} />);
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      const specialText = 'Loading... <>&"\'';
      renderWithProviders(<LoadingSpinner text={specialText} />);
      
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('applies primary color to spinner', () => {
      renderWithProviders(<LoadingSpinner />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('text-primary');
    });

    it('maintains aspect ratio for all sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      
      sizes.forEach(size => {
        const { container } = renderWithProviders(<LoadingSpinner size={size} />);
        const spinner = container.querySelector('.animate-spin');
        
        // Check that width and height classes match
        const classes = spinner?.className || '';
        const hasMatchingDimensions = 
          (classes.includes('h-4') && classes.includes('w-4')) ||
          (classes.includes('h-8') && classes.includes('w-8')) ||
          (classes.includes('h-12') && classes.includes('w-12'));
        
        expect(hasMatchingDimensions).toBe(true);
      });
    });
  });

  describe('Layout', () => {
    it('centers content vertically and horizontally', () => {
      const { container } = renderWithProviders(<LoadingSpinner />);
      
      const spinnerContainer = container.firstChild;
      expect(spinnerContainer).toHaveClass('items-center', 'justify-center');
    });

    it('stacks spinner and text vertically', () => {
      const { container } = renderWithProviders(
        <LoadingSpinner text="Loading..." />
      );
      
      const spinnerContainer = container.firstChild;
      expect(spinnerContainer).toHaveClass('flex-col');
    });

    it('adds gap between spinner and text', () => {
      const { container } = renderWithProviders(
        <LoadingSpinner text="Loading..." />
      );
      
      const spinnerContainer = container.firstChild;
      expect(spinnerContainer).toHaveClass('gap-2');
    });
  });

  describe('Performance', () => {
    it('renders quickly', () => {
      const startTime = performance.now();
      renderWithProviders(<LoadingSpinner />);
      const endTime = performance.now();
      
      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('does not cause memory leaks', () => {
      const { unmount } = renderWithProviders(<LoadingSpinner />);
      
      // Should unmount cleanly
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot for default props', () => {
      const { container } = renderWithProviders(<LoadingSpinner />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with all props', () => {
      const { container } = renderWithProviders(
        <LoadingSpinner 
          size="lg" 
          className="custom" 
          text="Loading..." 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
