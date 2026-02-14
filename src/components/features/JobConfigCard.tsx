'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { JOB_TEMPLATES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function JobConfigCard() {
    const { job, setJob, viewState, customJobs, addCustomJob } = useAppStore();
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
        setJob({ template: 'Custom', title: '', description: '' });
        setIsCollapsed(false);
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const builtIn = JOB_TEMPLATES.find(t => t.name === val);
        const custom = customJobs.find(j => j.title === val);
        setJob({
            template: val,
            title: val,
            description: builtIn ? builtIn.description : custom ? custom.description : ''
        });
        setIsAddingNew(false);
    };

    const allTemplateNames = [
        ...JOB_TEMPLATES.map(t => t.name),
        ...customJobs.map(j => j.title),
        'Custom',
    ];

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
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500 uppercase font-bold">Templates</span>
                        <Select
                            value={job.template}
                            disabled={viewState === 'active'}
                            onChange={handleTemplateChange}
                            options={(allTemplateNames as string[])}
                            className="h-8 py-1.5 text-xs"
                        />
                    </div>
                    {!isAddingNew && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleAddNew}
                            className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1 h-7 rounded font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <span className="material-icons text-[12px]">add_circle</span>
                            Add New
                        </Button>
                    )}
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[2000px] opacity-100'}`}>
                <div className="p-4 space-y-4">
                    {isAddingNew ? (
                        <div className="space-y-4">
                            <Input
                                label="Job Title"
                                placeholder="e.g. Senior Product Designer"
                                value={job.title}
                                onChange={(e) => setJob({ title: e.target.value })}
                            />
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Job Description</label>
                                <textarea
                                    className="w-full h-64 bg-slate-50 dark:bg-slate-950 border-none rounded-lg p-4 text-sm font-mono text-slate-800 dark:text-slate-200 shadow-inner focus:ring-1 focus:ring-primary/50 resize-none custom-scrollbar transition-colors"
                                    placeholder="Paste Job Description here..."
                                    value={job.description}
                                    onChange={(e) => setJob({ description: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="w-full bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 rounded-lg p-4 text-sm font-mono text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed shadow-sm">
                                {job.description || "No description selected. Click 'Add New' to paste one."}
                            </div>
                        </div>
                    )}

                    {isAddingNew && (
                        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        if (job.title && job.description) {
                                            addCustomJob({ template: job.title, title: job.title, description: job.description });
                                        }
                                        setIsAddingNew(false);
                                    }}
                                    className="px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <span className="material-icons text-sm">save</span>
                                    Save to My Jobs
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setJob({ description: '' })}
                                    className="px-4 py-2 rounded-lg"
                                >
                                    Clear
                                </Button>
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
