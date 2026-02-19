require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

// Load environment variables

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);


// Connect to MongoDB
connectDB();

const app = express();

// ---------- Global Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// ---------- Routes ----------
app.use("/", require("./routes/healthRoute"));
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/transactions", require("./routes/transactionRoute"));

// ---------- 404 Handler ----------
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- Global Error Handler ----------
app.use(errorHandler);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
