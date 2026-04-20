import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key is missing. Please add it to your .env.local file." },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract MIME type and base64 data
    const mimeTypeMatch = image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
    const base64Data = image.split(",")[1] || image;

    console.log(`Analyzing image with MIME type: ${mimeType}`);

    const result = await model.generateContent([
      "Identify the specific product in this image and provide a concise search query that could be used to find it on an e-commerce site. Only return the search query text.",
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim();

    return NextResponse.json({ query: text });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    
    // Check for common errors
    if (error.message?.includes("API key not valid")) {
      return NextResponse.json({ error: "Invalid Gemini API key." }, { status: 500 });
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to analyze image" },
      { status: 500 }
    );
  }
}
