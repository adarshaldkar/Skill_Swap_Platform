// src/components/SwapDashboard.jsx - COMPLETE SWAP MANAGEMENT DASHBOARD
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SwapRequestCard from './SwapRequestCard';

const SwapDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReceived: 0,
    totalSent: 0,
    pendingReceived: 0,
    pendingSent: 0,
    acceptedSwaps: 0,
    completedSwaps: 0
  });

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch received requests
      const receivedResponse = await fetch('http://localhost:5000/api/swap-requests/received', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const receivedData = await receivedResponse.json();
      
      // Fetch sent requests
      const sentResponse = await fetch('http://localhost:5000/api/swap-requests/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const sentData = await sentResponse.json();
      
      const received = receivedData.requests || [];
      const sent = sentData.requests || [];
      
      setReceivedRequests(received);
      setSentRequests(sent);
      
      // Calculate stats
      const allRequests = [...received, ...sent];
      setStats({
        totalReceived: received.length,
        totalSent: sent.length,
        pendingReceived: received.filter(req => req.status === 'pending').length,
        pendingSent: sent.filter(req => req.status === 'pending').length,
        acceptedSwaps: allRequests.filter(req => req.status === 'accepted').length,
        completedSwaps: allRequests.filter(req => req.status === 'completed').length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      setLoading(false);
    }
  };

  const handleRequestUpdate = () => {
    fetchSwapRequests(); // Refresh the data
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case 'received':
        return receivedRequests.length;
      case 'sent':
        return sentRequests.length;
      case 'active':
        return [...receivedRequests, ...sentRequests].filter(req => req.status === 'accepted').length;
      case 'completed':
        return [...receivedRequests, ...sentRequests].filter(req => req.status === 'completed').length;
      default:
        return 0;
    }
  };

  const getFilteredRequests = (tab) => {
    const allRequests = [...receivedRequests, ...sentRequests];
    
    switch (tab) {
      case 'received':
        return receivedRequests;
      case 'sent':
        return sentRequests;
      case 'active':
        return allRequests.filter(req => req.status === 'accepted').map(req => ({
          ...req,
          type: receivedRequests.includes(req) ? 'received' : 'sent'
        }));
      case 'completed':
        return allRequests.filter(req => req.status === 'completed').map(req => ({
          ...req,
          type: receivedRequests.includes(req) ? 'received' : 'sent'
        }));
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Skill Swap Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalReceived}</div>
          <div className="text-sm text-gray-600">Received</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalSent}</div>
          <div className="text-sm text-gray-600">Sent</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingReceived}</div>
          <div className="text-sm text-gray-600">Pending (In)</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.pendingSent}</div>
          <div className="text-sm text-gray-600">Pending (Out)</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.acceptedSwaps}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.completedSwaps}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="flex space-x-1 p-1">
          {[
            { key: 'received', label: 'Received Requests', color: 'blue' },
            { key: 'sent', label: 'Sent Requests', color: 'green' },
            { key: 'active', label: 'Active Swaps', color: 'purple' },
            { key: 'completed', label: 'Completed', color: 'indigo' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors text-center ${
                activeTab === tab.key
                  ? `bg-${tab.color}-600 text-white`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {getTabCount(tab.key)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {(() => {
          const requests = getFilteredRequests(activeTab);
          
          if (requests.length === 0) {
            return (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-gray-400 text-6xl mb-4">
                  {activeTab === 'received' && '📥'}
                  {activeTab === 'sent' && '📤'}
                  {activeTab === 'active' && '🤝'}
                  {activeTab === 'completed' && '✅'}
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {activeTab === 'received' && 'No requests received yet'}
                  {activeTab === 'sent' && 'No requests sent yet'}
                  {activeTab === 'active' && 'No active swaps'}
                  {activeTab === 'completed' && 'No completed swaps'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === 'received' && 'When others send you swap requests, they\'ll appear here.'}
                  {activeTab === 'sent' && 'Start by browsing users and sending swap requests.'}
                  {activeTab === 'active' && 'Accept swap requests to start exchanging skills.'}
                  {activeTab === 'completed' && 'Completed swaps will be shown here for your records.'}
                </p>
                {(activeTab === 'received' || activeTab === 'sent') && (
                  <a
                    href="/browse"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Users
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                )}
              </div>
            );
          }

          return (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {activeTab === 'received' && 'Requests You\'ve Received'}
                {activeTab === 'sent' && 'Requests You\'ve Sent'}
                {activeTab === 'active' && 'Your Active Swaps'}
                {activeTab === 'completed' && 'Your Completed Swaps'}
              </h2>
              
              {/* Sort/Filter Options */}
              <div className="flex flex-wrap gap-2 mb-4">
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  <option>Sort by: Newest First</option>
                  <option>Sort by: Oldest First</option>
                  <option>Sort by: Status</option>
                </select>
                
                {(activeTab === 'received' || activeTab === 'sent') && (
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                    <option>Cancelled</option>
                  </select>
                )}
              </div>

              {/* Request Cards */}
              <div className="space-y-4">
                {requests.map((request) => (
                  <SwapRequestCard
                    key={request._id}
                    request={request}
                    type={activeTab === 'received' ? 'received' : 
                          activeTab === 'sent' ? 'sent' : 
                          request.type || (receivedRequests.find(r => r._id === request._id) ? 'received' : 'sent')}
                    onUpdate={handleRequestUpdate}
                    showDetailedStatus={activeTab === 'active' || activeTab === 'completed'}
                  />
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href="/browse"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find New Users
          </a>
          
          <a
            href="/profile"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Update Profile
          </a>
          
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Tips for Successful Skill Swaps</h3>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start">
            <span className="font-medium mr-2">✓</span>
            Be clear about what you can offer and what you want to learn
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">✓</span>
            Respond to requests promptly to show you're engaged
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">✓</span>
            Set clear expectations about time commitment and meeting format
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">✓</span>
            Leave feedback after completing swaps to build your reputation
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SwapDashboard;
