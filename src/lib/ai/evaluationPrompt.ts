/**
 * Evaluation Prompt — gemini-3-pro
 *
 * After the interview session ends, this prompt instructs the "Coach" model
 * to deeply analyze the full transcript and return structured JSON feedback.
 */

import { JobConfig, InterviewConfig, ChatMessage } from '@/lib/store';

const DIFFICULTY_GUIDELINES: Record<string, string> = {
    'Junior': 'Expect solid grasp of fundamentals and ability to follow instructions. Score based on potential and clear communication of basic concepts.',
    'Senior': 'Expect deep technical expertise, understanding of architectural trade-offs, and ownership. Score based on their ability to handle complexity and justify decisions.',
    'Staff': 'Expect high-level strategic thinking, cross-domain knowledge, and leadership. Score based on their ability to navigate ambiguity and influence system-wide design.'
};

const FEW_SHOT_EXAMPLE = {
    question: "Tell me about a time you handled a difficult stakeholder.",
    originalAnswer: "Well, I had this manager who kept changing requirements. It was annoying but I just did what they asked every time to keep the peace.",
    improvedAnswer: "In a previous role, I worked with a stakeholder whose requirements were frequently shifting. Instead of just reacting to changes, I initiated a weekly alignment sync to document trade-offs and clarify the impact of new requests on the project timeline. This allowed me to manage expectations proactively while still being adaptable to business needs."
};


export function buildEvaluationPrompt(
    job: JobConfig,
    config: InterviewConfig,
    messages: ChatMessage[]
): string {
    const difficultyGuideline = DIFFICULTY_GUIDELINES[config.difficulty] || DIFFICULTY_GUIDELINES['Senior'];
    const transcript = messages
        .map((m) => `${m.role === 'user' ? 'CANDIDATE' : 'INTERVIEWER'}: ${m.content}`)
        .join('\n\n');

    return `You are a senior technical interview coach. Analyze the following mock interview transcript and produce a detailed performance evaluation.

## Context
- **Role**: ${job.title}
- **Job Description**: ${job.description}
- **Difficulty Level**: ${config.difficulty} (${difficultyGuideline})
- **Prompt Strategy Used**: ${config.strategy}

## Transcript
${transcript}

## Instructions
Evaluate the candidate's performance with brutal honesty but constructive framing. Use the following scoring rubric to determine scores for each category (Overall, Technical, Communication):

### Scoring Rubric (0-100)
- **90-100 (Expert)**: Exceptional performance. Demonstrated deep mastery, proactive thinking, and flawless communication.
- **70-89 (Competent)**: Strong performance. Met all expectations, handled complexity well, and communicated clearly with minor gaps.
- **50-69 (Developing)**: Mixed results. Shows potential but has significant gaps in knowledge, logic, or communication. (Note: Avoid defaulting to 65; be specific about where they land.)
- **Below 50 (Needs Work)**: Major red flags, clear lack of required skills, or extremely poor communication.

**CRITICAL**: Do NOT default to "safe" middle-ground scores (like 65 or 70) unless the performance truly merits it. Be precise and justify the score through your analysis.

For the "improvedResponse" field, pick the single weakest Q&A exchange from the transcript. Include the exact question asked, the candidate's original answer, and then write an improved version of their answer that directly applies the coaching tips from your evaluation. **CRITICAL: The improved answer MUST be written in the candidate's first-person voice ("I", "my"), as if they were actually delivering the response in the interview.** The improved answer should build on what the candidate said, not replace it entirely.

### Example of "improvedResponse" structure and quality:
\ \ \json
${JSON.stringify(FEW_SHOT_EXAMPLE, null, 2)}
\ \ \

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "overallScore": <number>,
  "technicalScore": <number>,
  "communicationScore": <number>,
  "positives": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "improvedResponse": {
    "question": "<the interviewer's exact question>",
    "originalAnswer": "<the candidate's original answer>",
    "improvedAnswer": "<a coached, improved version of the candidate's answer, following the voice and quality of the example above>"
  },
  "transcriptSummary": "<2-3 sentence summary of the interview>"
}`;
}

