import React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    value: number;
}

export const Slider: React.FC<SliderProps> = ({ label, value, className, ...props }) => {
    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slate-500 uppercase">{label}</label>
                <span className="font-mono text-xs text-primary font-bold">{value}</span>
            </div>
            <input
                type="range"
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                value={value}
                {...props}
            />
        </div>
    );
};
