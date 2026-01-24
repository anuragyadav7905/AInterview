const evaluateAnswer = async (questionContent, userAnswer, style = "Professional") => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple Mock Logic
    const length = userAnswer ? userAnswer.length : 0;

    let score;
    let feedback;
    let strengths = [];
    let improvements = [];

    // Base feedback logic
    if (length < 50) {
        score = Math.floor(Math.random() * 4) + 1; // 1-4
        feedback = "The answer was a little short.";
        strengths = ["Concise delivery"];
        improvements = ["Provide more specific examples", "Explain the 'why' behind the concept"];
    } else if (length < 150) {
        score = Math.floor(Math.random() * 3) + 5; // 5-7
        feedback = "Good answer! You covered the basics, but there is room for deeper analysis.";
        strengths = ["Clear articulation", "Correct terminology"];
        improvements = ["Discuss trade-offs", "Mention edge cases"];
    } else {
        score = Math.floor(Math.random() * 3) + 8; // 8-10
        feedback = "Excellent answer. You demonstrated a strong understanding of the topic.";
        strengths = ["Detailed explanation", "Comprehensive coverage", "Confidence"];
        improvements = ["Ensure answer is structured (START method)"];
    }

    // Apply Tone Adjustments
    if (style === 'Friendly') {
        feedback = `Great effort! ${feedback} Keep it up!`;
    } else if (style === 'Strict') {
        if (score < 7) {
            feedback = `This is insufficient. ${feedback} You need to be more precise.`;
        } else {
            feedback = `Acceptable. ${feedback}`;
        }
    } else if (style === 'HR') {
        feedback = `From a culture-fit perspective: ${feedback}`;
    } else if (style === 'Technical') {
        feedback = `Technically speaking: ${feedback}`;
    }

    return {
        score,
        feedback,
        feedbackStrengths: strengths,
        feedbackImprovements: improvements
    };
};

module.exports = { evaluateAnswer };
