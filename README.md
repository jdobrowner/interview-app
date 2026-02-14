This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## System Architecture & Orchestration

This application implements a high-performance, three-tier architecture designed for low-latency conversational AI:

1.  **State Management (Zustand)**: Orchestrates the interview lifecycle, maintaining real-time message history, job configurations, and strategy selections.
2.  **API Integration Layer (Edge Runtime)**: A secure Next.js route (`/api/chat`) that sanitizes requests and manages sensitive environment variables.
3.  **Inference Layer (Google Gemini)**: Utilizing the **Vercel AI SDK** to facilitate real-time, streaming text generation at the edge.

### System Prompt Management
To maintain a clean separation of concerns, our prompting logic is decoupled from the application logic:

-   **The Prompt Library (`src/lib/ai/systemPrompts.ts`)**: This module acts as the definitive storage for **System Prompts**. It contains 5 specialized strategy fragments:
    -   `Standard Prompting`: Standard technical phone screen simulation.
    -   `Chain-of-Thought`: Enhanced reasoning for deep technical probing.
    -   `Few-Shot Examples`: Pattern-based questioning based on structured templates.
    -   `Behavioral (STAR)`: Focused on leadership, accountability, and the STAR methodology.
    -   `System Design`: High-level architectural challenges focused on scalability and trade-offs.
-   **The Prompt Composer (`src/lib/ai/promptBuilder.ts`)**: This utility dynamically assembles the master system instruction by injecting the user's specific job description and interview parameters into the selected strategy fragment.

### AI Inference & Context Injection
The interaction flow within `src/app/api/chat/route.ts` follows a strict protocol:

1.  **Instruction Synthesis**: The server generates a master system instruction via `buildSystemPrompt`.
2.  **Model Priming**: This instruction is passed to the Gemini model using the **`system`** property, which establishes the persona and ruleset before the first token is generated.
3.  **Token Streaming**: Gemini processes the context and initiates a word-by-word text stream, which is decoded and rendered in the frontend for an immersive user experience.

## Development Roadmap
