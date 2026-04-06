import React from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-(--background) text-(--text) font-sans antialiased overflow-x-hidden">
      <Navbar />
      <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
