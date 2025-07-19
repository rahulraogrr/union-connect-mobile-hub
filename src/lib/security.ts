// Security utilities for industry-standard protection
export class SecurityHeaders {
  // Content Security Policy configuration
  static getCSPDirectives(): Record<string, string[]> {
    return {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'font-src': ["'self'", "https://fonts.gstatic.com"],
      'img-src': ["'self'", "data:", "blob:", "https:"],
      'connect-src': ["'self'", "https://api.github.com", "wss:"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };
  }

  // Generate CSP header value
  static generateCSPHeader(): string {
    const directives = this.getCSPDirectives();
    return Object.entries(directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
  }

  // Security headers for meta tags
  static getSecurityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': this.generateCSPHeader(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }
}

// Rate limiting utility
export class RateLimiter {
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map();

  static isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  static getRemainingAttempts(key: string, maxAttempts: number = 5): number {
    const attempt = this.attempts.get(key);
    if (!attempt || Date.now() > attempt.resetTime) {
      return maxAttempts;
    }
    return Math.max(0, maxAttempts - attempt.count);
  }

  static getTimeUntilReset(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt || Date.now() > attempt.resetTime) {
      return 0;
    }
    return attempt.resetTime - Date.now();
  }

  static reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Secure session storage
export class SecureStorage {
  private static readonly PREFIX = 'secure_';
  
  static setItem(key: string, value: any, expirationMinutes: number = 60): void {
    const expirationTime = Date.now() + (expirationMinutes * 60 * 1000);
    const item = {
      value: JSON.stringify(value),
      expiration: expirationTime,
      timestamp: Date.now()
    };
    
    try {
      sessionStorage.setItem(this.PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.warn('SecureStorage: Failed to store item', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const itemStr = sessionStorage.getItem(this.PREFIX + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      if (Date.now() > item.expiration) {
        this.removeItem(key);
        return null;
      }

      return JSON.parse(item.value);
    } catch (error) {
      console.warn('SecureStorage: Failed to retrieve item', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    sessionStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

// Password strength validator
export class PasswordValidator {
  static readonly MIN_LENGTH = 8;
  static readonly STRENGTH_PATTERNS = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /\d/,
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/
  };

  static validateStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < this.MIN_LENGTH) {
      feedback.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
    } else {
      score += 1;
    }

    Object.entries(this.STRENGTH_PATTERNS).forEach(([type, pattern]) => {
      if (pattern.test(password)) {
        score += 1;
      } else {
        feedback.push(`Password must contain ${type}`);
      }
    });

    // Additional checks
    if (password.length > 12) score += 1;
    if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters

    const isValid = score >= 4;
    
    return {
      isValid,
      score: Math.min(score, 5),
      feedback: isValid ? [] : feedback
    };
  }

  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }
}