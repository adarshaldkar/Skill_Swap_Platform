// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const usersRoutes = require("./routes/usersRoutes");
const swapRequestRoutes = require("./routes/swapRequestRoutes");
// const usersRoutes = require("./routes/usersRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (err) => console.error(err));
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", usersRoutes);
app.use("/api/users", searchRoutes); // or create new route group
app.use("/api/users", usersRoutes);
app.use("/api/swaps", swapRequestRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});