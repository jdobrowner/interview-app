'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

export default function LeftSidebar() {
    const { config, setConfig, theme, toggleTheme, toggleSidebar, sidebarCollapsed } = useAppStore();

    return (
        <aside className={`bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 transition-all duration-300 overflow-hidden ${sidebarCollapsed ? 'w-16' : 'w-72'
            }`}>
            <div className={`p-6 border-b border-slate-200 dark:border-slate-800 flex items-center shrink-0 ${sidebarCollapsed ? 'justify-center' : 'justify-between'
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
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Model Selection</label>
                        <div className="relative">
                            <select
                                value={config.model}
                                onChange={(e) => setConfig({ model: e.target.value })}
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary appearance-none cursor-pointer h-10"
                            >
                                <option>GPT-4o (Omni)</option>
                                <option>Claude 3.5 Sonnet</option>
                                <option>Llama 3 70B</option>
                            </select>
                            <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Prompt Strategy */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Prompt Strategy</label>
                        <div className="relative">
                            <select
                                value={config.strategy}
                                onChange={(e) => setConfig({ strategy: e.target.value })}
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary appearance-none cursor-pointer h-10"
                            >
                                <option>Chain-of-Thought</option>
                                <option>Standard Prompting</option>
                                <option>Few-Shot Examples</option>
                            </select>
                            <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Difficulty Level */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Difficulty Level</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            {['Junior', 'Senior', 'Staff'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setConfig({ difficulty: level as 'Junior' | 'Senior' | 'Staff' })}
                                    className={`flex-1 text-xs py-1.5 rounded-md transition ${config.difficulty === level
                                        ? 'bg-white dark:bg-slate-700 shadow-sm font-medium'
                                        : 'hover:bg-white dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6 pt-2">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase">Temperature</label>
                                <span className="font-mono text-xs text-primary font-bold">{config.temperature}</span>
                            </div>
                            <input
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={config.temperature}
                                onChange={(e) => setConfig({ temperature: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase">Top-P</label>
                                <span className="font-mono text-xs text-primary font-bold">{config.topP}</span>
                            </div>
                            <input
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={config.topP}
                                onChange={(e) => setConfig({ topP: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`shrink-0 transition-all duration-300 ${sidebarCollapsed
                ? 'max-h-0 opacity-0 pointer-events-none overflow-hidden'
                : 'p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 max-h-40 opacity-100'
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
