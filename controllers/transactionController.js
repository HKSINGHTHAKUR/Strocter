const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res) => {
    try {
        const { amount, type, category, note, emotion, tags } = req.body;

        const newTransaction = await Transaction.create({
            user: req.user,
            amount,
            type,
            category,
            note,
            emotion,
            tags,
        });

        res.status(201).json({
            success: true,
            data: newTransaction,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
