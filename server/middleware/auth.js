// middleware/auth.js - AUTHENTICATION MIDDLEWARE
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No token, authorization denied' 
      });
    }

    let actualToken;
    if (token.startsWith('Bearer ')) {
      actualToken = token.slice(7);
    } else {
      actualToken = token;
    }

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is valid but user not found' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'User account is deactivated' 
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      profilePicture: user.profilePicture,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      rating: user.rating,
      location: user.location
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired' 
      });
    }

    res.status(500).json({ 
      message: 'Server error in authentication' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      auth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ 
      message: 'Server error in admin authentication' 
    });
  }
};

module.exports = {
  auth,
  adminAuth
};
