const { GoogleGenerativeAI } = require('@google/generative-ai');

const parseCV = async (text) => {
    if (!text) return {};

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `Parse the following CV/resume text and extract the key information. Return ONLY a JSON object with these exact fields (use null for missing fields):
{
  "name": "<candidate's full name>",
  "email": "<email address>",
  "phone": "<phone number>",
  "skills": "<comma-separated list of technical and soft skills found in the CV>",
  "experience": "<concise summary of work experience, max 3 sentences>",
  "education": "<highest education level, degree, and institution>",
  "projects": "<notable projects mentioned, max 2 sentences>"
}
Do not include \`\`\`json or \`\`\` blocks. Return raw JSON only.

CV Text:
${text.substring(0, 8000)}`;

        const result = await model.generateContent(prompt);
        let raw = result.response.text().trim();

        if (raw.startsWith('```json')) raw = raw.replace(/^```json/, '').replace(/```$/, '').trim();
        else if (raw.startsWith('```')) raw = raw.replace(/^```/, '').replace(/```$/, '').trim();

        return JSON.parse(raw);
    } catch (error) {
        console.error('Gemini CV parsing failed, falling back to regex:', error.message);
        return regexParseCV(text);
    }
};

// Regex fallback if Gemini fails
const regexParseCV = (text) => {
    if (!text) return {};

    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const email = (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/) || [])[0] || null;
    const phone = (text.match(/(\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/) || [])[0] || null;

    let name = null;
    for (const line of lines) {
        if (line.length > 2 && !line.includes('@') && !line.match(/\d{10}/)) {
            name = line;
            break;
        }
    }

    return {
        name,
        email,
        phone,
        skills: extractSection(text, 'Skills', ['Education', 'Experience', 'Projects', 'Work']),
        experience: extractSection(text, 'Experience', ['Education', 'Skills', 'Projects', 'Work']),
        education: extractSection(text, 'Education', ['Experience', 'Skills', 'Projects', 'Work']),
        projects: extractSection(text, 'Projects', ['Education', 'Experience', 'Skills', 'Work'])
    };
};

const extractSection = (text, startKeyword, potentialEndKeywords) => {
    const lowerText = text.toLowerCase();
    const startIdx = lowerText.indexOf(startKeyword.toLowerCase());
    if (startIdx === -1) return null;

    let endIdx = text.length;
    for (const keyword of potentialEndKeywords) {
        const idx = lowerText.indexOf(keyword.toLowerCase(), startIdx + startKeyword.length);
        if (idx !== -1 && idx < endIdx) endIdx = idx;
    }

    return text.substring(startIdx + startKeyword.length, endIdx).trim() || null;
};

module.exports = { parseCV };
