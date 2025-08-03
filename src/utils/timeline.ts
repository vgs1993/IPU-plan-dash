import { WeekInfo, TimelineView } from '../types';

/**
 * Timeline Generation Utilities
 * 
 * Key Design: 1 Grid Cell = 1 Week
 * - Each timeline cell represents exactly one week (Monday to Sunday)
 * - Week indexing starts from 0 and increments for each week
 * - Milestones are positioned based on weekIndex (0-based)
 */

export const generateTimelineWeeks = (startDate: Date, numberOfWeeks: number = 16): TimelineView => {
  const weeks: WeekInfo[] = [];
  
  // Start from the beginning of the week (Monday)
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startDate.getDate() - startDate.getDay() + 1);
  
  // Generate exactly numberOfWeeks, each representing 1 week (7 days)
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(startOfWeek.getDate() + (i * 7)); // Each iteration = +7 days (1 week)
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Week spans 7 days (Monday to Sunday)
    
    // Format as full date YYYY-MM-DD for timeline headers
    const weekNumber = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD format
    const month = weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    weeks.push({
      weekNumber,
      startDate: weekStart,
      endDate: weekEnd,
      month
    });
  }
  
  const endDate = new Date(weeks[weeks.length - 1].endDate);
  
  return {
    startDate: startOfWeek,
    endDate,
    weeks
  };
};

// Get current week as starting point
export const getCurrentWeekStart = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Monday start
  return new Date(today.setDate(diff));
};

// Generate timeline relative to current date
export const generateCurrentTimeline = (weeksBefore: number = 2, weeksAfter: number = 20): TimelineView => {
  const currentWeekStart = getCurrentWeekStart();
  const timelineStart = new Date(currentWeekStart);
  timelineStart.setDate(currentWeekStart.getDate() - (weeksBefore * 7));
  
  const totalWeeks = weeksBefore + weeksAfter;
  return generateTimelineWeeks(timelineStart, totalWeeks);
};

// Navigate timeline left/right
export const shiftTimeline = (currentTimeline: TimelineView, direction: 'left' | 'right', weekShift: number = 4): TimelineView => {
  const currentStart = new Date(currentTimeline.startDate);
  const shiftDays = direction === 'left' ? -(weekShift * 7) : (weekShift * 7);
  currentStart.setDate(currentStart.getDate() + shiftDays);
  
  return generateTimelineWeeks(currentStart, currentTimeline.weeks.length);
};

export const getWeekForDate = (date: Date, timeline: TimelineView): WeekInfo | null => {
  return timeline.weeks.find(week => 
    date >= week.startDate && date <= week.endDate
  ) || null;
};

export const formatWeekDate = (date: Date): string => {
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
};

export const getMonthGroups = (weeks: WeekInfo[]): { [month: string]: WeekInfo[] } => {
  return weeks.reduce((groups, week) => {
    const month = week.month;
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(week);
    return groups;
  }, {} as { [month: string]: WeekInfo[] });
};

export const isDateInWeek = (date: Date, week: WeekInfo): boolean => {
  return date >= week.startDate && date <= week.endDate;
};

export const getPhaseWeekSpan = (phase: { startDate?: Date; endDate?: Date }, timeline: TimelineView): { startWeekIndex: number; endWeekIndex: number } | null => {
  if (!phase.startDate || !phase.endDate) return null;
  
  const startWeekIndex = timeline.weeks.findIndex(week => 
    isDateInWeek(phase.startDate!, week)
  );
  
  const endWeekIndex = timeline.weeks.findIndex(week => 
    isDateInWeek(phase.endDate!, week)
  );
  
  if (startWeekIndex === -1 || endWeekIndex === -1) return null;
  
  return { startWeekIndex, endWeekIndex };
};
