// Option 2: JSON Server (Simple REST API for development)
// Install: npm install json-server

// Create db.json file:
{
  "platforms": [],
  "products": [],
  "milestones": [],
  "teamMembers": []
}

// Start server: npx json-server --watch db.json --port 3001

// API service for your app:
export class DataService {
  private baseUrl = 'http://localhost:3001';

  async getPlatforms(): Promise<Platform[]> {
    const response = await fetch(`${this.baseUrl}/platforms`);
    return response.json();
  }

  async createPlatform(platform: Platform): Promise<Platform> {
    const response = await fetch(`${this.baseUrl}/platforms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(platform)
    });
    return response.json();
  }

  async updatePlatform(id: string, platform: Platform): Promise<Platform> {
    const response = await fetch(`${this.baseUrl}/platforms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(platform)
    });
    return response.json();
  }

  async deletePlatform(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/platforms/${id}`, {
      method: 'DELETE'
    });
  }

  // Similar methods for products, milestones, etc.
}

// Pros: Real database-like behavior, RESTful API, good for prototyping
// Cons: Development only, not suitable for production
