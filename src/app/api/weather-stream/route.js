import { getTime, getWeather } from "@/lib/tools";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req) {
    const { message } = await req.json();

    const result = streamText({
        model: google("gemini-3.6-flash"),

        prompt: message,

        tools: {
            getWeather,
            getTime,
        },
    });

    return result.toTextStreamResponse();
}