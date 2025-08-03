// Option 3: Supabase (Production-ready database with real-time features)
// Install: npm install @supabase/supabase-js

// Database schema (SQL):
/*
CREATE TABLE platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  platform_id UUID REFERENCES platforms(id),
  owner TEXT NOT NULL,
  description TEXT,
  overall_status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  week_index INTEGER NOT NULL,
  week_date TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bug_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES milestones(id),
  bug_number TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  severity TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
*/

// Supabase client setup:
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Service class:
export class SupabaseDataService {
  async getPlatforms() {
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async createPlatform(platform: any) {
    const { data, error } = await supabase
      .from('platforms')
      .insert([platform])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getMilestonesWithBugLinks(productId: string) {
    const { data, error } = await supabase
      .from('milestones')
      .select(`
        *,
        bug_links (*)
      `)
      .eq('product_id', productId);
    
    if (error) throw error;
    return data;
  }

  // Real-time subscriptions for collaborative features:
  subscribeToMilestoneChanges(productId: string, callback: (payload: any) => void) {
    return supabase
      .channel('milestone-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'milestones',
          filter: `product_id=eq.${productId}`
        }, 
        callback
      )
      .subscribe();
  }
}

// Pros: Production-ready, real-time updates, user authentication, scales well
// Cons: Requires setup, has usage limits on free tier
