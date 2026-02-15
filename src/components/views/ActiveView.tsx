'use client';

import React, { useState, useEffect, useRef } from 'react';
import JobConfigCard from '../features/JobConfigCard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function ActiveView() {
    const {
        messages,
        addMessage,
        setViewState,
        saveCurrentSession,
    } = useAppStore();
    const [input, setInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const hasInitialized = useRef(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
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

    const triggerOpeningQuestion = async () => {
        setIsAiThinking(true);
        addMessage({ role: 'assistant', content: '' });

        const { config, job } = useAppStore.getState();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'Please begin the interview.' }],
                    config,
                    job,
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch opening question');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error('No reader available');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                useAppStore.getState().updateLastMessage(chunk);
            }
        } catch (error) {
            console.error('Error getting opening question:', error);
            useAppStore.getState().updateLastMessage(
                "Hello! I'm ready to begin your interview simulation. Could you start by telling me about your background and experience relevant to this role?"
            );
        } finally {
            setIsAiThinking(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isAiThinking) return;

        // 1. Add User Message
        const userMsg = input;
        addMessage({ role: 'user', content: userMsg });
        setInput('');
        setIsAiThinking(true);

        // 2. Create placeholder for AI response
        addMessage({ role: 'assistant', content: '' });

        // 3. Stream response from interviewer
        setIsAiThinking(false);

        const { config, job, messages } = useAppStore.getState();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages,
                    config,
                    job
                })
            });

            if (!response.ok) throw new Error('Failed to fetch Gemini response');

            const reader = response.body?.getReader();
            /* Phase G: Enhanced Evaluation & History
            Refined the post-interview experience and data persistence:
            - **UI Cleanup**: Removed brain icon from `IdleView` for a professional, focused start.
            - **Advanced Coaching**: Updated `EvaluationPrompt` to generate a detailed "Improved Response" sample.
            - **Persistent History**: Evaluations are now saved in `localStorage` alongside transcripts; clicking history items restores the full report instantly.
            - **Conversation Replay**: Added "View Conversation" to the report, allowing users to review their transcript in a read-only mode with a "Return to Evaluation" bridge.
            
            ## 3-Model Architecture (Final)
            
            ```mermaid
            graph LR
                A["User Input"] --> B["SecurityShield<br/>gemini-2.5-flash-lite"]
                B -->|SAFE| C["Interviewer<br/>gemini-3-flash-preview"]
                B -->|BLOCKED| D["Inline Warning"]
                C --> E["Transcript"]
                E -->|Finish Interview| F["Coach<br/>gemini-3-flash-preview"]
                F --> G["Performance Report<br/>+ Improved Response"]
            ```
            
            ## Final Verification
            
            ✅ `npm run build` — Successful; all routes and persistence logic verified.
            ✅ **Persistence Test** — Refreshed page and restored evaluation from history sidebar successfully.
            
            ````carousel
            ![Idle View — Cleaned up interface (brain icon removed)](/Users/jasondobrowner/.gemini/antigravity/brain/710cfb73-8c02-45c8-b6de-0cb27fe2c7dd/idle_view_no_icon_1771146164732.png)
            <!-- slide -->
            ![Performance Report — Now includes AI-Improved Response Sample and View Conversation bridge](/Users/jasondobrowner/.gemini/antigravity/brain/710cfb73-8c02-45c8-b6de-0cb27fe2c7dd/evaluation_with_improved_response_v2_1771146549698.png)
            <!-- slide -->
            ![Conversation Replay — Read-only transcript view with Back to Evaluation navigation](/Users/jasondobrowner/.gemini/antigravity/brain/710cfb73-8c02-45c8-b6de-0cb27fe2c7dd/history_replay_fixed_1771146701618.png)
            ````
            
            ![Final verification flow recording](/Users/jasondobrowner/.gemini/antigravity/brain/710cfb73-8c02-45c8-b6de-0cb27fe2c7dd/phase_g_verification_fixed_1771146675555.webp)
            */
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader available');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                useAppStore.getState().updateLastMessage(chunk);
            }
        } catch (error) {
            console.error('Error streaming from Gemini:', error);
            useAppStore.getState().updateLastMessage(" [Error: Failed to connect to Gemini. Please check your API key.]");
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pb-32 custom-scrollbar">
                {/* Top Card: Job Configuration - Hidden in read-only mode */}
                {!isReadOnly && (
                    <section className="p-6 w-full max-w-5xl mx-auto">
                        <JobConfigCard />
                    </section>
                )}


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
