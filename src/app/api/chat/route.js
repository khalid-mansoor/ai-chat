import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";

export async function POST(req) {
    try {
        const { messages } = await req.json();

        // const result = await generateText({
        //     model: google("gemini-3.5-flash"),
        //     prompt: messages,
        // });
        // return Response.json({
        //     response: result.text,
        // });

        const result = streamText({
            model: google("gemini-3.5-flash"),
            messages,
        });

        return result.toTextStreamResponse();

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