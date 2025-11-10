#!/usr/bin/env node

/**
 * Production entry point for dashboard server
 * Used by Railway, Cloud Run, etc.
 */

import { DashboardServer } from './server.js';

const port = parseInt(process.env.PORT || '3000', 10);
const outputDir = process.env.OUTPUT_DIR || './output';

const server = new DashboardServer(port, outputDir);
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

