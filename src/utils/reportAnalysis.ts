import { Platform, Product, Milestone, MilestoneType } from '../types';
import { getMilestoneDisplayName } from './milestones';

/**
 * Schedule Report Analysis Utilities
 * 
 * Key Calculation Logic:
 * - WU Live date estimation starts from when "Final Bits Received" milestone is completed
 * - If Final Bits Received is not completed, estimation includes its duration
 * - Hard-coded milestone durations are used for consistent timeline calculations
 * - Blocked milestones are flagged only if subsequent milestones haven't started
 */

// Hard-coded milestone durations (in weeks)
export const MILESTONE_DURATIONS: Record<MilestoneType, number> = {
  '0-uefi-pre-eval': 1,
  '1-final-bits-received': 1,
  '2-dev-integration-work': 2,
  '3-inte-pst': 1,
  '4-dve-pre-eval': 2,
  '5-payload-readiness': 1,
  '6-full-rc-test-pass': 4,
  '7-wu-live': 1
};

// Milestone order for dependency calculation
export const MILESTONE_ORDER: MilestoneType[] = [
  '0-uefi-pre-eval',
  '1-final-bits-received',
  '2-dev-integration-work',
  '3-inte-pst',
  '4-dve-pre-eval',
  '5-payload-readiness',
  '6-full-rc-test-pass',
  '7-wu-live'
];

export interface ProductAnalysis {
  productId: string;
  productName: string;
  status: 'on-track' | 'blocked' | 'delayed';
  currentMilestone?: MilestoneType;
  blockedMilestones: {
    milestone: Milestone;
    blockingBugs: string[];
  }[];
  estimatedWULiveDate?: Date;
  actualWULiveDate?: Date;
  deviation?: number; // days
  milestoneDeviations: {
    milestone: MilestoneType;
    expectedDuration: number;
    actualDuration: number;
    delayDays: number;
  }[];
  wuLiveDeviation?: {
    dashboardDate?: Date;
    calculatedDate?: Date;
    deviationDays: number;
    reason: string;
  };
  issues: string[];
}

export interface PlatformAnalysis {
  platformId: string;
  platformName: string;
  status: 'on-track' | 'issues' | 'critical';
  productsAnalysis: ProductAnalysis[];
  summary: string;
  totalProducts: number;
  onTrackProducts: number;
  blockedProducts: number;
  delayedProducts: number;
}

export interface ScheduleReport {
  platforms: PlatformAnalysis[];
  overallStatus: 'on-track' | 'issues' | 'critical';
  summary: string;
  totalProducts: number;
  onTrackProducts: number;
  blockedProducts: number;
  delayedProducts: number;
  criticalIssues: string[];
  recommendations: string[];
}

