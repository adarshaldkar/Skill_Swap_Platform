// src/components/UserCard.jsx - USER BROWSING COMPONENT
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SkillExchangeModal from './SkillExchangeModal';

const UserCard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    location: '',
    minRating: 0,
    availability: '',
    sortBy: 'rating',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 12
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const skillCategories = [
    'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
    'Graphic Design', 'UI/UX Design', 'Photography', 'Video Editing',
    'Writing', 'Content Creation', 'Digital Marketing', 'SEO',
    'Music Production', 'Music Theory', 'Language Teaching', 'Tutoring',
    'Business Strategy', 'Project Management', 'Finance', 'Accounting'
  ];

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.limit
      });

      const response = await fetch(`http://localhost:5000/api/search/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setPagination(prev => ({
          ...prev,
          ...data.pagination
        }));
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleSendRequest = (targetUser) => {
    setSelectedUser(targetUser);
    setShowModal(true);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key={fullStars} className="text-yellow-400">☆</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={fullStars + 1 + i} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-blue-600">
                SkillSwap
              </Link>
              <nav className="flex space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/browse" className="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium">
                  Browse
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Link to="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse Users</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search users, skills..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {skillCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="City, Country"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Time</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="lastActive-desc">Recently Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
          <p className="text-gray-400">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((targetUser) => (
              <div key={targetUser._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                {/* User Header */}
                <div className="flex items-center mb-4">
                  {targetUser.profilePicture ? (
                    <img
                      src={targetUser.profilePicture}
                      alt={targetUser.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-lg">
                        {targetUser.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{targetUser.name}</h3>
                    <p className="text-gray-500 text-sm truncate">
                      {targetUser.location || 'Location not specified'}
                    </p>
                  </div>
                  {targetUser.isOnline && (
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  )}
                </div>

                {/* Bio */}
                {targetUser.bio && (
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {targetUser.bio}
                    </p>
                  </div>
                )}

                {/* Skills Offered */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills Offered:</p>
                  <div className="flex flex-wrap gap-1">
                    {targetUser.skillsOffered?.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {targetUser.skillsOffered?.length > 3 && (
                      <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        +{targetUser.skillsOffered.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills Wanted */}
                {targetUser.skillsWanted?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills Wanted:</p>
                    <div className="flex flex-wrap gap-1">
                      {targetUser.skillsWanted.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {targetUser.skillsWanted.length > 3 && (
                        <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                          +{targetUser.skillsWanted.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Rating and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex mr-1">
                      {getRatingStars(targetUser.rating || 0)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({targetUser.rating ? targetUser.rating.toFixed(1) : 'New'})
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {targetUser.skillCount} skills • {targetUser.availability}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleSendRequest(targetUser)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Send Swap Request
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                  const pageNum = pagination.currentPage - 2 + index;
                  if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-md ${
                        pageNum === pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center mt-4 text-gray-600">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers} users
          </div>
        </>
      )}

      {/* Skill Exchange Modal */}
      {showModal && selectedUser && (
        <SkillExchangeModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}
      </div>
    </div>
  );
};

export default UserCard;
