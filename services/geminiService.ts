import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Helper to strip the data:image/xyz;base64, prefix
 */
const cleanBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1] || dataUrl;
};

const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(.*);base64,/);
  return match ? match[1] : 'image/jpeg';
};

/**
 * Transforms the user's photo into a specific era using Gemini 2.5 Flash Image.
 * Acts as the "Time Travel" engine.
 */
export const timeTravelToEra = async (
  imageBase64: string,
  promptModifier: string
): Promise<string> => {
  try {
    const mimeType = getMimeType(imageBase64);
    const cleanData = cleanBase64(imageBase64);

    // We use the image editing capabilities to "re-imagine" the input.
    // Constructing a prompt that asks to keep the face but change the style.
    const prompt = `Transform this person into the following scene: ${promptModifier}. Maintain the facial features and identity of the person in the input image strictly, but replace clothing, background, and lighting to match the description. High quality, photorealistic.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ]
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Time Travel Error:", error);
    throw error;
  }
};

/**
 * Edits an image based on user text prompt using "Nano Banana" (Gemini 2.5 Flash Image).
 */
export const editImageWithPrompt = async (
  imageBase64: string,
  userInstruction: string
): Promise<string> => {
  try {
    const mimeType = getMimeType(imageBase64);
    const cleanData = cleanBase64(imageBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType
            }
          },
          { text: userInstruction }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated from edit.");
  } catch (error) {
    console.error("Edit Image Error:", error);
    throw error;
  }
};

/**
 * Analyzes an image using Gemini 3 Pro Preview.
 */
export const analyzeImageContent = async (
  imageBase64: string
): Promise<string> => {
  try {
    const mimeType = getMimeType(imageBase64);
    const cleanData = cleanBase64(imageBase64);

    const prompt = "Analyze this image in detail. Describe the person, their clothing, the background, the lighting, and any historical or stylistic elements present. If it looks like a specific era, mention it.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};