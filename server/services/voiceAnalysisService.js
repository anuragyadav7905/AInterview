const analyzeVoice = (transcript, duration) => {
    // duration is in seconds
    if (!transcript || !duration || duration === 0) {
        return { wpm: 0, fillerCount: 0, fillers: [] };
    }

    // 1. Calculate WPM
    const words = transcript.trim().split(/\s+/);
    const wordCount = words.length;
    const minutes = duration / 60;
    const wpm = Math.round(wordCount / minutes);

    // 2. Detect Fillers
    const fillerRegex = /\b(um|uh|like|you know|sort of|kind of|i mean)\b/gi;
    const matches = transcript.match(fillerRegex);

    const fillerCount = matches ? matches.length : 0;
    const fillers = matches ? [...new Set(matches.map(f => f.toLowerCase()))] : []; // Unique fillers found

    return {
        wpm,
        fillerCount,
        fillers
    };
};

module.exports = { analyzeVoice };
