import { Platform, Product } from '../types';

const STORAGE_KEYS = {
  PLATFORMS: 'ipu-planner-platforms',
  PRODUCTS: 'ipu-planner-products',
  TIMELINE_STATE: 'ipu-planner-timeline-state',
  UI_STATE: 'ipu-planner-ui-state'
} as const;

export class LocalStorageService {
  // Platform operations
  static savePlatforms(platforms: Platform[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(platforms));
    } catch (error) {
      console.error('Failed to save platforms to localStorage:', error);
    }
  }

  static loadPlatforms(): Platform[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLATFORMS);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Basic validation: ensure each item is an object with required properties
      const validPlatforms = parsed.filter(item => 
        item && 
        typeof item === 'object' && 
        typeof item.id === 'string' && 
        typeof item.name === 'string'
      );
      
      return validPlatforms;
    } catch (error) {
      console.error('Failed to load platforms from localStorage:', error);
      return [];
    }
  }

  // Product operations (with milestone data)
  static saveProducts(products: Product[]): void {
    try {
      // Convert Date objects to ISO strings for storage
      const serializedProducts = products.map(product => ({
        ...product,
        milestones: product.milestones?.map(milestone => ({
          ...milestone,
          createdDate: milestone.createdDate.toISOString()
        })),
        phases: product.phases.map(phase => ({
          ...phase,
          startDate: phase.startDate?.toISOString(),
          endDate: phase.endDate?.toISOString(),
          scheduledStartDate: phase.scheduledStartDate?.toISOString(),
          scheduledEndDate: phase.scheduledEndDate?.toISOString(),
          issues: phase.issues.map(issue => ({
            ...issue,
            createdDate: issue.createdDate.toISOString()
          }))
        })),
        estimatedReleaseDate: product.estimatedReleaseDate?.toISOString(),
        actualReleaseDate: product.actualReleaseDate?.toISOString()
      }));

      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(serializedProducts));
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
    }
  }

  static loadProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!stored) return [];

      const products = JSON.parse(stored);
      
      // Convert ISO strings back to Date objects
      return products.map((product: any) => ({
        ...product,
        milestones: product.milestones?.map((milestone: any) => ({
          ...milestone,
          createdDate: new Date(milestone.createdDate)
        })),
        phases: product.phases.map((phase: any) => ({
          ...phase,
          startDate: phase.startDate ? new Date(phase.startDate) : undefined,
          endDate: phase.endDate ? new Date(phase.endDate) : undefined,
          scheduledStartDate: phase.scheduledStartDate ? new Date(phase.scheduledStartDate) : undefined,
          scheduledEndDate: phase.scheduledEndDate ? new Date(phase.scheduledEndDate) : undefined,
          issues: phase.issues.map((issue: any) => ({
            ...issue,
            createdDate: new Date(issue.createdDate)
          }))
        })),
        estimatedReleaseDate: product.estimatedReleaseDate ? new Date(product.estimatedReleaseDate) : undefined,
        actualReleaseDate: product.actualReleaseDate ? new Date(product.actualReleaseDate) : undefined
      }));
    } catch (error) {
      console.error('Failed to load products from localStorage:', error);
      return [];
    }
  }

  // UI state operations
  static saveUIState(state: { expandedPlatforms: string[] }): void {
    try {
      localStorage.setItem(STORAGE_KEYS.UI_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save UI state to localStorage:', error);
    }
  }

  static loadUIState(): { expandedPlatforms: string[] } {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.UI_STATE);
      return stored ? JSON.parse(stored) : { expandedPlatforms: [] };
    } catch (error) {
      console.error('Failed to load UI state from localStorage:', error);
      return { expandedPlatforms: [] };
    }
  }

  // Timeline state operations
  static saveTimelineState(state: { startWeeks: number, totalWeeks: number }): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMELINE_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save timeline state to localStorage:', error);
    }
  }

  static loadTimelineState(): { startWeeks: number, totalWeeks: number } {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TIMELINE_STATE);
      return stored ? JSON.parse(stored) : { startWeeks: 2, totalWeeks: 20 };
    } catch (error) {
      console.error('Failed to load timeline state from localStorage:', error);
      return { startWeeks: 2, totalWeeks: 20 };
    }
  }

  // Clear all data
  static clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  // Export/Import functionality
  static exportData(): void {
    try {
      const exportData = {
        platforms: this.loadPlatforms(),
        products: this.loadProducts(),
        uiState: this.loadUIState(),
        timelineState: this.loadTimelineState(),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ipu-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  }

  static importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData = JSON.parse(content);
          
          if (importedData.platforms) {
            this.savePlatforms(importedData.platforms);
          }
          
          if (importedData.products) {
            this.saveProducts(importedData.products);
          }
          
          if (importedData.uiState) {
            this.saveUIState(importedData.uiState);
          }
          
          if (importedData.timelineState) {
            this.saveTimelineState(importedData.timelineState);
          }
          
          resolve();
        } catch (error) {
          console.error('Failed to import data:', error);
          reject(new Error('Invalid file format. Please check the file and try again.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  }

  // Get storage usage info
  static getStorageInfo(): { used: number, available: number, percentage: number } {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      // Rough estimate: most browsers allow ~5MB for localStorage
      const available = 5 * 1024 * 1024; // 5MB in bytes
      const percentage = Math.round((used / available) * 100);
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}
