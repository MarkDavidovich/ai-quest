require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateNpcResponse = async (npcId, playerMessage, history = []) => {
    // 1. הגדרת האישיות והוראות למודל
    const systemPrompt = `
    You are an NPC in a 2D RPG game. Your ID is "${npcId}".
    Respond to the player in character.
    You MUST respond in valid JSON format ONLY. 
    The JSON structure must exactly match this schema:
    {
      "text": "Your dialogue response here (keep it under 3 sentences)",
      "choices": [
        { "id": "choice_1", "label": "Short player reply option" },
        { "id": "leave", "label": "Goodbye" }
      ]
    }
    Always include a "leave" choice to end the conversation. Limit choices to 2-4 options.
  `;

    // 2. יצירת מערך ההודעות שיישלח ל-OpenAI (זה המשתנה שהיה חסר!)
    const messages = [
        { role: "system", content: systemPrompt },
        ...history.map(msg => ({
            role: msg.source === 'ai' ? 'assistant' : 'user',
            content: msg.text
        })),
        { role: "user", content: playerMessage || "Hello" }
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
            messages: messages,
            temperature: 0.7,
            max_tokens: 150,
        });

        const rawContent = completion.choices[0].message.content;
        return JSON.parse(rawContent);

    } catch (error) {
        console.error(`[OpenAI Service Error] Failed for NPC ${npcId}:`, error.message);
        throw new Error('AI Generation failed');
    }
};

module.exports = { generateNpcResponse };