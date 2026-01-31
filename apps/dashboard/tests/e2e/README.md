# Playwright E2E

## Setup

- Set env vars for auth and base URL (dashboard assumed at :3001):
  - `E2E_EMAIL` and `E2E_PASSWORD` (real credentials)
  - optional: `E2E_BASE_URL` (default `http://localhost:3001`)
- Install: `npm install --legacy-peer-deps`
- Run tests: `npm run test:e2e`

## Notes
- Global setup logs in via UI and saves storage to `playwright/.auth/state.json`.
- Tests assume accessible labels for Email/Password and New Lead form fields.
- Drag uses mouse events against `data-column-id` and `data-lead-name` attributes added to Kanban.
