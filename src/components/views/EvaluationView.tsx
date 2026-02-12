'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

export default function EvaluationView() {
    const { setViewState, clearChat } = useAppStore();

    const handleRestart = () => {
        clearChat();
        setViewState('idle');
    };

    return (
        <div className="flex-1 h-full w-full z-50 bg-bg-light dark:bg-bg-dark overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto py-12 px-6 space-y-10">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Performance Report</h1>
                        <p className="text-slate-500 text-sm mt-1">Interview Session: ML Ops Specialist (Simulation Complete)</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Overall Score</div>
                            <div className="text-2xl font-mono font-bold text-primary">84/100</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Communication', score: '92%' },
                        { label: 'Technical Depth', score: '78%' },
                        { label: 'Confidence', score: '82%' }
                    ].map((item) => (
                        <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-6 py-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</span>
                                <span className="text-xs font-mono font-bold text-primary">{item.score}</span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: item.score }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-emerald-500">
                            <span className="material-icons text-sm">check_circle</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">What You Did Well</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-emerald-700 dark:text-emerald-400">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                <span>Strong practical knowledge of <strong>DVC</strong> and <strong>Seldon Core</strong>, demonstrating real-world experience.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-emerald-700 dark:text-emerald-400">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                <span>Clear explanation of the semantic versioning strategy for model deployment pipelines.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-amber-500">
                            <span className="material-icons text-sm">warning</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Areas for Improvement</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-amber-700 dark:text-amber-400">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0"></span>
                                <span>Could provide more detail on specific <strong>quality gates</strong> (e.g., drift detection methods used).</span>
                            </li>
                            <li className="flex gap-3 text-sm text-amber-700 dark:text-amber-400">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0"></span>
                                <span>Mentioning <strong>Observability</strong> stacks (Prometheus/Grafana) would bolster the &apos;Scaling&apos; portion of the answer.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 flex justify-center">
                    <button
                        onClick={handleRestart}
                        className="bg-primary hover:bg-primary/90 text-white font-bold py-5 px-12 rounded-xl shadow-2xl shadow-primary/30 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
                    >
                        <span className="material-icons">refresh</span>
                        RESTART NEW SESSION
                    </button>
                </div>
            </div>
        </div>
    );
}
