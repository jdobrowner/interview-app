'use client';

import React from 'react';
import JobConfigCard from '../features/JobConfigCard';
import { useAppStore } from '@/lib/store';

export default function IdleView() {
    const setViewState = useAppStore((state) => state.setViewState);

    return (
        <>
            <section className="p-6 w-full max-w-5xl mx-auto z-10">
                <JobConfigCard />
            </section>

            <section className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
                <div className="hero-gradient absolute inset-0 pointer-events-none"></div>
                <div className="max-w-2xl w-full text-center relative z-10">
                    <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                        <svg className="w-40 h-40" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="brainGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#2547f4', stopOpacity: 1 }}></stop>
                                    <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }}></stop>
                                </linearGradient>
                            </defs>
                            <g className="node-pulse">
                                <circle cx="100" cy="100" fill="none" r="40" stroke="url(#brainGrad)" strokeDasharray="12 4" strokeWidth="1.5"></circle>
                                <circle cx="100" cy="100" fill="none" r="60" stroke="url(#brainGrad)" strokeDasharray="2 8" strokeWidth="1"></circle>
                                <circle cx="60" cy="70" fill="#2547f4" r="4"></circle>
                                <circle cx="140" cy="70" fill="#a855f7" r="3"></circle>
                                <circle cx="100" cy="160" fill="#2547f4" r="5"></circle>
                                <path d="M60 70 Q 100 100 140 70" fill="none" stroke="url(#brainGrad)" strokeWidth="0.5"></path>
                                <path d="M100 160 Q 100 100 60 70" fill="none" stroke="url(#brainGrad)" strokeWidth="0.5"></path>
                                <path d="M100 160 Q 100 100 140 70" fill="none" stroke="url(#brainGrad)" strokeWidth="0.5"></path>
                            </g>
                            <foreignObject height="80" width="80" x="60" y="60">
                                <div className="flex items-center justify-center h-full">
                                    <span className="material-symbols-outlined text-5xl text-primary/80" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>psychology</span>
                                </div>
                            </foreignObject>
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                        Welcome to your AI Interview Prep Studio
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                        Refine your technical communication with GPT-powered simulations tailored to your specific job requirements.
                    </p>

                    <button
                        onClick={() => setViewState('active')}
                        className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-xl">play_circle</span>
                        Start Practice Session
                    </button>
                </div>
            </section>

            {/* Bottom sticky bar (Idle state: disabled) */}
            <div className="p-6 bg-gradient-to-t from-bg-light dark:from-bg-dark via-bg-light dark:via-bg-dark to-transparent">
                <div className="max-w-4xl mx-auto flex items-end gap-4">
                    <div className="flex-1 relative">
                        <textarea
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-12 text-sm text-slate-400 dark:text-slate-600 transition resize-none custom-scrollbar cursor-not-allowed"
                            disabled
                            placeholder="Configure your interview above to start chatting..."
                            rows={1}
                        />
                        <button className="absolute left-4 bottom-4 text-slate-300 dark:text-slate-700 cursor-not-allowed" disabled>
                            <span className="material-icons">mic_off</span>
                        </button>
                        <button className="absolute right-4 bottom-3.5 w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-600 cursor-not-allowed" disabled>
                            <span className="material-icons text-sm">send</span>
                        </button>
                    </div>
                    <button className="bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest cursor-not-allowed flex-shrink-0" disabled>
                        Finish Interview
                    </button>
                </div>
            </div>
        </>
    );
}
