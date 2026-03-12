import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Create genAI by specifying solid base values
const genAI = new GoogleGenerativeAI(apiKey);

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export const searchWithGemini = async (
  query: string,
  file: File | null = null,
): Promise<string> => {
  try {
    // Force the use of version v1 and use the standard model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a music expert. The question is: "${query}". Analyze the genre, instruments, and mood from the attached audio file.`;

    let result;
    if (file) {
      const audioPart = await fileToGenerativePart(file);
      result = await model.generateContent([prompt, audioPart]);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Error Details:", error);
    throw new Error("A connection error occurred. Please try again.");
  }
};
