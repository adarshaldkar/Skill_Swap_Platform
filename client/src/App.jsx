import { useState } from 'react';
import AuthForm from './components/AuthForm';
import SkillSwapHero from './components/SkillSwapHero';
import UserCard from './components/UserCard';
import EditProfile from './components/EditProfile';

function App() {
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'home', 'browse', 'profile'
  const [isAuthenticated, setIsAuthenticated] = useState(false);



  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  // Navigation handlers
  const handleGoHome = () => {
    setCurrentView('home');
  };

  const handleBrowseSkills = () => {
    setCurrentView('browse');
  };

  const handleMyProfile = () => {
    setCurrentView('profile');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('auth');
  };

  // Render current view
  const renderCurrentView = () => {
    if (!isAuthenticated) {
      return <AuthForm onAuthSuccess={handleAuthSuccess} />;
    }

    switch (currentView) {
      case 'home':
        return (
          <SkillSwapHero 
            onBrowseSkills={handleBrowseSkills}
            onMyProfile={handleMyProfile}
            onLogout={handleLogout}
          />
        );
      case 'browse':
        return (
          <UserCard 
            onGoHome={handleGoHome}
            onMyProfile={handleMyProfile}
            onLogout={handleLogout}
          />
        );
      case 'profile':
        return (
          <EditProfile 
            onGoHome={handleGoHome}
            onBrowseSkills={handleBrowseSkills}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <SkillSwapHero 
            onBrowseSkills={handleBrowseSkills}
            onMyProfile={handleMyProfile}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;