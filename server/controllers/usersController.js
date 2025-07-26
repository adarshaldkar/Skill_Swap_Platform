// controllers/UsersController.js - USERS CONTROLLER
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const user = await User.findById(userId)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isPublic && userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'This profile is private' });
    }

    const userResponse = {
      ...user.toObject(),
      skillCount: user.skillsOffered ? user.skillsOffered.length : 0,
      isOnline: user.lastActive && (new Date() - new Date(user.lastActive)) < 15 * 60 * 1000,
      memberSince: user.joinedAt || user.createdAt
    };

    res.status(200).json({
      message: 'User retrieved successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      location,
      skillsOffered,
      skillsWanted,
      availability,
      bio,
      isPublic,
      profilePicture
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (location !== undefined) user.location = location.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (availability) user.availability = availability;
    if (isPublic !== undefined) user.isPublic = isPublic;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    if (skillsOffered && Array.isArray(skillsOffered)) {
      user.skillsOffered = skillsOffered.map(skill => skill.trim()).filter(skill => skill);
    }

    if (skillsWanted && Array.isArray(skillsWanted)) {
      user.skillsWanted = skillsWanted.map(skill => skill.trim()).filter(skill => skill);
    }

    await user.save();

    const updatedUser = await User.findById(userId)
      .select('-password -resetPasswordToken -resetPasswordExpires');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    res.status(200).json({
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUser,
  updateUser,
  changePassword,
  deleteUser
};
