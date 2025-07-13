const express = require("express");
const router = express.Router();
const swapRequestController = require("../controllers/swapRequestController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send", authMiddleware.authenticateUser, swapRequestController.sendSwapRequest);
router.get("/requests", authMiddleware.authenticateUser, swapRequestController.getSwapRequests);

module.exports = router;