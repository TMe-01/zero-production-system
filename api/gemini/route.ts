// test update to trigger deploy
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt missing" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API_KEY missing from environment" }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }],
    });

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return new Response(
      JSON.stringify({ result: text }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("API Error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error",
      }),
      { status: 500 }
    );
  }
}
