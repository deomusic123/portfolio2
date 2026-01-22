# ARCHITECTURE DECISION RECORD (ADR) - Portfolio2

**Title**: [Short title of the decision]

---

## Decision Overview

* **Status**: [Proposed | Accepted | Deprecated]
* **Date**: YYYY-MM-DD
* **Author**: [Name]
* **Affects**: [Components/Services impacted]

---

## Context (The "Wicked Problem")

Describe the problem that led to this decision:
- What was broken/inefficient/risky?
- Why was the status quo unsustainable?
- What constraints did we have? (React 19, Supabase RLS, etc.)

**Example:**
```
We were calling n8n webhooks directly from Client Components,
which exposed our n8n instance URL to the browser and created
race conditions if the user closed the tab before the request completed.
Also violated security rule: "No business logic on client."
```

---

## Decision

What is the proposed solution? Be specific and actionable.

**Example:**
```
Implement database-driven triggers using Supabase pg_net:
1. Client calls Server Action → insert to PostgreSQL
2. PostgreSQL trigger fires → calls n8n webhook via pg_net
3. n8n processes asynchronously → updates Supabase via SERVICE_ROLE
4. Dashboard polls RealtimeClient for updates

This ensures:
- Atomicity (automation only triggers if data saves)
- Security (n8n URL hidden from browser)
- Performance (user sees optimistic update immediately)
```

---

## Consequences

### Positive ✅
* ...
* ...

**Example:**
```
✅ Authentication: No secrets exposed to client
✅ Performance: User gets response instantly (optimistic updates)
✅ Atomicity: Lead only triggers automation if DB insert succeeds
✅ Scalability: n8n can handle complex workflows without blocking UI
```

### Negative (Trade-offs) ⚠️
* ...
* ...

**Example:**
```
⚠️ Complexity: Added pg_net trigger + RLS policies (learning curve)
⚠️ Latency: Lead enrichment happens async (user must refresh to see updates)
⚠️ Debugging: Harder to trace errors across 3 systems (Next.js, Supabase, n8n)
```

---

## Alternatives Considered

### Option A: [Alternative name]
**Pros**: ...
**Cons**: ...
**Why rejected**: ...

### Option B: [Alternative name]
**Pros**: ...
**Cons**: ...
**Why rejected**: ...

---

## Implementation Notes

- [ ] Code changes needed
- [ ] Database migrations required
- [ ] Documentation updates
- [ ] Testing strategy
- [ ] Rollout plan

---

## References

- Related ADRs: [List related decisions if any]
- External docs: [Relevant links]
- Code examples: [Point to code files if applicable]

---

## Review & Approval

- [ ] Tech lead approved
- [ ] Architecture reviewed
- [ ] Security signed off

---

# QUICK ADR EXAMPLES FOR REFERENCE

## ADR-001: React 19 RC & Framer Motion v12

* **Status**: Accepted
* **Date**: 2024-01-15
* **Context**: Next.js 15 uses React 19 RC. Stable Framer Motion (v11) breaks with peer dependency errors.
* **Decision**: Use Framer Motion v12 Alpha and add `overrides` in `package.json` to force React 19 resolution.
* **Implication**: DO NOT REMOVE overrides. New dependencies may require version bumps.

---

## ADR-002: Tailwind v4 Hybrid Config

* **Status**: Accepted
* **Date**: 2024-01-15
* **Context**: Aceternity UI needs JS access to theme colors (`flattenColorPalette`). Tailwind v4 uses CSS-only config.
* **Decision**: Maintain minimal `tailwind.config.ts` ONLY for `addVariablesForColors` plugin. All other styles go to `globals.css`.
* **Consequences**: Dual config requires careful management, but ensures Aceternity compatibility.

---

## ADR-003: Async Cookies

* **Status**: Accepted
* **Date**: 2024-01-15
* **Context**: Next.js 15 made `cookies()` async. Legacy synchronous patterns break.
* **Decision**: All access to cookies must be awaited. `const cookieStore = await cookies()` in Server Components and Actions.
* **Implication**: Cannot use cookies synchronously. Middleware must handle async session refresh.
