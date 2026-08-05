import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Reimbursement } from "@/types";

// Simple in-memory cache for reimbursements
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function GET(request: Request) {
  const url = new URL(request.url);
  const entity = url.searchParams.get('entity') || '';
  const cacheKey = `reimbursements:${entity}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  let query = supabase
    .from("reimbursements")
    .select("id, employee_name, description, amount, status, created_at, entity_id");
  
  if (entity) {
    query = query.eq('entity_id', entity);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false }).limit(300);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Update cache
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Reimbursement, "id">;

  const { data, error } = await supabase.from("reimbursements").insert({
    employee_name: body.employee_name,
    description: body.description,
    amount: body.amount,
    status: body.status ?? "pending",
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}