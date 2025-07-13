import React, { useState, useEffect } from 'react';
import { Search, Star, Sparkles } from 'lucide-react';
import SkillExchangeModal from './SkillExchangeModal'; // if you have a modal component

const UserCard = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [users, setUsers] = useState([]);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const params = new URLSearchParams();

    if (searchQuery) params.append("q", searchQuery);
    if (selectedCategories.length > 0) params.append("category", selectedCategories.join(","));
    if (selectedRating) params.append("minRating", selectedRating);

    const response = await fetch(`http://localhost:5000/api/users/search?${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, selectedCategories, selectedRating]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  const skillCategories = [
    'Design', 'Development', 'Music', 'Language', 'Business', 'Lifestyle', 'Photography', 'Education'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SkillSwap</span>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium" onClick={props.onGoHome}>
                Home
              </button>
              <button className="font-medium border-b-2 border-gray-900 pb-1" onClick={props.onBrowseSkills}>
                Browse Skills
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium" onClick={props.onMyProfile}>
                My Profile
              </button>
              <button 
                onClick={() => localStorage.removeItem('token')}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
          <p className="text-gray-600">Find people to learn or teach skills</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Skill Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Skill Categories</h4>
                <div className="space-y-2">
                  {skillCategories.map((category) => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={selectedRating === `${rating}`}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                      />
                      <div className="ml-3 flex items-center">
                        {renderStars(rating)}
                        <span className="ml-2 text-sm text-gray-700">{rating} & up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - User Cards Grid */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search skills or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.length === 0 ? (
                <p className="col-span-2 text-center text-gray-500 mt-10">
                  No users found matching your criteria.
                </p>
              ) : (
                users.map(user => (
                  <div key={user._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {user.initials || user.fullName?.charAt(0) + (user.fullName.split(" ")[1]?.charAt(0) || "")}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                          <p className="text-sm text-gray-500">{user.location || 'Location not specified'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skills I Can Teach */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Skills I Can Teach</h4>
                      {user.skillsToTeach?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skillsToTeach.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No skills listed</p>
                      )}
                    </div>

                    {/* Skills I Want to Learn */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Skills I Want to Learn</h4>
                      {user.skillsToLearn?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skillsToLearn.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No skills listed</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">{user.memberSince || 'Member since June 2025'}</p>
                      <button
                        onClick={() => {
                          setSelectedUser(user); // or whatever user object you want to swap with
                          setShowSwapModal(true);
                        }}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        Request Swap
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {showSwapModal && (
        <SkillExchangeModal
          user={selectedUser}
          onClose={() => setShowSwapModal(false)}
        />
      )}
    </div>
  );
};

export default UserCard;