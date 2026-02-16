import { google } from '@ai-sdk/google';
import { createOllama } from 'ollama-ai-provider-v2';
import { streamText } from 'ai';
import { buildSystemPrompt } from '@/lib/ai/promptBuilder';
import { MODELS, MODEL_IDS, DEFAULT_OLLAMA_URL, DEFAULT_OLLAMA_MODEL } from '@/lib/constants';

/**
 * Chat API supporting both Google Gemini and Local Ollama
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, config, job } = body;

        if (!messages || !config || !job) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: messages, config, job' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const systemPrompt = buildSystemPrompt(job, config);

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

        const result = streamText({
            model,
            system: systemPrompt,
            messages: messages.map((m: any) => ({
                role: m.role,
                content: m.content,
            })),
            temperature: config.temperature ?? 0.7,
            topP: config.topP ?? 0.9,
        });

        return result.toTextStreamResponse();

    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
