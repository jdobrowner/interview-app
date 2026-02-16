export const MODELS = [
    'Gemini 3 Flash Preview',
    'Gemini 2.5 Flash Lite',
    'Local (Ollama)'
] as const;

export const STRATEGIES = [
    'Recruiter Screen',
    'Hiring Manager',
    'Technical (Domain Knowledge)',
    'Technical (System Design)',
    'Leadership (CEO)'
] as const;

export const DIFFICULTIES = ['Junior', 'Senior', 'Staff'] as const;

export const JOB_TEMPLATES = [
    {
        name: 'AI Engineer',
        description: `Role: AI Engineer
Core Responsibilities:
- Integrate LLMs and generative AI features into production applications.
- Develop and tune prompts for various AI use cases.
- Build and maintain RAG (Retrieval-Augmented Generation) pipelines.
Requirements: Experience with OpenAI API, LangChain or LlamaIndex, and Python/TypeScript.`
    },
    {
        name: 'ML Ops Specialist',
        description: `Role: ML Ops Specialist
Core Responsibilities:
- Design and implement end-to-end ML pipelines using Kubeflow and Argo Workflows.
- Optimize model serving infrastructure for low-latency inference.
- Maintain CI/CD pipelines for automated model testing and deployment.
Requirements: Strong proficiency in Kubernetes, Python, and cloud infrastructure (GCP/AWS).`
    },
    {
        name: 'Frontend Engineer',
        description: `Role: Frontend Engineer
Core Responsibilities:
- Architect scalable React applications with modern state management.
- Ensure high performance and accessibility (WCAG 2.1) standards.
- Lead code reviews and mentor junior developers.
Requirements: Expert level React, TypeScript, and CSS-in-JS or Tailwind CSS.`
    },
    {
        name: 'Backend Architect',
        description: `Role: Backend Architect
Core Responsibilities:
- Design distributed systems and microservices architectures.
- Optimize database schemas and query performance at scale.
- Implement robust security protocols and identity management.
Requirements: Extensive experience with Node.js, Go, or Rust, and distributed systems.`
    },
    {
        name: 'Product Manager',
        description: `Role: Product Manager
Core Responsibilities:
- Define product strategy, roadmap, and requirements based on user needs.
- Collaborate with engineering and design to deliver high-impact features.
- Analyze product metrics and user feedback to inform future development.
Requirements: Strong communication, problem-solving skills, and experience in agile product development.`
    }
] as const;

// --- Ollama Defaults ---
export const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
export const DEFAULT_OLLAMA_MODEL = 'gemma3';

// --- Model API ID Mapping ---
// Maps display names (used in UI/store) to the actual API model identifiers
export const MODEL_IDS: Record<string, string> = {
    'Gemini 3 Flash Preview': 'gemini-3-flash-preview',
    'Gemini 2.5 Flash Lite': 'gemini-2.5-flash-lite',
};
