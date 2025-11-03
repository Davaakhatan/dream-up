/**
 * Web dashboard server for viewing test results
 */

import express from 'express';
import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DashboardServer {
  private app: express.Application;
  private port: number;
  private outputDir: string;

  constructor(port: number = 3000, outputDir: string = './output') {
    this.app = express();
    this.port = port;
    this.outputDir = resolve(outputDir);

    this.app.use(express.json());

    // Serve dashboard HTML
    const publicDir = join(__dirname, 'public');
    this.app.get('/', (req, res) => {
      res.sendFile(join(publicDir, 'index.html'));
    });
    
    // Serve static assets from public directory
    this.app.use('/static', express.static(publicDir));

    // API: Get all reports
    this.app.get('/api/reports', async (req, res) => {
      try {
        if (!existsSync(this.outputDir)) {
          return res.json([]);
        }

        const files = await readdir(this.outputDir);
        const reportFiles = files.filter((f) => f.startsWith('report-') && f.endsWith('.json'));

        const reports = await Promise.all(
          reportFiles.map(async (file) => {
            try {
              const content = await readFile(join(this.outputDir, file), 'utf-8');
              const report = JSON.parse(content);
              return {
                ...report,
                filename: file,
              };
            } catch (error) {
              return null;
            }
          })
        );

        res.json(reports.filter((r) => r !== null).reverse()); // Most recent first
      } catch (error) {
        res.status(500).json({ error: 'Failed to load reports' });
      }
    });

    // API: Get single report
    this.app.get('/api/reports/:filename', async (req, res) => {
      try {
        const filename = req.params.filename;
        const content = await readFile(join(this.outputDir, filename), 'utf-8');
        const report = JSON.parse(content);
        res.json(report);
      } catch (error) {
        res.status(404).json({ error: 'Report not found' });
      }
    });

    // API: Get screenshot
    this.app.get('/api/screenshots/:filename', async (req, res) => {
      try {
        const filename = req.params.filename;
        const screenshotPath = join(this.outputDir, 'screenshots', filename);
        res.sendFile(screenshotPath);
      } catch (error) {
        res.status(404).json({ error: 'Screenshot not found' });
      }
    });
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`\n${'═'.repeat(60)}`);
        console.log(`📊 Dashboard running at:`);
        console.log(`   ${'→'.repeat(2)} http://localhost:${this.port}`);
        console.log(`${'═'.repeat(60)}\n`);
        resolve();
      });
    });
  }

  stop(): void {
    // Express doesn't have a built-in stop method
    // In production, you'd want to store the server instance
  }
}

