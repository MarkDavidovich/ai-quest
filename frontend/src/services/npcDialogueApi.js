const API_URL = '/api/npc-dialogue/chat';

export const fetchAiDialogue = async (npcId, message = "", history = [], questContext = "") => { // <-- הוספנו פה
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ npcId, message, history, questContext }) // <-- ופה
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch AI dialogue. Falling back to static data...", error);
        throw error;
    }
};