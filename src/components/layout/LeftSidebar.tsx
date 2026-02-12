'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { MODELS, STRATEGIES, DIFFICULTIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function LeftSidebar() {
    const { config, setConfig, theme, toggleTheme, toggleSidebar, sidebarCollapsed } = useAppStore();

    return (
        <aside className={`bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-50 transition-all duration-300 overflow-hidden ${sidebarCollapsed ? 'w-16' : 'w-72'
            }`}>
            <div className={`p-6 h-[73px] border-b border-slate-200 dark:border-slate-800 flex items-center shrink-0 ${sidebarCollapsed ? 'justify-center' : 'justify-between'
                }`}>
                {!sidebarCollapsed && (
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary truncate animate-in fade-in duration-500">
                        Configuration
                    </h2>
                )}
                <button
                    onClick={toggleSidebar}
                    className={`rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 cursor-pointer ${sidebarCollapsed ? 'w-10 h-10' : 'w-6 h-6'
                        }`}
                    title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <span className={`material-icons ${sidebarCollapsed ? 'text-xl text-primary' : 'text-sm'}`}>
                        {sidebarCollapsed ? 'menu' : 'menu_open'}
                    </span>
                </button>
            </div>

            <div className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'
                }`}>
                <div className="p-6 space-y-8 min-w-[288px]">
                    {/* Model Selection */}
                    <Select
                        label="Model Selection"
                        value={config.model}
                        onChange={(e) => setConfig({ model: e.target.value })}
                        options={[...MODELS]}
                    />

                    {/* Prompt Strategy */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Prompt Strategy</label>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    useAppStore.getState().toggleStrategySidebar();
                                }}
                                className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                title="View Strategy Detail"
                            >
                                <span className="material-icons text-base">visibility</span>
                            </button>
                        </div>
                        <Select
                            value={config.strategy}
                            onChange={(e) => setConfig({ strategy: e.target.value })}
                            options={[...STRATEGIES]}
                        />
                    </div>

                    {/* Difficulty Level */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Difficulty Level</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            {DIFFICULTIES.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setConfig({ difficulty: level })}
                                    className={cn(
                                        "flex-1 text-xs py-1.5 rounded-md transition cursor-pointer",
                                        config.difficulty === level
                                            ? 'bg-white dark:bg-slate-700 shadow-sm font-medium'
                                            : 'hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6 pt-2">
                        <Slider
                            label="Temperature"
                            value={config.temperature}
                            min="0"
                            max="1"
                            step="0.1"
                            onChange={(e) => setConfig({ temperature: parseFloat(e.target.value) })}
                        />
                        <Slider
                            label="Top-P"
                            value={config.topP}
                            min="0"
                            max="1"
                            step="0.05"
                            onChange={(e) => setConfig({ topP: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            <div className={`shrink-0 transition-all duration-300 ${sidebarCollapsed
                ? 'max-h-0 opacity-0 pointer-events-none overflow-hidden'
                : 'p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 max-h-40 opacity-100'
                }`}>
                <div className="flex items-center justify-between min-w-[240px]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-icons text-primary text-lg">
                                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Appearance</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative transition-colors focus:outline-none cursor-pointer"
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-primary rounded-full transition-transform transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                            }`}></div>
                    </button>
                </div>
            </div>
        </aside>
    );
}
