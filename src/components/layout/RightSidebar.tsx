'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
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

            <Button
                variant="ghost"
                size="icon"
                className="group relative"
            >
                <span className="material-icons">code</span>
                <span className="absolute right-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap">Snippets</span>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="group relative"
            >
                <span className="material-icons">description</span>
                <span className="absolute right-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap">Resume</span>
            </Button>

            <div className="mt-auto flex flex-col items-center gap-4">
                <div className="w-1 h-12 bg-slate-200 dark:bg-slate-800 rounded-full">
                    <div className="w-full h-0 bg-primary rounded-full"></div>
                </div>
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxOFP0lZL1159eV-aRQA15j3tZ38LjTpBenGzQW92fbuSstXQ6-YwBibFotpQZXS_iFClRwdFpEGQ6VC_-KB4mXSHKA-0IsZtFCrmbrhY80JCD74ZMYOS8fgRnXNgESdpotfhXLafLU3WukePQ3WNoNLjRKRUMCdGgB7Qg1kGHRLNZga5ITzrzw5JNhVddY5wDT9BZVuLZ6y2h9TZTiKBqbdMNMHzGBWu_By3B2BCnQ14LXUN8bG4jqreatZyc-rmUDggTI5yvXo7J"
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-800 grayscale"
                />
            </div>
        </aside>
    );
}
