import { generateObject } from "ai";
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
    distributers: z.array(z.string())
});

export async function POST(req) {
    try {
        const { product } = await req.json();
        const result = await generateObject({
            model: google("gemini-3.5-flash"),
            schema: productSchema,
            prompt: `
        Analyze the following product:

        ${product}

        Return a structured product analysis including known distributors or retailers where this product can be purchased.
      `,
        });

        return Response.json({
            result: result.object,
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