
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFoodRecommendations = async (userPreferences: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this user profile: "${userPreferences}", recommend 3 types of African or International dishes they might like. Format as JSON array of objects with 'dish', 'description', and 'reason'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            dish: { type: Type.STRING },
            description: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["dish", "description", "reason"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const chatWithAssistant = async (message: string, context: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: "You are OLIF, the premium food assistant for OLIF Food. Be elegant, helpful, and concise. Help users find restaurants, track orders, or resolve issues. Current cart: " + JSON.stringify(context.cart),
    }
  });
  return response.text;
};

export const processVoiceOrder = async (transcript: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user said: "${transcript}". Identify if they want to order something. Extract 'item' and 'quantity'. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          isOrder: { type: Type.BOOLEAN }
        }
      }
    }
  });
  return JSON.parse(response.text);
};
