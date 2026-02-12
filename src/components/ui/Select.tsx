import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: string[] | { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, options, ...props }, ref) => {
        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            "w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary appearance-none cursor-pointer h-10",
                            className
                        )}
                        {...props}
                    >
                        {options.map((opt) => {
                            const label = typeof opt === 'string' ? opt : opt.label;
                            const value = typeof opt === 'string' ? opt : opt.value;
                            return (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            );
                        })}
                    </select>
                    <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                        expand_more
                    </span>
                </div>
            </div>
        );
    }
);

Select.displayName = 'Select';
