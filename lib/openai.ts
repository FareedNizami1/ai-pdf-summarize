import OpenAI, { APIError } from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

export async function generateSummaryFromOpenAI(pdfText: string): Promise<string> {
  try {
    const completion = await client.responses.create({
      model: "gpt-4o",
      input: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
        },
      ],
      temperature: 0.7,
    });
    return completion.output_text;
  } catch (error: any) {
    console.error("Error in OpenAI API:", error);
    const is429 = error instanceof APIError && error.status === 429;
    const isQuota = error.code === "insufficient_quota" || error.type === "insufficient_quota";
    if (is429 || isQuota) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
}
