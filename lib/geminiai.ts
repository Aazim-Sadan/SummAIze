import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 8192,
      },
    });

    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
              text: `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into and engaging, easy-to-read summary with contextually relavent emojis and proper markdown formatting:\n\n${pdfText}`,
            },
          ],
        },
      ],
    };

    let attempt = 0;
    const maxAttempts = 3;

    while(attempt < maxAttempts){
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;

            if (!response.text()) {
                throw new Error("Empty response from Gemini API");
              }

              return response.text();
        } catch (error: any) {
            if (error?.status === 503) {
                console.warn(`Gemini model overloaded. Retrying... (${attempt + 1})`);
                await sleep(2000);
                attempt++;
              } else {
                throw error;
              }
        }
    }

    throw new Error("Gemini API overloaded. Please try again later.");
  } catch (error: any) {
    console.error("Gemini API Error", error);
    throw error;
  }
};
