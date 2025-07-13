// backend/routes/searchRoutes.js
const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/search", authMiddleware.authenticateUser, searchController.searchUsers);

module.exports = router;