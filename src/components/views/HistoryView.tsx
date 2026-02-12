'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function HistoryView() {
    const {
        sessions,
        setViewState,
        setConfig,
        setJob,
        clearChat,
        addMessage
    } = useAppStore();

    const handleLoadSession = (session: any) => {
        setViewState('idle');
        setConfig(session.config);
        setJob(session.job);
        clearChat();
        session.messages.forEach((msg: any) => {
            addMessage(msg);
        });
        setViewState('active');
    };

    return (
        <div className="flex-1 h-full w-full bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar">
            <div className="max-w-6xl mx-auto py-12 px-6">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-2">History Browser</h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                            Review your past performances, tracking your progress across different models, strategies, and difficulty levels.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => setViewState('idle')}
                        className="flex items-center gap-2"
                    >
                        <span className="material-icons text-sm">arrow_back</span>
                        Back to Interview
                    </Button>
                </header>

                {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                            <span className="material-icons text-3xl text-slate-400">history</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No session history found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-center">
                            Complete your first practice session to see it show up here in your personal history dashboard.
                        </p>
                        <Button onClick={() => setViewState('idle')}>Start Practice Session</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-3 py-1 bg-primary/5 border border-primary/20 rounded-full">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{session.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-primary transition-colors">
                                        <span className="material-icons text-xs">forum</span>
                                        {session.messages.length} Messages
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1">
                                    {session.job.title}
                                </h3>

                                <div className="space-y-3 mb-8 flex-1">
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="material-icons text-sm opacity-50">smart_toy</span>
                                        {session.config.model}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="material-icons text-sm opacity-50">psychology</span>
                                        {session.config.strategy}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="material-icons text-sm opacity-50">signal_cellular_alt</span>
                                        {session.config.difficulty}
                                    </div>
                                </div>

                                {session.evaluation && (
                                    <div className="mb-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Overall Score</span>
                                            <span className="text-xs font-mono font-bold text-primary">{session.evaluation.overallScore}/100</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                                style={{ width: `${session.evaluation.overallScore}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 text-xs px-0"
                                        onClick={() => handleLoadSession(session)}
                                    >
                                        Reload Session
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => {
                                            // Future: Open detail view
                                            handleLoadSession(session);
                                            setViewState('evaluation');
                                        }}
                                    >
                                        Evaluation
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <footer className="mt-24 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        History is kept safely in your local browser storage.
                    </p>
                </footer>
            </div>
        </div>
    );
}
