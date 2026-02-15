import { google } from '@ai-sdk/google';
import { createOllama } from 'ollama-ai-provider-v2';
import { generateText } from 'ai';
import { buildEvaluationPrompt } from '@/lib/ai/evaluationPrompt';

/**
 * Evaluation API supporting both Google Gemini and Local Ollama
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

        // Determine model provider
        let model: any;

        if (config.model === 'Local (Ollama)') {
            const rawUrl = (config.ollamaBaseUrl || 'http://localhost:11434').replace(/\/+$/, '');
            const baseURL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
            const ollama = createOllama({ baseURL });
            model = ollama(config.ollamaModelName || 'gemma3');
        } else {
            // Default to Gemini
            const geminiModel = config.model === 'Gemini 2.5 Flash Lite'
                ? 'gemini-2.5-flash-lite'
                : 'gemini-3-flash-preview';
            model = google(geminiModel);
        }

        const { text } = await generateText({
            model,
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
