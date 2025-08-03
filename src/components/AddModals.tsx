import React, { useState } from 'react';
import { Platform, Product } from '../types';
import { createDefaultPhases } from '../data/mockData';

interface AddPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (platform: Platform) => void;
}

export const AddPlatformModal: React.FC<AddPlatformModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4CAF50'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlatform: Platform = {
      id: `platform-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      color: formData.color,
      products: [] // Initialize with empty products array
    };
    onAdd(newPlatform);
    setFormData({ name: '', description: '', color: '#4CAF50' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Platform</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Platform Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., UEFI/ME Platform"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the platform"
            />
          </div>
          <div className="form-group">
            <label>Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Add Platform</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  platforms: Platform[];
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd, platforms }) => {
  const [formData, setFormData] = useState({
    name: '',
    platformId: '',
    owner: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productId = `product-${Date.now()}`;
    
    // Create default phases for the product
    const phases = createDefaultPhases(productId);

    const newProduct: Product = {
      id: productId,
      name: formData.name,
      platformId: formData.platformId,
      phases,
      overallStatus: 'not-started',
      owner: formData.owner,
      description: formData.description
    };
    
    onAdd(newProduct);
    setFormData({ name: '', platformId: '', owner: '', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Avanti"
            />
          </div>
          <div className="form-group">
            <label>Platform *</label>
            <select
              value={formData.platformId}
              onChange={(e) => setFormData({ ...formData, platformId: e.target.value })}
              required
            >
              <option value="">Select Platform</option>
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Owner *</label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              required
              placeholder="e.g., John Smith"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the product"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};
