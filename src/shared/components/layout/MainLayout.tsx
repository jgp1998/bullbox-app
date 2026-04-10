import React from 'react';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-(--background) text-(--text) font-sans antialiased overflow-x-hidden">
      <Navbar />
      <main className="px-4 pt-6 pb-20 sm:px-6 lg:px-8 lg:pb-6 max-w-7xl mx-auto space-y-6">
        {children}
      </main>
      <BottomNavbar />
    </div>
  );
};

export default MainLayout;