export function analyzeProduct(product: Product, currentDate: Date = new Date()): ProductAnalysis {
  const milestones = product.milestones || [];
  const analysis: ProductAnalysis = {
    productId: product.id,
    productName: product.name,
    status: 'on-track',
    blockedMilestones: [],
    milestoneDeviations: [],
    issues: []
  };

  // Find blocked milestones
  const blockedMilestones = milestones.filter(m => m.status === 'blocked');
  
  for (const milestone of blockedMilestones) {
    const bugLinks = milestone.bugLinks || [];
    analysis.blockedMilestones.push({
      milestone,
      blockingBugs: bugLinks.map(bug => `${bug.bugNumber}: ${bug.title}${bug.url ? ` (${bug.url})` : ''}`)
    });
  }

  // Calculate estimated WU Live date based on Final Bits Received completion
  analysis.estimatedWULiveDate = calculateEstimatedWULiveDate(milestones, currentDate);
  
  // Find actual WU Live date if milestone exists
  const wuLiveMilestone = milestones.find(m => m.type === '7-wu-live');
  if (wuLiveMilestone && wuLiveMilestone.status === 'completed') {
    analysis.actualWULiveDate = new Date(wuLiveMilestone.weekDate);
  }

  // Calculate deviation
  if (analysis.estimatedWULiveDate && analysis.actualWULiveDate) {
    analysis.deviation = Math.ceil(
      (analysis.actualWULiveDate.getTime() - analysis.estimatedWULiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Detect milestone duration deviations
  analysis.milestoneDeviations = detectMilestoneDurationDeviations(milestones);
  
  // Detect WU Live date deviations between dashboard and calculated values
  analysis.wuLiveDeviation = detectWULiveDeviation(milestones, analysis.estimatedWULiveDate);
  
  // Add issues for detected deviations
  if (analysis.milestoneDeviations.length > 0) {
    analysis.milestoneDeviations.forEach(deviation => {
      if (deviation.delayDays > 0) {
        analysis.issues.push(
          `${getMilestoneDisplayName(deviation.milestone)} took ${deviation.actualDuration} weeks (expected ${deviation.expectedDuration} weeks) - ${deviation.delayDays} days delay`
        );
      }
    });
  }
  
  if (analysis.wuLiveDeviation && analysis.wuLiveDeviation.deviationDays !== 0) {
    if (analysis.wuLiveDeviation.deviationDays > 0) {
      analysis.issues.push(
        `WU Live dashboard date is ${analysis.wuLiveDeviation.deviationDays} days later than calculated date - ${analysis.wuLiveDeviation.reason}`
      );
    } else {
      analysis.issues.push(
        `WU Live dashboard date is ${Math.abs(analysis.wuLiveDeviation.deviationDays)} days earlier than calculated date - ${analysis.wuLiveDeviation.reason}`
      );
    }
  }

  // Check for specific issues with Final Bits Received milestone
  const finalBitsReceivedMilestone = milestones.find(m => m.type === '1-final-bits-received');
  if (finalBitsReceivedMilestone) {
    if (finalBitsReceivedMilestone.status === 'blocked') {
      analysis.issues.push('Final Bits Received milestone blocked - affects all subsequent timeline calculations');
    } else if (finalBitsReceivedMilestone.status === 'not-started') {
      analysis.issues.push('Final Bits Received milestone not started - WU Live date estimation pending');
    }
  } else {
    analysis.issues.push('Final Bits Received milestone not defined - timeline calculation may be inaccurate');
  }

  // Determine status - simplified logic: BLOCKED, DELAYED, or ON-TRACK
  if (blockedMilestones.length > 0) {
    // Check if next milestone has started despite blocks
    const hasProgressDespiteBlocks = hasSubsequentMilestoneProgress(milestones, blockedMilestones);
    
    if (!hasProgressDespiteBlocks) {
      // Current milestone blocked AND next milestone hasn't started = blocked
      analysis.status = 'blocked';
      analysis.issues.push(`${blockedMilestones.length} milestone(s) blocked - next milestone not started`);
    } else {
      // If work continues despite blocks, treat as delayed (not blocked)
      analysis.status = 'delayed';
      analysis.issues.push(`${blockedMilestones.length} milestone(s) blocked but work continues`);
    }
  }

  // Check for milestone duration deviations and mark as delayed
  if (analysis.milestoneDeviations.length > 0) {
    // Always mark as delayed if milestones took longer than expected (unless blocked)
    if (analysis.status !== 'blocked') {
      analysis.status = 'delayed';
    }
    
    // Add summary of total delay from milestone deviations
    const totalDelayDays = analysis.milestoneDeviations.reduce((sum, dev) => sum + dev.delayDays, 0);
    if (totalDelayDays > 0) {
      analysis.issues.push(`${totalDelayDays} total days of milestone delays detected`);
    }
  }

  // Check for delays from WU Live deviation
  if (analysis.deviation && analysis.deviation > 0) {
    // Mark as delayed if not already blocked
    if (analysis.status !== 'blocked') {
      analysis.status = 'delayed';
    }
    analysis.issues.push(`${analysis.deviation} days behind schedule`);
  }

  // Check for WU Live deviation and adjust status accordingly
  if (analysis.wuLiveDeviation && analysis.wuLiveDeviation.deviationDays > 0) {
    if (analysis.status === 'on-track') {
      analysis.status = 'delayed';
    }
  }

  // Find current milestone
  analysis.currentMilestone = getCurrentMilestone(milestones);

  return analysis;
}

export function analyzePlatform(platform: Platform, products: Product[]): PlatformAnalysis {
  const platformProducts = products.filter(p => p.platformId === platform.id);
  const productsAnalysis = platformProducts.map(p => analyzeProduct(p));

  const onTrackCount = productsAnalysis.filter(p => p.status === 'on-track').length;
  const blockedCount = productsAnalysis.filter(p => p.status === 'blocked').length;
  const delayedCount = productsAnalysis.filter(p => p.status === 'delayed').length;

  let platformStatus: 'on-track' | 'issues' | 'critical' = 'on-track';
  let summary = '';

  if (blockedCount > 0) {
    platformStatus = 'critical';
    summary = `${blockedCount} product(s) blocked, immediate attention required`;
  } else if (delayedCount > 0) {
    platformStatus = 'issues';
    summary = `${delayedCount} product(s) delayed`;
  } else {
    summary = 'All products on track';
  }

  return {
    platformId: platform.id,
    platformName: platform.name,
    status: platformStatus,
    productsAnalysis,
    summary,
    totalProducts: platformProducts.length,
    onTrackProducts: onTrackCount,
    blockedProducts: blockedCount,
    delayedProducts: delayedCount
  };
}

export function generateScheduleReport(platforms: Platform[], products: Product[]): ScheduleReport {
  const platformAnalyses = platforms.map(p => analyzePlatform(p, products));
  
  const totalProducts = platformAnalyses.reduce((sum, p) => sum + p.totalProducts, 0);
  const onTrackProducts = platformAnalyses.reduce((sum, p) => sum + p.onTrackProducts, 0);
  const blockedProducts = platformAnalyses.reduce((sum, p) => sum + p.blockedProducts, 0);
  const delayedProducts = platformAnalyses.reduce((sum, p) => sum + p.delayedProducts, 0);

  let overallStatus: 'on-track' | 'issues' | 'critical' = 'on-track';
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];

  // Determine overall status
  if (blockedProducts > 0) {
    overallStatus = 'critical';
  } else if (delayedProducts > 0) {
    overallStatus = 'issues';
  }

  // Collect critical issues and recommendations
  for (const platformAnalysis of platformAnalyses) {
    for (const productAnalysis of platformAnalysis.productsAnalysis) {
      if (productAnalysis.status === 'blocked') {
        for (const blocked of productAnalysis.blockedMilestones) {
          criticalIssues.push(
            `${productAnalysis.productName}: ${blocked.milestone.name} blocked - ${blocked.blockingBugs.join(', ')}`
          );
          recommendations.push(
            `Prioritize resolving bugs for ${productAnalysis.productName} ${blocked.milestone.name}`
          );
        }
      }
      
      if (productAnalysis.deviation && productAnalysis.deviation > 7) {
        criticalIssues.push(
          `${productAnalysis.productName}: ${productAnalysis.deviation} days behind schedule`
        );
        recommendations.push(
          `Review timeline and resource allocation for ${productAnalysis.productName}`
        );
      }
    }
  }

  const summary = generateOverallSummary(totalProducts, onTrackProducts, blockedProducts, delayedProducts);

  return {
    platforms: platformAnalyses,
    overallStatus,
    summary,
    totalProducts,
    onTrackProducts,
    blockedProducts,
    delayedProducts,
    criticalIssues,
    recommendations
  };
}

function calculateEstimatedWULiveDate(milestones: Milestone[], startDate: Date): Date {
  // Find the "Final Bits Received" milestone
  const finalBitsReceivedMilestone = milestones.find(m => m.type === '1-final-bits-received');
  
  let calculationStartDate = startDate;
  let remainingMilestones: MilestoneType[] = [];

  if (finalBitsReceivedMilestone) {
    if (finalBitsReceivedMilestone.status === 'completed') {
      // Start calculation from the week after Final Bits Received completion
      calculationStartDate = new Date(finalBitsReceivedMilestone.weekDate);
      calculationStartDate.setDate(calculationStartDate.getDate() + 7); // Start from next week
      
      // Calculate remaining milestones after Final Bits Received
      remainingMilestones = [
        '2-dev-integration-work',
        '3-inte-pst',
        '4-dve-pre-eval',
        '5-payload-readiness',
        '6-full-rc-test-pass',
        '7-wu-live'
      ];
    } else {
      // Final Bits Received not completed yet
      if (finalBitsReceivedMilestone.weekDate) {
        calculationStartDate = new Date(finalBitsReceivedMilestone.weekDate);
      }
      
      // Include Final Bits Received and all subsequent milestones
      remainingMilestones = [
        '1-final-bits-received',
        '2-dev-integration-work',
        '3-inte-pst',
        '4-dve-pre-eval',
        '5-payload-readiness',
        '6-full-rc-test-pass',
        '7-wu-live'
      ];
    }
  } else {
    // No Final Bits Received milestone found, calculate from beginning
    remainingMilestones = MILESTONE_ORDER;
  }

  // Calculate total weeks for remaining milestones
  const totalWeeks = remainingMilestones.reduce((sum, type) => {
    return sum + MILESTONE_DURATIONS[type];
  }, 0);

  const estimatedDate = new Date(calculationStartDate);
  estimatedDate.setDate(estimatedDate.getDate() + (totalWeeks * 7));
  return estimatedDate;
}

function getCurrentMilestone(milestones: Milestone[]): MilestoneType | undefined {
  const inProgress = milestones.find(m => m.status === 'in-progress');
  if (inProgress) return inProgress.type;

  // Find the next milestone that hasn't started
  for (const milestoneType of MILESTONE_ORDER) {
    const milestone = milestones.find(m => m.type === milestoneType);
    if (!milestone || milestone.status === 'not-started') {
      return milestoneType;
    }
  }

  return undefined;
}

function hasSubsequentMilestoneProgress(milestones: Milestone[], blockedMilestones: Milestone[]): boolean {
  const blockedTypes = blockedMilestones.map(m => m.type);
  
  for (const blocked of blockedTypes) {
    const blockedIndex = MILESTONE_ORDER.indexOf(blocked);
    
    // Check if any subsequent milestone has started
    for (let i = blockedIndex + 1; i < MILESTONE_ORDER.length; i++) {
      const subsequentType = MILESTONE_ORDER[i];
      const subsequentMilestone = milestones.find(m => m.type === subsequentType);
      
      if (subsequentMilestone && subsequentMilestone.status !== 'not-started') {
        return true;
      }
    }
  }
  
  return false;
}

function generateOverallSummary(total: number, onTrack: number, blocked: number, delayed: number): string {
  if (total === 0) return 'No products in timeline';
  
  const percentage = Math.round((onTrack / total) * 100);
  
  if (blocked > 0) {
    return `${blocked} of ${total} products blocked (${100 - percentage}% at risk)`;
  } else if (delayed > 0) {
    return `${delayed} of ${total} products delayed (${percentage}% on track)`;
  } else {
    return `All ${total} products on track (${percentage}% completion rate)`;
  }
}

/**
 * Detect milestone duration deviations from expected hard-coded durations
 * This function analyzes the actual timeline positions of milestones to determine
 * if they took longer than their expected durations.
 */
function detectMilestoneDurationDeviations(milestones: Milestone[]): Array<{
  milestone: MilestoneType;
  expectedDuration: number;
  actualDuration: number;
  delayDays: number;
}> {
  const deviations: Array<{
    milestone: MilestoneType;
    expectedDuration: number;
    actualDuration: number;
    delayDays: number;
  }> = [];

  // Group milestones by type to handle milestones that span multiple weeks
  const milestonesByType = new Map<MilestoneType, Milestone[]>();
  milestones.forEach(milestone => {
    if (milestone.status === 'completed' || milestone.status === 'in-progress') {
      if (!milestonesByType.has(milestone.type)) {
        milestonesByType.set(milestone.type, []);
      }
      milestonesByType.get(milestone.type)!.push(milestone);
    }
  });

  // Analyze each milestone type for duration deviations
  for (const [type, typeMilestones] of milestonesByType) {
    const expectedDuration = MILESTONE_DURATIONS[type];
    
    if (typeMilestones.length === 0) continue;
    
    // Sort milestones by week index to find the span
    const sortedMilestones = typeMilestones.sort((a, b) => a.weekIndex - b.weekIndex);
    const firstWeek = sortedMilestones[0].weekIndex;
    const lastWeek = sortedMilestones[sortedMilestones.length - 1].weekIndex;
    
    // Calculate actual duration based on week span
    // If milestone appears in multiple weeks, it took that many weeks
    const actualDuration = Math.max(1, lastWeek - firstWeek + 1);
    
    // If there are multiple milestones of the same type, count them as duration
    const milestoneCount = typeMilestones.length;
    const calculatedDuration = Math.max(actualDuration, milestoneCount);
    
    // Check if this milestone exceeded its expected duration
    if (calculatedDuration > expectedDuration) {
      const delayWeeks = calculatedDuration - expectedDuration;
      deviations.push({
        milestone: type,
        expectedDuration,
        actualDuration: calculatedDuration,
        delayDays: delayWeeks * 7 // Convert weeks to days
      });
    }
  }

  return deviations;
}

/**
 * Detect WU Live date deviation between dashboard milestone and calculated estimate
 */
function detectWULiveDeviation(milestones: Milestone[], calculatedWULiveDate?: Date): {
  dashboardDate?: Date;
  calculatedDate?: Date;
  deviationDays: number;
  reason: string;
} | undefined {
  const wuLiveMilestone = milestones.find(m => m.type === '7-wu-live');
  
  if (!wuLiveMilestone || !calculatedWULiveDate) {
    return undefined;
  }

  const dashboardDate = new Date(wuLiveMilestone.weekDate);
  const deviationMs = dashboardDate.getTime() - calculatedWULiveDate.getTime();
  const deviationDays = Math.ceil(deviationMs / (1000 * 60 * 60 * 24));

  let reason = '';
  if (deviationDays > 0) {
    reason = 'Dashboard WU Live date is later than calculated - check for milestone delays';
  } else if (deviationDays < 0) {
    reason = 'Dashboard WU Live date is earlier than calculated - verify milestone timeline';
  } else {
    reason = 'Dashboard WU Live date matches calculated estimate';
  }

  // Find specific reasons for deviation by checking milestone delays
  const delayedMilestones = milestones.filter(m => {
    // This is a simplified check - enhance based on your actual timeline tracking
    return m.status === 'in-progress' || m.status === 'blocked';
  });

  if (delayedMilestones.length > 0 && deviationDays > 0) {
    const delayedNames = delayedMilestones.map(m => getMilestoneDisplayName(m.type)).join(', ');
    reason = `Delayed due to: ${delayedNames}`;
  }

  return {
    dashboardDate,
    calculatedDate: calculatedWULiveDate,
    deviationDays,
    reason
  };
}
