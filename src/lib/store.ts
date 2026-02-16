import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Global Types ---

export type ViewState = 'idle' | 'active' | 'evaluation' | 'history' | 'history_replay';

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
    ollamaBaseUrl?: string;
    ollamaModelName?: string;
}

export interface JobConfig {
    template: string;
    title: string;
    description: string;
}

export interface Evaluation {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    positives: string[];
    improvements: string[];
    transcriptSummary: string;
    improvedResponse: string; // New field for Phase G
}

export interface InterviewSession {
    id: string;
    date: string;
    job: JobConfig;
    config: InterviewConfig;
    messages: ChatMessage[];
    evaluation?: Evaluation;
}

// --- Slice Interfaces ---

interface UISlice {
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
    strategySidebarOpen: boolean;
    historySidebarOpen: boolean;
    selectedSessionId: string | null; // Track which historical session is being viewed
    toggleTheme: () => void;
    toggleSidebar: () => void;
    toggleStrategySidebar: () => void;
    toggleHistorySidebar: () => void;
    setSelectedSessionId: (id: string | null) => void;
}

interface InterviewSlice {
    viewState: ViewState;
    config: InterviewConfig;
    job: JobConfig;
    messages: ChatMessage[];
    isProcessing: boolean;
    customJobs: JobConfig[];
    setViewState: (view: ViewState) => void;
    setConfig: (config: Partial<InterviewConfig>) => void;
    setJob: (job: Partial<JobConfig>) => void;
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'> | ChatMessage) => void;
    updateLastMessage: (content: string) => void;
    clearChat: () => void;
    addCustomJob: (job: JobConfig) => void;
    removeCustomJob: (title: string) => void;
}

interface VoiceSlice {
    isRecording: boolean;
    isPlaying: boolean;
    currentTranscript: string;
    setRecording: (recording: boolean) => void;
    setPlaying: (playing: boolean) => void;
    setTranscript: (transcript: string) => void;
    toggleRecording: () => void;
    togglePlaying: () => void;
}

interface HistorySlice {
    sessions: InterviewSession[];
    addSession: (session: InterviewSession) => void;
    saveCurrentSession: () => string | null; // Return ID of new session
    updateSessionEvaluation: (sessionId: string, evaluation: Evaluation) => void;
    clearHistory: () => void;
}

export type RootState = UISlice & InterviewSlice & VoiceSlice & HistorySlice;

// --- Slice Implementation ---

const createUISlice: StateCreator<RootState, [["zustand/persist", unknown]], [], UISlice> = (set) => ({
    theme: 'light',
    sidebarCollapsed: false,
    strategySidebarOpen: false,
    historySidebarOpen: false,
    selectedSessionId: null,
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    toggleStrategySidebar: () => set((state) => ({ strategySidebarOpen: !state.strategySidebarOpen })),
    toggleHistorySidebar: () => set((state) => ({ historySidebarOpen: !state.historySidebarOpen })),
    setSelectedSessionId: (id) => set({ selectedSessionId: id }),
});

const createInterviewSlice: StateCreator<RootState, [["zustand/persist", unknown]], [], InterviewSlice> = (set) => ({
    viewState: 'idle',
    config: {
        model: 'Gemini 3 Flash Preview',
        strategy: 'Recruiter Screen',
        difficulty: 'Senior',
        temperature: 0.7,
        topP: 0.9,
        ollamaBaseUrl: 'http://localhost:11434',
        ollamaModelName: 'gemma3',
    },
    job: {
        template: 'AI Engineer',
        title: 'AI Engineer',
        description: `Role: AI Engineer
Core Responsibilities:
- Integrate LLMs and generative AI features into production applications.
- Develop and tune prompts for various AI use cases.
- Build and maintain RAG (Retrieval-Augmented Generation) pipelines.
Requirements: Experience with OpenAI API, LangChain or LlamaIndex, and Python/TypeScript.`,
    },
    messages: [],
    isProcessing: false,
    customJobs: [],
    setViewState: (view) => set({ viewState: view }),
    setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
    setJob: (job) => set((state) => ({ job: { ...state.job, ...job } })),
    addMessage: (message) => set((state) => ({
        messages: [
            ...state.messages,
            {
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                ...message,
            },
        ],
    })),
    updateLastMessage: (content) => set((state) => {
        const messages = [...state.messages];
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            messages[messages.length - 1] = {
                ...lastMsg,
                content: lastMsg.content + content
            };
        }
        return { messages };
    }),
    clearChat: () => set({ messages: [] }),
    addCustomJob: (job) => set((state) => ({
        customJobs: [...state.customJobs, job],
    })),
    removeCustomJob: (title) => set((state) => ({
        customJobs: state.customJobs.filter((j) => j.title !== title),
    })),
});

const createVoiceSlice: StateCreator<RootState, [["zustand/persist", unknown]], [], VoiceSlice> = (set) => ({
    isRecording: false,
    isPlaying: false,
    currentTranscript: '',
    setRecording: (isRecording) => set({ isRecording }),
    setPlaying: (isPlaying) => set({ isPlaying }),
    setTranscript: (currentTranscript) => set({ currentTranscript }),
    toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
    togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
});

const createHistorySlice: StateCreator<RootState, [["zustand/persist", unknown]], [], HistorySlice> = (set, get) => ({
    sessions: [],
    addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
    saveCurrentSession: () => {
        const state = get();
        if (state.messages.length === 0) return null;

        const id = Math.random().toString(36).substring(7);
        const newSession: InterviewSession = {
            id,
            date: new Date().toLocaleDateString(),
            job: state.job,
            config: state.config,
            messages: state.messages,
        };

        set((state) => ({ sessions: [newSession, ...state.sessions] }));
        return id;
    },
    updateSessionEvaluation: (sessionId, evaluation) => set((state) => ({
        sessions: state.sessions.map(s => s.id === sessionId ? { ...s, evaluation } : s)
    })),
    clearHistory: () => set({ sessions: [] }),
});

// --- Root Store ---

export const useAppStore = create<RootState>()(
    persist(
        (...a) => ({
            ...createUISlice(...a),
            ...createInterviewSlice(...a),
            ...createVoiceSlice(...a),
            ...createHistorySlice(...a),
        }),
        {
            name: 'interview-prep-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist UI, Interview (config/job), and History
            partialize: (state) => ({
                theme: state.theme,
                sidebarCollapsed: state.sidebarCollapsed,
                config: state.config,
                job: state.job,
                sessions: state.sessions,
                customJobs: state.customJobs,
            }),
        }
    )
);

