import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateSummaryFromGemini(pdfText: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
      config: {
        systemInstruction: SUMMARY_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    if(!response || !response.text) {
        throw new Error("Failed to generate summary from Gemini.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Error generating summary from Gemini:", error);
    throw error;
  }
}
