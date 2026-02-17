
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
      systemInstruction: "You are TRE, the premium food assistant for TRE FOOD. Be elegant, helpful, and concise. Help users find restaurants, track orders, or resolve issues. Current cart: " + JSON.stringify(context.cart),
    }
  });
  return response.text;
};

export const processVoiceOrder = async (transcript: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user said: "${transcript}". 
    1. Identify if they want to add items to their basket. They might specify multiple items and quantities.
    2. Identify if they want to "checkout", "place order", "confirm order", or "pay".
    Return a JSON object according to the schema.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          orders: {
            type: Type.ARRAY,
            description: "A list of food items and their quantities identified in the speech.",
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING, description: "Simplified name of the food item (e.g., 'Jollof Rice')" },
                quantity: { type: Type.NUMBER, description: "Number of items to add. Default to 1 if not specified." }
              },
              required: ["item", "quantity"]
            }
          },
          isCheckoutIntent: { 
            type: Type.BOOLEAN, 
            description: "Set to true if the user clearly wants to finalize their order, checkout, or pay." 
          },
          isOrder: { 
            type: Type.BOOLEAN, 
            description: "Set to true if any specific food items were identified to be added." 
          }
        },
        required: ["isCheckoutIntent", "isOrder"]
      }
    }
  });
  return JSON.parse(response.text);
};
