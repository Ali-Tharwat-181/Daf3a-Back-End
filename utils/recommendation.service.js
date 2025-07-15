import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getRecommendationsFromGemini(
  student,
  mentors,
  workshops
) {
  const prompt = `
You are a smart recommendation assistant. Based on the student's info, suggest matching mentors and workshops.

Student Info:
${JSON.stringify(student, null, 2)}

Mentors:
${JSON.stringify(mentors, null, 2)}

Workshops:
${JSON.stringify(workshops, null, 2)}

Respond with a JSON object:
{
  "mentors": [{ "_id": "mentor_id", "name": "mentor_name" }],
  "workshops": [{ "_id": "workshop_id", "title": "workshop_title" }]
}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini recommendation error:", error.message);
    return { mentors: [], workshops: [] };
  }
}
