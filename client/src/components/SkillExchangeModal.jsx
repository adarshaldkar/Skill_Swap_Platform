import React, { useState } from 'react';
import { X, ChevronDown, Star } from 'lucide-react';

const SkillExchangeModal = ({ isOpen, onClose, selectedUser }) => {
  const [skillToLearn, setSkillToLearn] = useState('');
  const [skillToTeach, setSkillToTeach] = useState('');
  const [message, setMessage] = useState('');
  const [availability, setAvailability] = useState('');
  const [duration, setDuration] = useState('');
  const [showSkillToLearnDropdown, setShowSkillToLearnDropdown] = useState(false);
  const [showSkillToTeachDropdown, setShowSkillToTeachDropdown] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  const skillCategories = [
    'Design',
    'Development',
    'Music',
    'Language',
    'Business',
    'Lifestyle',
    'Photography',
    'Education'
  ];

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Evenings',
    'Mornings',
    'Flexible'
  ];

  const durationOptions = [
    '30 minutes',
    '1 hour',
    '1.5 hours',
    '2 hours',
    '2+ hours'
  ];

  const handleSendRequest = () => {
    console.log('Request sent:', {
      recipientUser: selectedUser,
      skillToLearn,
      skillToTeach,
      message,
      availability,
      duration
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSkillToLearn('');
      setSkillToTeach('');
      setMessage('');
      setAvailability('');
      setDuration('');
      setShowSkillToLearnDropdown(false);
      setShowSkillToTeachDropdown(false);
      setShowAvailabilityDropdown(false);
      setShowDurationDropdown(false);
    }
  }, [isOpen]);
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create Skill Exchange Request</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Skill You Want to Learn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You Want to Learn
            </label>
            <div className="relative">
              <button
                onClick={() => setShowSkillToLearnDropdown(!showSkillToLearnDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <span className={skillToLearn ? 'text-gray-900' : 'text-gray-500'}>
                  {skillToLearn || 'Select a skill you want to learn'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showSkillToLearnDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {skillCategories.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSkillToLearn(skill);
                        setShowSkillToLearnDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill You Can Teach */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You Can Teach
            </label>
            <div className="relative">
              <button
                onClick={() => setShowSkillToTeachDropdown(!showSkillToTeachDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <span className={skillToTeach ? 'text-gray-900' : 'text-gray-500'}>
                  {skillToTeach || 'Select a skill you can teach'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showSkillToTeachDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {skillCategories.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSkillToTeach(skill);
                        setShowSkillToTeachDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Your Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you're interested in this skill exchange."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-20"
            />
          </div>

          {/* Availability and Session Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <span className={availability ? 'text-gray-900' : 'text-gray-500'}>
                    {availability || 'Select availability'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showAvailabilityDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {availabilityOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setAvailability(option);
                          setShowAvailabilityDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <span className={duration ? 'text-gray-900' : 'text-gray-500'}>
                    {duration || 'Select duration'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showDurationDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {durationOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setDuration(option);
                          setShowDurationDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Request Recipient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Recipient
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                {selectedUser?.avatar || 'U'}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{selectedUser?.name || 'Unknown User'}</div>
                <div className="text-sm text-gray-500">{selectedUser?.location || 'Location not specified'}</div>
                <div className="flex items-center mt-1">
                  {renderStars(selectedUser?.rating || 0)}
                  <span className="text-sm text-gray-500 ml-1">({selectedUser?.rating || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendRequest}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillExchangeModal;