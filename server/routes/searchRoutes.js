// routes/searchRoutes.js - SEARCH ROUTES
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  searchUsers,
  getFeaturedUsers,
  getUsersBySkill,
  getSearchSuggestions
} = require('../controllers/searchController');

router.get('/users', auth, searchUsers);
router.get('/featured', auth, getFeaturedUsers);
router.get('/skill/:skill', auth, getUsersBySkill);
router.get('/suggestions', auth, getSearchSuggestions);

module.exports = router;
