import { NextResponse } from 'next/server';
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function POST(req) {
    const apiKey = process.env.GEMINI_API_KEY; // Securely accessing API key
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const data = await req.json();
        const userMessage = data.message || "Hello, how can I assist you today?";

        const systemPrompt = "You are a helpful assistant that provides concise and accurate information. You answer questions directly and provide useful responses based on the context given by the user.";

        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

        const chat = model.startChat({
            systemPrompt: systemPrompt,
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response.text();

        return new NextResponse(response, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });

    } catch (error) {
        console.error('Error with Gemini API:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
