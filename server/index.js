require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (Security & parsing)
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "Vehicle Repair System API is running!" });
});

// Database Connection
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
