const { generateNpcResponse } = require('../services/openaiClient');

const NPC_PERSONALITIES = {
    "10,9": "You are a grumpy, paranoid old woodcutter.",
    "20,15": "You are an overly dramatic, poetic bard.",
    "25,7": "You are a cowardly merchant who is terrified of the water monsters.",
};

const chatWithNpc = async (req, res) => {
    try {
        // משכנו את questContext מהבקשה
        const { npcId, message, history, questContext } = req.body;

        if (!npcId) {
            return res.status(400).json({ error: 'npcId is required!' });
        }

        const personality = NPC_PERSONALITIES[npcId] || "";

        const aiResponse = await generateNpcResponse(npcId, message, history, personality, questContext);

        return res.json({
            npcId,
            nodeId: "ai_generated",
            text: aiResponse.text,
            choices: aiResponse.choices,
            questOffer: aiResponse.questOffer || null,
            questCompleted: aiResponse.questCompleted || false, // <--- החזרת הדגל לקליינט
            source: "ai"
        });

    } catch (error) {
        console.error('AI Dialogue Error:', error);
        return res.status(500).json({ error: 'Failed to generate AI response' });
    }
};

module.exports = { chatWithNpc };