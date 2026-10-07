import React from 'react';
import UserSidebar from './UserSidebar';

export default function UserLayout({ children }) {
  return (
    <div className="min-h-[80vh] bg-[#F7F5F0] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <UserSidebar />
          <main className="flex-1 min-w-0 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

