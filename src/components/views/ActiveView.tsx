'use client';

import React, { useState } from 'react';
import JobConfigCard from '../features/JobConfigCard';
import { useAppStore } from '@/lib/store';

export default function ActiveView() {
    const { messages, addMessage, setViewState } = useAppStore();
    const [input, setInput] = useState('');

    // Sample data if no messages
    const displayMessages = messages.length > 0 ? messages : [
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I've reviewed the ML Ops Specialist role. To start our simulation, could you walk me through your experience building and scaling model deployment pipelines? Specifically, how do you handle versioning for both the models and the data they consume?",
            timestamp: '10:42 AM'
        },
        {
            id: '2',
            role: 'user',
            content: "In my previous role, I utilized DVC for data versioning integrated directly into our Git workflow. For model deployment, we used Seldon Core on Kubernetes. Every time a new model was trained, it was assigned a semantic version tag in our container registry, which allowed us to perform canary deployments and easy rollbacks if needed.",
            timestamp: '10:44 AM'
        },
        {
            id: '3',
            role: 'assistant',
            content: "Interesting approach with DVC. How did you manage the orchestration when a data update triggered a pipeline re-run? Did you implement any automated quality gates before the model moved from staging to production?",
            timestamp: '10:45 AM'
        }
    ];

    const handleSend = () => {
        if (!input.trim()) return;
        addMessage({ role: 'user', content: input });
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pb-32 custom-scrollbar">
                {/* Top Card: Job Configuration */}
                <section className="p-6 w-full max-w-5xl mx-auto">
                    <JobConfigCard />
                </section>

                {/* Chat Workspace */}
                <section className="px-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {displayMessages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20 border border-primary/30' : 'bg-slate-200 dark:bg-slate-800'
                                    }`}>
                                    <span className="material-icons text-sm">
                                        {msg.role === 'user' ? 'person' : 'smart_toy'}
                                    </span>
                                </div>
                                <div className={`space-y-2 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                    <div className={`text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                        {msg.role === 'assistant' ? 'AI Interviewer' : (msg.timestamp || 'Just now')}
                                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                        {msg.role === 'assistant' ? msg.timestamp : 'You'}
                                    </div>
                                    <div className={`p-4 rounded-xl border text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-primary/5 dark:bg-primary/10 border-primary/40 rounded-tr-none text-left dark:text-slate-200'
                                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-tl-none dark:text-slate-300'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Bottom Sticky Bar - Absolute positioning to stay fixed over scroll area */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-light dark:from-bg-dark via-bg-light dark:via-bg-dark to-transparent z-20">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <textarea
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-xl resize-none custom-scrollbar"
                            placeholder="Type your response..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button className="absolute left-4 bottom-4 text-slate-400 hover:text-primary transition cursor-pointer">
                            <span className="material-icons">mic</span>
                        </button>
                        <button
                            onClick={handleSend}
                            className="absolute right-4 bottom-3.5 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                            <span className="material-icons text-sm">send</span>
                        </button>
                    </div>
                    <button
                        onClick={() => setViewState('evaluation')}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition flex-shrink-0 cursor-pointer"
                    >
                        Finish Interview
                    </button>
                </div>
            </div>
        </div>
    );
}
