'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

import { SYSTEM_PROMPTS } from '@/lib/ai/systemPrompts';
import { Button } from '@/components/ui/Button';

export default function StrategyDetailSidebar() {
    const { config, strategySidebarOpen, toggleStrategySidebar, sidebarCollapsed } = useAppStore();

    const promptText = SYSTEM_PROMPTS[config.strategy] || SYSTEM_PROMPTS['Standard Prompting'];

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
                    <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800/50 shadow-inner">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <span className="material-icons text-sm">terminal</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">System Prompt</span>
                        </div>
                        <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">
                            {promptText}
                        </pre>
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-[10px] text-primary font-bold uppercase mb-2">Pro Tip</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            The prompt strategy determines how the AI structures its reasoning and follow-up questions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
