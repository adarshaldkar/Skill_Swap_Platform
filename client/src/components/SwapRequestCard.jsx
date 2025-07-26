// src/components/SwapRequestCard.jsx - COMPLETE SWAP REQUEST CARD
import React, { useState } from 'react';

const SwapRequestCard = ({ request, type, onUpdate, showDetailedStatus = false }) => {
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showActions, setShowActions] = useState(false);

  const actionButtonStyle = "px-4 py-2 text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50";

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      accepted: '✅',
      rejected: '❌',
      completed: '🎉',
      cancelled: '🚫'
    };
    return icons[status] || '📝';
  };

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `http://localhost:5000/api/swap-requests/${request._id}`;
      let method = 'PUT';
      let body = {};

      switch (action) {
        case 'accept':
          url += '/accept';
          if (notes) body.notes = notes;
          break;
        case 'reject':
          url += '/reject';
          if (notes) body.notes = notes;
          break;
        case 'cancel':
          url += '/cancel';
          method = 'DELETE';
          break;
        case 'complete':
          url += '/complete';
          break;
        default:
          return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: method !== 'DELETE' ? JSON.stringify(body) : undefined
      });

      if (response.ok) {
        onUpdate(); // Refresh the parent component
        setShowNotes(false);
        setShowActions(false);
        setNotes('');
        
        // Show success message
        const actionMessages = {
          accept: 'Swap request accepted!',
          reject: 'Swap request rejected.',
          cancel: 'Swap request cancelled.',
          complete: 'Swap marked as completed!'
        };
        
        // You could use a toast notification here instead
        alert(actionMessages[action] || 'Action completed');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const otherUser = type === 'received' ? request.requester : request.recipient;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* User Info */}
          <div className="flex items-start space-x-4 flex-1">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {otherUser.profilePicture ? (
                <img
                  src={otherUser.profilePicture}
                  alt={otherUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {otherUser.name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Request Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-gray-800 truncate">{otherUser.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)} {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    {type === 'received' ? 'They offer' : 'You offer'}
                  </p>
                  <p className="text-sm font-semibold text-blue-800">{request.requesterSkill}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium mb-1">
                    {type === 'received' ? 'They want' : 'You want'}
                  </p>
                  <p className="text-sm font-semibold text-green-800">{request.recipientSkill}</p>
                </div>
              </div>

              {request.message && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-xs text-gray-600 font-medium mb-1">Message:</p>
                  <p className="text-sm text-gray-800">{request.message}</p>
                </div>
              )}

              {request.notes && (
                <div className="bg-purple-50 p-3 rounded-lg mb-3">
                  <p className="text-xs text-purple-600 font-medium mb-1">Notes:</p>
                  <p className="text-sm text-purple-800">{request.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>📅 Sent: {formatDate(request.createdAt)}</span>
                {request.acceptedAt && (
                  <span>✅ Accepted: {formatDate(request.acceptedAt)}</span>
                )}
                {request.completedAt && (
                  <span>🎉 Completed: {formatDate(request.completedAt)}</span>
                )}
                {request.cancelledAt && (
                  <span>🚫 Cancelled: {formatDate(request.cancelledAt)}</span>
                )}
              </div>

              {showDetailedStatus && (
                <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-800">
                      {request.status === 'accepted' && '🤝 Ready to start your skill exchange!'}
                      {request.status === 'completed' && '🎊 Great job completing this swap!'}
                    </span>
                    <div className="flex items-center space-x-2">
                      {otherUser.rating && (
                        <span className="text-yellow-500">⭐ {otherUser.rating.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0 ml-4">
            {!showActions ? (
              <button
                onClick={() => setShowActions(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setShowActions(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Action Panel */}
        {showActions && (
          <div className="border-t border-gray-200 pt-4">
            {/* Notes Input for Accept/Reject */}
            {type === 'received' && request.status === 'pending' && showNotes && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Add a note (optional)
                  </label>
                  <button
                    onClick={() => setShowNotes(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Hide
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional information or instructions..."
                  className="w-full text-sm p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
                <p className="text-xs text-gray-500">
                  This note will be visible to {request.requester.name}.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('accept')}
                disabled={loading}
                className={`${actionButtonStyle} bg-green-600 text-white hover:bg-green-700`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Accept
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={loading}
                className={`${actionButtonStyle} bg-red-600 text-white hover:bg-red-700`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                Reject
              </button>
            </div>
            {!showNotes && (
              <button
                onClick={() => setShowNotes(true)}
                className={`${actionButtonStyle} text-blue-600 hover:bg-blue-50`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add Note
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapRequestCard;
