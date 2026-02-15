'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function HistorySidebar() {
    const {
        sessions,
        historySidebarOpen,
        toggleHistorySidebar,
        sidebarCollapsed,
        setConfig,
        setJob,
        setViewState,
        clearChat,
        addMessage
    } = useAppStore();

    const handleLoadSession = (session: any) => {
        // Load session data into the active state for viewing
        setConfig(session.config);
        setJob(session.job);
        clearChat();
        session.messages.forEach((msg: any) => {
            addMessage(msg);
        });

        // Track which session we are viewing
        useAppStore.getState().setSelectedSessionId(session.id);

        // Navigate to evaluation
        setViewState('evaluation');
        toggleHistorySidebar();
    };

    return (
        <div
            className={cn(
                "fixed inset-y-0 z-[100] w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-500 ease-in-out transform right-0",
                historySidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            <div className="h-full flex flex-col">
                <div className="p-6 h-[73px] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/80">
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Interview History</h2>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Past Sessions</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleHistorySidebar}
                        className="rounded-full"
                    >
                        <span className="material-icons text-xl">close</span>
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400 opacity-50">
                            <span className="material-icons text-3xl mb-2">history</span>
                            <p className="text-xs">No history yet</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => handleLoadSession(session)}
                                className="w-full text-left p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                                        {session.date}
                                    </span>
                                    <span className="text-[10px] text-slate-400 group-hover:text-primary transition-colors">
                                        {session.messages.length} messages
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">
                                    {session.job.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {session.config.model} • {session.config.strategy}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                {sessions.length > 0 && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                        <div className="flex gap-2">
                            <Button
                                className="flex-1 text-[11px] h-9"
                                size="sm"
                                onClick={() => {
                                    setViewState('history');
                                    toggleHistorySidebar();
                                }}
                            >
                                View All
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-[11px] text-slate-400 h-9 hover:text-red-500 hover:bg-red-50"
                                size="sm"
                                onClick={() => {
                                    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
                                        useAppStore.getState().clearHistory();
                                    }
                                }}
                            >
                                Clear All
                            </Button>
                        </div>
                        <p className="text-[10px] text-slate-400 italic text-center leading-relaxed">
                            History is stored locally in your browser and persists across refreshes.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
