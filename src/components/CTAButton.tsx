
import React from 'react';
import { cn } from '@/lib/utils';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const CTAButton = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className,
  icon,
  ...props 
}: CTAButtonProps) => {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out',
        'hover:shadow-lg active:shadow-inner active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40',
        // Variants
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
        variant === 'outline' && 'border border-border bg-transparent text-foreground hover:bg-secondary',
        // Sizes
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',
        className
      )}
      {...props}
    >
      {icon && <span className="animate-fade-right">{icon}</span>}
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
};

export default CTAButton;
