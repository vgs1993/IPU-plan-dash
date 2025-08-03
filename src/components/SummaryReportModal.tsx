import React, { useState } from 'react';
import { Platform, Product } from '../types';
import { generateScheduleReport, ScheduleReport, PlatformAnalysis, ProductAnalysis } from '../utils/reportAnalysis';

interface SummaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: Platform[];
  products: Product[];
}

export const SummaryReportModal: React.FC<SummaryReportModalProps> = ({
  isOpen,
  onClose,
  platforms,
  products
}) => {
  const [report, setReport] = useState<ScheduleReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const scheduleReport = generateScheduleReport(platforms, products);
      setReport(scheduleReport);
      setIsGenerating(false);
    }, 500); // Add slight delay for UX
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return '✅';
      case 'issues': case 'at-risk': return '⚠️';
      case 'blocked': case 'critical': return '🚫';
      case 'delayed': return '⏰';
      default: return '❓';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal extra-large">
        <div className="modal-header">
          <h3>📊 Schedule Summary Report</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {!report ? (
            <div className="report-generator">
              <div className="report-intro">
                <p>Generate a comprehensive analysis of your current schedule including:</p>
                <ul>
                  <li>Platform and product status overview</li>
                  <li>Blocked milestones with bug details</li>
                  <li>Estimated WU Live dates (calculated from Final Bits Received completion)</li>
                  <li>Critical issues and recommendations</li>
                </ul>
                <div className="calculation-info">
                  <strong>Note:</strong> WU Live dates are calculated using hard-coded milestone durations starting from when "Final Bits Received" milestone is completed.
                </div>
              </div>
              
              <div className="report-actions">
                <button 
                  onClick={generateReport} 
                  disabled={isGenerating}
                  className="generate-report-btn"
                >
                  {isGenerating ? '🔄 Analyzing...' : '📊 Generate Report'}
                </button>
              </div>
            </div>
          ) : (
            <div className="report-content">
              {/* Overall Summary */}
              <div className="report-section">
                <div className="section-header">
                  <h4>
                    {getStatusIcon(report.overallStatus)} Overall Status: {report.overallStatus.toUpperCase()}
                  </h4>
                </div>
                <div className="overall-summary">
                  <p className="summary-text">{report.summary}</p>
                  <div className="status-metrics">
                    <div className="metric">
                      <span className="metric-value">{report.totalProducts}</span>
                      <span className="metric-label">Total Products</span>
                    </div>
                    <div className="metric success">
                      <span className="metric-value">{report.onTrackProducts}</span>
                      <span className="metric-label">On Track</span>
                    </div>
                    <div className="metric warning">
                      <span className="metric-value">{report.blockedProducts}</span>
                      <span className="metric-label">Blocked</span>
                    </div>
                    <div className="metric danger">
                      <span className="metric-value">{report.delayedProducts}</span>
                      <span className="metric-label">Delayed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Issues */}
              {report.criticalIssues.length > 0 && (
                <div className="report-section critical">
                  <div className="section-header">
                    <h4>🚨 Critical Issues Requiring Immediate Attention</h4>
                  </div>
                  <div className="critical-issues">
                    {report.criticalIssues.map((issue, index) => (
                      <div key={index} className="critical-issue">
                        <span className="issue-icon">⚠️</span>
                        <span className="issue-text">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Analysis */}
              <div className="report-section">
                <div className="section-header">
                  <h4>🏢 Platform Analysis</h4>
                </div>
                <div className="platforms-analysis">
                  {report.platforms.map((platform) => (
                    <PlatformReport key={platform.platformId} platform={platform} />
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {report.recommendations.length > 0 && (
                <div className="report-section">
                  <div className="section-header">
                    <h4>💡 Recommendations</h4>
                  </div>
                  <div className="recommendations">
                    {report.recommendations.map((rec, index) => (
                      <div key={index} className="recommendation">
                        <span className="rec-icon">💡</span>
                        <span className="rec-text">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          {report && (
            <button 
              onClick={() => setReport(null)} 
              className="regenerate-btn"
            >
              🔄 Generate New Report
            </button>
          )}
          <button onClick={onClose} className="close-modal-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PlatformReport: React.FC<{ platform: PlatformAnalysis }> = ({ platform }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return '#28a745';
      case 'issues': case 'at-risk': return '#ffc107';
      case 'blocked': case 'critical': return '#dc3545';
      case 'delayed': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return '✅';
      case 'issues': case 'at-risk': return '⚠️';
      case 'blocked': case 'critical': return '🚫';
      case 'delayed': return '⏰';
      default: return '❓';
    }
  };

  return (
    <div className="platform-report">
      <div 
        className="platform-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="platform-status">
          <span className="status-icon">{getStatusIcon(platform.status)}</span>
          <span className="platform-name">{platform.platformName}</span>
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(platform.status) }}
          >
            {platform.status.toUpperCase()}
          </span>
        </div>
        <div className="platform-summary">
          <span className="summary-text">{platform.summary}</span>
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="platform-details">
          <div className="platform-metrics">
            <div className="metric">
              <span className="metric-value">{platform.totalProducts}</span>
              <span className="metric-label">Products</span>
            </div>
            <div className="metric success">
              <span className="metric-value">{platform.onTrackProducts}</span>
              <span className="metric-label">On Track</span>
            </div>
            <div className="metric warning">
              <span className="metric-value">{platform.blockedProducts}</span>
              <span className="metric-label">Blocked</span>
            </div>
            <div className="metric danger">
              <span className="metric-value">{platform.delayedProducts}</span>
              <span className="metric-label">Delayed</span>
            </div>
          </div>

          <div className="products-details">
            {platform.productsAnalysis.map((product) => (
              <ProductReport key={product.productId} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductReport: React.FC<{ product: ProductAnalysis }> = ({ product }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return '#28a745';
      case 'issues': case 'at-risk': return '#ffc107';
      case 'blocked': case 'critical': return '#dc3545';
      case 'delayed': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return '✅';
      case 'issues': case 'at-risk': return '⚠️';
      case 'blocked': case 'critical': return '🚫';
      case 'delayed': return '⏰';
      default: return '❓';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="product-report">
      <div className="product-header">
        <div className="product-info">
          <span className="status-icon">{getStatusIcon(product.status)}</span>
          <span className="product-name">{product.productName}</span>
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(product.status) }}
          >
            {product.status.toUpperCase()}
          </span>
        </div>
        
        {product.estimatedWULiveDate && (
          <div className="timeline-info">
            <span className="timeline-label">Est. WU Live:</span>
            <span className="timeline-date">{formatDate(product.estimatedWULiveDate)}</span>
            {product.deviation && (
              <span className={`deviation ${product.deviation > 0 ? 'late' : 'early'}`}>
                ({product.deviation > 0 ? '+' : ''}{product.deviation} days)
              </span>
            )}
            <span className="calculation-note">
              (from Final Bits Received completion)
            </span>
          </div>
        )}
      </div>

      {product.blockedMilestones.length > 0 && (
        <div className="blocked-milestones">
          <h6>🚫 Blocked Milestones:</h6>
          {product.blockedMilestones.map((blocked, index) => (
            <div key={index} className="blocked-milestone">
              <div className="milestone-name">{blocked.milestone.name}</div>
              {blocked.blockingBugs.length > 0 && (
                <div className="blocking-bugs">
                  <span className="bugs-label">Blocking bugs:</span>
                  {blocked.blockingBugs.map((bug, bugIndex) => (
                    <div key={bugIndex} className="bug-link">
                      {bug}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Milestone Duration Deviations */}
      {product.milestoneDeviations.length > 0 && (
        <div className="milestone-deviations">
          <h6>⏰ Milestone Duration Deviations:</h6>
          {product.milestoneDeviations.map((deviation, index) => (
            <div key={index} className="deviation-item">
              <div className="deviation-details">
                <span className="milestone-name">{deviation.milestone}</span>
                <span className="duration-info">
                  Took {deviation.actualDuration}w (expected {deviation.expectedDuration}w)
                </span>
                <span className="delay-days warning">
                  +{deviation.delayDays} days delay
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WU Live Date Deviation */}
      {product.wuLiveDeviation && product.wuLiveDeviation.deviationDays !== 0 && (
        <div className="wu-live-deviation">
          <h6>📅 WU Live Date Deviation:</h6>
          <div className="deviation-comparison">
            <div className="date-comparison">
              <div className="calculated-date">
                <span className="label">Calculated:</span>
                <span className="date">
                  {product.wuLiveDeviation.calculatedDate ? formatDate(product.wuLiveDeviation.calculatedDate) : 'N/A'}
                </span>
              </div>
              <div className="dashboard-date">
                <span className="label">Dashboard:</span>
                <span className="date">
                  {product.wuLiveDeviation.dashboardDate ? formatDate(product.wuLiveDeviation.dashboardDate) : 'N/A'}
                </span>
              </div>
            </div>
            <div className="deviation-summary">
              <span className={`deviation-value ${product.wuLiveDeviation.deviationDays > 0 ? 'late' : 'early'}`}>
                {product.wuLiveDeviation.deviationDays > 0 ? '+' : ''}{product.wuLiveDeviation.deviationDays} days
              </span>
              <span className="deviation-reason">{product.wuLiveDeviation.reason}</span>
            </div>
          </div>
        </div>
      )}

      {product.issues.length > 0 && (
        <div className="product-issues">
          {product.issues.map((issue, index) => (
            <div key={index} className="product-issue">
              <span className="issue-icon">⚠️</span>
              <span className="issue-text">{issue}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
