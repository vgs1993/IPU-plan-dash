import React, { useState } from 'react';
import { Milestone, BugLink, MilestoneType } from '../types';
import { MILESTONE_DEFINITIONS } from '../utils/milestones';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (milestone: Omit<Milestone, 'id' | 'createdDate'>) => void;
  productId: string;
  weekIndex: number;
  weekDate: string;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  productId,
  weekIndex,
  weekDate
}) => {
  const [formData, setFormData] = useState<{
    type: MilestoneType;
    status: Milestone['status'];
    notes: string;
  }>({
    type: '1-final-bits-received',
    status: 'not-started',
    notes: ''
  });

  const [bugLinks, setBugLinks] = useState<BugLink[]>([]);
  const [newBugLink, setNewBugLink] = useState<{
    bugNumber: string;
    title: string;
    url: string;
    severity: BugLink['severity'];
  }>({
    bugNumber: '',
    title: '',
    url: '',
    severity: 'medium'
  });
  const [showBugForm, setShowBugForm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const selectedMilestone = MILESTONE_DEFINITIONS.find(m => m.type === formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate blocked status requires bug links
    if (formData.status === 'blocked' && bugLinks.length === 0) {
      setValidationError('Bug links are required when status is marked as blocked.');
      return;
    }

    onAdd({
      name: selectedMilestone?.name || formData.type,
      type: formData.type,
      status: formData.status,
      productId,
      weekIndex,
      weekDate,
      bugLinks: bugLinks.length > 0 ? bugLinks : undefined,
      notes: formData.notes || undefined
    });

    // Reset form
    setFormData({ type: '1-final-bits-received', status: 'not-started', notes: '' });
    setBugLinks([]);
    setNewBugLink({ bugNumber: '', title: '', url: '', severity: 'medium' });
    setShowBugForm(false);
    setValidationError('');
    onClose();
  };

  const handleCancel = () => {
    setFormData({ type: '1-final-bits-received', status: 'not-started', notes: '' });
    setBugLinks([]);
    setNewBugLink({ bugNumber: '', title: '', url: '', severity: 'medium' });
    setShowBugForm(false);
    setValidationError('');
    onClose();
  };

  const addBugLink = () => {
    if (!newBugLink.bugNumber.trim() || !newBugLink.title.trim()) {
      return;
    }

    const bugLink: BugLink = {
      id: Date.now().toString(),
      bugNumber: newBugLink.bugNumber,
      title: newBugLink.title,
      url: newBugLink.url || undefined,
      severity: newBugLink.severity
    };

    setBugLinks(prev => [...prev, bugLink]);
    setNewBugLink({ bugNumber: '', title: '', url: '', severity: 'medium' });
    setShowBugForm(false);
  };

  const removeBugLink = (id: string) => {
    setBugLinks(prev => prev.filter(bug => bug.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>New Milestone Create Mode</h3>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Current Week</label>
            <div className="status-badge milestone-week">
              {weekDate}
            </div>
          </div>

          <div className="form-group">
            <label>Milestone Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                type: e.target.value as MilestoneType
              }))}
              required
            >
              {MILESTONE_DEFINITIONS.map(milestone => (
                <option key={milestone.type} value={milestone.type}>
                  {milestone.order} - {milestone.name}
                </option>
              ))}
            </select>
            {selectedMilestone && (
              <small className="form-hint">{selectedMilestone.description}</small>
            )}
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                status: e.target.value as Milestone['status']
              }))}
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Bug Links Section - Always show but only required for blocked status */}
          <div className="form-group">
            <label>
              Bug Links 
              {formData.status === 'blocked' && <span className="required">*</span>}
              <span className="field-note">
                {formData.status === 'blocked' 
                  ? 'Required when status is blocked'
                  : 'Optional: Add related bug links'
                }
              </span>
            </label>
              
              {bugLinks.length > 0 && (
                <div className="bug-links-list">
                  {bugLinks.map(bug => (
                    <div key={bug.id} className="bug-link-item">
                      <div className="bug-info">
                        <span className="bug-number">{bug.bugNumber}</span>
                        <span className="bug-title">{bug.title}</span>
                        <span className={`severity-badge severity-${bug.severity}`}>
                          {bug.severity}
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeBugLink(bug.id)}
                        className="remove-bug-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!showBugForm ? (
                <button 
                  type="button" 
                  onClick={() => setShowBugForm(true)}
                  className="add-bug-btn"
                >
                  + Add Bug Link
                </button>
              ) : (
                <div className="bug-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Bug Number*"
                      value={newBugLink.bugNumber}
                      onChange={(e) => setNewBugLink(prev => ({ 
                        ...prev, 
                        bugNumber: e.target.value 
                      }))}
                      required
                    />
                    <select
                      value={newBugLink.severity}
                      onChange={(e) => setNewBugLink(prev => ({ 
                        ...prev, 
                        severity: e.target.value as BugLink['severity']
                      }))}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Bug Title*"
                    value={newBugLink.title}
                    onChange={(e) => setNewBugLink(prev => ({ 
                      ...prev, 
                      title: e.target.value 
                    }))}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Bug URL (optional)"
                    value={newBugLink.url}
                    onChange={(e) => setNewBugLink(prev => ({ 
                      ...prev, 
                      url: e.target.value 
                    }))}
                  />
                  <div className="bug-form-actions">
                    <button type="button" onClick={addBugLink} className="save-bug-btn">
                      Save Bug
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowBugForm(false)} 
                      className="cancel-bug-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or comments..."
              rows={3}
            />
          </div>

          {validationError && (
            <div className="validation-error">
              {validationError}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
