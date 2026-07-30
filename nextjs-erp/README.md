# Mini-ERP Pro

Industrial ERP built with Next.js + Supabase

## Tech Stack

- Next.js 16 with App Router
- React 19
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth)
- TypeScript

## Setup Instructions

1. Install dependencies
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor and run the migration in `src/migrations/001_initial_schema.sql`
3. Update `.env.local` with your project URL and anon key
4. Create a login page to handle authentication

## Vercel Deployment

This project includes `vercel.json` with:
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Regions: `iad1`, `sfo1`, `hnd1`
- Clean URL rewrites for `/ess`, `/qhsee`, `/risk`

Deploy with:
```bash
vercel --prod
```

## Modules

- **Dashboard** - Overview and KPIs
- **Estimation** - Project costing and budgets
- **Operation** - Project execution tracking
- **Procurement** - Purchase orders and vendors
- **Finance** - Payments and reimbursements
- **HR** - Employee management
- **QHSSE** - Quality, Health, Safety, Security, Environment
- **Risk Management** - Early warning dashboard and risk register

## License

Private
