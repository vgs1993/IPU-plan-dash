import React, { useState, useEffect } from 'react';

interface AutoSaveIndicatorProps {
  isVisible: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ isVisible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div className="autosave-indicator">
      ✅ Data saved automatically
    </div>
  );
};
