import { getTime, getWeather } from "@/lib/tools";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";


export async function POST(req) {
    try {
        const { message } =
            await req.json();

        const result =
            await generateText({
                model: google(
                    "gemini-3.6-flash"
                ),

                prompt: message,

                tools: {
                    getWeather, getTime
                },
                stopWhen: ({ steps }) =>
                    steps.length >= 3,
            });

        return Response.json({
            text: result.text,
            toolCalls: result.toolCalls,
            toolResults:
                result.toolResults,
            steps: result.steps,

        });

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error:
                    "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}