/* ── strocterAI.js ──
   Strocter AI Service Layer — OpenAI integration.
   Receives summarized analytics (never raw transactions) + user message.
*/

const OpenAI = require("openai");

let _client = null;

/** Lazy-init so the server starts even if OPENAI_API_KEY is not set yet. */
function getClient() {
    if (!_client) {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
            throw new Error("OPENAI_API_KEY is not configured. Add your key to backend/.env");
        }
        _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return _client;
}

const SYSTEM_PROMPT = `You are Strocter AI, a financial psychology assistant built into the Strocter platform.

Your capabilities:
- Analyze emotional spending patterns
- Identify psychological triggers behind financial behavior
- Provide actionable behavioral insights
- Detect impulse spending tendencies

Your personality:
- Calm, analytical, and empathetic
- Never shame the user for their spending habits
- Reference their actual data when giving insights
- Be concise but thorough

Response format — always structure your response with these sections:

📊 Observation
(What the data reveals about recent behavior)

🧠 Psychological Insight
(The underlying behavioral pattern or cognitive bias at play)

⚠️ Behavioral Risk
(What could happen if this pattern continues)

✅ Practical Action Steps
(2-3 specific, actionable recommendations)

Keep responses focused and under 300 words. Use the user's actual analytics data to personalize every response.`;

/**
 * Send a message to Strocter AI with user analytics context.
 *
 * @param {Object} userAnalyticsData - Summarized behavioral analytics
 * @param {string} userMessage - The user's chat message
 * @returns {string} AI response text
 */
async function askStrocterAI(userAnalyticsData, userMessage) {
    const client = getClient();

    const analyticsContext = `
Current User Analytics Snapshot:
- Total Spent (Last 30 Days): ₹${userAnalyticsData.totalSpentLast30Days?.toLocaleString() || "N/A"}
- Emotional Spending: ${userAnalyticsData.emotionalSpendingPct || "N/A"}%
- Top Emotion: ${userAnalyticsData.topEmotion || "N/A"}
- Emotion Distribution: ${JSON.stringify(userAnalyticsData.emotionDistribution || {})}
- Impulse Score: ${userAnalyticsData.impulseScore ?? "N/A"}/100
- Control Score (Resilience): ${userAnalyticsData.controlScore ?? "N/A"}/10
- Late Night Spending: ${userAnalyticsData.lateNightSpendingPercent ?? "N/A"}%
- Volatility: ${userAnalyticsData.volatility || "N/A"}
- Top Category: ${userAnalyticsData.topCategory || "N/A"}
`;

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: analyticsContext },
            { role: "user", content: userMessage },
        ],
        max_tokens: 600,
        temperature: 0.7,
    });

    return completion.choices[0].message.content;
}

module.exports = { askStrocterAI };
