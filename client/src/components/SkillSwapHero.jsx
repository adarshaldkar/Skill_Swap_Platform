// src/components/SkillSwapHero.jsx - HERO/LANDING PAGE
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SkillSwapHero = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFeaturedUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFeaturedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/search/featured?limit=4', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFeaturedUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching featured users:', error);
    } finally {
      setLoading(false);
    }
  };

  const skillCategories = [
    { name: 'Web Development', icon: '💻', color: 'bg-blue-100 text-blue-800' },
    { name: 'Design', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
    { name: 'Photography', icon: '📸', color: 'bg-green-100 text-green-800' },
    { name: 'Writing', icon: '✍️', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Music', icon: '🎵', color: 'bg-pink-100 text-pink-800' },
    { name: 'Languages', icon: '🗣️', color: 'bg-indigo-100 text-indigo-800' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Swap Skills,{' '}
            <span className="text-blue-600">Grow Together</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with talented individuals and exchange skills. Learn something new while teaching what you know best.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Users
              </Link>
              <Link
                to="/profile"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Skill Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular Skill Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {skillCategories.map((category, index) => (
              <div
                key={index}
                className={`${category.color} p-6 rounded-lg text-center hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Users (only for logged-in users) */}
      {user && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Featured Users
            </h2>
            
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : featuredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredUsers.map((featuredUser) => (
                  <div key={featuredUser._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      {featuredUser.profilePicture ? (
                        <img
                          src={featuredUser.profilePicture}
                          alt={featuredUser.name}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold">
                            {featuredUser.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{featuredUser.name}</h3>
                        <p className="text-gray-500 text-sm">{featuredUser.location || 'Location not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Skills offered:</p>
                      <div className="flex flex-wrap gap-1">
                        {featuredUser.skillsOffered?.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {featuredUser.skillsOffered?.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{featuredUser.skillsOffered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {featuredUser.rating ? featuredUser.rating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {featuredUser.skillCount} skills
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>No featured users available at the moment.</p>
              </div>
            )}
            
            {featuredUsers.length > 0 && (
              <div className="text-center mt-8">
                <Link
                  to="/browse"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Users
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                List your skills and what you'd like to learn. Upload a photo and write a brief bio.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Find & Connect</h3>
              <p className="text-gray-600">
                Browse users and send swap requests to people whose skills match your interests.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
              <p className="text-gray-600">
                Meet up, exchange knowledge, and grow your skills while helping others learn too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Skill Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of learners and experts exchanging knowledge every day.
            </p>
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join SkillSwap Today
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default SkillSwapHero;
