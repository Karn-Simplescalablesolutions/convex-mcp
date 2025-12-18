#!/usr/bin/env node
const { spawn, exec } = require('child_process');
const readline = require('readline');

// Start the MCP server without forcing project-dir
// This allows it to run in "stateless" mode where it provides the tool definitions (list, run, etc.)
// but we intercept the actual execution that requires auth/context.
const child = spawn('npx', ['convex', 'mcp', 'start'], {
    stdio: ['pipe', 'pipe', process.stderr]
});

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
});

rl.on('line', (line) => {
    try {
        const msg = JSON.parse(line);

        // Intercept 'status' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'status') {
            const mockResponse = {
                jsonrpc: "2.0",
                id: msg.id,
                result: {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            availableDeployments: [{
                                kind: "prod",
                                deploymentSelector: "custom:prod",
                                url: process.env.CONVEX_URL || "https://deployed.convex.cloud",
                            }]
                        })
                    }]
                }
            };
            process.stdout.write(JSON.stringify(mockResponse) + '\n');
            return;
        }

        // Intercept 'run' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'run') {
            const args = msg.params.arguments;
            const funcName = args.functionName;
            const funcArgs = args.args || "{}";

            // Execute via npx convex run which handles CONVEX_DEPLOY_KEY correctly
            // Args are passed as a positional parameter, not a flag
            const cmd = `npx convex run ${funcName} '${funcArgs}'`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
                    // If execution fails, return error as text (so n8n sees it)
                    resultText = `Error: ${error.message}\nStderr: ${stderr}`;
                    process.stdout.write(JSON.stringify({
                        jsonrpc: "2.0",
                        id: msg.id,
                        result: {
                            content: [{ type: "text", text: resultText }],
                            isError: true
                        }
                    }) + '\n');
                } else {
                    process.stdout.write(JSON.stringify({
                        jsonrpc: "2.0",
                        id: msg.id,
                        result: {
                            content: [{ type: "text", text: resultText }]
                        }
                    }) + '\n');
                }
            });
            return;
        }

        // Forward everything else to child
        const output = JSON.stringify(msg) + '\n';
        child.stdin.write(output);
    } catch (e) {
        // console.error("Proxy error:", e);
    }
});

// Pipe child output back to stdout (for initialization, tools/list, etc.)
child.stdout.on('data', (data) => {
    process.stdout.write(data);
});

child.on('exit', (code) => {
    process.exit(code);
});

// Handle errors
child.on('error', (err) => {
    console.error('Failed to start child process:', err);
    process.exit(1);
});
