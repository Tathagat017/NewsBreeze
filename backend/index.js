const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/news", require("./src/routes/news"));
app.use("/api/audio", require("./src/routes/audio"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "NewsBreeze API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
