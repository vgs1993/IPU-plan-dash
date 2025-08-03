import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Product, Platform, Phase, Milestone, MilestoneType } from '../types';
import { mockData } from '../data/mockData';
import { generateCurrentTimeline, shiftTimeline } from '../utils/timeline';
import { AddPlatformModal, AddProductModal } from './AddModals';
import { AddMilestoneModal } from './AddMilestoneModal';
import { EditMilestoneModal } from './EditMilestoneModal';
import { EditPhaseModal } from './EditPhaseModal';
import { SummaryReportModal } from './SummaryReportModal';
import { BulkMilestoneModal } from './BulkMilestoneModal';
import { getMilestoneDisplayName } from '../utils/milestones';
import { LocalStorageService } from '../services/localStorage';

interface TimelinePlannerProps {
  selectedPlatforms: string[];
}

// Each TimelineCell represents exactly 1 week in the timeline grid
const TimelineCell: React.FC<{
  product: Product;
  weekIndex: number; // 0-based index: each increment = 1 week
  timeline: any;
  onAddClick: (productId: string, weekIndex: number) => void;
  onMilestoneClick: (milestone: Milestone) => void;
}> = ({ product, weekIndex, timeline, onAddClick, onMilestoneClick }) => {
  const weekDate = timeline.weeks[weekIndex]?.weekNumber;
  
  // Find milestone assigned to this specific week (1 grid = 1 week)
  const milestone = product.milestones?.find(m => m.weekIndex === weekIndex);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in-progress': return '#ffc107';
      case 'blocked': return '#dc3545';
      case 'not-started': return '#6c757d';
      default: return 'transparent';
    }
  };
  
  return (
    <div 
      className="timeline-cell"
      style={{ 
        backgroundColor: milestone ? getStatusColor(milestone.status) : 'transparent',
        opacity: milestone ? 0.8 : 1
      }}
    >
      {milestone ? (
        <div 
          className="milestone-indicator" 
          title={`${getMilestoneDisplayName(milestone.type)} - ${milestone.status}${milestone.bugLinks?.length ? ` (${milestone.bugLinks.length} bugs)` : ''}`}
          onClick={() => onMilestoneClick(milestone)}
        >
          {getMilestoneDisplayName(milestone.type).substring(0, 8)}
        </div>
      ) : (
        <button 
          className="add-btn"
          onClick={() => onAddClick(product.id, weekIndex)}
          title={`Add milestone for ${weekDate}`}
        >
          +
        </button>
      )}
    </div>
  );
};

