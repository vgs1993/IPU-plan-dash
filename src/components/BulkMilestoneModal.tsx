import React, { useState } from 'react';
import { Product, MilestoneType, WeekInfo } from '../types';
import { getMilestoneDisplayName } from '../utils/milestones';

interface BulkMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedProducts: string[], milestoneType: MilestoneType, weekIndex: number) => void;
  products: Product[];
  timeline: { weeks: WeekInfo[] };
}

export const BulkMilestoneModal: React.FC<BulkMilestoneModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  products,
  timeline
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedMilestoneType, setSelectedMilestoneType] = useState<MilestoneType>('1-final-bits-received');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);

  const milestoneTypes: MilestoneType[] = [
    '0-uefi-pre-eval',
    '1-final-bits-received',
    '2-dev-integration-work',
    '3-inte-pst',
    '4-dve-pre-eval',
    '5-payload-readiness',
    '6-full-rc-test-pass',
    '7-wu-live'
  ];

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      // Form validation prevents this, but keep as safety check
      return;
    }
    onSubmit(selectedProducts, selectedMilestoneType, selectedWeekIndex);
    onClose();
    // Reset form
    setSelectedProducts([]);
    setSelectedMilestoneType('1-final-bits-received');
    setSelectedWeekIndex(0);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal bulk-milestone-modal">
        <div className="modal-header">
          <h3>Bulk Add Milestone</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          {/* Milestone Type Selection */}
          <div className="form-group">
            <label htmlFor="milestoneType">Milestone Type:</label>
            <select
              id="milestoneType"
              value={selectedMilestoneType}
              onChange={(e) => setSelectedMilestoneType(e.target.value as MilestoneType)}
              required
            >
              {milestoneTypes.map(type => (
                <option key={type} value={type}>
                  {getMilestoneDisplayName(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Week Selection */}
          <div className="form-group">
            <label htmlFor="weekIndex">Target Week:</label>
            <select
              id="weekIndex"
              value={selectedWeekIndex}
              onChange={(e) => setSelectedWeekIndex(parseInt(e.target.value))}
              required
            >
              {timeline.weeks.map((week, index) => (
                <option key={index} value={index}>
                  Week {index + 1} - {week.weekNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Product Selection */}
          <div className="form-group">
            <div className="products-selection-header">
              <label>Select Products:</label>
              <button
                type="button"
                className="select-all-btn"
                onClick={handleSelectAll}
              >
                {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-checkbox-item">
                  <input
                    type="checkbox"
                    id={`product-${product.id}`}
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductToggle(product.id)}
                  />
                  <label htmlFor={`product-${product.id}`} className="product-label">
                    <span className="product-name">{product.name}</span>
                    <span className="product-owner">({product.owner})</span>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="selection-summary">
              {selectedProducts.length} of {products.length} products selected
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={selectedProducts.length === 0}
            >
              Add Milestone to {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
