import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import SkillSwapHero from './components/SkillSwapHero';
import UserCard from './components/UserCard';
import EditProfile from './components/EditProfile';

function App() {
  const { user, loading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is not authenticated, show auth routes
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/signup" element={<AuthForm mode="signup" />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user is authenticated, show protected routes
  return (
    <Routes>
      <Route path="/" element={<SkillSwapHero />} />
      <Route path="/browse" element={<UserCard />} />
      <Route path="/profile" element={<EditProfile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;