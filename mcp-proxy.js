#!/usr/bin/env node
const { spawn } = require('child_process');
const readline = require('readline');

// The real command to run
// We add --project-dir . to ensure context is correct
const child = spawn('npx', ['convex', 'mcp', 'start', '--project-dir', '.'], {
    stdio: ['pipe', 'pipe', process.stderr]
});

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
});

rl.on('line', (line) => {
    try {
        const msg = JSON.parse(line);

        // Filter out access_token from tools/call
        // This fixes the issue where n8n/LangChain sends a GHL token that confuses Convex
        if (msg.method === 'tools/call' && msg.params && msg.params.arguments) {
            if (msg.params.arguments.access_token) {
                // console.error('DEBUG: Sanitizing access_token from ' + msg.params.name);
                delete msg.params.arguments.access_token;
            }
        }

        const output = JSON.stringify(msg) + '\n';
        child.stdin.write(output);
    } catch (e) {
        // Fallback for non-JSON lines
        child.stdin.write(line + '\n');
    }
});

// Pipe child output back to stdout
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
