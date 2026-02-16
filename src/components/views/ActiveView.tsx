'use client';

import React, { useState, useEffect, useRef } from 'react';
import JobConfigCard from '../features/JobConfigCard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function ActiveView() {
    const {
        messages,
        isAiThinking,
        sendMessage,
        triggerOpeningQuestion,
        setViewState,
        saveCurrentSession,
    } = useAppStore();
    const [input, setInput] = useState('');
    const hasInitialized = useRef(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { viewState: currentViewState } = useAppStore();
    const isReadOnly = currentViewState === 'history_replay';

    // Auto-grow textarea height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    // When the interview starts, have the AI send an opening question
    useEffect(() => {
        if (messages.length === 0 && !hasInitialized.current) {
            hasInitialized.current = true;
            triggerOpeningQuestion();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isAiThinking) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pb-32 custom-scrollbar">
                {/* Top Card: Job Configuration - Always visible for context */}
                <section className="p-6 w-full max-w-5xl mx-auto">
                    <JobConfigCard />
                </section>


                {/* Chat Workspace */}
                <section className="px-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.map((msg) => (
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
                                        {msg.content || (
                                            <span className="inline-flex items-center gap-1.5 text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </section>
            </div>

            {/* Bottom Sticky Bar - Absolute positioning to stay fixed over scroll area */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent z-20">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
                    {isReadOnly ? (
                        <Button
                            variant="secondary"
                            onClick={() => setViewState('evaluation')}
                            className="px-8 py-4 text-xs tracking-widest uppercase flex items-center gap-2 group shadow-xl"
                        >
                            <span className="material-icons text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
                            Return to Evaluation
                        </Button>
                    ) : (
                        <>
                            <div className="flex-1 relative group">
                                <textarea
                                    ref={textareaRef}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-5 pr-12 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-xl resize-none scrollbar-none"
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
                                <button
                                    onClick={handleSend}
                                    className="absolute right-4 bottom-3.5 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition cursor-pointer"
                                >
                                    <span className="material-icons text-sm">send</span>
                                </button>
                            </div>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    const id = saveCurrentSession();
                                    if (id) useAppStore.getState().setSelectedSessionId(id);
                                    setViewState('evaluation');
                                }}
                                className="px-6 py-4 text-xs tracking-widest uppercase flex-shrink-0"
                            >
                                Finish Interview
                            </Button>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
