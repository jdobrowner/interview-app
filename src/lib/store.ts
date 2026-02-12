import { create } from 'zustand';

export type ViewState = 'idle' | 'active' | 'evaluation';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface InterviewConfig {
    model: string;
    strategy: string;
    difficulty: 'Junior' | 'Senior' | 'Staff';
    temperature: number;
    topP: number;
}

export interface JobConfig {
    template: string;
    title: string;
    description: string;
}

interface AppState {
    viewState: ViewState;
    config: InterviewConfig;
    job: JobConfig;
    messages: ChatMessage[];
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
    strategySidebarOpen: boolean;

    // Actions
    setViewState: (view: ViewState) => void;
    setConfig: (config: Partial<InterviewConfig>) => void;
    setJob: (job: Partial<JobConfig>) => void;
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    clearChat: () => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    toggleStrategySidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    viewState: 'idle',
    config: {
        model: 'GPT-4o (Omni)',
        strategy: 'Chain-of-Thought',
        difficulty: 'Senior',
        temperature: 0.7,
        topP: 0.9,
    },
    job: {
        template: 'ML Ops Specialist',
        title: 'ML Ops Specialist',
        description: `Role: ML Ops Specialist
Core Responsibilities:
- Design and implement end-to-end ML pipelines using Kubeflow and Argo Workflows.
- Optimize model serving infrastructure for low-latency inference.
- Maintain CI/CD pipelines for automated model testing and deployment.
Requirements: Strong proficiency in Kubernetes, Python, and cloud infrastructure (GCP/AWS).`,
    },
    messages: [],
    theme: 'dark',
    sidebarCollapsed: false,
    strategySidebarOpen: false,

    setViewState: (view) => set({ viewState: view }),
    setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
    setJob: (job) => set((state) => ({ job: { ...state.job, ...job } })),
    addMessage: (message) => set((state) => ({
        messages: [
            ...state.messages,
            {
                ...message,
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
        ],
    })),
    clearChat: () => set({ messages: [] }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    toggleStrategySidebar: () => set((state) => ({ strategySidebarOpen: !state.strategySidebarOpen })),
}));
