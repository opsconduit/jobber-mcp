import http from "node:http";
import { buildAuthorizationUrl, exchangeAuthorizationCode } from "./jobber.js";
import { config } from "./config.js";

const port = Number(new URL(config.redirectUri).port || 3333);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname === "/oauth/start") {
    const auth = buildAuthorizationUrl({ redirectUri: config.redirectUri });
    return sendText(res, 200, `Open this URL in a browser signed in to Jobber:\n\n${auth.url}\n\nState: ${auth.state}\n`);
  }

  if (url.pathname === "/oauth/callback") {
    const code = url.searchParams.get("code");
    if (!code) return sendText(res, 400, "Missing code in callback URL.");

    try {
      await exchangeAuthorizationCode({ code, redirectUri: config.redirectUri });
      return sendText(res, 200, "OpsConduit Jobber MCP is authorized. You can close this tab.");
    } catch (error) {
      return sendText(res, 500, `Authorization failed: ${error.message}`);
    }
  }

  return sendText(res, 404, "Not found. Use /oauth/start to begin.");
});

server.listen(port, "127.0.0.1", () => {
  const auth = buildAuthorizationUrl({ redirectUri: config.redirectUri });
  console.log(`OAuth helper listening at http://127.0.0.1:${port}`);
  console.log("Open this URL in a browser signed in to Jobber:");
  console.log(auth.url);
});

function sendText(res, status, body) {
  res.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  res.end(body);
}
