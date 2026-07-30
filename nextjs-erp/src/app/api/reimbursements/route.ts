import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Reimbursement } from "@/types";

export async function GET() {
  const { data, error } = await supabase
    .from("reimbursements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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