/* ── resetAndSeed.js ──
   Clears all transactions, goals, settings from MongoDB
   and inserts one fresh test transaction.
   Run: node resetAndSeed.js
*/

require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");
const User = require("./models/User");

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // 1. Find the existing user
    const user = await User.findOne({});
    if (!user) {
        console.error("❌ No user found! Please create a user first via the auth route.");
        process.exit(1);
    }
    console.log(`👤 Found user: ${user.name} (${user.email}) — ID: ${user._id}`);

    // 2. Clear all transactions
    const txnResult = await Transaction.deleteMany({});
    console.log(`🗑️  Deleted ${txnResult.deletedCount} transactions`);

    // 3. Clear goals if collection exists
    try {
        const Goal = require("./models/Goal");
        const goalResult = await Goal.deleteMany({});
        console.log(`🗑️  Deleted ${goalResult.deletedCount} goals`);
    } catch (e) {
        console.log("ℹ️  No Goal model found, skipping");
    }

    // 4. Clear system settings if collection exists
    try {
        const SystemSettings = require("./models/SystemSettings");
        const settingsResult = await SystemSettings.deleteMany({});
        console.log(`🗑️  Deleted ${settingsResult.deletedCount} system settings`);
    } catch (e) {
        console.log("ℹ️  No SystemSettings model found, skipping");
    }

    // 5. Insert one fresh test transaction
    const testTransaction = await Transaction.create({
        user: user._id,
        amount: 1500,
        type: "expense",
        category: "Food",
        note: "Dinner at a restaurant with family",
        emotion: "happy",
        tags: ["dining", "family"],
        createdAt: new Date(),  // right now
    });

    console.log("\n✅ Created 1 test transaction:");
    console.log(`   ID:       ${testTransaction._id}`);
    console.log(`   Amount:   ₹${testTransaction.amount}`);
    console.log(`   Type:     ${testTransaction.type}`);
    console.log(`   Category: ${testTransaction.category}`);
    console.log(`   Emotion:  ${testTransaction.emotion}`);
    console.log(`   Note:     ${testTransaction.note}`);
    console.log(`   Tags:     ${testTransaction.tags.join(", ")}`);
    console.log(`   Date:     ${testTransaction.createdAt}`);

    console.log("\n🎉 Done! Refresh the app to see the single entry across all pages.");

    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
