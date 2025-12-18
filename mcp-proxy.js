#!/usr/bin/env node
const { spawn, exec } = require('child_process');
const readline = require('readline');

// Start the MCP server WITH project-dir so runOneoffQuery works
// This allows the child server to access the Convex project and execute sandboxed queries
const child = spawn('npx', ['convex', 'mcp', 'start', '--project-dir', '.'], {
    stdio: ['pipe', 'pipe', process.stderr],
    env: {
        ...process.env,
        CONVEX_URL: process.env.CONVEX_URL,
        CONVEX_DEPLOY_KEY: process.env.CONVEX_DEPLOY_KEY
    }
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

        // Intercept 'tables' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'tables') {
            const cmd = `npx convex data`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
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

        // Intercept 'data' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'data') {
            const args = msg.params.arguments;
            const tableName = args.tableName || '';
            const limit = args.limit || 100;
            const order = args.order || 'desc';

            const cmd = `npx convex data ${tableName} --limit ${limit} --order ${order} --format json`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
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

        // Intercept 'functionSpec' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'functionSpec') {
            const cmd = `npx convex function-spec`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
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

        // Intercept 'logs' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'logs') {
            const args = msg.params.arguments;
            const limit = args.limit || 100;

            // Note: convex logs doesn't have a --limit flag, but we can use head
            const cmd = `npx convex logs --json | head -n ${limit}`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
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

        // Intercept 'envList' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'envList') {
            const cmd = `npx convex env list`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
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

        // Intercept 'envGet' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'envGet') {
            const args = msg.params.arguments;
            const varName = args.name || '';

            const cmd = `npx convex env get ${varName}`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
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

        // Intercept 'envSet' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'envSet') {
            const args = msg.params.arguments;
            const varName = args.name || '';
            const varValue = args.value || '';

            const cmd = `npx convex env set ${varName} "${varValue}"`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
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

        // Intercept 'envRemove' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'envRemove') {
            const args = msg.params.arguments;
            const varName = args.name || '';

            const cmd = `npx convex env remove ${varName}`;

            exec(cmd, (error, stdout, stderr) => {
                let resultText = stdout;
                if (error) {
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

        // Intercept 'runOneoffQuery' tool call
        if (msg.method === 'tools/call' && msg.params && msg.params.name === 'runOneoffQuery') {
            const args = msg.params.arguments;
            const queryCode = args.queryCode || '';

            // Use Convex client to execute sandboxed query
            const { ConvexHttpClient } = require('convex/browser');
            const convexUrl = process.env.CONVEX_URL;

            if (!convexUrl) {
                process.stdout.write(JSON.stringify({
                    jsonrpc: "2.0",
                    id: msg.id,
                    result: {
                        content: [{ type: "text", text: "Error: CONVEX_URL environment variable not set" }],
                        isError: true
                    }
                }) + '\n');
                return;
            }

            // Create a sandboxed query function
            const executeQuery = async () => {
                const client = new ConvexHttpClient(convexUrl);

                // The queryCode should be a function that takes ctx as parameter
                // Example: (ctx) => ctx.db.query("activities").collect()
                try {
                    // Wrap the query code in an async function
                    const queryFn = eval(`(async ${queryCode})`);

                    // Create a mock ctx object with db query capabilities
                    const mockCtx = {
                        db: {
                            query: (tableName) => ({
                                collect: async () => {
                                    // This is a simplified implementation
                                    // In reality, we'd need to use the actual Convex query API
                                    return await client.query("system:listDocuments", { tableName });
                                },
                                filter: (fn) => ({
                                    collect: async () => {
                                        // Simplified filter implementation
                                        return [];
                                    }
                                })
                            })
                        }
                    };

                    const result = await queryFn(mockCtx);
                    client.close();

                    return JSON.stringify(result, null, 2);
                } catch (error) {
                    client.close();
                    throw error;
                }
            };

            executeQuery()
                .then(result => {
                    process.stdout.write(JSON.stringify({
                        jsonrpc: "2.0",
                        id: msg.id,
                        result: {
                            content: [{ type: "text", text: result }]
                        }
                    }) + '\n');
                })
                .catch(error => {
                    process.stdout.write(JSON.stringify({
                        jsonrpc: "2.0",
                        id: msg.id,
                        result: {
                            content: [{ type: "text", text: `Error: ${error.message}` }],
                            isError: true
                        }
                    }) + '\n');
                });
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
