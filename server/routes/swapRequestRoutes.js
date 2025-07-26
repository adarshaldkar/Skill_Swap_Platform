// routes/swapRequestRoutes.js - SWAP REQUEST ROUTES
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  sendSwapRequest,
  getUserSwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwapRequest,
  getReceivedSwapRequests
} = require('../controllers/swapRequestController');

router.post('/send', auth, sendSwapRequest);
router.get('/user', auth, getUserSwapRequests);
router.get('/received', auth, getReceivedSwapRequests);
router.put('/:id/accept', auth, acceptSwapRequest);
router.put('/:id/reject', auth, rejectSwapRequest);
router.delete('/:id/cancel', auth, cancelSwapRequest);
router.put('/:id/complete', auth, completeSwapRequest);

module.exports = router;
