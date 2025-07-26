// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, onBrowseSkills, onMyProfile, onLogout }) => {
  return (
    <>
      <Navbar onBrowseSkills={onBrowseSkills} onMyProfile={onMyProfile} onLogout={onLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </>
  );
};

export default Layout;