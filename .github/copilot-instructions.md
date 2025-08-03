<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# IPU Program Planner - Copilot Instructions

This is a React TypeScript application for managing program planning across multiple platforms and products.

## Project Structure
- **Types**: All TypeScript interfaces and types are defined in `src/types/index.ts`
- **Data**: Mock data and data utilities are in `src/data/mockData.ts`
- **Components**: React components are in `src/components/`
- **Utils**: Utility functions for calculations are in `src/utils/calculations.ts`

## Key Features
1. **Phase Management**: 7 predefined phases with specific durations
   - Final Bits Reception (1 week)
   - Dev Integration Work (2 weeks)
   - PST Run (1 week)
   - Pre Eval Testing (2 weeks)
   - Payload Readiness (1 week)
   - RC Testing Full Pass (4 weeks)
   - WU Live (1 week)

2. **Status Tracking**: Four status types - not-started, in-progress, blocked, completed
3. **Platform Grouping**: Products are organized under platforms
4. **Timeline Calculations**: Automatic release date estimation
5. **Issue Management**: Track issues that cause blocking

## Design Patterns
- Use functional components with TypeScript
- Follow the existing component structure for consistency
- Status colors: Green (completed), Orange (in-progress), Red (blocked), Gray (not-started)
- Grid-based layout similar to the provided dashboard design

## When adding new features:
- Add new types to the types file
- Update mock data if needed
- Follow the existing CSS class naming conventions
- Maintain responsive design principles
