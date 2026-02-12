'use client';

import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { useAppStore } from '@/lib/store';
import IdleView from '../views/IdleView';
import ActiveView from '../views/ActiveView';
import EvaluationView from '../views/EvaluationView';

export default function AppShell() {
    const viewState = useAppStore((state) => state.viewState);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans h-screen flex overflow-hidden">
            {viewState !== 'evaluation' && <LeftSidebar />}

            <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
                {viewState === 'idle' && <IdleView />}
                {viewState === 'active' && <ActiveView />}
                {viewState === 'evaluation' && <EvaluationView />}
            </main>

            <RightSidebar />
        </div>
    );
}
