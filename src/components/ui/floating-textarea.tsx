import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const inputId = id || `floating-textarea-${Math.random().toString(36).substr(2, 9)}`;
    const isFloating = isFocused || hasValue;

    return (
      <div className="relative">
        <textarea
          id={inputId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 pt-6 pb-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-3 text-muted-foreground transition-all duration-200 pointer-events-none",
            isFloating
              ? "top-2 text-xs text-primary"
              : "top-4 text-base"
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)
FloatingTextarea.displayName = "FloatingTextarea"

export { FloatingTextarea }