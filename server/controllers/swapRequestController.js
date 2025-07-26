// controllers/SwapRequestController.js - SWAP REQUEST CONTROLLER
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

const sendSwapRequest = async (req, res) => {
  try {
    const { recipientId, requesterSkill, recipientSkill, message } = req.body;
    const requesterId = req.user.id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (requesterId === recipientId) {
      return res.status(400).json({ message: 'You cannot send a swap request to yourself' });
    }

    const existingRequest = await SwapRequest.findOne({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request with this user' });
    }

    const swapRequest = new SwapRequest({
      requester: requesterId,
      recipient: recipientId,
      requesterSkill,
      recipientSkill,
      message: message || ''
    });

    await swapRequest.save();

    await swapRequest.populate('requester', 'name email profilePicture');
    await swapRequest.populate('recipient', 'name email profilePicture');

    res.status(201).json({
      message: 'Swap request sent successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Send swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserSwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const swapRequests = await SwapRequest.find({ requester: userId })
      .populate('requester', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture skillsOffered location rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Swap requests retrieved successfully',
      requests: swapRequests
    });
  } catch (error) {
    console.error('Get user swap requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const swapRequest = await SwapRequest.findById(id)
      .populate('requester', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture');
    
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }
    
    if (swapRequest.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only accept requests sent to you' });
    }
    
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been responded to' });
    }
    
    swapRequest.status = 'accepted';
    swapRequest.acceptedAt = new Date();
    if (notes) swapRequest.notes = notes;
    
    await swapRequest.save();
    
    res.status(200).json({
      message: 'Swap request accepted successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Accept swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const swapRequest = await SwapRequest.findById(id)
      .populate('requester', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture');
    
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }
    
    if (swapRequest.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only reject requests sent to you' });
    }
    
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been responded to' });
    }
    
    swapRequest.status = 'rejected';
    if (notes) swapRequest.notes = notes;
    
    await swapRequest.save();
    
    res.status(200).json({
      message: 'Swap request rejected',
      swapRequest
    });
  } catch (error) {
    console.error('Reject swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const swapRequest = await SwapRequest.findById(id)
      .populate('requester', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture');
    
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }
    
    if (swapRequest.requester._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only cancel your own requests' });
    }
    
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }
    
    swapRequest.status = 'cancelled';
    swapRequest.cancelledAt = new Date();
    
    await swapRequest.save();
    
    res.status(200).json({
      message: 'Swap request cancelled successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Cancel swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const completeSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const swapRequest = await SwapRequest.findById(id)
      .populate('requester', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture');
    
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }
    
    const userId = req.user.id;
    if (swapRequest.requester._id.toString() !== userId && 
        swapRequest.recipient._id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not involved in this swap' });
    }
    
    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({ message: 'Only accepted swaps can be marked as completed' });
    }
    
    swapRequest.status = 'completed';
    swapRequest.completedAt = new Date();
    
    await swapRequest.save();
    
    res.status(200).json({
      message: 'Swap marked as completed',
      swapRequest
    });
  } catch (error) {
    console.error('Complete swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReceivedSwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const receivedRequests = await SwapRequest.find({ recipient: userId })
      .populate('requester', 'name email profilePicture skillsOffered location rating')
      .populate('recipient', 'name email profilePicture skillsOffered')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Received swap requests retrieved successfully',
      requests: receivedRequests
    });
  } catch (error) {
    console.error('Get received swap requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendSwapRequest,
  getUserSwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwapRequest,
  getReceivedSwapRequests
};
