// Input sanitization utilities for security
export class InputSanitizer {
  // Remove potentially harmful HTML tags and attributes
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    // Remove script tags and their content
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove potentially harmful attributes
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, ''); // onclick, onload, etc.
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/vbscript:/gi, '');
    sanitized = sanitized.replace(/data:/gi, '');
    
    // Allow only safe HTML tags
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'];
    const tagPattern = /<(\/?)([\w]+)([^>]*)>/gi;
    
    sanitized = sanitized.replace(tagPattern, (match, closing, tagName, attributes) => {
      if (allowedTags.includes(tagName.toLowerCase())) {
        // Remove attributes for safety
        return `<${closing}${tagName}>`;
      }
      return '';
    });
    
    return sanitized;
  }

  // Sanitize text input (remove special characters that could be harmful)
  static sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    // Remove null bytes and control characters
    return input
      .replace(/\0/g, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();
  }

  // Sanitize email input
  static sanitizeEmail(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w.@+-]/g, ''); // Only allow word chars, dots, @, +, -
  }

  // Sanitize phone number
  static sanitizePhone(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input.replace(/[^\d+\-\s()]/g, ''); // Only allow digits, +, -, space, parentheses
  }

  // Sanitize URL input
  static sanitizeUrl(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    try {
      const url = new URL(input);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return '';
      }
      return url.toString();
    } catch {
      return '';
    }
  }

  // Sanitize filename for file uploads
  static sanitizeFilename(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[^a-zA-Z0-9.\-_]/g, '') // Only allow alphanumeric, dots, hyphens, underscores
      .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
      .replace(/^\./, '') // Remove leading dot
      .substring(0, 255); // Limit length
  }

  // General purpose sanitizer that detects input type
  static sanitize(input: string, type: 'text' | 'email' | 'phone' | 'url' | 'html' | 'filename' = 'text'): string {
    switch (type) {
      case 'email':
        return this.sanitizeEmail(input);
      case 'phone':
        return this.sanitizePhone(input);
      case 'url':
        return this.sanitizeUrl(input);
      case 'html':
        return this.sanitizeHtml(input);
      case 'filename':
        return this.sanitizeFilename(input);
      case 'text':
      default:
        return this.sanitizeText(input);
    }
  }
}

// XSS prevention utilities
export const XSSProtection = {
  // Encode HTML entities
  encodeHtml: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  // Decode HTML entities
  decodeHtml: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.innerHTML = input;
    return div.textContent || div.innerText || '';
  },

  // Escape special regex characters
  escapeRegex: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },
};

// SQL injection prevention (for client-side validation)
export const SQLInjectionProtection = {
  // Check for common SQL injection patterns
  hasSQLInjectionPattern: (input: string): boolean => {
    if (!input || typeof input !== 'string') return false;
    
    const patterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;|\||&)/,
      /('|('')|"|(\\")|(%27)|(%22))/,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    ];
    
    return patterns.some(pattern => pattern.test(input));
  },

  // Clean input from SQL injection attempts
  sanitizeSQLInput: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Remove dangerous SQL keywords and characters
    return input
      .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, '')
      .replace(/(--|\/\*|\*\/|;|\||&)/g, '')
      .replace(/('|('')|"|(\\")|(%27)|(%22))/g, '')
      .trim();
  },
};

// Export a comprehensive sanitization function
export const sanitizeInput = (
  input: any,
  type: 'text' | 'email' | 'phone' | 'url' | 'html' | 'filename' = 'text'
): string => {
  if (input === null || input === undefined) return '';
  
  const stringInput = String(input);
  
  // First check for SQL injection
  if (SQLInjectionProtection.hasSQLInjectionPattern(stringInput)) {
    console.warn('Potential SQL injection attempt detected and blocked');
    return '';
  }
  
  // Then sanitize based on type
  return InputSanitizer.sanitize(stringInput, type);
};