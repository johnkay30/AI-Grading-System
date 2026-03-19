import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getFeedback(modelAnswer: string, studentResponse: string, score: number) {
  const model = ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{
          text: `You are a University Professor. Grade a student's theoretical exam response.
          
Model Answer: "${modelAnswer}"
Student Response: "${studentResponse}"
SBERT Similarity Score: ${score}/10

Task: Provide exactly 3 sentences of formative feedback. 
Explain why the student received that score and what specific concepts they missed based on the model answer.
Do NOT mention the SBERT algorithm by name, just refer to the score.
Maintain a professional, academic, yet encouraging tone.`
        }]
      }
    ],
    config: {
      temperature: 0.7,
    }
  });

  const response = await model;
  return response.text || "No feedback generated.";
}
