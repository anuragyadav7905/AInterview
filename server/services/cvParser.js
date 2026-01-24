const parseCV = (text) => {
    if (!text) return {};

    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    // 1. Basic Extraction
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/;

    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);

    const email = emailMatch ? emailMatch[0] : null;
    const phone = phoneMatch ? phoneMatch[0] : null;

    // Guess Name (First line that isn't email/phone and has words)
    // Very naive heuristic: usually the first line is the name.
    let name = null;
    for (const line of lines) {
        if (line.length > 2 && !line.includes('@') && !line.match(/\d{10}/)) {
            name = line;
            break;
        }
    }

    // 2. Section Detection
    const sections = {
        education: extractSection(text, 'Education', ['Experience', 'Skills', 'Projects', 'Work']),
        experience: extractSection(text, 'Experience', ['Education', 'Skills', 'Projects', 'Work']),
        skills: extractSection(text, 'Skills', ['Education', 'Experience', 'Projects', 'Work']),
        projects: extractSection(text, 'Projects', ['Education', 'Experience', 'Skills', 'Work'])
    };

    return {
        name,
        email,
        phone,
        ...sections
    };
};

const extractSection = (text, startKeyword, potentialEndKeywords) => {
    const lowerText = text.toLowerCase();
    const startIdx = lowerText.indexOf(startKeyword.toLowerCase());

    if (startIdx === -1) return null;

    // Find the earliest occurrence of any end keyword that appears AFTER the start
    let endIdx = text.length;

    for (const keyword of potentialEndKeywords) {
        const idx = lowerText.indexOf(keyword.toLowerCase(), startIdx + startKeyword.length);
        if (idx !== -1 && idx < endIdx) {
            endIdx = idx;
        }
    }

    // Extract and clean
    // We skip the keyword itself
    let content = text.substring(startIdx + startKeyword.length, endIdx).trim();
    return content;
};

module.exports = { parseCV };
