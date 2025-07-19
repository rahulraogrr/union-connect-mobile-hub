import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test/setup';
import { ErrorBoundary } from '../ErrorBoundary';
import { errorHelpers } from '../test/utils';

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error fallback when child component throws', () => {
    const consoleSpy = errorHelpers.mockConsoleError();
    const ErrorComponent = errorHelpers.triggerError();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('provides retry functionality', async () => {
    const consoleSpy = errorHelpers.mockConsoleError();
    let shouldThrow = true;
    
    const ConditionalErrorComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Success!</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalErrorComponent />
      </ErrorBoundary>
    );

    // Should show error
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Fix the error condition
    shouldThrow = false;

    // Click retry
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    // Rerender with fixed component
    rerender(
      <ErrorBoundary>
        <ConditionalErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('logs errors to error handler', () => {
    const consoleSpy = errorHelpers.mockConsoleError();
    const ErrorComponent = errorHelpers.triggerError();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('ErrorBoundary caught an error'),
      expect.any(Error),
      expect.any(Object)
    );
    
    consoleSpy.mockRestore();
  });

  it('handles custom fallback component', () => {
    const CustomFallback = ({ error }: { error: Error }) => (
      <div>Custom error: {error.message}</div>
    );

    const ErrorComponent = () => {
      throw new Error('Custom error message');
    };

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error: Custom error message')).toBeInTheDocument();
  });

  it('is accessible', () => {
    const consoleSpy = errorHelpers.mockConsoleError();
    const ErrorComponent = errorHelpers.triggerError();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveAttribute('aria-live', 'assertive');

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});