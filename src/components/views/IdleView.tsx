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
                        {/* Icon removed for cleaner look */}


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
