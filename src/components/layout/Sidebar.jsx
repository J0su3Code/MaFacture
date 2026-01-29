import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: 'home', label: t('dashboard') },
    { path: '/invoices', icon: 'fileText', label: t('invoices') },
    { path: '/invoices/new', icon: 'plus', label: t('newInvoice') },
    { path: '/clients', icon: 'users', label: t('clients') },
    { path: '/settings', icon: 'settings', label: t('settings') }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Icons.fileText width={32} height={32} />
            <span>MaFacture</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <Icons.x width={24} height={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const IconComponent = Icons[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `nav-item ${isActive ? 'is-active' : ''}`
                }
                onClick={() => handleNavClick(item.path)}
                end={item.path === '/dashboard'}
              >
                <IconComponent width={20} height={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <p>MaFacture v1.0</p>
            <p className="text-muted">© 2025</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;