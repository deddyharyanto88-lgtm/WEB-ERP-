import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Simple in-memory cache for purchase orders
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function GET(request: Request) {
  const url = new URL(request.url);
  const entity = url.searchParams.get('entity') || '';
  const cacheKey = `purchase-orders:${entity}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  let query = supabase.from('purchase_orders').select('id, po_number, vendor_name, amount, status, date, entity_id, project_id');
  
  if (entity) {
    query = query.eq('entity_id', entity);
  }

  const { data, error } = await query.order('date', { ascending: false }).limit(500);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Update cache
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase.from('purchase_orders').insert(body).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}