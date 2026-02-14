import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { SHIELD_SYSTEM_PROMPT, parseShieldResponse } from '@/lib/ai/securityShield';

/**
 * Security Guard API — gemini-2.5-flash-lite
 * Pre-screens user input before it reaches the interviewer model.
 */
export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== 'string') {
            return Response.json({ safe: true });
        }

        const { text } = await generateText({
            model: google('gemini-2.5-flash-lite'),
            system: SHIELD_SYSTEM_PROMPT,
            prompt: message,
        });

        const result = parseShieldResponse(text);

        return Response.json(result);
    } catch (error) {
        console.error('Guard API Error:', error);
        // Fail-open: if the guard crashes, let the message through
        return Response.json({ safe: true });
    }
}
