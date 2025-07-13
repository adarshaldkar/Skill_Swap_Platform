const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  offeredSkill: {
    type: String,
    required: true
  },
  wantedSkill: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending", // pending, accepted, rejected, completed
    enum: ["pending", "accepted", "rejected", "completed"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SwapRequest", swapRequestSchema);