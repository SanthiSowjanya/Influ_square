import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseClasses =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]";

    const sizeClasses = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5",
      icon: "h-9 w-9 rounded-lg"
    };

    const variantClasses = {
      primary:
        "bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md transition-shadow border border-purple-500/20",
      secondary:
        "bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 shadow-xs",
      outline:
        "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300 shadow-xs",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-500/20",
      gradient:
        "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all border border-purple-400/20"
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
