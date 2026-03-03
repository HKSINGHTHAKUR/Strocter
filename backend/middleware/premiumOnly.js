/* ── premiumOnly.js ──
   Middleware: blocks free users whose trial has expired.
   Premium subscribers + active trial users pass through.

   // TEMPORARY: FREE FOR ALL — bypass premium check.
   // Revert this when payment gateway is added.
*/

const premiumOnly = async (req, res, next) => {
    // TEMPORARY: All features free — skip premium check
    next();
};

module.exports = { premiumOnly };
