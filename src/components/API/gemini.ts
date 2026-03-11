import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// สร้าง genAI โดยระบุค่าพื้นฐานให้แน่นหนา
const genAI = new GoogleGenerativeAI(apiKey);
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type
    },
  };
}

export const searchWithGemini = async (query: string, file: File | null = null): Promise<string> => {
  try {
    // บังคับเรียกใช้เวอร์ชัน v1 และใช้ model ชื่อมาตรฐาน
    const model = genAI.getGenerativeModel(
  { model: "gemini-2.5-flash" }
);

    const prompt = `คุณคือผู้เชี่ยวชาญด้านดนตรี คำถามคือ: "${query}" วิเคราะห์แนวเพลง เครื่องดนตรี และอารมณ์จากไฟล์เสียงที่แนบมาด้วย`;

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
    throw new Error("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
  }
};