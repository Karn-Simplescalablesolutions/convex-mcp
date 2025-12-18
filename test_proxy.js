#!/usr/bin/env node
const { spawn } = require('child_process');
const readline = require('readline');

// Start the proxy
const proxy = spawn('node', ['mcp-proxy.js'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    env: {
        ...process.env,
        CONVEX_URL: process.env.CONVEX_URL,
        CONVEX_DEPLOY_KEY: process.env.CONVEX_DEPLOY_KEY,
        CONVEX_ADMIN_KEY: process.env.CONVEX_ADMIN_KEY
    }
});

const rl = readline.createInterface({
    input: proxy.stdout,
    terminal: false
});

let messageId = 0;

// Listen for responses
rl.on('line', (line) => {
    try {
        const response = JSON.parse(line);
        console.log('Response:', JSON.stringify(response, null, 2));
    } catch (e) {
        console.log('Non-JSON output:', line);
    }
});

// Send initialize message
const initMsg = {
    jsonrpc: "2.0",
    id: messageId++,
    method: "initialize",
    params: {
        protocolVersion: "2025-06-18",
        capabilities: { tools: {} },
        clientInfo: { name: "test-client", version: "1" }
    }
};

setTimeout(() => {
    console.log('Sending initialize...');
    proxy.stdin.write(JSON.stringify(initMsg) + '\n');

    // After initialization, send tables tool call
    setTimeout(() => {
        const tablesMsg = {
            jsonrpc: "2.0",
            id: messageId++,
            method: "tools/call",
            params: {
                name: "tables",
                arguments: {
                    deploymentSelector: "{}"
                }
            }
        };
        console.log('Sending tables call...');
        proxy.stdin.write(JSON.stringify(tablesMsg) + '\n');

        // Exit after 5 seconds
        setTimeout(() => {
            console.log('Test complete, exiting...');
            proxy.kill();
            process.exit(0);
        }, 5000);
    }, 2000);
}, 1000);

proxy.on('exit', (code) => {
    console.log('Proxy exited with code:', code);
    process.exit(code);
});
