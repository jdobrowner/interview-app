# AI Interview Prep Studio

A real-time, AI-powered technical interview simulator built with Next.js and Google Gemini. Practice mock interviews tailored to specific job descriptions, receive live AI feedback, and get a detailed post-session performance report — all from your browser.

## Features

### 🎯 Multi-Model Gemini Architecture

The application uses three specialized Gemini models, each optimized for a different stage of the interview lifecycle:

| Stage | Model | Purpose |
|:---|:---|:---|
| **Interviewer** | `gemini-3-flash-preview` | Low-latency streaming chat for realistic conversational flow |
| **Coach** | `gemini-3-flash-preview` | Deep reasoning for post-session transcript analysis and scoring |
| **Shield** | `gemini-2.5-flash-lite` | Ultra-fast input classification to guard against misuse |

### 💬 Streaming Interview Chat

The core experience is a real-time, streaming conversation with an AI interviewer. Messages are streamed token-by-token from Gemini, producing a natural interview cadence with no perceptible lag.

**Technical details:**
- Server-side streaming via the Vercel AI SDK's `streamText()` in `/api/chat/route.ts`
- Client-side `ReadableStream` decoding in `ActiveView.tsx` for progressive rendering
- Configurable `temperature` and `topP` sliders that pass directly to Gemini's inference parameters

### 🛡️ SecurityShield (Input Guard)

Every user message is pre-screened by `gemini-2.5-flash-lite` before reaching the interviewer. The guard classifies input as `SAFE` or `BLOCKED` based on:

- Prompt injection attempts (e.g., "ignore your instructions")
- Off-topic requests (e.g., asking for recipes or stories)
- Harmful or inappropriate content
- System prompt extraction attempts

**Blocked messages** produce an inline chat warning — no disruptive popups, no page navigation. The user is simply asked to rephrase.

**Implementation:**
- `src/lib/ai/securityShield.ts` — Classification prompt and response parser with `SAFE`/`BLOCKED: <reason>` format
- `src/app/api/guard/route.ts` — Lightweight API route using `generateText()` (non-streaming)
- Fail-open design: if the guard crashes, the message proceeds to the interviewer

### 📊 AI-Powered Performance Evaluation

When the user clicks "Finish Interview," the entire transcript is sent to `gemini-3-flash-preview` for deep analysis. The model returns structured JSON with:

- **Overall Score** (0–100)
- **Technical Depth Score** (0–100)
- **Communication Score** (0–100)
- **Strengths** — What the candidate did well
- **Improvements** — Areas to work on
- **Session Summary** — A 2–3 sentence overview

The `EvaluationView` shows a loading animation while Gemini processes the transcript, then renders the scores as animated progress bars with color-coded feedback cards.

**Implementation:**
- `src/lib/ai/evaluationPrompt.ts` — Builds the evaluation prompt with full transcript, job context, and difficulty level
- `src/app/api/evaluate/route.ts` — Non-streaming `generateText()` call with JSON parsing
- `src/components/views/EvaluationView.tsx` — Loading state → error handling → dynamic rendering

### 🧠 5 Interview Personas (Prompt Strategies)

Each persona simulates a different interviewer the candidate might face during a real hiring loop. Each is backed by a distinct prompt engineering technique:

| Persona | Technique | Who You're Talking To |
|:---|:---|:---|
| Recruiter Screen | Zero-Shot | A Talent Acquisition Specialist — high-level background, motivation, and cultural fit |
| Hiring Manager | Behavioral Modeling | The Hiring Manager — STAR method evaluation of ownership, impact, and collaboration |
| Technical (Domain Knowledge) | Few-Shot | A Senior Engineer — few-shot examples calibrate the depth of domain-specific questions |
| Technical (System Design) | System Design | A Systems Architect — scalability, trade-offs, component selection, failure scenarios |
| Leadership (CEO) | Chain-of-Thought | The CEO — chain-of-thought reasoning to probe strategic thinking and business acumen |

### 🔧 How the AI Prompt is Assembled

The system prompt sent to Gemini is dynamically constructed at request time through a two-layer pipeline:

```
User selects a Persona (e.g. "Technical (Domain Knowledge)") in the sidebar
                              ↓
/api/chat/route.ts calls buildSystemPrompt(job, config)
                              ↓
promptBuilder.ts looks up SYSTEM_PROMPTS[config.strategy]
  → Retrieves the PromptStrategy object from systemPrompts.ts
  → Extracts its .content (the technique-specific instructions)
                              ↓
promptBuilder.ts assembles the FINAL system prompt by combining:
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. PERSONA          — Role identity + conciseness rules    │
  │ 2. JOB DESCRIPTION  — The full job description text        │
  │ 3. INTERVIEW PARAMS — Difficulty level + persona name      │
  │ 4. STRATEGY CONTENT — The .content from systemPrompts.ts   │
  │                       (Few-Shot examples, STAR method,     │
  │                        Chain-of-Thought instructions, etc.)│
  │ 5. RULES            — "Ask ONE question at a time,"        │
  │                       "Don't provide answers," etc.        │
  └─────────────────────────────────────────────────────────────┘
                              ↓
Final assembled prompt is sent as the `system` parameter to Gemini
```

