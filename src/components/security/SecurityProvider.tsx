import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { SecurityHeaders } from '@/lib/security';

interface SecurityContextType {
  reportViolation: (violation: string) => void;
  isSecureContext: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const isSecureContext = window.location.protocol === 'https:' || 
                          window.location.hostname === 'localhost';

  useEffect(() => {
    // Apply security headers via meta tags for development
    const headers = SecurityHeaders.getSecurityHeaders();
    
    Object.entries(headers).forEach(([name, content]) => {
      const existingMeta = document.querySelector(`meta[http-equiv="${name}"]`);
      if (!existingMeta) {
        const meta = document.createElement('meta');
        meta.httpEquiv = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Add CSP violation reporting
    document.addEventListener('securitypolicyviolation', (e) => {
      console.warn('CSP Violation:', {
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        originalPolicy: e.originalPolicy
      });
    });

    // Disable right-click in production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  const reportViolation = (violation: string) => {
    console.warn('Security Violation:', violation);
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Analytics or monitoring service call would go here
    }
  };

  const value = {
    reportViolation,
    isSecureContext,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}