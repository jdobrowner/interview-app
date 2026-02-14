import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { buildEvaluationPrompt } from '@/lib/ai/evaluationPrompt';

/**
 * Evaluation API — gemini-3-pro
 * Deep reasoning model for post-interview transcript analysis.
 */
export async function POST(req: Request) {
    try {
        const { job, config, messages } = await req.json();

        if (!job || !config || !messages || messages.length === 0) {
            return Response.json(
                { error: 'Missing required fields: job, config, messages' },
                { status: 400 }
            );
        }

        const evaluationPrompt = buildEvaluationPrompt(job, config, messages);

        const { text } = await generateText({
            model: google('gemini-3-flash-preview'),
            prompt: evaluationPrompt,
        });

        // Parse the JSON response
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const evaluation = JSON.parse(cleaned);

        return Response.json(evaluation);
    } catch (error) {
        console.error('Evaluation API Error:', error);
        return Response.json(
            { error: 'Failed to generate evaluation' },
            { status: 500 }
        );
    }
}
