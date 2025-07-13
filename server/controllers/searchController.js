// backend/controllers/searchController.js
const User = require("../models/user");

exports.searchUsers = async (req, res) => {
  try {
    const { q, category, minRating, location, sortBy } = req.query;

    const query = {};

    // 🔍 General keyword search (name, skills)
    if (q) {
      query.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { "skillsToTeach.name": { $regex: q, $options: "i" } },
        { "skillsToLearn.name": { $regex: q, $options: "i" } }
      ];
    }

    // 🏷️ Filter by skill category (e.g., Development, Design)
    if (category) {
      query["skillsToTeach.category"] = { $regex: category, $options: "i" };
    }

    // ⭐ Minimum rating filter
    if (minRating && !isNaN(minRating)) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // 🌐 Location-based filtering
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 🔀 Sorting options
    let sortOptions = {};
    if (sortBy === "rating") {
      sortOptions = { rating: -1 }; // Descending order
    } else if (sortBy === "newest") {
      sortOptions = { createdAt: -1 };
    } else {
      sortOptions = { rating: -1, createdAt: -1 }; // Default: sort by rating then newest
    }

    const users = await User.find(query).select("-password").sort(sortOptions);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};