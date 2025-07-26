// src/components/SkillExchangeModal.jsx - SWAP REQUEST MODAL
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const SkillExchangeModal = ({ user: targetUser, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    requesterSkill: '',
    recipientSkill: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.requesterSkill || !formData.recipientSkill) {
      setError('Please select skills for both parties');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/swap-requests/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: targetUser._id,
          requesterSkill: formData.requesterSkill,
          recipientSkill: formData.recipientSkill,
          message: formData.message
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        alert('Swap request sent successfully!');
      } else {
        setError(data.message || 'Failed to send swap request');
      }
    } catch (error) {
      console.error('Error sending swap request:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Send Swap Request
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Target User Info */}
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            {targetUser.profilePicture ? (
              <img
                src={targetUser.profilePicture}
                alt={targetUser.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-semibold">
                  {targetUser.name?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{targetUser.name}</h3>
              <p className="text-gray-600 text-sm">{targetUser.location || 'Location not specified'}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Your Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Skill to Offer
              </label>
              <select
                value={formData.requesterSkill}
                onChange={(e) => setFormData(prev => ({ ...prev, requesterSkill: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a skill you can teach</option>
                {user?.skillsOffered?.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Their Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill You Want to Learn
              </label>
              <select
                value={formData.recipientSkill}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientSkill: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a skill you want to learn</option>
                {targetUser.skillsOffered?.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Introduce yourself and explain what you're hoping to achieve through this skill swap..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SkillExchangeModal;
