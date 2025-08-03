import React from 'react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

interface BlockerBug {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  product: string;
  assignee: string;
  daysOpen: number;
}

const menuItems = [
  { id: 'ipu-planning', label: 'IPU Planning', icon: '📋' }
];

// Mock blocker bugs data - start with empty list
const blockerBugs: BlockerBug[] = [];

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onItemClick(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
      
      <div className="blocker-bugs-section">
        <div className="section-header">
          <span className="section-icon">🚨</span>
          <span className="section-title">Blocker Bugs</span>
          <span className="bug-count">{blockerBugs.length}</span>
        </div>
        
        <div className="bugs-list">
          {blockerBugs.length === 0 ? (
            <div className="no-bugs-message">
              <span className="no-bugs-icon">✅</span>
              <span className="no-bugs-text">No blocker bugs</span>
            </div>
          ) : (
            blockerBugs.map((bug) => (
              <div key={bug.id} className="bug-item">
                <div className="bug-header">
                  <span className="bug-id">{bug.id}</span>
                  <span 
                    className="bug-severity"
                    style={{ color: getSeverityColor(bug.severity) }}
                  >
                    ●
                  </span>
                </div>
                <div className="bug-title">{bug.title}</div>
                <div className="bug-details">
                  <div className="bug-product">{bug.product}</div>
                  <div className="bug-assignee">👤 {bug.assignee}</div>
                  <div className="bug-days">{bug.daysOpen}d open</div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="bugs-footer">
          <button className="view-all-bugs">View All Bugs</button>
        </div>
      </div>
    </div>
  );
};
