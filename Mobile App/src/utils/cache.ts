// Simple in-memory cache for Firebase queries
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheService = {
  get: (key: string) => {
    const cached = cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      cache.delete(key);
      return null;
    }
    
    return cached.data;
  },
  
  set: (key: string, data: any) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  clear: (key?: string) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }
};

