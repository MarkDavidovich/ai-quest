const { generateNpcResponse } = require('../services/openaiClient');

const chatWithNpc = async (req, res) => {
    try {
        const { npcId, meesage, history } = req.body;

        if (!npcId) {
            return res.status(400).json({ error: 'npcId is required!' });
        }

        const aiResponse = await generateNpcResponse(npcId, meesage, history);

        return res.json({
            npcId,
            nodeId: "ai_generated",
            text: aiResponse.text,
            choices: aiResponse.choices,
            source: "ai"
        });

    } catch (error) {
        console.error('AI Dialogue Error:', error);
        return res.status(500).json({ error: 'Failed to generate AI response' });
    }
};

module.exports = { chatWithNpc };