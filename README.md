# IPU Program Planner

[![Build Status](https://github.com/YOUR_USERNAME/ipu-planner/workflows/Build/badge.svg)](https://github.com/YOUR_USERNAME/ipu-planner/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

A comprehensive program planning dashboard for managing product development across multiple platforms and phases.

## Features

### 🎯 Core Functionality
- **Multi-Platform Management**: Organize 20 products across 6-7 platforms
- **7-Phase Development Process**: 
  1. Final Bits Reception (1 week)
  2. Dev Integration Work (2 weeks)
  3. PST Run (1 week)
  4. Pre Eval Testing (2 weeks)
  5. Payload Readiness (1 week)
  6. RC Testing Full Pass (4 weeks)
  7. WU Live (1 week)

### 📊 Status Tracking
- **Phase Status**: Not Started, In Progress, Blocked, Completed
- **Issue Management**: Track blocking issues with severity levels
- **Ownership**: Assign team members to phases and products
- **Timeline**: Automatic release date calculations

### 🎨 User Interface
- **Dashboard Design**: Similar to Microsoft PLE Dashboard
- **Responsive Grid**: Expandable platform groups
- **Status Indicators**: Color-coded progress indicators
- **Interactive Elements**: Click-through phase details

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Grid and Flexbox
- **Icons**: Unicode icons (easily replaceable with icon libraries)

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── PlannerView.tsx # Main planner grid
├── types/              # TypeScript interfaces
├── data/               # Mock data and templates
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm 7+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Data Model

### Products
Each product contains:
- Name and description
- Platform assignment
- 7 development phases
- Overall status
- Owner information
- Estimated release date

### Phases
Each phase includes:
- Status (not-started, in-progress, blocked, completed)
- Duration in weeks
- Assigned team member
- Issue tracking
- Dependencies

### Platforms
Platform groupings with:
- Name and description
- Color coding
- Product assignments

## Customization

### Adding New Platforms
Update the `platforms` array in `src/data/mockData.ts`

### Modifying Phases
Edit the `PHASE_TEMPLATES` in `src/data/mockData.ts`

### Styling
Main styles are in `src/App.css` with CSS custom properties for easy theming

## Team Members

The application includes predefined team members with roles:
- Senior Engineer
- Product Manager  
- QA Lead
- DevOps Engineer
- Software Architect
- Test Engineer
- Frontend Developer
- Backend Developer

## Contributing

1. Follow TypeScript best practices
2. Maintain responsive design
3. Use semantic HTML elements
4. Follow the existing CSS class naming conventions
5. Update types when adding new data structures

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Data persistence (API integration)
- [ ] Advanced filtering and search
- [ ] Gantt chart view
- [ ] Export functionality
- [ ] Email notifications
- [ ] Mobile app companion
