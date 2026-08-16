import { google } from "@ai-sdk/google";
import {
    streamText,
    convertToModelMessages,
} from "ai";

import {
    getWeather,
    getTime,
} from "@/lib/tools";

export async function POST(req) {
    try {
        const { messages } = await req.json();

        const modelMessages =
            await convertToModelMessages(messages);

        const result = streamText({
            model: google("gemini-3.5-flash"),

            messages: modelMessages,

            tools: {
                getWeather,
                getTime,
            },

            stopWhen: ({ steps }) =>
                steps.length >= 3,
        });

        return result.toUIMessageStreamResponse();

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}