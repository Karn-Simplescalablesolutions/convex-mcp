# Convex MCP Server for Railway

MCP (Model Context Protocol) server for Convex, designed to be deployed on Railway and used with n8n.

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set environment variables
export CONVEX_URL="https://your-deployment.convex.cloud"
export CONVEX_DEPLOY_KEY="prod:your-project|your-key"

# Start the server
npm start
```

The server will be available at `http://localhost:8080`.

### Railway Deployment

1. **Connect your GitHub repository** to Railway

2. **Set environment variables** in Railway dashboard:
   ```
   CONVEX_URL=https://your-deployment.convex.cloud
   CONVEX_DEPLOY_KEY=prod:your-project|your-deploy-key
   ```

3. **Deploy** - Railway will automatically build and deploy

4. **Get your Railway URL** - Use this in your n8n MCP client configuration

### n8n Configuration

In your n8n workflow, configure the MCP client node:

- **SSE Endpoint**: `https://your-railway-app.railway.app/sse`
- **Message Endpoint**: `https://your-railway-app.railway.app/message`
- **API Key**: `test` (as configured in package.json)

## Architecture

```
n8n MCP Client
    ↓ (HTTP/SSE)
Railway (supergateway)
    ↓ (stdio)
mcp-proxy.js (intercepts tool calls)
    ↓ (spawns processes)
npx convex CLI commands
    ↓ (uses env vars)
Convex Deployment
```

## Available Tools

The following Convex MCP tools are supported:

- `status` - Get deployment status
- `tables` - List all tables
- `data` - Query table data
- `functionSpec` - List function metadata
- `run` - Execute Convex functions
- `logs` - Fetch execution logs
- `envList`, `envGet`, `envSet`, `envRemove` - Manage environment variables

## How It Works

The `mcp-proxy.js` intercepts MCP tool calls and executes them using the Convex CLI, which automatically uses the `CONVEX_DEPLOY_KEY` and `CONVEX_URL` environment variables for authentication.

This solves the "Not Authorized" error that occurs when the Convex MCP server tries to authenticate without credentials.

## Troubleshooting

### "Not Authorized" Error

- Verify `CONVEX_URL` and `CONVEX_DEPLOY_KEY` are set correctly in Railway
- Check that your deploy key has the correct permissions
- Ensure the URL matches your actual Convex deployment

### Connection Issues

- Verify Railway deployment is running
- Check Railway logs for errors
- Test the SSE endpoint directly: `curl https://your-app.railway.app/sse`

## Files

- `mcp-proxy.js` - Proxy that intercepts MCP tool calls
- `package.json` - Dependencies and start script
- `Dockerfile` - Container configuration for Railway
- `convex/` - Your Convex functions and schema

## License

MIT
