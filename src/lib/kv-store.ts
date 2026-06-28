import { supabase } from './supabase';

export const kvStore = {
  async get(key: string) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('kv_store')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Not found
        console.error('Error fetching from KV store:', error);
      }
      return null;
    }
    
    return data.value;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(key: string, value: unknown, metadata: any = {}) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('kv_store')
      .upsert({ 
        key, 
        value, 
        metadata, 
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' })
      .select()
      .single();
    
    if (error) {
      console.error('Error setting in KV store:', error);
      return null;
    }
    
    return data;
  }
};
