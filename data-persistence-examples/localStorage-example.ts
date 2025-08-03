// Option 1: Local Storage (Browser-based persistence)
// Add this to your TimelinePlanner component

import { useEffect } from 'react';

export const TimelinePlanner: React.FC<TimelinePlannerProps> = ({ selectedPlatforms: _ }) => {
  // Load data from localStorage on component mount
  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    const saved = localStorage.getItem('ipu-planner-platforms');
    return saved ? JSON.parse(saved) : mockData.platforms;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ipu-planner-products');
    return saved ? JSON.parse(saved) : mockData.products;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('ipu-planner-platforms', JSON.stringify(platforms));
  }, [platforms]);

  useEffect(() => {
    localStorage.setItem('ipu-planner-products', JSON.stringify(products));
  }, [products]);

  // Rest of your component...
};

// Pros: Simple, no backend needed, persists across browser sessions
// Cons: Limited to ~5-10MB, not shared between users, can be cleared by user
