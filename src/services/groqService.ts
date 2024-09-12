'use server';

import Groq from 'groq-sdk';

export async function requestChatCompletions(content: string): Promise<string> {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
    const result = groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content
            }
        ],
        model: 'llama3-70b-8192'
    });
    return (await result.choices[0]?.message?.content) || '';
}
