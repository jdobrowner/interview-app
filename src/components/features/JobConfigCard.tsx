'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

export default function JobConfigCard() {
    const { job, setJob } = useAppStore();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="material-icons text-slate-400">work_outline</span>
                    <h3 className="font-semibold text-sm">Job Configuration</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 uppercase font-bold">Templates</span>
                    <div className="relative">
                        <select
                            value={job.template}
                            onChange={(e) => setJob({ template: e.target.value })}
                            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                        >
                            <option>ML Ops Specialist</option>
                            <option>Senior Frontend Engineer</option>
                            <option>Backend Architect</option>
                        </select>
                        <span className="material-icons absolute right-2 top-1.5 text-slate-400 text-[16px] pointer-events-none">expand_more</span>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <textarea
                    className="w-full h-32 bg-slate-50 dark:bg-slate-950 border-none rounded-lg p-4 text-sm font-mono text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-primary/50 resize-none custom-scrollbar"
                    placeholder="Paste Job Description here..."
                    value={job.description}
                    onChange={(e) => setJob({ description: e.target.value })}
                />

                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <button className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition">
                            <span className="material-icons text-sm">save</span>
                            Save to My Jobs
                        </button>
                        <button
                            onClick={() => setJob({ description: '' })}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-4 py-2 rounded-lg transition"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="material-icons text-sm">history</span>
                        Draft saved
                    </div>
                </div>
            </div>
        </div>
    );
}
