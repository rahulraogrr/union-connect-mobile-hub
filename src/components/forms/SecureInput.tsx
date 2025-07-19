import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { sanitizeInput } from '@/lib/sanitization';
import { PasswordValidator } from '@/lib/security';
import { cn } from '@/lib/utils';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitationType?: 'text' | 'email' | 'phone' | 'url' | 'html' | 'filename';
  showPasswordStrength?: boolean;
  preventPaste?: boolean;
  maxAttempts?: number;
  onSecurityViolation?: (violation: string) => void;
}

export function SecureInput({
  sanitationType = 'text',
  showPasswordStrength = false,
  preventPaste = false,
  maxAttempts = 5,
  onSecurityViolation,
  type,
  value,
  onChange,
  className,
  ...props
}: SecureInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  }>({ score: 0, feedback: [] });

  const isPasswordType = type === 'password';

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;

    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue, sanitationType);
    
    // Check if sanitization changed the value (potential security issue)
    if (rawValue !== sanitizedValue && onSecurityViolation) {
      onSecurityViolation(`Input sanitization applied: ${sanitationType}`);
    }

    // Password strength checking
    if (isPasswordType && showPasswordStrength) {
      const strength = PasswordValidator.validateStrength(sanitizedValue);
      setPasswordStrength(strength);
    }

    // Create new event with sanitized value
    const sanitizedEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue
      }
    };

    onChange?.(sanitizedEvent as React.ChangeEvent<HTMLInputElement>);
  }, [isLocked, sanitationType, onSecurityViolation, isPasswordType, showPasswordStrength, onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    if (preventPaste) {
      e.preventDefault();
      onSecurityViolation?.('Paste operation blocked for security');
      return;
    }

    const pastedText = e.clipboardData.getData('text');
    const sanitizedText = sanitizeInput(pastedText, sanitationType);
    
    if (pastedText !== sanitizedText && onSecurityViolation) {
      onSecurityViolation('Pasted content was sanitized');
    }
  }, [preventPaste, sanitationType, onSecurityViolation]);

  const handleInvalidInput = useCallback(() => {
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts >= maxAttempts) {
        setIsLocked(true);
        onSecurityViolation?.(`Input locked after ${maxAttempts} invalid attempts`);
        
        // Auto-unlock after 5 minutes
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, 5 * 60 * 1000);
      }
      return newAttempts;
    });
  }, [maxAttempts, onSecurityViolation]);

  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return 'destructive';
    if (score < 4) return 'secondary';
    return 'default';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          {...props}
          type={isPasswordType && showPassword ? 'text' : type}
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          onInvalid={handleInvalidInput}
          disabled={isLocked}
          className={cn(
            'pr-10',
            isLocked && 'opacity-50 cursor-not-allowed',
            className
          )}
        />
        
        {isPasswordType && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLocked}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}
        
        {isLocked && (
          <div className="absolute right-0 top-0 h-full px-3 flex items-center">
            <Shield className="h-4 w-4 text-destructive" />
          </div>
        )}
      </div>
      
      {/* Password Strength Indicator */}
      {isPasswordType && showPasswordStrength && value && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  passwordStrength.score < 2 && 'bg-destructive',
                  passwordStrength.score >= 2 && passwordStrength.score < 4 && 'bg-warning',
                  passwordStrength.score >= 4 && 'bg-green-500'
                )}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
            <Badge variant={getPasswordStrengthColor(passwordStrength.score)}>
              {getPasswordStrengthText(passwordStrength.score)}
            </Badge>
          </div>
          
          {passwordStrength.feedback.length > 0 && (
            <div className="text-sm text-muted-foreground space-y-1">
              {passwordStrength.feedback.map((feedback, index) => (
                <div key={index} className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {feedback}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Security Status */}
      {(attempts > 0 || isLocked) && (
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-warning" />
          {isLocked ? (
            <span className="text-destructive">Input locked due to security violations</span>
          ) : (
            <span className="text-warning">
              {attempts}/{maxAttempts} security attempts
            </span>
          )}
        </div>
      )}
    </div>
  );
}