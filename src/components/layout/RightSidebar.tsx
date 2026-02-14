'use client';

import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';

export default function RightSidebar() {
    const { toggleHistorySidebar } = useAppStore();

    return (
        <aside className="w-16 bg-white dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-6">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleHistorySidebar}
                className="group relative"
            >
                <span className="material-icons">history</span>
                <span className="absolute right-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap">History</span>
            </Button>

            <div className="mt-auto flex flex-col items-center gap-4">
                <div className="w-1 h-12 bg-slate-200 dark:bg-slate-800 rounded-full">
                    <div className="w-full h-0 bg-primary rounded-full"></div>
                </div>
            </div>
        </aside>
    );
}
