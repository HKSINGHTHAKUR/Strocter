import api from "./api";

/**
 * Send a message to Strocter AI.
 * @param {string} message - User's chat message
 * @param {string} [context] - Optional hidden behavioral context (not shown in UI)
 * @returns {Promise<string>} AI reply text
 */
export async function sendAIMessage(message, context) {
    const payload = { message };
    if (context) payload.context = context;
    const { data } = await api.post("/ai/chat", payload);
    return data.reply;
}
