const SwapRequest = require("../models/SwapRequest");
const User = require("../models/user");

exports.sendSwapRequest = async (req, res) => {
  const { toUserId, offeredSkill, wantedSkill } = req.body;

  try {
    const newRequest = new SwapRequest({
      fromUserId: req.user.userId,
      toUserId,
      offeredSkill,
      wantedSkill,
      status: "pending"
    });

    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSwapRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await SwapRequest.find({
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    }).populate("fromUserId toUserId", "name");

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};