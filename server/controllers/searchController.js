// controllers/SearchController.js - SEARCH CONTROLLER
const User = require('../models/User');

const searchUsers = async (req, res) => {
  try {
    const {
      keyword = '',
      category = '',
      location = '',
      minRating = 0,
      maxRating = 5,
      availability = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const currentUserId = req.user.id;

    let searchQuery = {
      _id: { $ne: currentUserId },
      isActive: true,
      isPublic: true
    };

    if (keyword.trim()) {
      const keywordRegex = new RegExp(keyword.trim(), 'i');
      searchQuery.$or = [
        { skillsOffered: { $regex: keywordRegex } },
        { skillsWanted: { $regex: keywordRegex } },
        { name: { $regex: keywordRegex } },
        { bio: { $regex: keywordRegex } }
      ];
    }

    if (category.trim()) {
      const categoryRegex = new RegExp(category.trim(), 'i');
      searchQuery.skillsOffered = { $regex: categoryRegex };
    }

    if (location.trim()) {
      const locationRegex = new RegExp(location.trim(), 'i');
      searchQuery.location = { $regex: locationRegex };
    }

    if (minRating > 0 || maxRating < 5) {
      searchQuery.rating = {
        $gte: parseFloat(minRating),
        $lte: parseFloat(maxRating)
      };
    }

    if (availability.trim()) {
      searchQuery.availability = availability;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions.rating = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'name':
        sortOptions.name = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'location':
        sortOptions.location = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'joinedAt':
        sortOptions.joinedAt = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'lastActive':
        sortOptions.lastActive = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(searchQuery)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limitNum);

    const usersWithExtras = users.map(user => ({
      ...user,
      skillCount: user.skillsOffered ? user.skillsOffered.length : 0,
      isOnline: user.lastActive && (new Date() - new Date(user.lastActive)) < 15 * 60 * 1000,
      memberSince: user.joinedAt || user.createdAt
    }));

    res.status(200).json({
      message: 'Users found successfully',
      users: usersWithExtras,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      },
      filters: {
        keyword,
        category,
        location,
        minRating,
        maxRating,
        availability,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      message: 'Server error during user search',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getFeaturedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const limit = parseInt(req.query.limit) || 6;

    const currentUser = await User.findById(currentUserId).select('skillsWanted skillsOffered');
    
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    let featuredQuery = {
      _id: { $ne: currentUserId },
      isActive: true,
      isPublic: true,
      rating: { $gte: 3.0 }
    };

    if (currentUser.skillsWanted && currentUser.skillsWanted.length > 0) {
      featuredQuery.skillsOffered = { 
        $in: currentUser.skillsWanted 
      };
    }

    let featuredUsers = await User.find(featuredQuery)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ 
        rating: -1, 
        totalRatings: -1, 
        lastActive: -1 
      })
      .limit(limit)
      .lean();

    if (featuredUsers.length < limit) {
      const remainingLimit = limit - featuredUsers.length;
      const featuredUserIds = featuredUsers.map(user => user._id);
      
      const additionalUsers = await User.find({
        _id: { 
          $ne: currentUserId,
          $nin: featuredUserIds 
        },
        isActive: true,
        isPublic: true
      })
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ 
        rating: -1, 
        lastActive: -1,
        createdAt: -1 
      })
      .limit(remainingLimit)
      .lean();

      featuredUsers = [...featuredUsers, ...additionalUsers];
    }

    const usersWithExtras = featuredUsers.map(user => ({
      ...user,
      skillCount: user.skillsOffered ? user.skillsOffered.length : 0,
      isOnline: user.lastActive && (new Date() - new Date(user.lastActive)) < 15 * 60 * 1000,
      memberSince: user.joinedAt || user.createdAt,
      isFeatured: true
    }));

    res.status(200).json({
      message: 'Featured users retrieved successfully',
      users: usersWithExtras,
      total: usersWithExtras.length
    });

  } catch (error) {
    console.error('Get featured users error:', error);
    res.status(500).json({ 
      message: 'Server error getting featured users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getUsersBySkill = async (req, res) => {
  try {
    const { skill } = req.params;
    const currentUserId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    if (!skill || !skill.trim()) {
      return res.status(400).json({ message: 'Skill parameter is required' });
    }

    const skillRegex = new RegExp(skill.trim(), 'i');

    const users = await User.find({
      _id: { $ne: currentUserId },
      isActive: true,
      isPublic: true,
      skillsOffered: { $regex: skillRegex }
    })
    .select('-password -resetPasswordToken -resetPasswordExpires')
    .sort({ rating: -1, totalRatings: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const totalUsers = await User.countDocuments({
      _id: { $ne: currentUserId },
      isActive: true,
      isPublic: true,
      skillsOffered: { $regex: skillRegex }
    });

    const usersWithExtras = users.map(user => ({
      ...user,
      skillCount: user.skillsOffered ? user.skillsOffered.length : 0,
      isOnline: user.lastActive && (new Date() - new Date(user.lastActive)) < 15 * 60 * 1000,
      memberSince: user.joinedAt || user.createdAt
    }));

    res.status(200).json({
      message: `Users with skill "${skill}" found successfully`,
      users: usersWithExtras,
      skill: skill,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page < Math.ceil(totalUsers / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get users by skill error:', error);
    res.status(500).json({ 
      message: 'Server error getting users by skill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getSearchSuggestions = async (req, res) => {
  try {
    const { query, type = 'skills' } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Query must be at least 2 characters long' 
      });
    }

    const queryRegex = new RegExp(query.trim(), 'i');
    let suggestions = [];

    switch (type) {
      case 'skills':
        const skillsOffered = await User.distinct('skillsOffered', {
          skillsOffered: { $regex: queryRegex },
          isActive: true,
          isPublic: true
        });
        
        const skillsWanted = await User.distinct('skillsWanted', {
          skillsWanted: { $regex: queryRegex },
          isActive: true,
          isPublic: true
        });

        const allSkills = [...new Set([...skillsOffered, ...skillsWanted])];
        suggestions = allSkills
          .filter(skill => skill.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10);
        break;

      case 'locations':
        suggestions = await User.distinct('location', {
          location: { $regex: queryRegex },
          isActive: true,
          isPublic: true
        });
        suggestions = suggestions.slice(0, 10);
        break;

      case 'users':
        const users = await User.find({
          name: { $regex: queryRegex },
          isActive: true,
          isPublic: true
        })
        .select('name profilePicture')
        .limit(10)
        .lean();

        suggestions = users.map(user => ({
          id: user._id,
          name: user.name,
          profilePicture: user.profilePicture
        }));
        break;

      default:
        return res.status(400).json({ message: 'Invalid suggestion type' });
    }

    res.status(200).json({
      message: 'Search suggestions retrieved successfully',
      suggestions,
      query,
      type
    });

  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({ 
      message: 'Server error getting search suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  searchUsers,
  getFeaturedUsers,
  getUsersBySkill,
  getSearchSuggestions
};
