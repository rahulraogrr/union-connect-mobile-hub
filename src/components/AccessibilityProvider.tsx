import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'normal' | 'large';
  keyboardNavigation: boolean;
  screenReaderMode: boolean;
  focusManagement: boolean;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleKeyboardNavigation: () => void;
  toggleScreenReaderMode: () => void;
  toggleFocusManagement: () => void;
  setFontSize: (size: 'small' | 'normal' | 'large') => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  manageFocus: (element: HTMLElement | null) => void;
  trapFocus: (container: HTMLElement) => () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('accessibility-high-contrast');
    return saved === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem('accessibility-reduced-motion');
    const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return saved === 'true' || systemPreference;
  });

  const [fontSize, setFontSizeState] = useState<'small' | 'normal' | 'large'>(() => {
    const saved = localStorage.getItem('accessibility-font-size') as 'small' | 'normal' | 'large';
    return saved || 'normal';
  });

  const [keyboardNavigation, setKeyboardNavigation] = useState(() => {
    const saved = localStorage.getItem('accessibility-keyboard-nav');
    return saved === 'true';
  });

  const [screenReaderMode, setScreenReaderMode] = useState(() => {
    const saved = localStorage.getItem('accessibility-screen-reader');
    return saved === 'true';
  });

  const [focusManagement, setFocusManagement] = useState(() => {
    const saved = localStorage.getItem('accessibility-focus-management');
    return saved === 'true';
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Font size
    root.classList.remove('font-small', 'font-normal', 'font-large');
    root.classList.add(`font-${fontSize}`);
    
    // Keyboard navigation
    if (keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
    
    // Screen reader mode
    if (screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
    
    // Focus management
    if (focusManagement) {
      root.classList.add('focus-management');
    } else {
      root.classList.remove('focus-management');
    }

    // Save to localStorage
    localStorage.setItem('accessibility-high-contrast', highContrast.toString());
    localStorage.setItem('accessibility-reduced-motion', reducedMotion.toString());
    localStorage.setItem('accessibility-font-size', fontSize);
    localStorage.setItem('accessibility-keyboard-nav', keyboardNavigation.toString());
    localStorage.setItem('accessibility-screen-reader', screenReaderMode.toString());
    localStorage.setItem('accessibility-focus-management', focusManagement.toString());
  }, [highContrast, reducedMotion, fontSize, keyboardNavigation, screenReaderMode, focusManagement]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('accessibility-reduced-motion') === null) {
        setReducedMotion(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const toggleKeyboardNavigation = () => {
    setKeyboardNavigation(!keyboardNavigation);
  };

  const toggleScreenReaderMode = () => {
    setScreenReaderMode(!screenReaderMode);
  };

  const toggleFocusManagement = () => {
    setFocusManagement(!focusManagement);
  };

  const setFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSizeState(size);
  };

  // Enhanced screen reader announcements
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  // Focus management utilities
  const manageFocus = useCallback((element: HTMLElement | null) => {
    if (!element || !focusManagement) return;
    
    // Wait for next tick to ensure element is rendered
    requestAnimationFrame(() => {
      element.focus();
      announceToScreenReader(`Focus moved to ${element.getAttribute('aria-label') || element.textContent || 'element'}`);
    });
  }, [focusManagement, announceToScreenReader]);

  // Focus trap utility for modals/dialogs
  const trapFocus = useCallback((container: HTMLElement) => {
    if (!focusManagement) return () => {};
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusManagement]);

  // Keyboard navigation detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true);
      }
    };

    const handleMouseDown = () => {
      setKeyboardNavigation(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const value = {
    highContrast,
    reducedMotion,
    fontSize,
    keyboardNavigation,
    screenReaderMode,
    focusManagement,
    toggleHighContrast,
    toggleReducedMotion,
    toggleKeyboardNavigation,
    toggleScreenReaderMode,
    toggleFocusManagement,
    setFontSize,
    announceToScreenReader,
    manageFocus,
    trapFocus,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Skip link component for keyboard navigation
export function SkipLink({ href = '#main-content', children = 'Skip to main content' }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
    >
      {children}
    </a>
  );
}