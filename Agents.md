# Agents.md

Project rules for Codex work in this repo:

- Keep phase 2 environment and Doppler work in `src/lib/tracking/`, with shared env helpers in `src/lib/utils/` and shared env types in `src/types/`.
- Treat GTM Account ID `6346744109` and GA4 Account ID `389036374` as the project defaults for Kapten Batik tracking setup.
- Every new project must automatically create and use its own GTM container and GA4 property based on the project name `KaptenBatik`; do not assume a shared container or property.
- Keep all GTM/GA4 attribution capture, global install, and success-event helpers in `src/lib/tracking/`.
- Keep backend orchestration in `src/lib/backend/`, Supabase server access in `src/lib/supabase/`, Sheets integration in `src/lib/sheets/`, email integration in `src/lib/email/`, and WhatsApp helpers in `src/lib/whatsapp/`.
- Never hardcode secrets or API keys. Read them from `process.env` so Doppler-managed secrets work in local dev and deployment.
- Separate public `NEXT_PUBLIC_*` variables from server-only variables.
- Supabase is the source of truth. Google Sheets is a secondary sync target only.
- Use Google Sheets API directly. Do not add Google Apps Script.
- If env vars change, update `.env.example` and `scripts/verify-contact-env.mjs` together.
- Keep GTM/GA4 provisioning automation in `scripts/` and make it idempotent where practical.
- Prefer small, typed helpers over mixing env logic into pages or route handlers.
