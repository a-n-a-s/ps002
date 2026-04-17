import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full bg-bg-primary border rounded-lg px-4 py-3
          text-text-primary placeholder:text-text-muted
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-blood/20 focus:border-blood
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-white/20'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';