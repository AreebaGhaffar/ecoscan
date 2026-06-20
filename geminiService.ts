
import { GoogleGenAI, Type } from "@google/genai";
import { EcoScanResult, DisposalCategory } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeItem = async (base64Image: string): Promise<EcoScanResult> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze this image for eco-friendly disposal with high precision.
    
    CRITICAL: Evaluate the confidence score based on these criteria:
    1. Image Clarity: If the image is blurry, poorly lit, or the object is partially obscured, lower the confidence (70-84%).
    2. Object Rarity: Common items get high confidence (95-100%). Specialized/rare items get lower confidence (75-89%).
    3. Material Ambiguity: Reflect uncertainty if material looks similar to another type.
    
    Output Requirements:
    1. Identify the object.
    2. Breakdown the materials seen (e.g., "Cap: Plastic #5", "Body: Glass").
    3. Categorize it: Recyclable, Compostable, or Landfill.
    4. Provide 2-3 specific visual "observations" you made (e.g. "Clear plastic body detected", "Aluminum cap present", "No liquid residue seen").
    5. Provide the REALISTIC confidence score (0-100).
    6. Give a 2-sentence friendly reason about the environmental impact.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: [DisposalCategory.RECYCLABLE, DisposalCategory.COMPOSTABLE, DisposalCategory.LANDFILL],
          },
          reason: { type: Type.STRING },
          confidence: { type: Type.INTEGER },
          observations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-3 specific visual features observed by the AI."
          },
          materials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                part: { type: Type.STRING },
                material: { type: Type.STRING }
              },
              required: ["part", "material"]
            }
          }
        },
        required: ["item", "category", "reason", "confidence", "materials", "observations"],
      },
    },
  });

  const resultStr = response.text;
  if (!resultStr) {
    throw new Error("No response from AI");
  }

  return JSON.parse(resultStr) as EcoScanResult;
};
