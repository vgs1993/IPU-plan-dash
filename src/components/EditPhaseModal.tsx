import React, { useState, useEffect } from 'react';
import { Phase, Issue, PhaseStatus } from '../types';

interface EditPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: Phase | null;
  onUpdate: (updatedPhase: Phase) => void;
}

export const EditPhaseModal: React.FC<EditPhaseModalProps> = ({ 
  isOpen, 
  onClose, 
  phase, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState({
    status: 'not-started' as PhaseStatus,
    startDate: '',
    endDate: '',
    delayReason: '',
    completionNotes: '',
    owner: ''
  });

  const [newBug, setNewBug] = useState({
    title: '',
    bugNumber: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    assignedTo: '',
    impactDays: 0
  });

  const [showAddBug, setShowAddBug] = useState(false);

  useEffect(() => {
    if (phase) {
      setFormData({
        status: phase.status,
        startDate: phase.startDate ? phase.startDate.toISOString().split('T')[0] : '',
        endDate: phase.endDate ? phase.endDate.toISOString().split('T')[0] : '',
        delayReason: phase.delayReason || '',
        completionNotes: phase.completionNotes || '',
        owner: phase.owner
      });
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phase) return;

    const updatedPhase: Phase = {
      ...phase,
      status: formData.status,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      delayReason: formData.delayReason || undefined,
      completionNotes: formData.completionNotes || undefined,
      owner: formData.owner
    };

    // Adjust end date if there are impactful bugs
    if (updatedPhase.endDate && updatedPhase.issues.length > 0) {
      const totalImpactDays = updatedPhase.issues.reduce((total, issue) => {
        return total + (issue.severity === 'critical' ? 7 : 
                      issue.severity === 'high' ? 5 : 
                      issue.severity === 'medium' ? 3 : 1);
      }, 0);
      
      const adjustedEndDate = new Date(updatedPhase.endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + totalImpactDays);
      updatedPhase.endDate = adjustedEndDate;
    }

    onUpdate(updatedPhase);
    onClose();
  };

  const handleAddBug = () => {
    if (!phase || !newBug.title) return;

    const bug: Issue = {
      id: `bug-${Date.now()}`,
      title: newBug.title,
      description: `Bug ${newBug.bugNumber}: ${newBug.title}`,
      severity: newBug.severity,
      createdDate: new Date(),
      assignedTo: newBug.assignedTo,
      status: 'open',
      bugNumber: newBug.bugNumber
    };

    const updatedPhase = {
      ...phase,
      issues: [...phase.issues, bug],
      status: 'blocked' as PhaseStatus
    };

    setFormData({ ...formData, status: 'blocked' });
    onUpdate(updatedPhase);
    setNewBug({ title: '', bugNumber: '', severity: 'medium', assignedTo: '', impactDays: 0 });
    setShowAddBug(false);
  };

  const handleRemoveBug = (bugId: string) => {
    if (!phase) return;

    const updatedPhase = {
      ...phase,
      issues: phase.issues.filter(issue => issue.id !== bugId)
    };

    // If no more bugs, change status from blocked
    if (updatedPhase.issues.length === 0 && phase.status === 'blocked') {
      updatedPhase.status = 'in-progress';
      setFormData({ ...formData, status: 'in-progress' });
    }

    onUpdate(updatedPhase);
  };

  if (!isOpen || !phase) return null;

  const getImpactDays = (severity: string) => {
    switch (severity) {
      case 'critical': return 7;
      case 'high': return 5;
      case 'medium': return 3;
      case 'low': return 1;
      default: return 0;
    }
  };

  const totalImpactDays = phase.issues.reduce((total, issue) => 
    total + getImpactDays(issue.severity), 0
  );

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>Edit Phase: {phase.name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PhaseStatus })}
                required
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="delayed">Delayed</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Assigned team member"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              {totalImpactDays > 0 && (
                <small className="impact-note">
                  +{totalImpactDays} days impact from bugs
                </small>
              )}
            </div>
          </div>

          {formData.status === 'delayed' && (
            <div className="form-group">
              <label>Delay Reason</label>
              <textarea
                value={formData.delayReason}
                onChange={(e) => setFormData({ ...formData, delayReason: e.target.value })}
                placeholder="e.g., MTL UEFI/ME - Delay due to validation with UEFI Core team and packaging"
              />
            </div>
          )}

          {formData.status === 'completed' && (
            <div className="form-group">
              <label>Completion Notes</label>
              <textarea
                value={formData.completionNotes}
                onChange={(e) => setFormData({ ...formData, completionNotes: e.target.value })}
                placeholder="e.g., Int bits received"
              />
            </div>
          )}

          {/* Bugs Section */}
          <div className="bugs-section">
            <div className="section-header">
              <h4>Blocker Bugs ({phase.issues.length})</h4>
              <button 
                type="button" 
                className="add-bug-btn"
                onClick={() => setShowAddBug(!showAddBug)}
              >
                {showAddBug ? 'Cancel' : '+ Add Bug'}
              </button>
            </div>

            {showAddBug && (
              <div className="add-bug-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Bug Title *</label>
                    <input
                      type="text"
                      value={newBug.title}
                      onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
                      placeholder="e.g., MSVC Toolset issues blocking integration"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bug Number</label>
                    <input
                      type="text"
                      value={newBug.bugNumber}
                      onChange={(e) => setNewBug({ ...newBug, bugNumber: e.target.value })}
                      placeholder="e.g., 4924769"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Severity</label>
                    <select
                      value={newBug.severity}
                      onChange={(e) => setNewBug({ ...newBug, severity: e.target.value as any })}
                    >
                      <option value="low">Low (+1 day)</option>
                      <option value="medium">Medium (+3 days)</option>
                      <option value="high">High (+5 days)</option>
                      <option value="critical">Critical (+7 days)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assigned To</label>
                    <input
                      type="text"
                      value={newBug.assignedTo}
                      onChange={(e) => setNewBug({ ...newBug, assignedTo: e.target.value })}
                      placeholder="Team member name"
                    />
                  </div>
                </div>
                <button type="button" className="submit-bug-btn" onClick={handleAddBug}>
                  Add Bug
                </button>
              </div>
            )}

            <div className="bugs-list">
              {phase.issues.map(bug => (
                <div key={bug.id} className="bug-item">
                  <div className="bug-info">
                    <div className="bug-header">
                      <span className="bug-title">{bug.title}</span>
                      <span className={`bug-severity ${bug.severity}`}>
                        {bug.severity}
                      </span>
                    </div>
                    <div className="bug-details">
                      {bug.bugNumber && <span className="bug-number">#{bug.bugNumber}</span>}
                      <span className="bug-assignee">👤 {bug.assignedTo}</span>
                      <span className="bug-impact">+{getImpactDays(bug.severity)}d impact</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="remove-bug-btn"
                    onClick={() => handleRemoveBug(bug.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Update Phase</button>
          </div>
        </form>
      </div>
    </div>
  );
};
