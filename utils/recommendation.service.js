import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractJsonFromMarkdown(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function getRecommendationsFromGemini(
  student,
  mentors,
  workshops
) {
  const prompt = `
You are a smart recommendation assistant.

Based on the following student information, mentors, and workshops, respond with ONLY a raw JSON object — no markdown, no explanations.

{
  "mentors": [{ "_id": "mentor_id", "name": "mentor_name" }],
  "workshops": [{ "_id": "workshop_id", "title": "workshop_title" }]
}

Student:
${JSON.stringify(student, null, 2)}

Mentors:
${JSON.stringify(mentors.slice(0, 3), null, 2)}

Workshops:
${JSON.stringify(workshops.slice(0, 3), null, 2)}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanJson = extractJsonFromMarkdown(text);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini recommendation error:", error.message);
    return { mentors: [], workshops: [] };
  }
}
