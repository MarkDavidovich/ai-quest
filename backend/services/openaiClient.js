require("dotenv").config();
const { OpenAI } = require("openai");

// הנה השורות שנמחקו לך בטעות!
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// הוספנו את questContext בסוף הפרמטרים
const generateNpcResponse = async (npcId, playerMessage, history = [], personality = "", questContext = "") => {
  const isFirstTurn = history.length === 0;

  const systemPrompt = `
You are NPC "${npcId}" in a 2D RPG called "AI-Quest".
${personality ? `PERSONALITY: ${personality}` : "You are a standard, friendly traveler."}

===ONLY THESE ITEMS AND ENEMIES ARE IN THE GAME===
ITEMS:
- id:"dino_bone" name:"Dino Bone"
- id:"goblin_flask" name:"Goblin Flask"
- id:"dragon_meat" name: "Dragon Meat"

ENEMIES:
- id:"bear" name:"Forest Bear"
- id:"dragon" name:"Dragon"
- id:"goblin" name:"Goblin"
- id:"dino" name:""Wild Dino"
- id:"lizard" name:""Giant Lizard"


=== CURRENT QUEST STATUS ===
${questContext || "No active quest."}
* If the player is on your quest and requirements are MET: You MUST thank them, tell them the quest is done, and set "questCompleted": true in your JSON!
* If the player is on your quest and requirements are NOT MET: Remind them what they need to do.

=== WORLD MECHANICS ===
- Water tiles trigger random combat encounters (goblins or dragons).
- Chests scattered across the map contain loot (potions or swords only).

=== QUEST RULES ===
You may offer the player a quest ONLY when they ask for one AND if they are not already on one.
- Quest type must be "gather" or "kill".
- "gather" quests: targetId must be "Dragon Meat", amount 1. This item are obtained by fighting the dragon in the Deep Forest.
- NEVER invent items, enemies, places, or mechanics not listed above.

=== REQUIRED JSON OUTPUT (strict schema) ===
Respond with ONLY valid JSON.
{
  "text": "<your dialogue, 3 sentences max>",
  "choices": [
    { "id": "<short_id>", "label": "<short player reply>" },
    { "id": "leave", "label": "Goodbye" }
  ],
  "questOffer": null,
  "questCompleted": false
}

CHOICES:
- ALWAYS include exactly one choice with id "leave" as the last item.
- Total choices: 2-4.

QUEST OFFER:
- "questOffer" is null unless you are offering a new quest THIS turn.
- When offering: { "type": "gather", "targetId": "<valid_id>", "amount": <integer> }
`;

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
      temperature: 0.4,
      max_tokens: 600,
    });

    const rawContent = completion.choices[0].message.content;
    return JSON.parse(rawContent);
  } catch (error) {
    console.error(`[OpenAI Service Error] Failed for NPC ${npcId}:`, error.message);
    throw new Error("AI Generation failed");
  }
};

module.exports = { generateNpcResponse };