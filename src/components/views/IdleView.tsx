'use client';

import React from 'react';
import JobConfigCard from '../features/JobConfigCard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export default function IdleView() {
    const { setViewState, clearChat } = useAppStore();

    const handleStart = () => {
        clearChat();
        setViewState('active');
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
            <div className="flex-1 flex flex-col min-h-min">
                <section className="p-6 w-full max-w-5xl mx-auto z-10 flex-shrink-0">
                    <JobConfigCard />
                </section>

                <section className="flex-1 flex items-center justify-center px-6 relative overflow-visible min-h-[400px]">
                    <div className="hero-gradient absolute inset-0 pointer-events-none"></div>
                    <div className="max-w-2xl w-full text-center relative z-10 py-12">
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
                            Are you ready to ace your interview?
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                            Refine your technical communication with GPT-powered simulations tailored to your specific job requirements.
                        </p>

                        <Button
                            size="lg"
                            onClick={handleStart}
                            className="inline-flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-xl">play_circle</span>
                            Start Practice Session
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
