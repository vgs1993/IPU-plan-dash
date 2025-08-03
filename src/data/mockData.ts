import { PlannerData, Platform, Product, TeamMember, Phase, PhaseType } from '../types';

// Phase templates with predefined durations
export const PHASE_TEMPLATES: Record<PhaseType, { name: string; duration: number }> = {
  'final-bits-reception': { name: 'Final Bits Reception', duration: 1 },
  'dev-integration-work': { name: 'Dev Integration Work', duration: 2 },
  'pst-run': { name: 'PST Run', duration: 1 },
  'pre-eval-testing': { name: 'Pre Eval Testing', duration: 2 },
  'payload-readiness': { name: 'Payload Readiness', duration: 1 },
  'rc-testing-full-pass': { name: 'RC Testing Full Pass', duration: 4 },
  'wu-live': { name: 'WU Live', duration: 1 }
};

export const createPhase = (type: PhaseType, productId: string, phaseIndex: number): Phase => {
  const template = PHASE_TEMPLATES[type];
  return {
    id: `${productId}-phase-${phaseIndex + 1}`,
    name: template.name,
    type,
    duration: template.duration,
    status: 'not-started',
    owner: 'Unassigned',
    issues: []
  };
};

// Create all phases for a new product
export const createDefaultPhases = (productId: string): Phase[] => {
  return Object.keys(PHASE_TEMPLATES).map((type, index) => 
    createPhase(type as PhaseType, productId, index)
  );
};

export const teamMembers: TeamMember[] = [];

// Empty initial data - users will add their own platforms and products
export const platforms: Platform[] = [];

export const products: Product[] = [];

export const mockData: PlannerData = {
  platforms,
  products,
  teamMembers
};
