
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType, FileData } from "../types";

export const generateQuestions = async (
  file: FileData, 
  numQuestions: number, 
  type: QuestionType,
  referenceText?: string
): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  
  let systemInstruction = `Eres un Mentor de Aprendizaje Acelerado. Tu misión es crear un examen profundo basado en el PDF.
  
  REGLAS DE EXPLICACIÓN:
  - ESCRIBE LA EXPLICACIÓN EN UN SOLO BLOQUE DE TEXTO (PÁRRAFO ÚNICO).
  - NO USES números (1., 2.), ni guiones, ni listas.
  - NO USES frases de confirmación como "¡Exacto!", "¡Correcto!" o "¡Sí!" al principio, ya que el usuario puede haber fallado y leer eso le confunde.
  - Explica el concepto de forma clara, directa y fácil de entender.
  - Enfócate en por qué la respuesta correcta es la verdadera y aporta un razonamiento lógico o analogía que ayude a memorizarlo.
  - El tono debe ser profesional pero muy cercano.
  
  REGLAS TÉCNICAS:
  1. IDIOMA: Español.
  2. FORMATO: JSON array.
  3. VISUAL: visualPrompt en inglés (descriptivo).`;

  if (referenceText && referenceText.trim().length > 0) {
    systemInstruction += `\n\nESTILO DE REFERENCIA: Mimetiza el tono y nivel de estas preguntas:\n"${referenceText}"`;
  }

  const parts: any[] = [
    { text: `${systemInstruction}\n\nGenera ${numQuestions} preguntas de tipo ${type} del PDF adjunto.` }
  ];

  if (file.base64Data && file.mimeType) {
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.base64Data.split(',')[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 24000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            type: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            visualPrompt: { type: Type.STRING }
          },
          required: ["id", "text", "options", "correctAnswer", "explanation", "visualPrompt"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

export const generateTopicImage = async (topic: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let styleHint = "Professional academic 3D illustration, cinematic lighting";
  const lowerTopic = topic.toLowerCase();
  
  if (lowerTopic.includes('historia')) styleHint = "Epic historical painting style, dramatic cinematic lighting";
  if (lowerTopic.includes('ciencia') || lowerTopic.includes('bio')) styleHint = "Microscopic 3D render, bioluminescent details";
  if (lowerTopic.includes('teoria') || lowerTopic.includes('filo')) styleHint = "Abstract conceptual art, ethereal lighting";
  
  const prompt = `${styleHint} about "${topic}". High resolution, 16:9.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return '';
  } catch (error) {
    return '';
  }
};
