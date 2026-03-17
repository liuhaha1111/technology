# Admin System Deployment

## 1. Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop
- Local Supabase stack at `supabase-project/`

## 2. Environment Variables

Create `admin-system/admin-backend/.env`:

```env
PORT=3200
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>
```

Create `admin-system/admin-frontend/.env.local`:

```env
VITE_ADMIN_API_BASE_URL=http://localhost:3200/api/v1
```

## 3. Start Local Supabase

From repository root:

```powershell
cd supabase-project
npx supabase start
```

## 4. Apply Schema and Seed

Apply SQL files in order:

1. `admin-system/database/supabase/migrations/20260309_0001_core.sql`
2. `admin-system/database/supabase/migrations/20260309_0002_rls.sql`
3. `admin-system/database/supabase/seeds/seed_core.sql`

## 5. Install and Run

From repository root:

```powershell
npm --prefix admin-system install
npm --prefix admin-system/admin-backend run dev
npm --prefix admin-system/admin-frontend run dev
```

Open:

- Frontend: `http://localhost:3100`
- Backend health: `http://localhost:3200/api/v1/health`

## 6. Build for Production

```powershell
npm --prefix admin-system/admin-backend run build
npm --prefix admin-system/admin-frontend run build
```
