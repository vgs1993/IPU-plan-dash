import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">IPU Planner</span>
        </div>
        <div className="build-info">
          <div>F: 20250731.1</div>
          <div>B: 20250729.2</div>
        </div>
      </div>
      
      <div className="header-center">
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="header-right">
        <button className="report-bug-btn">🐛 Report a bug</button>
        <div className="user-menu">
          <span className="notification-icon">🔔</span>
          <span className="user-avatar">👤</span>
        </div>
      </div>
    </div>
  );
};
