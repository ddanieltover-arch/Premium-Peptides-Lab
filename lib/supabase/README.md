# Supabase (Premium Peptides Lab)

## Env

Copy [`.env.example`](../.env.example) → **`.env.local`** in this app root and set:

- `NEXT_PUBLIC_SUPABASE_URL` — e.g. `https://fwzantgfbvtfpzujgmjr.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Dashboard → **Settings → API** → anon public

Restart `npm run dev` after changing env.

## Smoke test

```bash
npm run db:smoke
```

Or while dev is running: [http://localhost:3000/api/health/supabase](http://localhost:3000/api/health/supabase)

## Clients

- `lib/supabase/client.ts` — Client Components
- `lib/supabase/server.ts` — Server Components / Route Handlers
