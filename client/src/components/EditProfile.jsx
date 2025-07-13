import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { User, MapPin, Mail, Phone, Edit3, X, Star } from 'lucide-react';

const skillCategories = [
  { value: 'Development', label: 'Development' },
  { value: 'Design', label: 'Design' },
  { value: 'Music', label: 'Music' },
  { value: 'Language', label: 'Language' },
  { value: 'Business', label: 'Business' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Education', label: 'Education' },
];

const EditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [swapRequests, setSwapRequests] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professionalTitle: '',
    skillsToTeach: [],
    skillsToLearn: []
  });

  const [newSkillTeach, setNewSkillTeach] = useState('');
  const [newSkillLearn, setNewSkillLearn] = useState('');
  const [selectedTeachCategory, setSelectedTeachCategory] = useState('');
  const [selectedLearnCategory, setSelectedLearnCategory] = useState('');

  // Fetch user data and swap requests on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/users/me');
        setProfile(res.data);
        setEditForm({
          fullName: res.data.fullName || res.data.name || 'Unknown',
          email: res.data.email,
          phone: res.data.phone || '',
          location: res.data.location || '',
          professionalTitle: res.data.professionalTitle || '',
          skillsToTeach: res.data.skillsToTeach || [],
          skillsToLearn: res.data.skillsToLearn || []
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    const fetchSwapRequests = async () => {
      try {
        const res = await axios.get('/swaps/requests');
        setSwapRequests(res.data);
      } catch (err) {
        console.error("Failed to load swap requests", err);
      }
    };

    fetchProfile();
    fetchSwapRequests();
  }, []);

  // Get incoming and outgoing requests
  const getIncomingRequests = () =>
    swapRequests.filter((r) => r.toUserId?._id === profile?._id);

  const getOutgoingRequests = () =>
    swapRequests.filter((r) => r.fromUserId?._id === profile?._id);

  // Open modal with current data
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  // Save changes to backend
  const handleSaveChanges = async () => {
    try {
      const res = await axios.put('/users/me', editForm);
      setProfile(res.data);
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to save changes", err);
    }
  };

  // Cancel edit modal
  const handleCancel = () => {
    setEditForm({ ...profile });
    setShowEditModal(false);
  };

  // Add new skill to teach
  const addSkillToTeach = () => {
    if (newSkillTeach.trim() && selectedTeachCategory) {
      setEditForm({
        ...editForm,
        skillsToTeach: [
          ...editForm.skillsToTeach,
          { name: newSkillTeach, category: selectedTeachCategory }
        ]
      });
      setNewSkillTeach('');
      setSelectedTeachCategory('');
    }
  };

  // Remove a skill from teach list
  const removeSkillToTeach = (index) => {
    const updatedSkills = [...editForm.skillsToTeach];
    updatedSkills.splice(index, 1);
    setEditForm({
      ...editForm,
      skillsToTeach: updatedSkills
    });
  };

  // Add new skill to learn
  const addSkillToLearn = () => {
    if (newSkillLearn.trim() && selectedLearnCategory) {
      setEditForm({
        ...editForm,
        skillsToLearn: [
          ...editForm.skillsToLearn,
          { name: newSkillLearn, category: selectedLearnCategory }
        ]
      });
      setNewSkillLearn('');
      setSelectedLearnCategory('');
    }
  };

  // Remove a skill from learn list
  const removeSkillToLearn = (index) => {
    const updatedSkills = [...editForm.skillsToLearn];
    updatedSkills.splice(index, 1);
    setEditForm({
      ...editForm,
      skillsToLearn: updatedSkills
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 flex items-center justify-center rounded-full text-blue-600 font-semibold mx-auto mb-2">
                  {profile?.fullName?.substring(0, 2).toUpperCase() || 'TU'}
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Change Photo</button>
              </div>

              {/* Full Name */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone || 'Not set'}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Location */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location || 'Not specified'}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Professional Title */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={editForm.professionalTitle || ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditProfile}
                className="mt-6 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Skills I Can Teach */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Skills I Can Teach</h3>
              <div className="space-y-2">
                {editForm.skillsToTeach.length === 0 ? (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                ) : (
                  editForm.skillsToTeach.map((skill, index) => (
                    <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm flex justify-between items-center">
                      <span>{skill.name} ({skill.category})</span>
                      <button
                        onClick={() => removeSkillToTeach(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Skills I Want to Learn */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Skills I Want to Learn</h3>
              <div className="space-y-2">
                {editForm.skillsToLearn.length === 0 ? (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                ) : (
                  editForm.skillsToLearn.map((skill, index) => (
                    <div key={index} className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm flex justify-between items-center">
                      <span>{skill.name} ({skill.category})</span>
                      <button
                        onClick={() => removeSkillToLearn(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Swap Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Swap Requests</h3>

              {/* Incoming Requests */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Incoming Requests</h4>
                {getIncomingRequests().length === 0 ? (
                  <p className="text-gray-500 text-sm">No incoming requests</p>
                ) : (
                  getIncomingRequests().map((request) => (
                    <div key={request._id} className="bg-gray-50 p-4 rounded-lg mb-3">
                      <p><strong>{request.fromUserId.fullName || request.fromUserId.name}</strong> wants to learn:</p>
                      <p>Offer: <strong>{request.offeredSkill}</strong> for <strong>{request.wantedSkill}</strong></p>
                      <div className="mt-2 flex space-x-2">
                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                          Accept
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Outgoing Requests */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Outgoing Requests</h4>
                {getOutgoingRequests().length === 0 ? (
                  <p className="text-gray-500 text-sm">No outgoing requests</p>
                ) : (
                  getOutgoingRequests().map((request) => (
                    <div key={request._id} className="bg-gray-50 p-4 rounded-lg mb-3">
                      <p>Sent to: <strong>{request.toUserId.fullName || request.toUserId.name}</strong></p>
                      <p>Offer: <strong>{request.offeredSkill}</strong> for <strong>{request.wantedSkill}</strong></p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="e.g., +1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="e.g., New York, USA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Professional Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={editForm.professionalTitle}
                  onChange={(e) => setEditForm({ ...editForm, professionalTitle: e.target.value })}
                  placeholder="e.g. Web Developer, Photographer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Skills I Can Teach */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Skills I Can Teach</h4>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSkillTeach}
                    onChange={(e) => setNewSkillTeach(e.target.value)}
                    placeholder="Add a skill you can teach"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={selectedTeachCategory}
                    onChange={(e) => setSelectedTeachCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {skillCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addSkillToTeach}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {editForm.skillsToTeach.map((skill, index) => (
                    <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm flex justify-between items-center">
                      <span>{skill.name} ({skill.category})</span>
                      <button
                        onClick={() => removeSkillToTeach(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills I Want to Learn */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Skills I Want to Learn</h4>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSkillLearn}
                    onChange={(e) => setNewSkillLearn(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={selectedLearnCategory}
                    onChange={(e) => setSelectedLearnCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {skillCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addSkillToTeach}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {editForm.skillsToLearn.map((skill, index) => (
                    <div key={index} className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm flex justify-between items-center">
                      <span>{skill.name} ({skill.category})</span>
                      <button
                        onClick={() => {
                          const updated = [...editForm.skillsToLearn];
                          updated.splice(index, 1);
                          setEditForm({ ...editForm, skillsToLearn: updated });
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EditProfile;