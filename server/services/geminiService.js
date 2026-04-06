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
const withRetry = async (fn, retries = 2, delayMs = 5000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await withTimeout(fn);
        } catch (error) {
            const msg = (error?.message || '').toLowerCase();
            const is429 = error?.status === 429 ||
                msg.includes('429') ||
                msg.includes('too many requests') ||
                msg.includes('resource_exhausted') ||
                msg.includes('resource has been exhausted') ||
                msg.includes('quota');
            const isTimeout = msg.includes('timed out');

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

// Single Gemini call that evaluates the answer AND generates the next question together.
// Pass generateNext=false for the last answer (evaluation only).
const evaluateAndGenerateNext = async ({
    question, answer, cvContext,
    generateNext = true,
    nextQuestionNumber, totalQuestions,
    previousQA, persona = 'Professional', role = 'Software Engineer', difficulty = 'Medium'
}) => {
    const genAI = getGeminiInstance();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const personaDescriptions = {
        'Professional': 'a professional and composed interviewer',
        'Strict & Technical': 'a strict, highly technical interviewer who asks deep dive questions and expects precise answers',
        'Friendly & Casual': 'a friendly and casual interviewer who creates a relaxed atmosphere while still being thorough'
    };
    const personaDesc = personaDescriptions[persona] || 'a professional interviewer';

    const difficultyGuidance = {
        'Easy': 'straightforward and beginner-friendly',
        'Medium': 'moderately challenging for a mid-level candidate',
        'Hard': 'challenging and in-depth to test deep expertise'
    };
    const diffHint = difficultyGuidance[difficulty] || difficultyGuidance['Medium'];

    const cvString = cvContext
        ? (typeof cvContext === 'string' ? cvContext : JSON.stringify(cvContext))
        : null;

    let prompt = `You are ${personaDesc} conducting a ${role} interview.\n\n`;
    prompt += `QUESTION ASKED: ${question}\n`;
    prompt += `CANDIDATE'S ANSWER: ${answer}\n`;
    if (cvString) prompt += `CANDIDATE BACKGROUND: ${cvString}\n`;
    if (previousQA) prompt += `PRIOR Q&A: ${previousQA}\n`;
    prompt += `\nTask 1 — Evaluate the candidate's answer.\n`;

    if (generateNext) {
        prompt += `Task 2 — Generate the next interview question (question ${nextQuestionNumber} of ${totalQuestions}). It should be ${diffHint}. Do not repeat previous questions.\n`;
        prompt += `\nReturn ONLY this JSON (no markdown, no extra text):\n`;
        prompt += `{"evaluation":{"score":<1-10>,"feedback":"<2 sentences>","strength":"<1 sentence>","improvement":"<1 sentence>","modelAnswer":"<3 sentences>"},"nextQuestion":"<question text>"}`;
    } else {
        prompt += `\nReturn ONLY this JSON (no markdown, no extra text):\n`;
        prompt += `{"evaluation":{"score":<1-10>,"feedback":"<2 sentences>","strength":"<1 sentence>","improvement":"<1 sentence>","modelAnswer":"<3 sentences>"}}`;
    }

    const result = await withRetry(() => model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 }
    }));

    const raw = result.response.text().trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.error('[evaluateAndGenerateNext] No JSON in response:', raw.substring(0, 200));
        throw new Error('Gemini did not return valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.evaluation) throw new Error('Gemini response missing evaluation field');

    parsed.evaluation.score = Math.min(10, Math.max(1, Number(parsed.evaluation.score) || 5));

    return {
        evaluation: parsed.evaluation,
        nextQuestion: parsed.nextQuestion || null
    };
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
    evaluateAndGenerateNext,
    transcribeWithGemini
};
