# Contact delivery setup

The form posts JSON to `/api/contact`. The shared Node handler in `server/contact.cjs` validates the submission and sends a plain-text email using the [Resend HTTP API](https://resend.com/docs/api-reference/emails/send-email). `api/contact.js` deploys that handler as a Vercel function; `server/index.js` exposes the same handler in the existing Express server. No email SDK or new runtime dependency is needed. Use Node 20 or newer.

## Recommended deployment: Vercel

1. Import this repository in Vercel using the included Vite configuration and `docs` output directory. Vercel detects `api/contact.js` as the server function.
2. Create a Resend API key with sending access and verify a sending domain in Resend. Set a sender on that domain. Resend test-mode restrictions still apply until the account/domain is ready.
3. Add these **server-side** project environment variables, for the environments you actually deploy:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Your private Resend sending key |
   | `CONTACT_TO_EMAIL` | The private inbox that receives all submissions |
   | `CONTACT_FROM_EMAIL` | Verified sender, e.g. `Portfolio <contact@your-domain.example>` |
   | `CONTACT_ALLOWED_ORIGINS` | Comma-separated exact browser origins, e.g. `https://your-domain.example` |

4. Leave the public `VITE_CONTACT_API_URL` unset for same-origin Vercel hosting, then deploy/redeploy. Secrets must never use a `VITE_` prefix. The browser bundle contains neither the recipient nor the provider key.
5. Submit a real message from the deployed form and check the recipient inbox and Resend delivery events. Automated tests replace provider fetch and send no real messages. A successful API receipt confirms provider acceptance; it does not establish final inbox delivery.

The handler trusts only explicit valid origins plus HTTPS deployment origins derived from Vercel's server-owned `VERCEL_URL` and `VERCEL_PROJECT_PRODUCTION_URL`. It never derives permission from the incoming `Host` header, uses wildcard subdomain matching, or accepts requests without an Origin header. Add custom domains explicitly. No cookies or browser credentials are required.

## GitHub Pages

GitHub Pages is static hosting and **cannot execute** `api/contact.js` or Express. To keep that frontend, deploy the API separately to Vercel or a Node host, set `VITE_CONTACT_API_URL=https://your-api.example/api/contact` at frontend build time, and include the exact Pages origin (`https://your-user.github.io`, without the repository path) in the API's `CONTACT_ALLOWED_ORIGINS`. The existing GitHub Pages workflow must receive this public build variable before rebuilding; it does not deploy the backend.

Without a working endpoint/configuration, the form reports an unavailable/network state and preserves the visitor's message. It never reports simulated success or opens a mail app.

## Local development with the existing Express server

1. Copy `server/.env.example` to `server/.env`, set the private server values, and include `http://localhost:5173` in the allowed origins. Existing `server/.env.dev` values take precedence if present; shell environment values take precedence over both files.
2. Run `npm ci --prefix server` once, then `npm start --prefix server`.
3. In the project root, copy `.env.example` to `.env.local` and set `VITE_CONTACT_API_URL=http://localhost:3001/api/contact`.
4. Run `npm run dev`. Restart Vite after changing browser environment variables.

Express uses the socket IP for throttling and intentionally ignores untrusted forwarded headers. Behind a reverse proxy, all traffic may share one bucket; configure IP handling only at a trusted infrastructure boundary before relying on per-visitor limits. The Vercel adapter uses the platform-managed forwarded IP header.

## Validation, abuse handling, and failure behavior

- Name: 2–100 characters; email: valid syntax and at most 254; subject: 3–160; message: 10–5,000. Leading/trailing whitespace is removed server-side. Header fields reject control characters. Only the server-configured recipient receives messages; visitor email is used solely as a validated `reply_to`.
- JSON only, honeypot rejection, a bounded request payload, and an exact Origin allowlist. Field errors are localized in the browser. CORS is a browser boundary, not authentication: a non-browser attacker can forge an Origin.
- Five attempts per IP per 15 minutes. The bounded, in-memory map is **per process/function instance**, resets on restart/cold start, and is not a distributed abuse guarantee. Add a hosting WAF/shared rate limiter for higher exposure, monitor provider usage, and set provider account limits. The built-in limiter does not claim to provide global protection across Vercel replicas.
- Provider request aborts after eight seconds. Provider rejection, network failure, missing configuration, malformed success receipt, or timeout is a visible failure. No provider response, secret, private address, or submitted message is returned to the browser or logged by the handler.
- Sending disables the form and synchronously guards duplicate clicks. Fields clear only after an explicit success receipt and remain on failure. A timeout can mean delivery is uncertain; avoid immediate repeated retries and check the recipient/provider dashboard during testing.

## Verification

Run `node --test server/contact.test.cjs server/contact-adapter.test.mjs src/lib/contact.test.js` or `npm test --prefix server`. Tests cover delivery payload, fixed recipient, reply address, server timestamp and submitted origin, validation, exact deployment origins/preflight, rate limiting/expiry, honeypot, configuration, provider failures/timeouts, Vercel malformed-JSON getter handling, and static-host frontend failure handling. These tests use injected provider responses and do not need credentials.

No live contact credentials were configured or used during implementation. To enable actual delivery, the owner must supply the server variables above and verify a real deployed submission.
