import React from 'react';
import PartnerSidebar from './PartnerSidebar';
import Topbar from './Topbar';

const PartnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <PartnerSidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PartnerLayout;
