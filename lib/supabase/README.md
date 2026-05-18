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

## Account auth (magic link)

1. Supabase Dashboard → **Authentication** → enable **Email** provider.
2. **URL configuration** → add redirect: `https://premiumpeptideslab.online/auth/callback` (and `http://localhost:3001/auth/callback` for local dev if needed).
3. Run `supabase/get_customer_orders_rpc.sql` in the SQL Editor (order history RPC).

Sign-in uses `signInWithOtp`; orders match `orders.contact_email` to the signed-in email (same as legacy `get_public_order` email gate).
