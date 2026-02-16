'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function EvaluationView() {
    const {
        setViewState,
        clearChat,
        job,
        evaluation,
        evaluationLoading,
        evaluationError,
        fetchEvaluation,
    } = useAppStore();

    useEffect(() => { fetchEvaluation(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRestart = () => {
        clearChat();
        setViewState('idle');
    };

    if (evaluationLoading) {
        return (
            <div className="flex-1 h-full w-full bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                        <div className="relative w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="material-icons text-primary text-2xl animate-pulse">psychology</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Analyzing Your Performance</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            Our AI coach is reviewing your transcript and generating a detailed evaluation...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (evaluationError) {
        return (
            <div className="flex-1 h-full w-full bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md">
                    <span className="material-icons text-4xl text-amber-500">warning</span>
                    <p className="text-slate-600 dark:text-slate-400">{evaluationError}</p>
                    <button
                        onClick={handleRestart}
                        className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition"
                    >
                        Back to Setup
                    </button>
                </div>
            </div>
        );
    }

    if (!evaluation) return null;

    const scoreCategories = [
        { label: 'Communication', score: evaluation.communicationScore },
        { label: 'Technical Depth', score: evaluation.technicalScore },
        { label: 'Overall', score: evaluation.overallScore },
    ];

    return (
        <div className="flex-1 h-full w-full bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto py-12 px-6 space-y-10">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Performance Report</h1>
                        <p className="text-slate-500 text-sm mt-1">Interview Session: {job.title} (Simulation Complete)</p>
                    </div>
                    <div className="flex items-center gap-10">
                        <button
                            onClick={() => setViewState('history_replay')}
                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 hover:bg-primary/5"
                        >
                            <span className="material-icons text-sm">chat_bubble</span>
                            View Conversation
                        </button>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Overall Score</div>
                            <div className="text-2xl font-mono font-bold text-primary">{evaluation.overallScore}/100</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {scoreCategories.map((item) => (
                        <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-6 py-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</span>
                                <span className="text-xs font-mono font-bold text-primary">{item.score}%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${item.score}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                {evaluation.transcriptSummary && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3 text-slate-500">
                            <span className="material-icons text-sm">summarize</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Session Summary</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {evaluation.transcriptSummary}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-emerald-500">
                            <span className="material-icons text-sm">check_circle</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">What You Did Well</h3>
                        </div>
                        <ul className="space-y-4">
                            {evaluation.positives.map((item, i) => (
                                <li key={i} className="flex gap-3 text-sm text-emerald-700 dark:text-emerald-400">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-amber-500">
                            <span className="material-icons text-sm">warning</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Areas for Improvement</h3>
                        </div>
                        <ul className="space-y-4">
                            {evaluation.improvements.map((item, i) => (
                                <li key={i} className="flex gap-3 text-sm text-amber-700 dark:text-amber-400">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0"></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {evaluation.improvedResponse && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-6 text-primary relative z-10">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <span className="material-icons text-sm">auto_awesome</span>
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Coaching Example</h3>
                        </div>

                        <div className="space-y-5 relative z-10">
                            {/* Question Asked */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Question Asked</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                                    {typeof evaluation.improvedResponse === 'string' ? evaluation.improvedResponse : evaluation.improvedResponse.question}
                                </p>
                            </div>

                            {/* Original Answer */}
                            {typeof evaluation.improvedResponse !== 'string' && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">Your Answer</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic bg-amber-500/5 rounded-lg p-4 border-l-4 border-amber-500/30">
                                        {evaluation.improvedResponse.originalAnswer}
                                    </p>
                                </div>
                            )}

                            {/* Coached Improvement */}
                            {typeof evaluation.improvedResponse !== 'string' && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Coached Response</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-500/5 rounded-lg p-4 border-l-4 border-emerald-500/30">
                                        {evaluation.improvedResponse.improvedAnswer}
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="text-[10px] text-slate-500 mt-5 uppercase font-bold tracking-widest pl-1 opacity-70">
                            Pro Tip: Compare the two answers to see how the coaching tips apply in practice.
                        </p>
                    </div>
                )}


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
