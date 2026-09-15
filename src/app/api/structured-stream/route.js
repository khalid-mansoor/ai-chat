import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const productSchema = z.object({
    name: z.string(),
    category: z.string(),
    summary: z.string(),
    rating: z.number(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    recommendation: z.string(),


});

export async function POST(req) {
    try {
        const { product } = await req.json();

        const result = streamObject({
            model: google("gemini-3.5-flash"),
            schema: productSchema,
            prompt: `Analyze this product:${product}Provide a detailed structured analysis.`,
        });

        return result.toTextStreamResponse();

    } catch (error) {
        return Response.json({ error: "Something went wrong", }, { status: 500, });
    }
}