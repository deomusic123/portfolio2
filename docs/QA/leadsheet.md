# LeadSheet QA Checklist

## Functional
- [ ] Open from Kanban card → sheet appears, loading state visible, close works.
- [ ] Fields editable: suggested_action, next_follow_up_at, notes; save shows "Saved" and values persist after reload.
- [ ] AI draft: button shows only when ai_email_draft exists; copy works (verify paste) with feedback state.
- [ ] Pain points: chips render; empty shows "Sin pain points".
- [ ] Activities: list renders in order; empty shows "No activities yet".

## Error handling
- [ ] Simulated failure (e.g., offline or force action error) shows error banner; retry (or re-open) clears error.
- [ ] Unauthorized session does not expose other leads (RLS enforced); action returns Unauthorized.

## UX/Accessibility
- [ ] Focus trap: close on backdrop click and close button; tab order reaches Save/Close buttons.
- [ ] Scroll: long content scrolls inside sheet, background locked.
- [ ] Dates: next_follow_up_at uses `toLocaleString` output; visually acceptable.

## Integration
- [ ] Saving triggers revalidation and board reflects updated fields on reload.
- [ ] Copy AI draft + LeadCard copy produce consistent text.

## Regression
- [ ] Sheet open/close does not break DnD state or selections.
- [ ] No console errors in browser devtools while opening/saving.
