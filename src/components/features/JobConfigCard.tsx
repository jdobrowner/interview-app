'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

export default function JobConfigCard() {
    const { job, setJob, viewState } = useAppStore();
    const [isCollapsed, setIsCollapsed] = React.useState(viewState === 'active');
    const [isAddingNew, setIsAddingNew] = React.useState(false);

    // Auto-collapse when interview starts
    React.useEffect(() => {
        if (viewState === 'active') {
            setIsCollapsed(true);
        }
    }, [viewState]);

    const handleAddNew = () => {
        setIsAddingNew(true);
        setJob({ template: 'Custom', description: '' });
        setIsCollapsed(false);
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setJob({ template: e.target.value });
        setIsAddingNew(false);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center gap-3 hover:text-primary transition-colors group cursor-pointer"
                    >
                        <span className={`material-icons text-slate-400 group-hover:text-primary transition-transform duration-300 ${isCollapsed ? '-rotate-90' : ''}`}>
                            expand_more
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="material-icons text-slate-400 text-sm">description</span>
                            <h3 className="font-semibold text-sm">Job Description</h3>
                        </div>
                    </button>
                    {!isAddingNew && (
                        <button
                            onClick={handleAddNew}
                            className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <span className="material-icons text-[12px]">add_circle</span>
                            Add New
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 uppercase font-bold">Templates</span>
                    <div className="relative">
                        <select
                            value={job.template}
                            onChange={handleTemplateChange}
                            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary appearance-none cursor-pointer h-8 flex items-center"
                        >
                            <option>ML Ops Specialist</option>
                            <option>Senior Frontend Engineer</option>
                            <option>Backend Architect</option>
                            <option>Custom</option>
                        </select>
                        <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] pointer-events-none">expand_more</span>
                    </div>
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[2000px] opacity-100'}`}>
                <div className="p-4 space-y-4">
                    {isAddingNew ? (
                        <textarea
                            className="w-full h-64 bg-slate-50 dark:bg-slate-950 border-none rounded-lg p-4 text-sm font-mono text-slate-800 dark:text-slate-200 shadow-inner focus:ring-1 focus:ring-primary/50 resize-none custom-scrollbar transition-colors"
                            placeholder="Paste Job Description here..."
                            value={job.description}
                            autoFocus
                            onChange={(e) => setJob({ description: e.target.value })}
                        />
                    ) : (
                        <div className="w-full bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 rounded-lg p-4 text-sm font-mono text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed shadow-sm">
                            {job.description || "No description selected. Click 'Add New' to paste one."}
                        </div>
                    )}

                    {isAddingNew && (
                        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAddingNew(false)}
                                    className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
                                >
                                    <span className="material-icons text-sm">save</span>
                                    Save to My Jobs
                                </button>
                                <button
                                    onClick={() => setJob({ description: '' })}
                                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-4 py-2 rounded-lg transition cursor-pointer"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                                <span className="material-icons text-sm opacity-50">info</span>
                                Editing mode active
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
