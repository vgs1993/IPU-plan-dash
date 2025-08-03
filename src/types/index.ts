export type PhaseStatus = 'not-started' | 'in-progress' | 'blocked' | 'completed' | 'delayed';

export type PhaseType = 
  | 'final-bits-reception'
  | 'dev-integration-work'
  | 'pst-run'
  | 'pre-eval-testing'
  | 'payload-readiness'
  | 'rc-testing-full-pass'
  | 'wu-live';

export interface Phase {
  id: string;
  name: string;
  type: PhaseType;
  duration: number; // in weeks
  status: PhaseStatus;
  startDate?: Date;
  endDate?: Date;
  scheduledStartDate?: Date;
  scheduledEndDate?: Date;
  assignedTo?: string;
  owner: string;
  issues: Issue[];
  dependencies?: string[]; // Phase IDs that must complete before this phase
  delayReason?: string;
  completionNotes?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdDate: Date;
  assignedTo: string;
  status: 'open' | 'in-progress' | 'resolved';
  bugNumber?: string;
}

export type MilestoneType = 
  | '0-uefi-pre-eval'
  | '1-final-bits-received'
  | '2-dev-integration-work'
  | '3-inte-pst'
  | '4-dve-pre-eval'
  | '5-payload-readiness'
  | '6-full-rc-test-pass'
  | '7-wu-live';

export interface BugLink {
  id: string;
  bugNumber: string;
  title: string;
  url?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Milestone {
  id: string;
  name: string;
  type: MilestoneType;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  productId: string;
  weekIndex: number;
  weekDate: string;
  createdDate: Date;
  bugLinks?: BugLink[];
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  platformId: string;
  phases: Phase[];
  milestones?: Milestone[];
  estimatedReleaseDate?: Date;
  actualReleaseDate?: Date;
  overallStatus: PhaseStatus;
  owner: string;
  description?: string;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  color: string;
  products: string[]; // Product IDs
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface WeekInfo {
  weekNumber: string;
  startDate: Date;
  endDate: Date;
  month: string;
}

export interface TimelineView {
  startDate: Date;
  endDate: Date;
  weeks: WeekInfo[];
}

export interface PlannerData {
  platforms: Platform[];
  products: Product[];
  teamMembers: TeamMember[];
}
