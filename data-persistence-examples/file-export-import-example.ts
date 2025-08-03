// Option 4: Simple File Export/Import (Immediate solution)
// Add these functions to your TimelinePlanner component

export const TimelinePlanner: React.FC<TimelinePlannerProps> = ({ selectedPlatforms: _ }) => {
  // ... existing state ...

  // Export data as JSON file
  const exportData = () => {
    const exportData = {
      platforms,
      products,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ipu-planner-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (importedData.platforms) setPlatforms(importedData.platforms);
        if (importedData.products) setProducts(importedData.products);
        
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Add to your header section:
  return (
    <div className="timeline-planner">
      <div className="timeline-header">
        <div className="action-buttons">
          <button onClick={exportData} className="export-btn">
            📥 Export Data
          </button>
          <label className="import-btn">
            📤 Import Data
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </label>
          {/* ... existing buttons ... */}
        </div>
      </div>
      {/* ... rest of component ... */}
    </div>
  );
};

// Pros: Simple, works immediately, good for backups, portable
// Cons: Manual process, not automatic, no real-time collaboration
