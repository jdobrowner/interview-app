# Product Design Record (PDR): Open-Source Interview Studio

## 1. Project Vision
*   **Goal**: A high-performance, single-page application (SPA) for mock interview practice.
*   **Engineering Focus**: Transitioning from proprietary APIs to Open-Source LLMs to demonstrate architectural flexibility and cost optimization.
*   **Deployment**: Optimized for the Vercel edge runtime using Next.js.

## 2. Technical Stack & Environment
*   **Framework**: Next.js (App Router preferred for streaming support).
*   **Deployment**: Vercel (utilizing Edge Functions for low-latency AI responses).
*   **Model Provider**: Google Gemini (Flash/Pro) for intelligent reasoning and high concurrency.
*   **Security**: API keys and sensitive environment variables are stored in `.env.local` and Vercel's encrypted dashboard, never exposed to the client.

## 3. The "Open Model" Strategy
Instead of a hardcoded provider, the app uses a Model-Agnostic Interface.
*   **Research Requirement**: We must research and identify appropriate open models (e.g., Llama 4, DeepSeek-V3, or Qwen 2.5) that balance reasoning capabilities with inference speed.
*   **Configuration**: Users select models from a dynamic list populated by our research.

## 4. UI Architecture & States
The UI supports a "Hybrid Toggle" to switch between a Playground (configuration-heavy) and Immersive (conversation-focused) experience.

| State      | Sidebar Visibility | Component Focus                                      |
| :---       | :---               | :---                                                 |
| Idle       | Expanded           | Template selection & Job Description setup.          |
| Active     | Collapsible        | Real-time chat with streaming text from open models. |
| Evaluation | Hidden             | Post-interview analysis & performance dashboard.     |

## 5. Key Functional Components
*   **InterviewManager**: Handles the logic for starting/ending sessions and triggering the "Evaluation" prompt.
*   **JobVault**: Manages local storage for saving/loading custom job descriptions.
*   **PromptEngine**: Manages 5 distinct system prompt strategies (Zero-Shot, Few-Shot, Chain-of-Thought, etc.).
*   **SecurityShield**: A middleware layer to sanitize user input and prevent prompt injection before sending to the open model.

## 6. Development Roadmap
*   **Phase 1**: Set up Next.js boilerplate and Tailwind CSS for the Hybrid Layout.
*   **Phase 2**: Implement localStorage hooks for job templates and history.
*   **Phase 3**: Integrate Google Gemini AI using Vercel AI SDK.
*   **Phase 4**: Build the streaming chat interface using the Vercel AI SDK.
*   **Phase 5**: Deploy to Vercel and verify edge function performance.