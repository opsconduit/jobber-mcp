# Install Guide

This guide is for a customer-hosted OpsConduit Jobber MCP install. The connector is read-only by default and stores Jobber tokens on the machine running the MCP server.

## Requirements

- Node.js 20 or newer
- A Jobber account with permission to authorize apps
- A local MCP client that can run a stdio server
- Jobber app client ID and client secret

## Setup

```bash
git clone https://github.com/opsconduit/jobber-mcp.git
cd jobber-mcp
npm install
cp .env.example .env
```

Edit `.env`:

```bash
JOBBER_CLIENT_ID=your_client_id
JOBBER_CLIENT_SECRET=your_client_secret
JOBBER_REDIRECT_URI=http://localhost:3333/oauth/callback
JOBBER_TOKEN_STORE=.opsconduit/jobber-tokens.json
```

Run the local OAuth helper:

```bash
npm run auth
```

Open the URL printed by the helper, authorize the app in Jobber, and let the browser return to `http://localhost:3333/oauth/callback`.

Start the MCP server:

```bash
npm start
```

## MCP Client Config

Use this shape for MCP clients that accept a stdio server config:

```json
{
  "mcpServers": {
    "opsconduit-jobber": {
      "command": "node",
      "args": ["C:/path/to/jobber-mcp/src/server.js"],
      "env": {
        "JOBBER_CLIENT_ID": "your_client_id",
        "JOBBER_CLIENT_SECRET": "your_client_secret",
        "JOBBER_REDIRECT_URI": "http://localhost:3333/oauth/callback",
        "JOBBER_TOKEN_STORE": "C:/path/to/jobber-mcp/.opsconduit/jobber-tokens.json"
      }
    }
  }
}
```

## Validation

After setup, run these MCP tools:

1. `jobber_account`
2. `jobber_clients_sample`

If both return data, the install can read from Jobber.

## Safety

- Mutations are blocked by default.
- Tokens are stored locally in `.opsconduit/jobber-tokens.json`.
- Do not paste Jobber tokens into email, GitHub issues, or chat tools.
- Do not enable write access unless there is a separate written scope.
