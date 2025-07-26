// models/User.js - USER MODEL
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  skillsOffered: [{
    type: String,
    trim: true
  }],
  skillsWanted: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: ['weekdays', 'weekends', 'evenings', 'flexible'],
    default: 'flexible'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpires: {
    type: Date,
    default: undefined
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ skillsOffered: 1 });
userSchema.index({ skillsWanted: 1 });
userSchema.index({ location: 1 });
userSchema.index({ rating: -1 });

// Methods
userSchema.methods.updateRating = function(newRating) {
  this.totalRatings += 1;
  this.rating = ((this.rating * (this.totalRatings - 1)) + newRating) / this.totalRatings;
  return this.save();
};

userSchema.methods.hasSkill = function(skill) {
  return this.skillsOffered.includes(skill);
};

userSchema.methods.wantsSkill = function(skill) {
  return this.skillsWanted.includes(skill);
};

// Static methods
userSchema.statics.findBySkill = function(skill) {
  return this.find({ skillsOffered: { $in: [skill] } });
};

userSchema.statics.findWantingSkill = function(skill) {
  return this.find({ skillsWanted: { $in: [skill] } });
};

// Pre-save middleware
userSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('lastActive')) {
    this.lastActive = new Date();
  }
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
