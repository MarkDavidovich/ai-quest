require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateNpcResponse = async (npcId, playerMessage, history = []) => {
  const isFirstTurn = history.length === 0;

  const systemPrompt = `
    You are an NPC in a 2D RPG game. Your ID is "${npcId}".
    Respond to the player in character.

    WORLD LORE & KNOWLEDGE (Use this if relevant):
    1. Water is dangerous! If the player walks on water tiles, they can trigger random combat encounters with enemies. Warn them about this if they ask for advice.
    2. Quests: If the player asks for a quest (e.g., "Do you have a quest?"), invent a fun, short RPG quest for them (for example: "Defeat 3 water monsters", "Find a shiny item", "Explore the edges of the map"). Make it sound epic but keep it brief.

    ${
      isFirstTurn
        ? "This is the beginning of the conversation. Start by saying something atmospheric about the world map, the current environment, or a subtle hint about the game."
        : "The conversation is ongoing. In your response, occasionally ask the player if they are lost, or give them a strong motivational message to keep exploring and not to give up!"
    }
    You MUST respond in valid JSON format ONLY. 
    The JSON structure must exactly match this schema:
    {
      "text": "Your dialogue response here (keep it under 3 sentences)",
      "choices": [
        { "id": "choice_1", "label": "Short player reply option" },
        { "id": "leave", "label": "Goodbye" }
      ]
    }
    CRITICAL RULES FOR CHOICES:
    1. If it's the start of the conversation, provide choices similar to: "What should I do?", "Do you have a quest?", and always a "Goodbye" option.
    2. For subsequent turns, generate 2-3 logical and short player responses based on what you just said.
    3. Always include exactly one choice with the id "leave" (label can be "Goodbye", "Leave", "Farewell") so the player can exit the chat.
    
  `;

  // 2. יצירת מערך ההודעות שיישלח ל-OpenAI (זה המשתנה שהיה חסר!)
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((msg) => ({
      role: msg.source === "ai" ? "assistant" : "user",
      content: msg.text,
    })),
    { role: "user", content: playerMessage || "Hello" },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    const rawContent = completion.choices[0].message.content;
    return JSON.parse(rawContent);
  } catch (error) {
    console.error(`[OpenAI Service Error] Failed for NPC ${npcId}:`, error.message);
    throw new Error("AI Generation failed");
  }
};

module.exports = { generateNpcResponse };
