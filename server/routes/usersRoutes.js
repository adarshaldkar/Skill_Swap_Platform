const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const usersController = require("../controllers/usersController");

router.get("/me", authMiddleware.authenticateUser, usersController.getCurrentUser);
router.put("/me", authMiddleware.authenticateUser, usersController.updateCurrentUser);

module.exports = router;