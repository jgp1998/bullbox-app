import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] font-sans antialiased overflow-x-hidden">
      <Header />
      <main className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
