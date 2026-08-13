import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req) {
    try {


        const { messages } = await req.json();

        const result = await generateText({
            model: google("gemini-3.5-flash"),
            prompt: messages,
        });

        return Response.json({
            response: result.text,
        });

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