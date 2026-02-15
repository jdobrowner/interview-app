/**
 * Evaluation Prompt — gemini-3-pro
 *
 * After the interview session ends, this prompt instructs the "Coach" model
 * to deeply analyze the full transcript and return structured JSON feedback.
 */

import { JobConfig, InterviewConfig, ChatMessage } from '@/lib/store';

export function buildEvaluationPrompt(
    job: JobConfig,
    config: InterviewConfig,
    messages: ChatMessage[]
): string {
    const transcript = messages
        .map((m) => `${m.role === 'user' ? 'CANDIDATE' : 'INTERVIEWER'}: ${m.content}`)
        .join('\n\n');

    return `You are a senior technical interview coach. Analyze the following mock interview transcript and produce a detailed performance evaluation.

## Context
- **Role**: ${job.title}
- **Job Description**: ${job.description}
- **Difficulty Level**: ${config.difficulty}
- **Prompt Strategy Used**: ${config.strategy}

## Transcript
${transcript}

## Instructions
Evaluate the candidate's performance with brutal honesty but constructive framing.
Score each category from 0 to 100.

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "overallScore": <number>,
  "technicalScore": <number>,
  "communicationScore": <number>,
  "positives": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "improvedResponse": "<one detailed example of how a specific weak response from the transcript could have been improved>",
  "transcriptSummary": "<2-3 sentence summary of the interview>"
}`;
}
