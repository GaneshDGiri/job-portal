// Simple mock AI logic
exports.getSuggestions = async (req, res) => {
    const { userSkills } = req.body;
    
    // In a real app, you would send 'userSkills' to OpenAI API here.
    // Returning mock response:
    res.json({
        message: "AI Analysis Complete",
        suggestions: [
            `Based on ${userSkills}, you are a good fit for Frontend roles.`,
            `Consider learning Docker to increase your hiring chance by 20%.`
        ]
    });
};