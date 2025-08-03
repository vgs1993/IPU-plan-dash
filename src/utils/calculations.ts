import { Product, Phase, PhaseStatus } from '../types';
import { addWeeks, format } from 'date-fns';

export const calculateEstimatedReleaseDate = (product: Product): Date | null => {
  const startDate = new Date(); // Could be configurable
  let currentDate = startDate;
  
  for (const phase of product.phases) {
    if (phase.status === 'completed') {
      continue;
    }
    currentDate = addWeeks(currentDate, phase.duration);
  }
  
  return currentDate;
};

export const calculatePhaseProgress = (phase: Phase): number => {
  if (phase.status === 'completed') return 100;
  if (phase.status === 'not-started') return 0;
  if (phase.status === 'blocked') return 0;
  
  // For in-progress, we can calculate based on time elapsed
  if (phase.startDate) {
    const now = new Date();
    const elapsed = now.getTime() - phase.startDate.getTime();
    const total = phase.duration * 7 * 24 * 60 * 60 * 1000; // duration in milliseconds
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  }
  
  return 0;
};

export const getOverallProductStatus = (product: Product): PhaseStatus => {
  const phases = product.phases;
  
  if (phases.every(p => p.status === 'completed')) return 'completed';
  if (phases.some(p => p.status === 'blocked')) return 'blocked';
  if (phases.some(p => p.status === 'in-progress')) return 'in-progress';
  
  return 'not-started';
};

export const getDaysToComplete = (phase: Phase): number => {
  if (phase.status === 'completed') return 0;
  if (phase.status === 'not-started') return phase.duration * 7;
  if (phase.status === 'blocked') return phase.duration * 7;
  
  if (phase.startDate) {
    const totalDays = phase.duration * 7;
    const elapsedDays = Math.floor((new Date().getTime() - phase.startDate.getTime()) / (24 * 60 * 60 * 1000));
    return Math.max(totalDays - elapsedDays, 0);
  }
  
  return phase.duration * 7;
};

export const getStatusColor = (status: PhaseStatus): string => {
  switch (status) {
    case 'completed': return '#4CAF50';
    case 'in-progress': return '#2196F3';
    case 'delayed': return '#FF9800';
    case 'blocked': return '#F44336';
    case 'not-started': return '#9E9E9E';
    default: return '#9E9E9E';
  }
};

export const getStatusIcon = (status: PhaseStatus): string => {
  switch (status) {
    case 'completed': return '✓';
    case 'in-progress': return '⏳';
    case 'delayed': return '⚠️';
    case 'blocked': return '🚫';
    case 'not-started': return '○';
    default: return '○';
  }
};

export const formatDate = (date: Date | undefined): string => {
  if (!date) return 'TBD';
  return format(date, 'yyyy-MM-dd');
};
