// src/App.js - MAIN APP COMPONENT
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import SkillSwapHero from './components/SkillSwapHero';
import UserCard from './components/UserCard';
import EditProfile from './components/EditProfile';
import SwapDashboard from './components/SwapDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<SkillSwapHero />} />
              <Route path="/login" element={<AuthForm mode="login" />} />
              <Route path="/signup" element={<AuthForm mode="signup" />} />
              
              {/* Protected Routes */}
              <Route path="/browse" element={
                <ProtectedRoute>
                  <UserCard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <SwapDashboard />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
