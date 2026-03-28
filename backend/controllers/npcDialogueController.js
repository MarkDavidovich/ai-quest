const { generateNpcResponse } = require('../services/openaiClient');

const NPC_PERSONALITIES = {
    "10,9": "You are a grumpy, paranoid old woodcutter. You hate strangers, complain about your back hurting, and speak in short, angry sentences. You think everyone is trying to steal your wood.",
    "20,15": "You are an overly dramatic, poetic bard. You speak in rhymes or flowery language. You think everything is a beautiful tragedy.",
    "25,7": "You are a cowardly merchant who is terrified of the water monsters. You stutter slightly when you talk and constantly look over your shoulder.",
};

const chatWithNpc = async (req, res) => {
    try {
        const { npcId, message, history } = req.body;

        if (!npcId) {
            return res.status(400).json({ error: 'npcId is required!' });
        }

        const personality = NPC_PERSONALITIES[npcId] || "";

        const aiResponse = await generateNpcResponse(npcId, message, history, personality);

        return res.json({
            npcId,
            nodeId: "ai_generated",
            text: aiResponse.text,
            choices: aiResponse.choices,
            questOffer: aiResponse.questOffer || null, // <--- התוספת הקריטית מההצעה של Opus
            source: "ai"
        });

    } catch (error) {
        console.error('AI Dialogue Error:', error);
        return res.status(500).json({ error: 'Failed to generate AI response' });
    }
};

module.exports = { chatWithNpc };