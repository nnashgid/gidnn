import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  location: string;
  activityType: string;
  tags: string[];
}

export interface GeneratedItinerary {
  id: string;
  name: string;
  duration: number;
  items: ItineraryItem[];
  vibe: string;
  difficulty: "Легкий" | "Средний" | "Сложный";
}

export async function generateItinerary(params: {
  days: number;
  activityType: string;
  interests: string[];
  difficulty?: string;
}): Promise<GeneratedItinerary> {
  const prompt = `Сгенерируй детальный и географически точный эко-маршрут на ${params.days} дн. по Нижегородской области. 
  
  Параметры:
  - Тип активности: ${params.activityType}
  - Уровень сложности: ${params.difficulty || "любой"}
  - Интересы: ${params.interests.join(", ")}

  Твои рекомендации должны включать реальные локации (например: Керженский заповедник, озеро Светлояр, река Ветлуга, город Городец, Ардатовский район, Дивеево, Ичалковский бор).
  
  Для каждого дня укажи:
  - Название локации
  - Короткий, вовлекающий заголовок активности
  - Описание, которое подчеркивает эко-составляющую и уникальность места
  - 2-3 тега (например: "Пещеры", "Байдарки", "История", "Кемпинг")
  
  Вся информация должна быть на русском языке.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "Ты — экспертный гид по эко-туризму в Нижегородской области. Твоя миссия — открывать людям красоту локальной природы через ответственное отношение к окружающей среде. Твой стиль — вдохновляющий, профессиональный и аутентичный.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Название маршрута" },
          duration: { type: Type.NUMBER },
          vibe: { type: Type.STRING, description: "Краткое описание атмосферы поездки" },
          difficulty: { type: Type.STRING, enum: ["Легкий", "Средний", "Сложный"] },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                activityType: { type: Type.STRING },
                tags: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
              },
              required: ["day", "title", "description", "location", "activityType", "tags"],
            },
          },
        },
        required: ["name", "duration", "vibe", "items", "difficulty"],
      },
    },
  });

  const result = JSON.parse(response.text);
  return {
    ...result,
    id: Math.random().toString(36).substring(7),
  };
}
