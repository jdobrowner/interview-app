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
Evaluate the candidate's performance with brutal honesty but constructive framing.
Score each category from 0 to 100.

For the "improvedResponse" field, pick the single weakest Q&A exchange from the transcript. Include the exact question asked, the candidate's original answer, and then write an improved version of their answer that directly applies the coaching tips from your evaluation. The improved answer should build on what the candidate said, not replace it entirely.

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
    "improvedAnswer": "<a coached, improved version of the candidate's answer>"
  },
  "transcriptSummary": "<2-3 sentence summary of the interview>"
}`;
}
