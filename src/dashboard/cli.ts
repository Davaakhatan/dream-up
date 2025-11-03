#!/usr/bin/env node

/**
 * Standalone dashboard CLI entry point
 */

import { DashboardServer } from './server.js';
import { CLIUI } from '../utils/cli-ui.js';

const port = parseInt(process.env.PORT || '3000', 10);
const outputDir = process.env.OUTPUT_DIR || './output';

CLIUI.banner();

CLIUI.section('Starting Dashboard');
CLIUI.info(`Port: ${port}`);
CLIUI.info(`Reports directory: ${outputDir}`);

const server = new DashboardServer(port, outputDir);
server.start().then(() => {
  // Keep process alive
  process.on('SIGINT', () => {
    CLIUI.info('\nShutting down dashboard...');
    process.exit(0);
  });
});

