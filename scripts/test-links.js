#!/usr/bin/env node
/**
 * Link checker — starts the preview server, crawls all pages for broken links,
 * then shuts the server down.
 * Run via: npm run test:links (build first with npm run build)
 */

import { spawn } from 'child_process';

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;

function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const timeout = setTimeout(() => reject(new Error('Server start timeout')), 15000);

    const onData = (data) => {
      if (data.toString().includes(String(PORT))) {
        clearTimeout(timeout);
        resolve(server);
      }
    };

    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    server.on('error', reject);
  });
}

function runLinkinator() {
  return new Promise((resolve) => {
    const proc = spawn(
      'npx',
      [
        'linkinator', BASE,
        '--recurse',
        '--skip', 'mailto:|tel:|linkedin\\.com|googletagmanager\\.com|google-analytics\\.com',
        '--format', 'text',
      ],
      { stdio: 'inherit' }
    );
    proc.on('close', (code) => resolve(code));
  });
}

console.log('\x1b[36mStarting preview server…\x1b[0m');
let server;
try {
  server = await startServer();
  console.log(`\x1b[36mCrawling ${BASE} for broken links…\x1b[0m\n`);
  const code = await runLinkinator();
  if (code === 0) {
    console.log('\n\x1b[32m✓ All links OK\x1b[0m');
  } else {
    console.error('\n\x1b[31m✗ Broken links found — see above\x1b[0m');
  }
  server.kill();
  process.exit(code ?? 0);
} catch (err) {
  console.error('\x1b[31mError:\x1b[0m', err.message);
  server?.kill();
  process.exit(1);
}
