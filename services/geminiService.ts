import { GoogleGenAI, Chat, Type } from '@google/genai';
import { PracticeProblemData, LearningLevel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstruction = (level: LearningLevel): string => {
    let levelDescription: string;
    switch (level) {
        case 'beginner':
            levelDescription = "The user is a beginner. Explain concepts simply, using analogies, and avoid jargon where possible. Build from the ground up.";
            break;
        case 'basic':
            levelDescription = "The user has a basic understanding. You can introduce some core terminology but should still explain it clearly. Focus on building on foundational knowledge.";
            break;
        case 'advanced':
            levelDescription = "The user is an advanced learner. You can use technical terminology and delve into complex details. Assume they have a foundational understanding.";
            break;
        default:
            levelDescription = "The user is a beginner. Explain concepts simply, using analogies, and avoid jargon where possible. Build from the ground up.";
            break;
    }

    return `You are an expert tutor AI, named 'Study Buddy'. Your goal is to help users understand complex topics. ${levelDescription}
- Your explanations should be clear, concise, and accurate.
- Start with fundamental concepts and build up to more advanced ones.
- Use analogies and real-world examples to make topics relatable.
- When asked for practice problems, create relevant multiple-choice questions with appropriate difficulty.
- When asked to simplify, break down the concept into its simplest terms, as if explaining to someone with even less knowledge than the user's stated level.
- Maintain a friendly, encouraging, and supportive tone throughout the conversation.
- After an explanation, ask a follow-up question to check for the user's understanding. This makes the session interactive.
- The user can also ask you questions at any time. Answer them directly and thoroughly before continuing with the study plan.`;
};

export class GeminiService {
  public static startChatSession(level: LearningLevel): Chat {
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(level),
      },
    });
  }

  public static async generatePracticeProblem(topic: string, level: LearningLevel): Promise<PracticeProblemData> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a single, unique, multiple-choice practice problem about "${topic}". The difficulty should be appropriate for a ${level} learner. The question should test a key concept. Provide four distinct options. One option must be correct. Also provide a brief explanation for why the correct answer is right.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The question text." },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of 4 possible answers."
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "The 0-based index of the correct answer in the options array." },
              explanation: { type: Type.STRING, description: "A brief explanation for the correct answer."}
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          },
        },
      });
      
      const jsonText = response.text.trim();
      const problemData = JSON.parse(jsonText);

      // Basic validation
      if (
        !problemData.question ||
        !Array.isArray(problemData.options) ||
        problemData.options.length !== 4 ||
        typeof problemData.correctAnswerIndex !== 'number' ||
        !problemData.explanation
      ) {
        throw new Error("Received malformed practice problem data from API.");
      }
      
      return problemData as PracticeProblemData;

    } catch (error) {
      console.error("Error generating practice problem:", error);
      // Fallback to a default error problem
      return {
        question: "Could not generate a practice problem.",
        options: ["Sorry, an error occurred.", "Please try again.", "Check console for details.", "N/A"],
        correctAnswerIndex: -1,
        explanation: "There was an issue communicating with the AI service to generate a problem."
      };
    }
  }
}