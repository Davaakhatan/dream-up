#!/usr/bin/env node

/**
 * Production entry point for dashboard server
 * Used by Railway, Cloud Run, etc.
 */

import { DashboardServer } from './server.js';

const port = parseInt(process.env.PORT || '3000', 10);
const outputDir = process.env.OUTPUT_DIR || './output';

console.log('🚀 Starting Dashboard Server...');
console.log(`   PORT: ${port}`);
console.log(`   OUTPUT_DIR: ${outputDir}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

const server = new DashboardServer(port, outputDir);
server.start().catch((error) => {
  console.error('❌ Failed to start server:', error);
  console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
  process.exit(1);
});

