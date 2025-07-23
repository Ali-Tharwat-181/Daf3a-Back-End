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

Return only mentor and workshop IDs like this:
{
  "recommendedMentors": ["mentor_id_1", "mentor_id_2"],
  "recommendedWorkshops": ["workshop_id_1", "workshop_id_2"]
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
      model: "models/gemini-2.5-flash",
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanJson = extractJsonFromMarkdown(text);
    const parsed = JSON.parse(cleanJson);

    // Ensure output is just arrays of IDs
    return {
      recommendedMentors: Array.isArray(parsed.recommendedMentors)
        ? parsed.recommendedMentors.map((m) =>
            typeof m === "object" ? m._id : m
          )
        : [],
      recommendedWorkshops: Array.isArray(parsed.recommendedWorkshops)
        ? parsed.recommendedWorkshops.map((w) =>
            typeof w === "object" ? w._id : w
          )
        : [],
    };
  } catch (error) {
    console.error("Gemini recommendation error:", error.message);
    return { recommendedMentors: [], recommendedWorkshops: [] };
  }
}
