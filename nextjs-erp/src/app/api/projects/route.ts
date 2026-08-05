import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Simple in-memory cache for projects
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function GET(request: Request) {
  const url = new URL(request.url);
  const entity = url.searchParams.get('entity') || '';
  const cacheKey = `projects:${entity}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  let query = supabase.from('projects').select('id, name, code, status, budget, spent, manager, start_date, end_date, entity_id');
  
  if (entity) {
    query = query.eq('entity_id', entity);
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(200);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Update cache
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return NextResponse.json(data);
}