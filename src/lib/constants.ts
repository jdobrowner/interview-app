export const MODELS = [
    'GPT-4o (Omni)',
    'Claude 3.5 Sonnet',
    'Llama 3 70B'
] as const;

export const STRATEGIES = [
    'Chain-of-Thought',
    'Standard Prompting',
    'Few-Shot Examples'
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

export const PROMPT_TEXTS: Record<string, string> = {
    'Chain-of-Thought': `You are an expert technical interviewer. Use Chain-of-Thought prompting to evaluate candidates. 
    
Before asking a question, break down the core competencies you want to test. 
After the candidate responds, internalize their logic, identify gaps, and then provide a follow-up that probes deeper into the specific area they seemed least confident about.

Always explain your reasoning internally before generating the output message.`,
    'Standard Prompting': `You are a professional technical interviewer. Your goal is to conduct a realistic simulation of a technical phone screen.

Ask one clear, concise question at a time. 
Listen to the user's response and provide immediate feedback or a natural follow-up question as a real interviewer would.
Maintain a high bar for technical accuracy and communication clarity.`,
    'Few-Shot Examples': `You are a technical interviewer following a structured rubric.

Example 1:
User: "I use React for everything."
Interviewer: "That's great for frontend. How do you handle state management in large scale applications specifically to avoid prop drilling?"

Example 2:
User: "We use a monolithic architecture."
Interviewer: "What were the primary drivers for that decision over microservices, and how do you manage database scaling in that setup?"

Now, continue the interview focusing on the provided job description.`
};
