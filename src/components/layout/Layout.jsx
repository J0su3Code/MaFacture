import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="layout-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;