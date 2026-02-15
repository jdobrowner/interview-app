'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

import { SYSTEM_PROMPTS } from '@/lib/ai/systemPrompts';
import { Button } from '@/components/ui/Button';

export default function StrategyDetailSidebar() {
    const { config, strategySidebarOpen, toggleStrategySidebar, sidebarCollapsed } = useAppStore();

    const strategy = SYSTEM_PROMPTS[config.strategy] || SYSTEM_PROMPTS['Recruiter Screen'];

    if (!strategy) return null;

    return (
        <div
            className={`fixed inset-y-0 z-40 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-500 ease-in-out transform ${sidebarCollapsed ? 'left-16' : 'left-72'
                } ${strategySidebarOpen ? 'translate-x-0' : '-translate-x-full opacity-0 pointer-events-none'
                }`}
        >
            <div className="h-full flex flex-col">
                <div className="p-6 h-[73px] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/80">
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Prompt Detail</h2>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{config.strategy}</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleStrategySidebar}
                        className="rounded-full"
                    >
                        <span className="material-icons text-xl">close</span>
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {/* Strategy Metadata Card */}
                    <div className="mb-6 p-5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm relative overflow-hidden group">
                        <div className="flex flex-col gap-4 relative z-10">
                            <div>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-tighter mb-1.5 flex items-center gap-1.5">
                                    Strategy Description
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                    {strategy.description}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-tighter mb-1.5 flex items-center gap-1.5">
                                    Prompt Technique
                                </p>
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    {strategy.technique}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* System Prompt Code Block */}
                    <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800/50 shadow-inner">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <span className="material-icons text-sm">terminal</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">System Prompt Injection</span>
                        </div>
                        <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar italic opacity-80 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                            {strategy.content}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
