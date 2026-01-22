# Authentication Flow - Portfolio2

## 🔐 Architecture

```
Login/Register Form
    ↓
Server Action (auth.ts)
    ├─ Validate with Zod
    ├─ Supabase Auth sign up/in
    ├─ Create profile (register only)
    └─ Set JWT cookie
    ↓
Middleware
    ├─ Validates JWT token
    ├─ Refreshes if needed
    └─ Redirects to /login if expired
    ↓
Server Component
    ├─ Access user via getUser()
    ├─ Fetch profile from DB (RLS applied)
    └─ Return protected content
```

## 📝 Key Files

### Server Actions
- `src/actions/auth.ts`
  - `login()` - Email/password authentication
  - `register()` - Create account + profile
  - `logout()` - Sign out user
  - `getCurrentUser()` - Fetch user server-side (no state)

### Pages
- `src/app/(auth)/login/page.tsx` - Login form
- `src/app/(auth)/register/page.tsx` - Register form
- `src/app/(dashboard)/dashboard/page.tsx` - Protected route

### Components
- `src/components/auth/AuthForm.tsx` - Form wrapper + input fields
- `src/hooks/useUser.ts` - Client-side user context

### Security
- `src/middleware.ts` - JWT validation gate
- `src/lib/supabase/middleware.ts` - Session refresh logic

## 🔄 Flow Examples

### Login Flow
```typescript
// src/app/(auth)/login/page.tsx
<AuthForm action={login} />

// src/actions/auth.ts
export async function login(prevState, formData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({...});
  // On success: redirect to /dashboard
}
```

### Register Flow
```typescript
// src/app/(auth)/register/page.tsx
<AuthForm action={register} />

// src/actions/auth.ts
export async function register(prevState, formData) {
  const supabase = await createClient();
  
  // 1. Create user in auth.users
  const authData = await supabase.auth.signUp({...});
  
  // 2. Create profile in public.profiles (RLS allows it)
  await supabase.from('profiles').insert({...});
  
  // On success: redirect to /login
}
```

### Protected Server Component
```typescript
// src/app/(dashboard)/dashboard/page.tsx
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login'); // Middleware should catch this
  
  // RLS automatically filters by user ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return <Dashboard user={profile} />;
}
```

### Client-Side User Access (Optional)
```typescript
'use client';
import { useUser } from '@/hooks/useUser';

export function UserMenu() {
  const { user, loading } = useUser();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  
  return <span>{user.name}</span>;
}
```

## 🛡️ Security Rules

1. **No JWT in localStorage**: Cookies are httpOnly (secure)
2. **Middleware validates every request**: Redirects to /login if token expired
3. **RLS policies enforce access**: Database rejects queries from wrong user
4. **Server Actions only**: No client→n8n calls (credentials stay server-side)
5. **Zod validation**: All inputs validated before touching database

## 🧪 Testing Authentication

### 1. Register
1. Go to http://localhost:3000/register
2. Fill in name, email, password
3. Click "Sign Up"
4. Should redirect to /login

### 2. Login
1. Go to http://localhost:3000/login
2. Fill in email, password
3. Click "Sign In"
4. Should redirect to /dashboard

### 3. Protected Routes
1. Try accessing /dashboard without logging in
2. Should redirect to /login (via middleware)
3. After login, should see protected content

### 4. Logout
1. From /dashboard, click "Sign Out"
2. Should redirect to /
3. Try /dashboard again → redirects to /login

## ⚙️ Environment Setup

Before testing, ensure:

```bash
# 1. Create .env.local
cp .env.local.example .env.local

# 2. Fill in Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 3. Run schema.sql in Supabase console
# This creates profiles table and RLS policies
```

## 🚨 Common Issues

### "User not found after register"
- Check that schema.sql was executed
- Verify `public.profiles` table exists
- Check RLS policy allows insert from auth.users

### "Middleware redirect loop"
- Ensure /login and /register routes don't require auth
- Check middleware matcher excludes static files
- Verify JWT refresh is happening in middleware

### "RLS policy denies access"
- Make sure user_id matches auth.uid()
- Check that policy uses correct column name (should be `id` for profiles)
- Verify role is correct in profile

### "Form not submitting"
- Check browser console for errors
- Ensure Server Action imports are correct
- Verify useActionState is used (not deprecated useFormState)

## 🔮 Next Steps (Phase 2B)

- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add OAuth (Google, GitHub)
- [ ] Add 2FA
- [ ] Build dashboard layout
- [ ] Add user settings page
