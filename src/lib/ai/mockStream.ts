/**
 * Simulates a streaming response from an AI by breaking a string into chunks
 * and yielding them with a small delay.
 */
export async function* simulateStreamingResponse(text: string, delayMs: number = 20): AsyncGenerator<string> {
    // Break into words to feel more natural
    const words = text.split(' ');

    for (const word of words) {
        // Yield the word with a space
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, delayMs + Math.random() * 30));
    }
}

/**
 * Alternative version that works with standard ReadableStream for API mocking
 */
export function createMockReadableStream(text: string, delayMs: number = 20): ReadableStream {
    const encoder = new TextEncoder();
    const words = text.split(' ');

    return new ReadableStream({
        async start(controller) {
            for (const word of words) {
                controller.enqueue(encoder.encode(word + ' '));
                await new Promise(resolve => setTimeout(resolve, delayMs + Math.random() * 30));
            }
            controller.close();
        }
    });
}
