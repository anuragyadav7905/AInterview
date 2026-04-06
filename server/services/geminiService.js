const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in .env. AI features will not function.");
}

const getGeminiInstance = () => {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
};

const generateInterviewQuestion = async (cvData, previousQA, questionNumber, totalQuestions, persona = 'Professional', role = 'Software Engineer', difficulty = 'Medium') => {
    try {
        const genAI = getGeminiInstance();
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const personaDescriptions = {
            'Professional': 'a professional and composed interviewer',
            'Strict & Technical': 'a strict, highly technical interviewer who asks deep dive questions and expects precise answers',
            'Friendly & Casual': 'a friendly and casual interviewer who creates a relaxed atmosphere while still being thorough'
        };
        const personaDesc = personaDescriptions[persona] || 'a professional interviewer';

        const difficultyGuidance = {
            'Easy': 'Ask a straightforward, beginner-friendly question.',
            'Medium': 'Ask a moderately challenging question appropriate for a mid-level candidate.',
            'Hard': 'Ask a challenging, in-depth question that tests deep expertise.'
        };
        const difficultyHint = difficultyGuidance[difficulty] || difficultyGuidance['Medium'];

        let promptText = `You are ${personaDesc} conducting a ${role} interview. ${difficultyHint} `;
        if (cvData) {
            const cvString = typeof cvData === 'string' ? cvData : JSON.stringify(cvData);
            promptText += `The candidate has the following background: ${cvString}. Ask question ${questionNumber} of ${totalQuestions} tailored to their experience and the ${role} role. `;
        } else {
            promptText += `Ask question ${questionNumber} of ${totalQuestions} specifically relevant to the ${role} role. `;
        }

        if (previousQA && previousQA.length > 0) {
            promptText += `Previous questions and answers so far: ${previousQA}. `;
        }
        promptText += "Return ONLY the question text, nothing else.";

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.7 }
        });
        const response = result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error in generateInterviewQuestion:", error);
        throw error;
    }
};

const evaluateAnswer = async (question, answer, cvContext) => {
    try {
        const genAI = getGeminiInstance();
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        let promptText = `You are an expert interview coach. Question asked: ${question}. Candidate's answer: ${answer}. `;
        if (cvContext) {
            const cvString = typeof cvContext === 'string' ? cvContext : JSON.stringify(cvContext);
            promptText += `The candidate's background is: ${cvString}. `;
        }
        promptText += `Evaluate this answer and respond in JSON format ONLY matching exactly this schema:
{
  "score": <number 1-10>,
  "feedback": "<string max 2 sentences>",
  "strength": "<string max 1 sentence>",
  "improvement": "<string max 1 sentence>",
  "modelAnswer": "<string max 3 sentences>"
}
Do not include \`\`\`json or \`\`\` blocks, just raw JSON.`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.7 }
        });
        
        let rawResponse = result.response.text().trim();

        // Extract JSON object regardless of surrounding text or code block markers
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('Gemini response had no JSON object:', rawResponse);
            throw new Error('Gemini did not return valid JSON');
        }

        const parsed = JSON.parse(jsonMatch[0]);

        // Ensure score is a valid number 1-10
        if (typeof parsed.score !== 'number' || parsed.score < 1 || parsed.score > 10) {
            parsed.score = Math.min(10, Math.max(1, Number(parsed.score) || 5));
        }

        return parsed;
    } catch (error) {
        console.error("Error in evaluateAnswer:", error);
        throw error;
    }
};

const transcribeWithGemini = async (audioBase64, mimeType) => {
    try {
        const genAI = getGeminiInstance();
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = "Transcribe this audio recording exactly as spoken.";
        
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: audioBase64,
                    mimeType: mimeType
                }
            }
        ]);
        
        return result.response.text().trim();
    } catch (error) {
        console.error("Error in transcribeWithGemini:", error);
        throw error;
    }
};

module.exports = {
    generateInterviewQuestion,
    evaluateAnswer,
    transcribeWithGemini
};