export const TimelinePlanner: React.FC<TimelinePlannerProps> = ({ selectedPlatforms: _ }) => {
  // Load initial data from localStorage or use defaults
  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    const saved = LocalStorageService.loadPlatforms();
    return saved.length > 0 ? saved : mockData.platforms;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = LocalStorageService.loadProducts();
    return saved.length > 0 ? saved : mockData.products;
  });

  const [showAddPlatformModal, setShowAddPlatformModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditPhaseModal, setShowEditPhaseModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showEditMilestoneModal, setShowEditMilestoneModal] = useState(false);
  const [showSummaryReportModal, setShowSummaryReportModal] = useState(false);
  const [showBulkMilestoneModal, setShowBulkMilestoneModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState<{product: Product, phaseIndex: number} | null>(null);
  const [milestoneContext, setMilestoneContext] = useState<{productId: string, weekIndex: number} | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  
  // Refs for scroll synchronization
  const timelineDatesRef = useRef<HTMLDivElement>(null);

  // Scroll synchronization effect
  useEffect(() => {
    const timelineDatesElement = timelineDatesRef.current;
    if (!timelineDatesElement) return;

    const handleDatesScroll = () => {
      // Find all timeline-cells-container elements and sync their scroll position
      const timelineCellsContainers = document.querySelectorAll('.timeline-cells-container');
      timelineCellsContainers.forEach((container) => {
        if (container !== timelineDatesElement) {
          (container as HTMLElement).scrollLeft = timelineDatesElement.scrollLeft;
        }
      });
    };

    const handleCellsScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('timeline-cells-container')) {
        // Sync dates container with this cells container
        timelineDatesElement.scrollLeft = target.scrollLeft;
        
        // Sync all other cells containers
        const allCellsContainers = document.querySelectorAll('.timeline-cells-container');
        allCellsContainers.forEach((container) => {
          if (container !== target) {
            (container as HTMLElement).scrollLeft = target.scrollLeft;
          }
        });
      }
    };

    // Add event listeners
    timelineDatesElement.addEventListener('scroll', handleDatesScroll);
    document.addEventListener('scroll', handleCellsScroll, true); // Use capture phase

    return () => {
      timelineDatesElement.removeEventListener('scroll', handleDatesScroll);
      document.removeEventListener('scroll', handleCellsScroll, true);
    };
  }, [products]); // Re-run when products change
  
  // Load timeline state from localStorage
  const [timeline, setTimeline] = useState(() => {
    const { startWeeks, totalWeeks } = LocalStorageService.loadTimelineState();
    return generateCurrentTimeline(startWeeks, totalWeeks);
  });
  
  // Load UI state from localStorage
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(() => {
    const saved = LocalStorageService.loadUIState();
    const defaultExpanded = new Set(mockData.platforms.map(p => p.id));
    return saved.expandedPlatforms.length > 0 
      ? new Set(saved.expandedPlatforms) 
      : defaultExpanded;
  });

  // Auto-save to localStorage when data changes
  useEffect(() => {
    LocalStorageService.savePlatforms(platforms);
  }, [platforms]);

  useEffect(() => {
    LocalStorageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    LocalStorageService.saveUIState({ 
      expandedPlatforms: Array.from(expandedPlatforms) 
    });
  }, [expandedPlatforms]);

  useEffect(() => {
    // Save timeline state when timeline changes
    const timelineState = {
      startWeeks: 2, // You can track this based on your timeline logic
      totalWeeks: timeline.weeks.length
    };
    LocalStorageService.saveTimelineState(timelineState);
  }, [timeline]);
  
  // Navigate timeline left/right
  const navigateTimeline = useCallback((direction: 'left' | 'right') => {
    setTimeline(currentTimeline => shiftTimeline(currentTimeline, direction, 4));
  }, []);

  // Toggle platform expansion
  const togglePlatform = (platformId: string) => {
    setExpandedPlatforms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(platformId)) {
        newSet.delete(platformId);
      } else {
        newSet.add(platformId);
      }
      return newSet;
    });
  };

  // Group products by platform
  const platformsWithProducts = useMemo(() => {
    return platforms.map(platform => ({
      ...platform,
      products: products.filter(product => product.platformId === platform.id)
    }));
  }, [platforms, products]);

  const handleAddClick = (productId: string, weekIndex: number) => {
    setMilestoneContext({ productId, weekIndex });
    setShowAddMilestoneModal(true);
  };

  const handleAddMilestone = (milestone: Omit<Milestone, 'id' | 'createdDate'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: Date.now().toString(),
      createdDate: new Date()
    };

    setProducts(prev => prev.map(product => {
      if (product.id === milestone.productId) {
        return {
          ...product,
          milestones: [...(product.milestones || []), newMilestone]
        };
      }
      return product;
    }));
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setShowEditMilestoneModal(true);
  };

  const handleUpdateMilestone = (updatedMilestone: Milestone) => {
    setProducts(prev => prev.map(product => {
      if (product.id === updatedMilestone.productId) {
        return {
          ...product,
          milestones: (product.milestones || []).map(m => 
            m.id === updatedMilestone.id ? updatedMilestone : m
          )
        };
      }
      return product;
    }));
  };

  const handleBulkMilestone = (selectedProducts: string[], milestoneType: MilestoneType, weekIndex: number) => {
    const week = timeline.weeks[weekIndex];
    if (!week) return;

    const newMilestones: Milestone[] = selectedProducts.map(productId => ({
      id: `${Date.now()}-${productId}-${Math.random()}`,
      name: milestoneType,
      type: milestoneType,
      productId,
      status: 'not-started' as const,
      weekIndex: weekIndex,
      weekDate: week.weekNumber,
      createdDate: new Date()
    }));

    setProducts(prev => prev.map(product => {
      if (selectedProducts.includes(product.id)) {
        return {
          ...product,
          milestones: [...(product.milestones || []), 
            newMilestones.find(m => m.productId === product.id)!]
        };
      }
      return product;
    }));

    setShowBulkMilestoneModal(false);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    setProducts(prev => prev.map(product => ({
      ...product,
      milestones: (product.milestones || []).filter(m => m.id !== milestoneId)
    })));
  };

  // Export/Import handlers
  const handleExportData = () => {
    LocalStorageService.exportData();
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await LocalStorageService.importData(file);
      
      // Reload data from localStorage
      const newPlatforms = LocalStorageService.loadPlatforms();
      const newProducts = LocalStorageService.loadProducts();
      const newUIState = LocalStorageService.loadUIState();
      
      setPlatforms(newPlatforms);
      setProducts(newProducts);
      setExpandedPlatforms(new Set(newUIState.expandedPlatforms));
      
      alert('Data imported successfully!');
      
      // Clear the file input
      event.target.value = '';
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import data');
      event.target.value = '';
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      LocalStorageService.clearAllData();
      setPlatforms([]);
      setProducts([]);
      setExpandedPlatforms(new Set());
      alert('All data has been cleared.');
    }
  };

  // Storage info for display
  const storageInfo = LocalStorageService.getStorageInfo();

  if (platforms.length === 0) {
    return (
      <div className="timeline-planner">
        <div className="timeline-header">
          <div className="action-buttons">
            <button 
              className="add-platform-btn"
              onClick={() => setShowAddPlatformModal(true)}
            >
              Add Platform
            </button>
            <button 
              className="add-product-btn"
              onClick={() => setShowAddProductModal(true)}
            >
              Add Product
            </button>
          </div>
        </div>
        
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-title">No Platforms Created</div>
          <div className="empty-state-description">
            Create platforms to organize your products and start planning timelines.
          </div>
          <div className="empty-state-actions">
            <button 
              className="add-platform-btn primary"
              onClick={() => setShowAddPlatformModal(true)}
            >
              Add Platform
            </button>
          </div>
        </div>
        
        {/* Modals */}
        {showAddPlatformModal && (
          <AddPlatformModal
            isOpen={showAddPlatformModal}
            onClose={() => setShowAddPlatformModal(false)}
            onAdd={(platform) => {
              setPlatforms(prev => [...prev, platform]);
              setShowAddPlatformModal(false);
            }}
          />
        )}
        
        {showAddProductModal && (
          <AddProductModal
            isOpen={showAddProductModal}
            platforms={platforms}
            onClose={() => setShowAddProductModal(false)}
            onAdd={(product) => {
              setProducts(prev => [...prev, product]);
              // Also update the platform's products array
              setPlatforms(prev => prev.map(p => 
                p.id === product.platformId 
                  ? { ...p, products: [...p.products, product.id] }
                  : p
              ));
              setShowAddProductModal(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="timeline-planner">
      <div className="timeline-header">
        <div className="action-buttons">
          <button 
            className="add-platform-btn"
            onClick={() => setShowAddPlatformModal(true)}
          >
            Add Platform
          </button>
          <button 
            className="add-product-btn"
            onClick={() => setShowAddProductModal(true)}
          >
            Add Product
          </button>
          
          <button 
            className="bulk-milestone-btn"
            onClick={() => setShowBulkMilestoneModal(true)}
          >
            📋 Bulk Add Milestone
          </button>
          
          <div className="data-management-buttons">
            <button 
              className="summary-report-btn"
              onClick={() => setShowSummaryReportModal(true)}
              title="Generate comprehensive schedule analysis report"
            >
              📊 Summary Report
            </button>
            
            <button 
              className="export-btn"
              onClick={handleExportData}
              title="Export all data as JSON file"
            >
              📥 Export
            </button>
            
            <label className="import-btn">
              📤 Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
            
            <button 
              className="clear-data-btn"
              onClick={handleClearAllData}
              title="Clear all saved data"
            >
              🗑️ Clear Data
            </button>
            
            <div className="storage-info" title={`Using ${storageInfo.used} bytes of storage`}>
              💾 {storageInfo.percentage}%
              <div className="storage-bar">
                <div 
                  className={`storage-fill ${storageInfo.percentage > 80 ? 'danger' : storageInfo.percentage > 60 ? 'warning' : ''}`}
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="timeline-navigation">
          <button 
            className="nav-btn"
            onClick={() => navigateTimeline('left')}
            title="Previous weeks"
          >
            ← Previous
          </button>
          <span className="timeline-period">
            {timeline.weeks[0]?.startDate.toLocaleDateString()} - {timeline.weeks[timeline.weeks.length - 1]?.endDate.toLocaleDateString()}
          </span>
          <button 
            className="nav-btn"
            onClick={() => navigateTimeline('right')}
            title="Next weeks"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="timeline-grid">
        {/* Simple date headers only */}
        <div className="timeline-headers">
          <div className="product-header-cell">Products</div>
          <div className="timeline-dates-container" ref={timelineDatesRef}>
            {timeline.weeks.map((week, index) => (
              <div key={index} className="date-header">
                {week.weekNumber}
              </div>
            ))}
          </div>
        </div>

        {/* Product rows */}
        <div className="timeline-body">
          {platformsWithProducts.map(platform => (
            <div key={platform.id} className="platform-section">
              {/* Platform header row - no grid cells */}
              <div className="platform-row">
                <div className="platform-info-cell full-width">
                  <button 
                    className="platform-toggle"
                    onClick={() => togglePlatform(platform.id)}
                  >
                    {expandedPlatforms.has(platform.id) ? '▼' : '▶'}
                  </button>
                  <div 
                    className="platform-name"
                    style={{ borderLeft: `4px solid ${platform.color}` }}
                  >
                    {platform.name}
                  </div>
                  <div className="platform-description">
                    {platform.description}
                  </div>
                </div>
              </div>
              
              {/* Products under this platform */}
              {expandedPlatforms.has(platform.id) && platform.products.map((product: Product) => (
                <div key={product.id} className="product-timeline-row">
                  <div className="product-info-cell">
                    <div className="product-name">{product.name}</div>
                    <div className="product-owner">{product.owner}</div>
                  </div>
                  
                  <div className="timeline-cells-container">
                    {timeline.weeks.map((_, weekIndex) => (
                      <TimelineCell
                        key={weekIndex}
                        product={product}
                        weekIndex={weekIndex}
                        timeline={timeline}
                        onAddClick={handleAddClick}
                        onMilestoneClick={handleMilestoneClick}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Modals */}
      {showAddPlatformModal && (
        <AddPlatformModal
          isOpen={showAddPlatformModal}
          onClose={() => setShowAddPlatformModal(false)}
          onAdd={(platform) => {
            setPlatforms(prev => [...prev, platform]);
            setShowAddPlatformModal(false);
          }}
        />
      )}
      
      {showAddProductModal && (
        <AddProductModal
          isOpen={showAddProductModal}
          platforms={platforms}
          onClose={() => setShowAddProductModal(false)}
          onAdd={(product) => {
            setProducts(prev => [...prev, product]);
            // Also update the platform's products array
            setPlatforms(prev => prev.map(p => 
              p.id === product.platformId 
                ? { ...p, products: [...p.products, product.id] }
                : p
            ));
            setShowAddProductModal(false);
          }}
        />
      )}

      {showAddMilestoneModal && milestoneContext && (
        <AddMilestoneModal
          isOpen={showAddMilestoneModal}
          onClose={() => {
            setShowAddMilestoneModal(false);
            setMilestoneContext(null);
          }}
          onAdd={handleAddMilestone}
          productId={milestoneContext.productId}
          weekIndex={milestoneContext.weekIndex}
          weekDate={timeline.weeks[milestoneContext.weekIndex]?.weekNumber || ''}
        />
      )}

      {showEditMilestoneModal && editingMilestone && (
        <EditMilestoneModal
          isOpen={showEditMilestoneModal}
          onClose={() => {
            setShowEditMilestoneModal(false);
            setEditingMilestone(null);
          }}
          onUpdate={handleUpdateMilestone}
          onDelete={handleDeleteMilestone}
          milestone={editingMilestone}
        />
      )}      {showEditPhaseModal && editingPhase && (
        <EditPhaseModal
          isOpen={showEditPhaseModal}
          phase={editingPhase.product.phases[editingPhase.phaseIndex]}
          onClose={() => {
            setShowEditPhaseModal(false);
            setEditingPhase(null);
          }}
          onUpdate={(updatedPhase: Phase) => {
            setProducts(prev => prev.map(p => {
              if (p.id === editingPhase.product.id) {
                const updatedPhases = [...p.phases];
                updatedPhases[editingPhase.phaseIndex] = updatedPhase;
                return { ...p, phases: updatedPhases };
              }
              return p;
            }));
            setShowEditPhaseModal(false);
            setEditingPhase(null);
          }}
        />
      )}

      {showSummaryReportModal && (
        <SummaryReportModal 
          isOpen={showSummaryReportModal}
          onClose={() => setShowSummaryReportModal(false)}
          platforms={platforms}
          products={products}
        />
      )}

      {showBulkMilestoneModal && (
        <BulkMilestoneModal 
          isOpen={showBulkMilestoneModal}
          onClose={() => setShowBulkMilestoneModal(false)}
          onSubmit={handleBulkMilestone}
          products={products}
          timeline={timeline}
        />
      )}
    </div>
  );
};
