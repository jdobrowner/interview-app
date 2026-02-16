import { google } from '@ai-sdk/google';
import { createOllama } from 'ollama-ai-provider-v2';
import { generateText } from 'ai';
import { buildEvaluationPrompt } from '@/lib/ai/evaluationPrompt';
import { MODELS, MODEL_IDS, DEFAULT_OLLAMA_URL, DEFAULT_OLLAMA_MODEL } from '@/lib/constants';

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

        if (config.model === MODELS[2]) {
            const rawUrl = (config.ollamaBaseUrl || DEFAULT_OLLAMA_URL).replace(/\/+$/, '');
            const baseURL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
            const ollama = createOllama({ baseURL });
            model = ollama(config.ollamaModelName || DEFAULT_OLLAMA_MODEL);
        } else {
            const geminiModelId = MODEL_IDS[config.model] || MODEL_IDS[MODELS[0]];
            model = google(geminiModelId);
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
