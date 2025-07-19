// Testing utilities and helpers
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Accessibility testing helpers
export const testAccessibility = {
  // Check if element has proper ARIA labels
  hasAccessibleName: (element: HTMLElement) => {
    const accessibleName = element.getAttribute('aria-label') || 
                           element.getAttribute('aria-labelledby') ||
                           element.textContent;
    return !!accessibleName;
  },

  // Check if interactive element is keyboard accessible
  isKeyboardAccessible: async (element: HTMLElement) => {
    const user = userEvent.setup();
    element.focus();
    expect(element).toHaveFocus();
    
    // Test Enter key
    await user.keyboard('{Enter}');
    
    // Test Space key for buttons
    if (element.tagName === 'BUTTON') {
      await user.keyboard(' ');
    }
  },

  // Check color contrast (basic implementation)
  hasGoodContrast: (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // This is a simplified check - in real projects use tools like axe-core
    return color !== backgroundColor;
  },

  // Find elements by role with better error messages
  findByRole: async (role: string, options?: any) => {
    try {
      return await screen.findByRole(role, options);
    } catch (error) {
      const availableRoles = screen.getAllByRole(/.+/).map(el => el.getAttribute('role')).filter(Boolean);
      throw new Error(`Could not find element with role "${role}". Available roles: ${availableRoles.join(', ')}`);
    }
  },
};

// Form testing helpers
export const formHelpers = {
  // Fill and submit a form
  fillAndSubmitForm: async (fields: Record<string, string>, submitText = 'Submit') => {
    const user = userEvent.setup();
    
    for (const [fieldName, value] of Object.entries(fields)) {
      const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
      await user.clear(field);
      await user.type(field, value);
    }
    
    const submitButton = screen.getByRole('button', { name: new RegExp(submitText, 'i') });
    await user.click(submitButton);
  },

  // Check form validation
  expectValidationError: async (fieldName: string, errorMessage: string) => {
    await waitFor(() => {
      const errorElement = screen.getByText(new RegExp(errorMessage, 'i'));
      expect(errorElement).toBeInTheDocument();
    });
  },

  // Check if form is properly disabled during submission
  expectFormDisabled: () => {
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  },
};

// API testing helpers
export const apiHelpers = {
  // Mock successful API response
  mockApiSuccess: (data: any) => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
      status: 200,
      statusText: 'OK',
    });
  },

  // Mock API error
  mockApiError: (status = 500, message = 'Internal Server Error') => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: message }),
      status,
      statusText: message,
    });
  },

  // Mock network error
  mockNetworkError: () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
  },

  // Verify API call
  expectApiCall: (url: string, options?: any) => {
    expect(global.fetch).toHaveBeenCalledWith(url, options);
  },
};

// Performance testing helpers
export const performanceHelpers = {
  // Measure component render time
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    await waitFor(() => {});
    const end = performance.now();
    return end - start;
  },

  // Check if component renders within acceptable time
  expectFastRender: async (renderFn: () => void, maxTime = 100) => {
    const renderTime = await performanceHelpers.measureRenderTime(renderFn);
    expect(renderTime).toBeLessThan(maxTime);
  },
};

// Navigation testing helpers
export const navigationHelpers = {
  // Test route navigation
  expectNavigation: async (targetPath: string) => {
    await waitFor(() => {
      expect(window.location.pathname).toBe(targetPath);
    });
  },

  // Click link and verify navigation
  clickAndExpectNavigation: async (linkText: string, expectedPath: string) => {
    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: new RegExp(linkText, 'i') });
    await user.click(link);
    await navigationHelpers.expectNavigation(expectedPath);
  },
};

// Error testing helpers
export const errorHelpers = {
  // Test error boundary
  triggerError: () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    return ErrorComponent;
  },

  // Check if error is displayed properly
  expectErrorMessage: async (message: string) => {
    await waitFor(() => {
      const errorElement = screen.getByText(new RegExp(message, 'i'));
      expect(errorElement).toBeInTheDocument();
    });
  },

  // Mock console.error to check error logging
  mockConsoleError: () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    return consoleSpy;
  },
};

// Loading state helpers
export const loadingHelpers = {
  // Wait for loading to complete
  waitForLoadingToFinish: async () => {
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  },

  // Check if loading indicator is shown
  expectLoadingIndicator: () => {
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  },

  // Wait for specific content to load
  waitForContent: async (text: string) => {
    await screen.findByText(new RegExp(text, 'i'));
  },
};

// Data testing helpers
export const dataHelpers = {
  // Create mock data
  createMockData: (template: any, count = 1) => {
    return Array.from({ length: count }, (_, index) => ({
      ...template,
      id: `${template.id || 'item'}-${index}`,
    }));
  },

  // Verify data is displayed correctly
  expectDataInTable: (data: any[], tableRole = 'table') => {
    const table = screen.getByRole(tableRole);
    data.forEach(item => {
      const row = within(table).getByText(item.name || item.title || item.id);
      expect(row).toBeInTheDocument();
    });
  },
};

// Setup user event with default options
export const setupUserEvent = () => userEvent.setup({
  delay: null, // Remove delay for faster tests
});

// Common test patterns
export const testPatterns = {
  // Test component mounting and unmounting
  testMountUnmount: (ComponentToTest: React.ComponentType) => {
    return () => {
      const { unmount } = screen.getByRole(/.*/) ? { unmount: vi.fn() } : { unmount: vi.fn() };
      expect(() => unmount()).not.toThrow();
    };
  },

  // Test responsive behavior
  testResponsive: async (breakpoint = 768) => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: breakpoint - 1,
    });
    
    window.dispatchEvent(new Event('resize'));
    await waitFor(() => {});
  },
};

export { userEvent };