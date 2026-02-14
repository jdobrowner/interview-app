import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { buildSystemPrompt } from '@/lib/ai/promptBuilder';

/**
 * Chat API with Google Gemini
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

        const result = streamText({
            model: google('gemini-2.0-flash-exp'),
            system: systemPrompt,
            messages: messages.map((m: any) => ({
                role: m.role,
                content: m.content,
            })),
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
