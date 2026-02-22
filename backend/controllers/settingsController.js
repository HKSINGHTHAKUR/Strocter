const SystemSettings = require("../models/SystemSettings");
const { DEFAULTS, validateSettings } = require("../services/settingsEngine");

/* GET /api/settings — Returns full settings (auto-creates if missing) */
const getSettings = async (req, res) => {
    try {
        let settings = await SystemSettings.findOne({ userId: req.user._id });

        if (!settings) {
            settings = await SystemSettings.create({ userId: req.user._id, ...DEFAULTS });
        }

        res.json(settings);
    } catch (err) {
        console.error("Get settings error:", err);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

/* PUT /api/settings — Update entire settings object */
const updateSettings = async (req, res) => {
    try {
        const validated = validateSettings(req.body);

        const settings = await SystemSettings.findOneAndUpdate(
            { userId: req.user._id },
            { $set: validated },
            { new: true, upsert: true, runValidators: true }
        );

        res.json(settings);
    } catch (err) {
        console.error("Update settings error:", err);
        res.status(500).json({ message: "Failed to update settings" });
    }
};

/* POST /api/settings/reset — Reset to defaults */
const resetSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.findOneAndUpdate(
            { userId: req.user._id },
            { $set: DEFAULTS },
            { new: true, upsert: true }
        );

        res.json(settings);
    } catch (err) {
        console.error("Reset settings error:", err);
        res.status(500).json({ message: "Failed to reset settings" });
    }
};

module.exports = { getSettings, updateSettings, resetSettings };
