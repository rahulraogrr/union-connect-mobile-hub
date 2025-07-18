import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'normal' | 'large';
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: 'small' | 'normal' | 'large') => void;
  announceToScreenReader: (message: string) => void;
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
    
    // Save to localStorage
    localStorage.setItem('accessibility-high-contrast', highContrast.toString());
    localStorage.setItem('accessibility-reduced-motion', reducedMotion.toString());
    localStorage.setItem('accessibility-font-size', fontSize);
  }, [highContrast, reducedMotion, fontSize]);

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

  const setFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSizeState(size);
  };

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const value = {
    highContrast,
    reducedMotion,
    fontSize,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSize,
    announceToScreenReader,
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