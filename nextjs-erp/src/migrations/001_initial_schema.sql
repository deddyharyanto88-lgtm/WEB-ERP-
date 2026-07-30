-- Mini-ERP Pro Initial Schema
-- Run this in the Supabase SQL Editor or via migration tool

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security on all tables
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Entities table (multi-entity support)
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Indonesia',
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  entity_id UUID REFERENCES entities(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id),
  project_id UUID REFERENCES projects(id),
  vendor_id UUID,
  po_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  status TEXT DEFAULT 'pending',
  order_date DATE,
  delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id),
  project_id UUID REFERENCES projects(id),
  po_id UUID REFERENCES purchase_orders(id),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  method TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id),
  employee_number TEXT UNIQUE,
  full_name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  hire_date DATE,
  salary DECIMAL(12,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reimbursements table
CREATE TABLE IF NOT EXISTS reimbursements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id),
  employee_id UUID REFERENCES employees(id),
  project_id UUID REFERENCES projects(id),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  category TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspections table (QHSSE)
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  type TEXT,
  inspector TEXT,
  findings TEXT,
  score INTEGER,
  status TEXT DEFAULT 'open',
  inspection_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risks table
CREATE TABLE IF NOT EXISTS risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id),
  project_id UUID REFERENCES projects(id),
  description TEXT NOT NULL,
  level TEXT DEFAULT 'medium',
  probability INTEGER DEFAULT 50,
  impact INTEGER DEFAULT 50,
  mitigation TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_entity ON projects(entity_id);
CREATE INDEX IF NOT EXISTS idx_risks_entity ON risks(entity_id);
CREATE INDEX IF NOT EXISTS idx_risks_project ON risks(project_id);
CREATE INDEX IF NOT EXISTS idx_risks_status ON risks(status);
CREATE INDEX IF NOT EXISTS idx_payments_project ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_employees_entity ON employees(entity_id);

-- Row Level Security Policies

-- Entities: users can read their own entity, admins can manage
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their entity" ON entities FOR SELECT USING (true);
CREATE POLICY "Admins can insert entities" ON entities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update entities" ON entities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete entities" ON entities FOR DELETE USING (auth.role() = 'authenticated');

-- Profiles: users can view their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can create own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects: authenticated users can read, admins can manage
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view projects" ON projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Purchase Orders
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view purchase orders" ON purchase_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert purchase orders" ON purchase_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update purchase orders" ON purchase_orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete purchase orders" ON purchase_orders FOR DELETE USING (auth.role() = 'authenticated');

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view payments" ON payments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert payments" ON payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update payments" ON payments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete payments" ON payments FOR DELETE USING (auth.role() = 'authenticated');

-- Employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view employees" ON employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert employees" ON employees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update employees" ON employees FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete employees" ON employees FOR DELETE USING (auth.role() = 'authenticated');

-- Reimbursements
ALTER TABLE reimbursements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view reimbursements" ON reimbursements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert reimbursements" ON reimbursements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update reimbursements" ON reimbursements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete reimbursements" ON reimbursements FOR DELETE USING (auth.role() = 'authenticated');

-- Inspections
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view inspections" ON inspections FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert inspections" ON inspections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update inspections" ON inspections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete inspections" ON inspections FOR DELETE USING (auth.role() = 'authenticated');

-- Risks
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view risks" ON risks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert risks" ON risks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update risks" ON risks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete risks" ON risks FOR DELETE USING (auth.role() = 'authenticated');

-- Seed sample data
INSERT INTO entities (id, name, code, city, country, status) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'PT. Konstruksi Nusantara', 'KN', 'Jakarta', 'Indonesia', 'active'),
  ('a0000000-0000-0000-0000-000000000002', 'CV. Sumber Daya', 'SD', 'Surabaya', 'Indonesia', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, entity_id, name, code, description, location, start_date, end_date, status) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Delta Tower Construction', 'PROJ-001', 'High-rise office tower project in central Jakarta', 'Jakarta', '2024-01-15', '2025-06-30', 'active'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'West Wing Expansion', 'PROJ-002', 'Industrial complex warehouse expansion', 'Bekasi', '2024-03-01', '2025-01-31', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, entity_id, employee_number, full_name, position, department, hire_date, status) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'EMP-001', 'Budi Santoso', 'Project Manager', 'Operations', '2022-06-01', 'active'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'EMP-002', 'Siti Aminah', 'HSE Officer', 'QHSSE', '2023-01-15', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO risks (id, entity_id, project_id, description, level, probability, impact, mitigation, status) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Concrete supply chain interruption due to fuel hike', 'high', 80, 85, 'Negotiate fixed-price contract renewal with backup supplier', 'open'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Permit delays for West Wing expansion', 'medium', 45, 60, 'Engage local council liaison early', 'mitigating'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Currency volatility (IDR/USD) for imports', 'medium', 60, 50, 'Currency hedging with bank', 'monitored'),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Monsoon weather impact on foundation work', 'low', 30, 40, 'Increase drainage capacity on site', 'resolved')
ON CONFLICT (id) DO NOTHING;
