import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

        const variants = {
            primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
            secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700",
            ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary",
            danger: "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20",
            outline: "bg-transparent border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary"
        };

        const sizes = {
            sm: "px-4 py-2 text-xs",
            md: "px-6 py-3 text-sm",
            lg: "px-10 py-4 text-base",
            icon: "w-10 h-10"
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <span className="material-icons animate-spin text-sm">refresh</span>
                ) : children}
            </button>
        );
    }
);

Button.displayName = 'Button';
