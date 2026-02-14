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

### 🧠 5 Prompt Strategies

Each strategy represents a different interview style, backed by a distinct system prompt with rich metadata:

| Strategy | Technique | Description |
|:---|:---|:---|
| Comprehensive Technical Screen | Zero-Shot | Well-rounded interview covering core competencies |
| Deep Technical Probe | Chain-of-Thought | Forces step-by-step reasoning on complex problems |
| Role-Specific Simulation | Few-Shot | Pattern-based questioning tied to the job description |
| Leadership & Soft Skills Evaluation | Behavioral Modeling | STAR methodology for leadership scenarios |
| Architectural Trade-off Analysis | System Design | High-level architecture challenges focused on trade-offs |

**Implementation:**
- `src/lib/ai/systemPrompts.ts` — Each strategy stored as a `PromptStrategy` object with `content`, `description`, and `technique`
- `src/lib/ai/promptBuilder.ts` — Dynamically assembles the master system prompt by injecting job context into the selected strategy
- `src/components/layout/StrategyDetailSidebar.tsx` — Slide-out panel showing the strategy description, prompt technique, and the raw system prompt

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
- A Google AI API key ([Get one here](https://aistudio.google.com/apikey))

### Setup

```bash
# Clone and install
git clone <repo-url>
cd interview-app
npm install

# Configure your API key
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start practicing.

## Environment Variables

| Variable | Required | Description |
|:---|:---|:---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | Google AI Studio API key for Gemini access |
