# Raindrop MCP Server Setup Guide

This guide explains how to connect to your deployed Raindrop MCP server at `https://web-production-46ceb.up.railway.app`.

## Quick Start

Your server is live and ready to use! Here are the connection details:

- **Server URL**: `https://web-production-46ceb.up.railway.app`
- **MCP Endpoint**: `https://web-production-46ceb.up.railway.app/mcp`
- **Health Check**: `https://web-production-46ceb.up.railway.app/health`

## Prerequisites

- A Raindrop.io account with an API access token
- The `RAINDROP_ACCESS_TOKEN` must be set in Railway (already configured)

## Connection Methods

### Method 1: Claude Desktop (Recommended)

1. **Locate your Claude Desktop config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Edit the config file** and add:

```json
{
  "mcpServers": {
    "raindrop": {
      "url": "https://web-production-46ceb.up.railway.app/mcp",
      "transport": "http"
    }
  }
}
```

3. **Restart Claude Desktop** to load the new configuration.

4. **Verify connection**: Ask Claude to list available tools or resources from Raindrop.

### Method 2: Cursor IDE

1. **Open Cursor Settings** (Cmd/Ctrl + ,)

2. **Navigate to MCP Settings** or edit your MCP config file:
   - Location: `~/.cursor/mcp.json` or in Cursor settings

3. **Add configuration**:

```json
{
  "mcpServers": {
    "raindrop": {
      "url": "https://web-production-46ceb.up.railway.app/mcp",
      "transport": "http"
    }
  }
}
```

4. **Restart Cursor** to apply changes.

### Method 3: MCP Inspector (Testing & Debugging)

Use the MCP Inspector to test and explore the server interactively:

```bash
npx @modelcontextprotocol/inspector https://web-production-46ceb.up.railway.app/mcp
```

This will:
- Open a web interface at `http://localhost:5173`
- Allow you to test all tools and resources
- Show real-time protocol messages
- Help debug any connection issues

### Method 4: Direct HTTP API

For programmatic access, you can make direct HTTP requests:

#### Initialize Session

```bash
curl -X POST https://web-production-46ceb.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "my-client",
        "version": "1.0.0"
      }
    }
  }'
```

#### List Available Tools

```bash
curl -X POST https://web-production-46ceb.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "MCP-Session-Id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list",
    "params": {}
  }'
```

**Note**: The server uses Server-Sent Events (SSE) for responses, so responses come as `event: message` followed by `data: {...}`.

## Available Tools

Once connected, you'll have access to these tools:

### Collections
- `collection_list` - List all collections
- `collection_manage` - Create, update, or delete collections

### Bookmarks
- `bookmark_search` - Search bookmarks with filters
- `bookmark_manage` - Create, update, or delete bookmarks
- `getRaindrop` - Fetch single bookmark by ID (legacy)
- `listRaindrops` - List bookmarks for collection (legacy)
- `bulk_edit_raindrops` - Bulk update bookmarks

### Tags
- `tag_manage` - Rename, merge, or delete tags

### Highlights
- `highlight_manage` - Create, update, or delete highlights

### Diagnostics
- `diagnostics` - Server diagnostic information

## Available Resources

Access these resources via MCP resource URIs:

### Static Resources
- `mcp://user/profile` - User account information
- `diagnostics://server` - Server diagnostics and environment info

### Dynamic Resources
- `mcp://collection/{id}` - Access any Raindrop collection by ID
- `mcp://raindrop/{id}` - Access any Raindrop bookmark by ID

## Testing Your Connection

### 1. Health Check

Visit in your browser:
```
https://web-production-46ceb.up.railway.app/health
```

Should return server status and active sessions.

### 2. Documentation

Visit:
```
https://web-production-46ceb.up.railway.app/
```

Shows server information and available endpoints.

### 3. MCP Inspector Test

Run:
```bash
npx @modelcontextprotocol/inspector https://web-production-46ceb.up.railway.app/mcp
```

Then in the web UI:
- Click "Initialize" to establish connection
- Browse available tools
- Test tool calls
- View resources

## Troubleshooting

### Connection Issues

1. **Verify server is running:**
   ```bash
   curl https://web-production-46ceb.up.railway.app/health
   ```

2. **Check Railway logs:**
   - Go to Railway dashboard
   - Click on your service
   - View "Deployments" → "View Logs"

3. **Verify environment variable:**
   - In Railway: Settings → Variables
   - Ensure `RAINDROP_ACCESS_TOKEN` is set

### Authentication Errors

If you see authentication errors:
- Verify `RAINDROP_ACCESS_TOKEN` is valid
- Check token hasn't expired (Raindrop tokens don't expire, but can be regenerated)
- Ensure token has proper permissions (read/write)

### MCP Client Not Connecting

1. **Check URL format:**
   - Must use `https://` (not `http://`)
   - Must include `/mcp` endpoint
   - No trailing slash

2. **Verify transport type:**
   - Use `"transport": "http"` for HTTP-based clients
   - Some clients may use `"transport": "sse"` for Server-Sent Events

3. **Check client logs:**
   - Claude Desktop: Check console output
   - Cursor: Check developer console or logs

## Example Usage

### In Claude Desktop

Once connected, you can ask Claude:

- "List my Raindrop collections"
- "Search for bookmarks tagged with 'work'"
- "Create a new bookmark for https://example.com"
- "Show me highlights from my reading collection"
- "What are my most recent bookmarks?"

### In Cursor

The MCP server will be available to Cursor's AI assistant, allowing it to:
- Access your bookmarks
- Search and filter bookmarks
- Manage collections
- Work with highlights

## Advanced Configuration

### Custom Domain (Optional)

If you want a custom domain:

1. In Railway: Settings → Domains
2. Add your custom domain
3. Update MCP client configs with new URL

### Environment Variables

The server uses these environment variables (configured in Railway):

- `RAINDROP_ACCESS_TOKEN` (required) - Your Raindrop.io API token
- `PORT` (auto-set by Railway) - Server port
- `LOG_LEVEL` (optional) - Logging level (default: `info`)
- `NODE_ENV` (optional) - Environment mode (default: `production`)

## Security Notes

- The server uses your `RAINDROP_ACCESS_TOKEN` to access Raindrop.io
- All requests go through your account
- The server is publicly accessible - anyone with the URL can connect
- Consider adding authentication if you want to restrict access
- Railway provides HTTPS automatically

## Support

- **Server Status**: Check `/health` endpoint
- **Documentation**: See `README.md` for full feature list
- **Issues**: Open an issue on GitHub: https://github.com/codester1000/raindrop-mcp

## Next Steps

1. ✅ Server is deployed and running
2. ✅ Configure your MCP client (Claude Desktop, Cursor, etc.)
3. ✅ Test connection with MCP Inspector
4. ✅ Start using Raindrop tools in your AI assistant!

Enjoy your Raindrop MCP server! 🎉

