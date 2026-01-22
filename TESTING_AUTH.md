# Quick Auth Testing Checklist

**Test in this order:**

## 1️⃣ Setup
```bash
npm install
cp .env.local.example .env.local
# Fill .env.local with your Supabase credentials
npm run dev
```

## 2️⃣ Database
- [x] Go to Supabase console → SQL Editor
- [x] Run `docs/database/schema.sql`
- [x] Verify `public.profiles` table exists
- [x] Check RLS policies are enabled

## 3️⃣ Register Flow
- [x] Visit http://localhost:3000/register
- [x] Fill form: name, email, password (8+ chars)
- [x] Click "Sign Up"
- [x] Should redirect to /login
- [x] Check Supabase → Auth Users (new user should appear)
- [x] Check Supabase → profiles table (profile should be created)

## 4️⃣ Login Flow
- [x] Visit http://localhost:3000/login
- [x] Use credentials from step 3
- [x] Click "Sign In"
- [x] Should redirect to /dashboard
- [x] Should show user name, email, role

## 5️⃣ Protected Routes
- [x] From dashboard, right-click "Sign Out" → open in new tab
- [x] In original tab, manually visit http://localhost:3000/dashboard
- [x] Refresh page
- [x] Should still be logged in (middleware validates JWT)

## 6️⃣ Session Expiry (Manual)
- [x] Open browser DevTools → Application → Cookies
- [x] Find `sb-*-auth-token` cookie
- [x] Delete it
- [x] Refresh /dashboard
- [x] Should redirect to /login (middleware detected missing token)

## 7️⃣ Logout
- [x] Login again
- [x] Go to /dashboard
- [x] Click "Sign Out"
- [ ] Should redirect to /
- [ ] Try accessing /dashboard
- [ ] Should redirect to /login

## 8️⃣ Error Cases
- [ ] Register with existing email → should show error
- [ ] Login with wrong password → should show error
- [ ] Register with password < 8 chars → validation error
- [ ] Submit empty fields → validation error

---

## 🔍 Debugging

**Check browser console for:**
- Network errors (failed API calls)
- Type errors (missing imports)
- Hydration mismatches

**Check server logs for:**
- "Error: cookies is not a function" → missing await
- RLS policy denials → user_id mismatch
- Auth errors → check Supabase credentials in .env.local

**Check Supabase logs:**
- Supabase console → Logs
- Filter by auth events
- Look for signup/signin success/failures
