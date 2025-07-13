import React, { useState, useEffect } from 'react';
import { Search, Users, BookOpen, Star, ArrowRight, Sparkles } from 'lucide-react';

const SkillSwapHero = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredSkills = [
    'Web Development',
    'Digital Photography', 
    'Graphic Design',
    'Data Analysis',
    'Language Learning',
    'Music Production'
  ];

  const featuredSwappers = [
    {
      name: 'Sarah Chen',
      rating: 5.0,
      canTeach: ['Web Development', 'Digital Photography'],
      lookingFor: 'Graphic Design',
      avatar: 'SC'
    },
    {
      name: 'Alex Rodriguez',
      rating: 4.9,
      canTeach: ['Data Analysis', 'Python'],
      lookingFor: 'UI/UX Design',
      avatar: 'AR'
    },
    {
      name: 'Emma Thompson',
      rating: 5.0,
      canTeach: ['Creative Writing', 'Marketing'],
      lookingFor: 'Web Development',
      avatar: 'ET'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SkillSwap
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-purple-600 transition-colors font-medium" onClick={props.onBrowseSkills}>
            Browse Skills
          </button>
          <button
            className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            onClick={props.onMyProfile}
          >
            My Profile
          </button>
          <button 
            onClick={props.onLogout}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Swap Skills, Learn & Teach for Free!
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Exchange your expertise with others. No money involved - just knowledge sharing and community building.
          </p>

          {/* Search Section */}
          <div className={`max-w-2xl mx-auto mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills (e.g., Graphic Design, Piano, Coding...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium flex items-center space-x-2 group">
                <span>Find Skills</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Popular Skills Tags */}
          <div className={`mb-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-gray-600 mb-4">Popular skills:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {featuredSkills.map((skill, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Skill Swappers */}
        <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Featured Skill Swappers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredSwappers.map((swapper, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {swapper.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{swapper.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{swapper.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Can teach:</p>
                  <div className="flex flex-wrap gap-2">
                    {swapper.canTeach.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Looking to learn:</p>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {swapper.lookingFor}
                  </span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform group-hover:scale-105">
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-20 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">2,500+</h3>
              <p className="text-gray-600">Active Skill Swappers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">500+</h3>
              <p className="text-gray-600">Skills Available</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">10,000+</h3>
              <p className="text-gray-600">Successful Swaps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillSwapHero;