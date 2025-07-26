// routes/userRoutes.js - USER ROUTES
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getUser, updateUser, changePassword, deleteUser } = require('../controllers/usersController');

router.get('/profile', auth, getUser);
router.put('/profile', auth, updateUser);
router.put('/change-password', auth, changePassword);
router.delete('/account', auth, deleteUser);
router.get('/:id', auth, getUser);

module.exports = router;
