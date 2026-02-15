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
        name: 'ML Ops Specialist',
        description: `Role: ML Ops Specialist
Core Responsibilities:
- Design and implement end-to-end ML pipelines using Kubeflow and Argo Workflows.
- Optimize model serving infrastructure for low-latency inference.
- Maintain CI/CD pipelines for automated model testing and deployment.
Requirements: Strong proficiency in Kubernetes, Python, and cloud infrastructure (GCP/AWS).`
    },
    {
        name: 'Senior Frontend Engineer',
        description: `Role: Senior Frontend Engineer
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
    }
] as const;

