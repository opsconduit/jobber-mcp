# OpsConduit Jobber MCP

Read-only MCP connector for Jobber field-service operations.

OpsConduit helps owners and operators ask practical questions about the tools that run their business. This first connector is for Jobber and is designed to stay read-only by default.

## What It Should Answer

- Which estimates need follow-up?
- Which invoices are overdue?
- Which jobs are unscheduled, stale, or blocked?
- Which customers have not had activity recently?
- What work needs attention this week?
- Where is operational follow-up leaking revenue?

## Product Posture

- Customer-hosted first.
- Read-only first.
- No credential custody required for the public repo.
- No autonomous writes in customer systems.
- No scraping private data.
- No fake claims, fake testimonials, or deceptive outreach.

## Launch Offer

Early-access pricing is documented in [docs/offer.md](docs/offer.md).

## Install

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
npm run auth
npm start
```

Fill `JOBBER_CLIENT_ID` and `JOBBER_CLIENT_SECRET` in `.env` before running the auth helper. The helper prints a Jobber OAuth URL, receives the local callback at `http://localhost:3333/oauth/callback`, and stores tokens in `.opsconduit/jobber-tokens.json`.

Detailed setup notes are in [docs/install.md](docs/install.md). Paid pilot validation steps are in [docs/pilot-checklist.md](docs/pilot-checklist.md).

## MCP Tools

- `jobber_auth_url` - build a Jobber OAuth URL.
- `jobber_exchange_code` - exchange an OAuth code and store local tokens.
- `jobber_refresh_token` - refresh the stored access token.
- `jobber_account` - validate the connected account.
- `jobber_clients_sample` - validate client read access.
- `jobber_graphql_read` - run a read-only GraphQL query; mutations are blocked by default.

## Policies

- [Terms of Service](docs/terms.md)
- [Privacy Policy](docs/privacy.md)

## Status

This repository is in early implementation. The first usable target is a customer-hosted MCP server with local OAuth setup and read-only Jobber GraphQL access.