**Layer 1 — Strategy Fragments** (`systemPrompts.ts`):
Each persona is a `PromptStrategy` object with `content` (the actual prompt fragment), `description` (human-readable summary), and `technique` (the prompting method used). These are the building blocks.

**Layer 2 — Prompt Composer** (`promptBuilder.ts`):
Takes the selected strategy fragment and wraps it in the full interview context — the job description, difficulty level, persona identity, conciseness rules, and behavioral constraints. This is the final prompt Gemini receives.

**Implementation:**
- `src/lib/ai/systemPrompts.ts` — 5 persona prompt fragments, each using a specific prompting technique
- `src/lib/ai/promptBuilder.ts` — Assembles the master system prompt by injecting job context + strategy content
- `src/components/layout/StrategyDetailSidebar.tsx` — Slide-out panel showing the strategy description, technique, and raw prompt

### 💼 JobVault (Custom Job Persistence)

Users can select from built-in job templates or create their own:

- **3 built-in templates:** ML Ops Specialist, Senior Frontend Engineer, Backend Architect
- **"Add New" flow:** Input a custom title and description, then "Save to My Jobs"
- **Persistence:** Custom jobs are stored in `localStorage` via Zustand's `persist` middleware and appear in the template dropdown alongside built-in options

**Implementation:**
- `src/lib/store.ts` — `customJobs: JobConfig[]` with `addCustomJob()` and `removeCustomJob()` actions
- `src/components/features/JobConfigCard.tsx` — Merges `customJobs` with `JOB_TEMPLATES` in the dropdown

### 📜 Session History

Every completed interview is automatically saved with its full transcript, job configuration, and strategy settings. Users can:

- Browse past sessions in the History sidebar
- Reload any previous session's transcript
- Review evaluations from past interviews

**Implementation:**
- `src/lib/store.ts` — `HistorySlice` with `saveCurrentSession()` that snapshots messages, job, and config
- `src/components/layout/HistorySidebar.tsx` — Slide-out panel listing saved sessions
- `src/components/views/HistoryView.tsx` — Full session detail view with message replay

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Interviewer — gemini-3-flash-preview streaming
│   │   ├── evaluate/route.ts      # Coach — gemini-3-flash-preview evaluation
│   │   └── guard/route.ts         # Shield — gemini-2.5-flash-lite guard
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── features/
│   │   └── JobConfigCard.tsx      # Job template selection + custom input
│   ├── layout/
│   │   ├── AppShell.tsx           # Root layout with view routing
│   │   ├── HistorySidebar.tsx     # Past session browser
│   │   ├── LeftSidebar.tsx        # Model, strategy, difficulty, temp/topP
│   │   ├── RightSidebar.tsx       # History toggle
│   │   └── StrategyDetailSidebar.tsx  # Prompt strategy inspector
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Slider.tsx
│   └── views/
│       ├── ActiveView.tsx         # Real-time chat with SecurityShield
│       ├── EvaluationView.tsx     # AI-generated performance report
│       ├── HistoryView.tsx        # Session replay
│       └── IdleView.tsx           # Landing / setup screen
└── lib/
    ├── ai/
    │   ├── evaluationPrompt.ts    # Evaluation prompt builder
    │   ├── promptBuilder.ts       # System prompt composer
    │   ├── securityShield.ts      # Shield prompt + classifier
    │   └── systemPrompts.ts       # 5 strategy prompt definitions
    ├── constants.ts               # Models, strategies, difficulties, templates
    ├── store.ts                   # Zustand store (UI, Interview, Voice, History)
    └── utils.ts                   # cn() utility
```


## Tech Stack

| Layer | Technology |
|:---|:---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State Management | Zustand with `localStorage` persistence |
| AI SDK | Vercel AI SDK (`ai` + `@ai-sdk/google`) |
| AI Provider | Google Gemini (3 models) |

## Getting Started

### Prerequisites
- Node.js 18+

### Setup

```bash
# Clone and install
git clone <repo-url>
cd interview-app
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start practicing.

### Setup for Local Models (Ollama)

You can run your interviews entirely on your local machine using [Ollama](https://ollama.com/).

1. **Install Ollama**: Download from [ollama.com](https://ollama.com).
2. **Pull a Model**: e.g., `ollama pull gemma`.
3. **Run with CORS**: You must set `OLLAMA_ORIGINS` to allow browser connections:
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
4. **App Configuration**: 
   - Set **Model Selection** to `Local (Ollama)` in the sidebar.
   - Enter your model name (e.g., `gemma`) in the **Local Model Name** field.


## Environment Variables

| Variable | Required | Description |
|:---|:---|:---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | Google AI Studio API key for Gemini access |
