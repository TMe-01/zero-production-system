// services/geminiService.ts

async function callGeminiAPI(prompt: string) {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result.text || data.result;
}

// ---------------- Daily Summary ---------------- //
export const generateDailySummary = async (tasks: any[], language: 'en' | 'ar'): Promise<string> => {
  if (tasks.length === 0) {
    return language === 'en'
      ? 'No tasks for today. Great job staying on top of things!'
      : 'لا توجد مهام لليوم. أحسنت في تنظيم أمورك!';
  }

  const taskList = tasks
    .map(task => `- ${task.title} (Priority: ${task.priority}, Due: ${task.dueDate})`)
    .join('\n');

  const prompt = `
Provide an encouraging daily summary in ${language}:

Tasks:
${taskList}
`;

  return callGeminiAPI(prompt);
};

// ---------------- Diet Plan ---------------- //
export const generateDietPlanTasks = async (dietDescription: string) => {
  const prompt = `
Analyze this diet plan and convert meal names (breakfast/lunch/dinner) and times into HH:MM format:

"${dietDescription}"
`;

  return callGeminiAPI(prompt);
};

// ---------------- Info Dashboard Functions ---------------- //
const callGeminiWithSearch = (prompt: string, language: string) => {
  const formatting = `
Format the output in ${language}.
Use emojis, bold text, and separator lines (---).
`;

  return callGeminiAPI(`${prompt}\n${formatting}`);
};

export const getTechNews = (language: string) =>
  callGeminiWithSearch(
    "Search for the latest 3 major technology news headlines and summarize each clearly.",
    language
  );

export const getEconomicNews = (language: string) =>
  callGeminiWithSearch(
    `
Give a real-time economic brief:
- Major global & Egypt news
- Gold price in Egypt
- USD/EGP exchange rate
- Top richest 10 now
- Market updates
`,
    language
  );

export const getDailyTopicInfo = (topic: string, language: string) =>
  callGeminiWithSearch(
    `Search for new, updated information about: "${topic}". Write half a page.`,
    language
  );

export const getGeneralKnowledgeOrQuiz = (language: string) =>
  callGeminiWithSearch(
    "Find 10 new, interesting, lesser-known general knowledge facts.",
    language
  );
