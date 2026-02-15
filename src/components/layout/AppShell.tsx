'use client';

import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import StrategyDetailSidebar from './StrategyDetailSidebar';
import HistorySidebar from './HistorySidebar';
import { useAppStore } from '@/lib/store';
import IdleView from '../views/IdleView';
import ActiveView from '../views/ActiveView';
import EvaluationView from '../views/EvaluationView';
import HistoryView from '../views/HistoryView';

export default function AppShell() {
    const { viewState, theme, sidebarCollapsed } = useAppStore();

    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans h-screen w-screen flex overflow-hidden">
            <LeftSidebar />
            <StrategyDetailSidebar />
            <HistorySidebar />

            <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative overflow-hidden">
                {viewState === 'idle' && <IdleView />}
                {(viewState === 'active' || viewState === 'history_replay') && <ActiveView />}
                {viewState === 'evaluation' && <EvaluationView />}
                {viewState === 'history' && <HistoryView />}
            </main>

            <RightSidebar />
        </div>
    );
}
