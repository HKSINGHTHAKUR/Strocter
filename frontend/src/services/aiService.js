import api from "./api";

/**
 * Send a message to Strocter AI.
 * @param {string} message - User's chat message
 * @returns {Promise<string>} AI reply text
 */
export async function sendAIMessage(message) {
    const { data } = await api.post("/ai/chat", { message });
    return data.reply;
}
