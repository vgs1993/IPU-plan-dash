import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { mockData } from '../data/mockData';
import { 
  calculateEstimatedReleaseDate, 
  getOverallProductStatus, 
  getDaysToComplete, 
  getStatusColor,
  getStatusIcon,
  formatDate 
} from '../utils/calculations';

interface PlannerViewProps {
  selectedPlatforms: string[];
  onPlatformToggle: (platformId: string) => void;
}

const PhaseCell: React.FC<{
  product: Product;
  phaseIndex: number;
  onPhaseClick: (productId: string, phaseIndex: number) => void;
}> = ({ product, phaseIndex, onPhaseClick }) => {
  const phase = product.phases[phaseIndex];
  if (!phase) return <div className="phase-cell empty">-</div>;

  const daysRemaining = getDaysToComplete(phase);
  const statusColor = getStatusColor(phase.status);
  const statusIcon = getStatusIcon(phase.status);

  return (
    <div 
      className={`phase-cell ${phase.status}`}
      style={{ borderLeftColor: statusColor }}
      onClick={() => onPhaseClick(product.id, phaseIndex)}
    >
      <div className="phase-status">
        <span className="status-icon">{statusIcon}</span>
        <span className="status-text">{phase.status.replace('-', ' ')}</span>
      </div>
      {phase.status !== 'not-started' && (
        <div className="phase-details">
          <div className="owner">{phase.owner}</div>
          <div className="days-remaining">{daysRemaining}d remaining</div>
          {phase.issues.length > 0 && (
            <div className="issues-count">{phase.issues.length} issues</div>
          )}
        </div>
      )}
    </div>
  );
};

export const PlannerView: React.FC<PlannerViewProps> = ({ 
  selectedPlatforms, 
  onPlatformToggle: _ 
}) => {
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(
    new Set(mockData.platforms.map(p => p.id))
  );
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return mockData.products.filter(product => 
      selectedPlatforms.length === 0 || selectedPlatforms.includes(product.platformId)
    );
  }, [selectedPlatforms]);

  const productsByPlatform = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    filteredProducts.forEach(product => {
      if (!grouped[product.platformId]) {
        grouped[product.platformId] = [];
      }
      grouped[product.platformId].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  const togglePlatformExpansion = (platformId: string) => {
    const newExpanded = new Set(expandedPlatforms);
    if (newExpanded.has(platformId)) {
      newExpanded.delete(platformId);
    } else {
      newExpanded.add(platformId);
    }
    setExpandedPlatforms(newExpanded);
  };

  const handlePhaseClick = (_productId: string, _phaseIndex: number) => {
    // Here you could open a modal or navigate to detailed view
  };

  const phases = [
    'Final Bits Reception',
    'Dev Integration Work', 
    'PST Run',
    'Pre Eval Testing',
    'Payload Readiness',
    'RC Testing Full Pass',
    'WU Live'
  ];

  return (
    <div className="planner-view">
      <div className="planner-header">
        <div className="view-controls">
          <button className="expand-btn">Expand All</button>
          <button className="collapse-btn">Collapse All</button>
          <button className="new-btn">New IPU</button>
        </div>
        
        <div className="status-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#4CAF50' }}></span>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#FF9800' }}></span>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#F44336' }}></span>
            <span>Blocked</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#9E9E9E' }}></span>
            <span>Not Started</span>
          </div>
        </div>
      </div>

      <div className="planner-grid">
        <div className="grid-header">
          <div className="product-column">Products</div>
          {phases.map((phase, index) => (
            <div key={index} className="phase-column">
              <div className="phase-name">{phase}</div>
              <div className="phase-duration">
                {index === 0 || index === 2 || index === 4 || index === 6 ? '1 week' : 
                 index === 1 || index === 3 ? '2 weeks' : '4 weeks'}
              </div>
            </div>
          ))}
          <div className="release-column">Estimated Release</div>
        </div>

        <div className="grid-body">
          {mockData.platforms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">No Platforms or Products</div>
              <div className="empty-state-description">
                Add platforms and products to start planning your development phases.
              </div>
              <button className="add-platform-btn">Add Platform</button>
            </div>
          ) : (
            mockData.platforms.map(platform => {
              const platformProducts = productsByPlatform[platform.id] || [];
              if (platformProducts.length === 0) return null;

              return (
                <div key={platform.id} className="platform-group">
                  <div 
                    className="platform-header"
                    onClick={() => togglePlatformExpansion(platform.id)}
                  >
                    <span className="expand-icon">
                      {expandedPlatforms.has(platform.id) ? '▼' : '▶'}
                    </span>
                    <span 
                      className="platform-name"
                      style={{ color: platform.color }}
                    >
                      {platform.name}
                    </span>
                    <span className="product-count">
                      ({platformProducts.length} products)
                    </span>
                  </div>

                  {expandedPlatforms.has(platform.id) && (
                    <div className="platform-products">
                      {platformProducts.map(product => {
                        const estimatedRelease = calculateEstimatedReleaseDate(product);
                        const overallStatus = getOverallProductStatus(product);
                        
                        return (
                          <div 
                            key={product.id} 
                            className={`product-row ${selectedProduct === product.id ? 'selected' : ''}`}
                            onClick={() => setSelectedProduct(product.id)}
                          >
                            <div className="product-info">
                              <div className="product-name">{product.name}</div>
                              <div className="product-owner">Owner: {product.owner}</div>
                              <div className={`product-status ${overallStatus}`}>
                                {getStatusIcon(overallStatus)} {overallStatus.replace('-', ' ')}
                              </div>
                            </div>

                            {phases.map((_, phaseIndex) => (
                              <PhaseCell
                                key={phaseIndex}
                                product={product}
                                phaseIndex={phaseIndex}
                                onPhaseClick={handlePhaseClick}
                              />
                            ))}

                            <div className="release-info">
                              <div className="release-date">
                                {formatDate(estimatedRelease || undefined)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
