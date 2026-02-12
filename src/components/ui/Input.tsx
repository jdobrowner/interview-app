import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-inner focus:ring-1 focus:ring-primary/50 transition-colors",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = 'Input';
