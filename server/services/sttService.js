const transcribeAudio = async (filePath) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, we would send the file to OpenAI Whisper or Google Cloud Speech-to-Text
    // Here, we return mock text.
    // Ideally, we could vary the text based on the file size or random choice.

    const mockTranscripts = [
        "The difference between an Array and a Linked List is that an Array uses contiguous memory locations, allowing for O(1) access time, whereas a Linked List consists of nodes where each node contains data and a reference to the next node, allowing for efficient insertion and deletion.",
        "Closures in JavaScript are functions that have access to the outer function's scope (lexical environment) even after the outer function has returned. This allows for data encapsulation and factory patterns.",
        "I have experience building React applications using Redux for state management. In my last project, I optimized the rendering performance by using useMemo and useCallback hooks.",
        "Rest APIs use standard HTTP methods like GET, POST, PUT, DELETE for CRUD operations. They are stateless and typically communicate using JSON.",
        "Uh, I think... um... well, to be honest, I am not entirely sure about that specific detail, but I would look it up in the documentation."
    ];

    const randomIndex = Math.floor(Math.random() * mockTranscripts.length);

    return {
        transcript: mockTranscripts[randomIndex],
        confidence: 0.85 + (Math.random() * 0.1), // 0.85 to 0.95
        duration: 15 // Placeholder duration
    };
};

module.exports = { transcribeAudio };
