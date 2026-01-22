# SETUP GUIDE - Portfolio2

## 1. Prerequisites
- Node.js 18.17+ 
- npm o pnpm
- Supabase account (free tier OK)
- n8n instance (self-hosted or cloud)

## 2. Local Development Setup

### Clone and Install
```bash
git clone <repository-url> portfolio2
cd portfolio2

# Install dependencies (don't skip - React 19 RC needs careful handling)
npm install

# Create .env.local from template
cp .env.local.example .env.local
```

### Configure Environment
Edit `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
```

### Database Setup (Supabase)
1. Go to [supabase.com](https://supabase.com) → Create project
2. Once project is live, go to SQL Editor
3. Copy the content from `docs/database/schema.sql`
4. Run the SQL to create tables, RLS policies, and triggers

### Start Development Server
```bash
npm run dev
```
Visit http://localhost:3000

## 3. Key Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 4. Project Structure

```
src/
├── app/               # Next.js App Router
├── components/        # React components
├── lib/              # Utilities & clients
├── actions/          # Server Actions
├── types/            # TypeScript definitions
└── middleware.ts     # Auth middleware
```

## 5. CRITICAL RULES (from copilot-instructions.md)

- ✅ **Cookies are async**: Always use `await cookies()` in Server Components
- ✅ **React 19 RC**: Use `useActionState` not `useFormState`
- ✅ **Framer Motion v12-alpha**: Don't remove overrides in package.json
- ✅ **No client→n8n calls**: Always use Server Action → Supabase → pg_net trigger
- ✅ **RLS enforcement**: All database queries respect Row Level Security

## 6. Authentication Setup (Minimal - Phase 2A)

**BEFORE you can test auth, run SQL schema!**

1. Go to Supabase console → SQL Editor
2. Copy entire content from `docs/database/schema.sql`
3. Execute the SQL (creates tables + RLS policies)
4. Test: http://localhost:3000/register

**Flow**:
1. User signs up → Supabase Auth
2. Profile created in `public.profiles` (RLS policy allows it)
3. JWT token stored in secure httpOnly cookie
4. Middleware validates token on each request
5. Server Components access Supabase with user context (RLS enforced)

**See [AUTH_GUIDE.md](AUTH_GUIDE.md) for detailed flow & testing**

## 7. Creating a Lead (Example Flow)

1. Client Component: Form submission
2. Server Action: `actions/leads.ts` validates with Zod
3. Database Insert: Supabase with RLS
4. Trigger: PostgreSQL → pg_net → n8n webhook
5. n8n: Enriches lead, sends to CRM, notifies team
6. Dashboard: Revalidates to show new lead

## 8. Troubleshooting

### Cookies Async Error
```
Error: cookies is not a function
```
**Fix**: Add `await` before `cookies()` in Server Components

### Framer Motion Peer Dep Warning
```
peer dep warning for react@19
```
**Fix**: Normal - we have overrides in package.json. Ignore it.

### RLS Policy Denials
```
Error: new row violates row-level security policy
```
**Fix**: Check that your user ID is being passed correctly to Supabase

### Hydration Mismatch
```
Hydration failed because...
```
**Fix**: Use `dynamic(() => import(...), { ssr: false })` for components with random values

## 9. Deployment (Future)

- Production build: `npm run build`
- Deploy to Vercel: `vercel deploy`
- Database: Supabase handles backups automatically
- n8n: Self-host or use cloud version

## 10. Next Steps

1. ✅ Implement authentication pages (JUST DONE)
   - Login: http://localhost:3000/login
   - Register: http://localhost:3000/register
   - Protected: http://localhost:3000/dashboard
   
2. ⏳ Create dashboard layout (Phase 2B - PARALLEL)
3. ⏳ Build leads management UI
4. ⏳ Configure n8n workflows
5. ⏳ Add project management features
6. ⏳ Implement analytics dashboard

**See [AUTH_GUIDE.md](AUTH_GUIDE.md) for authentication testing & troubleshooting**
