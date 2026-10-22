import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-colors";
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs"
  };

  const variantClasses = {
    default: "bg-slate-100 text-slate-700 border border-slate-200/80",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-rose-50 text-rose-700 border border-rose-200",
    outline: "bg-white text-slate-600 border border-slate-200 shadow-2xs",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    cyan: "bg-cyan-50 text-cyan-700 border border-cyan-200"
  };

  return (
    <span
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
