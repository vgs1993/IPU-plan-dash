import { MilestoneType } from '../types';

export interface MilestoneDefinition {
  type: MilestoneType;
  name: string;
  description: string;
  order: number;
}

export const MILESTONE_DEFINITIONS: MilestoneDefinition[] = [
  {
    type: '0-uefi-pre-eval',
    name: 'UEFI Pre Eval',
    description: 'UEFI Pre-Evaluation Phase',
    order: 0
  },
  {
    type: '1-final-bits-received',
    name: 'Final Bits Received',
    description: 'Final Bits Reception Phase',
    order: 1
  },
  {
    type: '2-dev-integration-work',
    name: 'Dev Integration Work',
    description: 'Development Integration Work Phase',
    order: 2
  },
  {
    type: '3-inte-pst',
    name: 'Inte PST',
    description: 'Integration PST Run Phase',
    order: 3
  },
  {
    type: '4-dve-pre-eval',
    name: 'DVE Pre Eval',
    description: 'DVE Pre-Evaluation Testing Phase',
    order: 4
  },
  {
    type: '5-payload-readiness',
    name: 'Payload Readiness',
    description: 'Payload Readiness Phase',
    order: 5
  },
  {
    type: '6-full-rc-test-pass',
    name: 'Full RC Test Pass',
    description: 'RC Testing Full Pass Phase',
    order: 6
  },
  {
    type: '7-wu-live',
    name: 'WU Live',
    description: 'Windows Update Live Phase',
    order: 7
  }
];

export const getMilestoneDefinition = (type: MilestoneType): MilestoneDefinition | undefined => {
  return MILESTONE_DEFINITIONS.find(def => def.type === type);
};

export const getMilestoneDisplayName = (type: MilestoneType): string => {
  const definition = getMilestoneDefinition(type);
  return definition ? definition.name : type;
};
