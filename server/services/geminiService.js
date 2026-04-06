const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in .env. AI features will not function.");
}

const getGeminiInstance = () => {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
};

// Timeout wrapper — rejects if Gemini takes too long
const withTimeout = (fn, ms = 25000) => {
    return Promise.race([
        fn(),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Gemini request timed out after ${ms}ms`)), ms)
        )
    ]);
};

// Retry wrapper — handles 429 rate limit and timeout errors
const withRetry = async (fn, retries = 3, delayMs = 3000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await withTimeout(fn);
        } catch (error) {
            const is429 = error?.status === 429 ||
                error?.message?.includes('429') ||
                error?.message?.toLowerCase().includes('too many requests');
            const isTimeout = error?.message?.includes('timed out');

            if ((is429 || isTimeout) && attempt < retries) {
                const wait = delayMs * attempt;
                console.warn(`Gemini ${isTimeout ? 'timeout' : '429 rate limit'}, retrying in ${wait}ms (attempt ${attempt}/${retries})...`);
                await new Promise(r => setTimeout(r, wait));
            } else {
                throw error;
            }
        }
    }
};

const generateInterviewQuestion = async (cvData, previousQA, questionNumber, totalQuestions, persona = 'Professional', role = 'Software Engineer', difficulty = 'Medium') => {
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

    const result = await withRetry(() => model.generateContent({
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.7 }
    }));

    return result.response.text().trim();
};

const evaluateAnswer = async (question, answer, cvContext) => {
    const genAI = getGeminiInstance();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let promptText = `You are an expert interview coach. Question asked: ${question}. Candidate's answer: ${answer}. `;
    if (cvContext) {
        const cvString = typeof cvContext === 'string' ? cvContext : JSON.stringify(cvContext);
        promptText += `The candidate's background is: ${cvString}. `;
    }
    promptText += `Evaluate this answer and respond in JSON format ONLY:
{"score":<number 1-10>,"feedback":"<max 2 sentences>","strength":"<max 1 sentence>","improvement":"<max 1 sentence>","modelAnswer":"<max 3 sentences>"}
Return raw JSON only, no markdown, no extra text.`;

    const result = await withRetry(() => model.generateContent({
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.3 }
    }));

    const rawResponse = result.response.text().trim();

    // Safe JSON extraction — works even if Gemini adds surrounding text
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.error('[evaluateAnswer] No JSON in Gemini response:', rawResponse.substring(0, 200));
        throw new Error('Gemini did not return valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Ensure score is always a valid number between 1-10
    parsed.score = Math.min(10, Math.max(1, Number(parsed.score) || 5));

    return parsed;
};

const transcribeWithGemini = async (audioBase64, mimeType) => {
    const genAI = getGeminiInstance();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await withRetry(() => model.generateContent([
        "Transcribe this audio recording exactly as spoken.",
        { inlineData: { data: audioBase64, mimeType } }
    ]));

    return result.response.text().trim();
};

module.exports = {
    generateInterviewQuestion,
    evaluateAnswer,
    transcribeWithGemini
};
