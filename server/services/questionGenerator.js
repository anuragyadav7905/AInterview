const generateQuestions = (role, difficulty, style, cvData, focus) => {
    const questions = [];

    // Helper to add question
    const addQ = (q) => questions.push(q);

    // If focus is provided, override normal flow with specific drills
    if (focus) {
        addQ(`Welcome to your practice session focusing on: ${focus}. Let's dive straight in.`);

        if (focus === "Technical Depth") {
            addQ("Pick a complex system or project you built and explain its architecture in minute detail.");
            addQ("Explain a technical concept you found difficult to learn to someone without a technical background.");
            addQ("If you had to scale your last project to 10 million users, what bottlenecks would you face and how would you solve them?");
        } else if (focus === "Filler Words") {
            addQ("Describe your favorite movie plot in under 2 minutes. Focus on speaking clearly without pauses.");
            addQ("Explain how the internet works. Take a deep breath before every sentence.");
            addQ("Tell me about a time you failed. Be concise and direct.");
        } else if (focus.includes("Speaking Speed")) {
            addQ("Read this out loud: 'The quick brown fox jumps over the lazy dog.' Focus on maintaining a steady, moderate pace.");
            addQ("Describe your morning routine. Ensure you are enunciating every word clearly.");
            addQ("Explain the rules of your favorite game. Focus on energy and pacing.");
        } else if (focus === "Voice Delivery") {
            addQ("Introduce yourself as if you are presenting to a CEO. Project confidence.");
            addQ("Tell me a joke. Focus on your tone and timing.");
        } else {
            // General Fallback
            addQ("Tell me about yourself.");
            addQ("What are your greatest strengths?");
            addQ("Where do you see yourself in 5 years?");
        }

        return questions;
    }

    // --- Normal Flow (if no focus) ---

    // 1. Introduction (Ice breaker)
    if (style === 'Friendly') {
        addQ(`Hi ${cvData.name || 'Candidate'}! To start, could you tell me a bit about yourself?`);
    } else if (style === 'Strict') {
        addQ("State your name and current role concisely.");
    } else {
        addQ("Let's begin. Walk me through your resume.");
    }

    // 2. Role specific (Technical 1)
    if (role === 'SDE') {
        if (difficulty === 'Easy') addQ("What is the difference between an Array and a Linked List?");
        else if (difficulty === 'Medium') addQ("Explain the concept of closures in JavaScript.");
        else addQ("Design a system for a real-time chat application.");
    } else if (role === 'Data Analyst') {
        addQ("What is the difference between INNER JOIN and LEFT JOIN?");
    } else if (role === 'Product Manager') {
        addQ("How do you prioritize features in a roadmap?");
    } else {
        addQ(`What are the key responsibilities of a ${role}?`);
    }

    // 3. Experience based (Behavioral/Technical Hybrid)
    if (cvData.structuredData && cvData.structuredData.experience) {
        addQ("I see you have experience. Can you describe a challenging project you worked on?");
    } else {
        addQ("Describe a project you worked on in university or your free time.");
    }

    // 4. Skills based
    if (cvData.structuredData && cvData.structuredData.skills) {
        const skills = cvData.structuredData.skills.split(',').slice(0, 3).join(', '); // simplistic split
        addQ(`Your resume mentions ${skills}. Which one are you most proficient in and why?`);
    } else {
        addQ(" What technical skills do you consider your strongest?");
    }

    // 5. Closing
    addQ("Do you have any questions for us?");

    return questions;
};

module.exports = { generateQuestions };
