
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Habit } from "../types";

// Note: API_KEY should be set in environment variables
if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailySummary = async (tasks: Task[], language: 'en' | 'ar'): Promise<string> => {
  if (tasks.length === 0) {
    return language === 'en' ? 'No tasks for today. Great job staying on top of things!' : 'لا توجد مهام لليوم. أحسنت في تنظيم أمورك!';
  }

  const taskList = tasks
    .map(task => `- ${task.title} (Priority: ${task.priority}, Due: ${task.dueDate})`)
    .join('\n');

  const prompt = `Based on the following list of tasks, provide a brief, encouraging summary for the day in ${language}. Mention the number of tasks and highlight 1-2 most important ones (based on priority and due date). The output should be a single paragraph. Tasks:\n${taskList}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating daily summary:', error);
    return language === 'en' ? 'Could not generate summary at this time.' : 'تعذر إنشاء الملخص في الوقت الحالي.';
  }
};

export const generateDietPlanTasks = async (dietDescription: string): Promise<Omit<Habit, 'id' | 'isCompleted'>[]> => {
    const prompt = `Analyze the following diet plan and extract the meal times. Convert the times to HH:MM format. Ignore snacks, just focus on main meals like breakfast, lunch, and dinner. Diet plan: "${dietDescription}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            meal: {
                                type: Type.STRING,
                                description: 'The name of the meal, e.g., Breakfast, Lunch, Dinner.',
                            },
                            time: {
                                type: Type.STRING,
                                description: 'The time of the meal in HH:MM format (24-hour clock).',
                            },
                        },
                        required: ["meal", "time"],
                    },
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        
        if (Array.isArray(jsonResponse)) {
            return jsonResponse.map((item: any) => ({
                titleKey: `habit_diet_${item.meal?.toLowerCase() || 'meal'}`,
                time: item.time
            }));
        }
        return [];

    } catch (error) {
        console.error('Error generating diet plan:', error);
        return [];
    }
}

// --- Info Dashboard Functions ---

const callGeminiWithSearch = async (prompt: string, language: string) => {
  try {
    const formattingInstructions = `
    The response MUST be in ${language}.
    Format the output beautifully and professionally:
    - Use relevant emojis (like 📱, 💰, 🌍, etc.) at the start of major sections or headlines.
    - Use numbered lists (1., 2., 3.) where appropriate.
    - STRICTLY use double asterisks (**like this**) to bold key terms, numbers, names, and prices for highlighting.
    - Use clear separator lines (---) between different topics if necessary.
    `;
    
    const fullPrompt = `${prompt}\n${formattingInstructions}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text;
  } catch (error) {
    console.error('Error calling Gemini with search:', error);
    throw new Error(language === 'ar' ? 'تعذر جلب المعلومات المحدثة.' : 'Failed to fetch up-to-date information.');
  }
};

export const getTechNews = (language: string) => callGeminiWithSearch(
  "Search for the absolute latest 3 major technology news headlines right now. Provide a clear, engaging summary for each.", 
  language
);

export const getEconomicNews = (language: string) => callGeminiWithSearch(
  "Provide a comprehensive, real-time economic brief. You MUST search and include: 1) The latest important economic news globally and locally (focus on Egypt if relevant data exists). 2) Current real-time Gold prices in Egypt (EGP). 3) Current real-time USD to EGP exchange rate. 4) A list of the current top 10 richest people in the world right now. 5) Major market updates or top companies by market cap if significant today.", 
  language
);

export const getDailyTopicInfo = (topic: string, language: string) => callGeminiWithSearch(
  `Search for new, interesting, and up-to-date information about the topic: "${topic}". Write a daily engaging installment (about half a page). Ensure the information is fresh and not generic.`, 
  language
);

export const getGeneralKnowledgeOrQuiz = (language: string) => {
    // Removed Weekly Quiz logic as requested. Always return 10 new facts.
    return callGeminiWithSearch(
      "Find 10 new, interesting, and distinct general knowledge facts. Search to ensure they are accurate and perhaps less commonly known. Present them clearly.", 
      language
    );
};
