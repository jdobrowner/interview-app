import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MODELS, STRATEGIES, DIFFICULTIES, JOB_TEMPLATES, DEFAULT_OLLAMA_URL, DEFAULT_OLLAMA_MODEL } from './constants';

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
    improvedResponse: {
        question: string;
        originalAnswer: string;
        improvedAnswer: string;
    };
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

    // Chat actions
    isAiThinking: boolean;
    sendMessage: (input: string) => Promise<void>;
    triggerOpeningQuestion: () => Promise<void>;

    // Evaluation actions
    evaluation: Evaluation | null;
    evaluationLoading: boolean;
    evaluationError: string | null;
    fetchEvaluation: () => Promise<void>;

    // Navigation and Session Loading
    loadSession: (sessionId: string) => void;

    // Setters
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

const DEFAULT_JOB = JOB_TEMPLATES[0];

const createInterviewSlice: StateCreator<RootState, [["zustand/persist", unknown]], [], InterviewSlice> = (set, get) => ({
    viewState: 'idle',
    config: {
        model: MODELS[0],
        strategy: STRATEGIES[0],
        difficulty: DIFFICULTIES[1],
        temperature: 0.7,
        topP: 0.9,
        ollamaBaseUrl: DEFAULT_OLLAMA_URL,
        ollamaModelName: DEFAULT_OLLAMA_MODEL,
    },
    job: {
        template: DEFAULT_JOB.name,
        title: DEFAULT_JOB.name,
        description: DEFAULT_JOB.description,
    },
    messages: [],
    isProcessing: false,
    customJobs: [],
    isAiThinking: false,
    evaluation: null,
    evaluationLoading: false,
    evaluationError: null,

    // --- Chat Actions ---

    triggerOpeningQuestion: async () => {
        set({ isAiThinking: true });
        const state = get();
        state.addMessage({ role: 'assistant', content: '' });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'Please begin the interview.' }],
                    config: get().config,
                    job: get().job,
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
                get().updateLastMessage(chunk);
            }
        } catch (error) {
            console.error('Error getting opening question:', error);
            get().updateLastMessage(
                "Hello! I'm ready to begin your interview simulation. Could you start by telling me about your background and experience relevant to this role?"
            );
        } finally {
            set({ isAiThinking: false });
        }
    },

    sendMessage: async (input: string) => {
        if (!input.trim() || get().isAiThinking) return;

        const state = get();
        state.addMessage({ role: 'user', content: input });
        set({ isAiThinking: true });
        state.addMessage({ role: 'assistant', content: '' });

        try {
            const { config, job, messages } = get();
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages, config, job }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error('No reader available');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                get().updateLastMessage(chunk);
            }
        } catch (error) {
            console.error('Error streaming response:', error);
            get().updateLastMessage(' [Error: Failed to connect. Please check your API key or model configuration.]');
        } finally {
            set({ isAiThinking: false });
        }
    },

    // --- Evaluation Actions ---

    fetchEvaluation: async () => {
        const state = get();
        const { selectedSessionId, sessions, evaluation: existing } = state;

        // If we already have an evaluation in the current session state, don't re-fetch
        if (existing) return;

        // If we are viewing a historical session, check if it already has an evaluation
        if (selectedSessionId) {
            const session = sessions.find(s => s.id === selectedSessionId);
            if (session?.evaluation) {
                set({
                    evaluation: session.evaluation,
                    evaluationLoading: false,
                    evaluationError: null
                });
                return;
            }
        }

        const { messages, job, config } = get();

        if (messages.length === 0) {
            set({
                evaluationLoading: false,
                evaluationError: 'No interview transcript found. Start a practice session first.',
            });
            return;
        }

        set({ evaluationLoading: true, evaluationError: null });

        try {
            const response = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job, config, messages }),
            });

            if (!response.ok) throw new Error('Evaluation failed');

            const data: Evaluation = await response.json();
            set({ evaluation: data, evaluationLoading: false });

            // Persist to history
            const { selectedSessionId: sid, updateSessionEvaluation } = get();
            if (sid) {
                updateSessionEvaluation(sid, data);
            }
        } catch (err) {
            console.error('Evaluation error:', err);
            set({
                evaluationLoading: false,
                evaluationError: 'Failed to generate evaluation. Please try again.',
            });
        }
    },

    // --- Navigation and Session Loading ---

    loadSession: (sessionId: string) => {
        const { sessions } = get();
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            console.error(`Session ${sessionId} not found`);
            return;
        }

        // Hydrate all state from the session
        set({
            config: session.config,
            job: session.job,
            messages: session.messages,
            evaluation: session.evaluation || null,
            selectedSessionId: sessionId,
            evaluationError: null,
            evaluationLoading: false
        });
    },

    // --- Setters ---

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
    clearChat: () => set({ messages: [], evaluation: null, evaluationLoading: false, evaluationError: null }),
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

