#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  buildAuthorizationUrl,
  exchangeAuthorizationCode,
  getAccount,
  getClientSample,
  jobberGraphql,
  refreshAccessToken
} from "./jobber.js";

const server = new McpServer({
  name: "opsconduit-jobber-mcp",
  version: "0.1.0"
});

server.registerTool(
  "jobber_auth_url",
  {
    title: "Build Jobber OAuth URL",
    description: "Build an authorization URL for a Jobber admin to connect this customer-hosted MCP server.",
    inputSchema: {
      redirectUri: z.string().url().optional(),
      state: z.string().min(8).optional()
    }
  },
  async ({ redirectUri, state }) => textResult(buildAuthorizationUrl({ redirectUri, state }))
);

server.registerTool(
  "jobber_exchange_code",
  {
    title: "Exchange Jobber OAuth Code",
    description: "Exchange a Jobber OAuth authorization code and store tokens locally.",
    inputSchema: {
      code: z.string().min(8),
      redirectUri: z.string().url().optional()
    }
  },
  async ({ code, redirectUri }) => textResult(await exchangeAuthorizationCode({ code, redirectUri }))
);

server.registerTool(
  "jobber_refresh_token",
  {
    title: "Refresh Jobber Token",
    description: "Refresh the locally stored Jobber access token.",
    inputSchema: {}
  },
  async () => textResult(await refreshAccessToken())
);

server.registerTool(
  "jobber_account",
  {
    title: "Get Jobber Account",
    description: "Return the connected Jobber account id and name.",
    inputSchema: {}
  },
  async () => textResult(await getAccount())
);

server.registerTool(
  "jobber_clients_sample",
  {
    title: "Sample Jobber Clients",
    description: "Return a small sample of Jobber clients for install validation.",
    inputSchema: {
      first: z.number().int().min(1).max(25).default(10)
    }
  },
  async ({ first }) => textResult(await getClientSample({ first }))
);

server.registerTool(
  "jobber_graphql_read",
  {
    title: "Run Read-Only Jobber GraphQL",
    description: "Run a read-only Jobber GraphQL query. Mutations are blocked by default.",
    inputSchema: {
      query: z.string().min(10),
      variables: z.record(z.string(), z.unknown()).optional()
    }
  },
  async ({ query, variables }) => textResult(await jobberGraphql({ query, variables: variables || {} }))
);

await server.connect(new StdioServerTransport());

function textResult(value) {
  return {
    content: [
      {
        type: "text",
        text: typeof value === "string" ? value : JSON.stringify(value, null, 2)
      }
    ]
  };
}
