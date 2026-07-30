export type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  entity_id: string;
};

export type Entity = {
  id: string;
  name: string;
  code: string;
  industry: string;
  is_active: boolean;
};

export type Project = {
  id: string;
  entity_id: string;
  name: string;
  code: string;
  status: string;
  budget: number;
  spent: number;
  manager: string;
  start_date: string;
  end_date: string;
};

export type PurchaseOrder = {
  id: string;
  entity_id: string;
  project_id: string;
  po_number: string;
  vendor_name: string;
  amount: number;
  status: string;
  date: string;
};

export type Payment = {
  id: string;
  entity_id: string;
  po_id: string;
  amount: number;
  date: string;
  method: string;
  status: string;
};

export type Employee = {
  id: string;
  entity_id: string;
  name: string;
  department: string;
  position: string;
  join_date: string;
  status: string;
};

export type Inspection = {
  id: string;
  entity_id: string;
  project_id: string;
  inspector: string;
  date: string;
  type: string;
  status: string;
  score: number;
};

export type Risk = {
  id: string;
  entity_id: string;
  project_id: string;
  description: string;
  level: string;
  probability: string;
  impact: string;
  mitigation: string;
  status: string;
};

export type Reimbursement = {
  id: string;
  entity_id: string;
  employee_id: string;
  amount: number;
  category: string;
  date: string;
  status: string;
};

export type ApiResponse<T = unknown> = {
  data: T | null;
  error: string | null;
};

export type DashboardStats = {
  totalRevenue: number;
  totalProjects: number;
  activePOs: number;
  pendingPayments: number;
  budgetUtilization: number;
  teamSize: number;
};
