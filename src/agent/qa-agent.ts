/**
 * Main QA Agent orchestrator
 */

import type { BrowserSession } from '../types/browser.js';
import type { QAConfig } from '../types/config.js';
import type { QAReport } from '../types/report.js';
import { InteractionEngine } from './interaction-engine.js';
import { EvidenceCapture } from './evidence-capture.js';
import { Evaluator } from './evaluator.js';

export class QAAgent {
  constructor(
    private session: BrowserSession,
    private config: QAConfig,
    private evidenceCapture: EvidenceCapture,
    private evaluator: Evaluator
  ) {}

  /**
   * Run complete QA test on a game URL
   */
  async testGame(gameUrl: string): Promise<QAReport> {
    const startTime = Date.now();
    let loadTime: number | undefined;

    try {
      // Initialize evidence capture
      await this.evidenceCapture.initialize();

      // Step 1: Load game
      const loadStart = Date.now();
      await this.loadGame(gameUrl);
      loadTime = Date.now() - loadStart;

      // Step 2: Capture initial state
      await this.evidenceCapture.captureScreenshot(this.session, 'initial-load');

      // Step 3: Wait for render
      await this.session.wait(this.config.timeouts.load * 1000);

      // Step 4: Try to detect and interact with common UI patterns
      const interactionEngine = new InteractionEngine(
        this.session,
        this.config.timeouts
      );
      
      try {
        await interactionEngine.detectAndInteract();
      } catch (error) {
        console.warn('Auto-detection interaction failed:', error);
        // Continue with configured actions
      }

      // Step 5: Execute configured actions
      await interactionEngine.executeActions(this.config.actions);

      // Step 6: Capture evidence during actions
      await this.evidenceCapture.captureActionScreenshots(
        this.session,
        this.config.actions
      );

      // Step 7: Capture final state
      await this.evidenceCapture.captureScreenshot(this.session, 'final-state');

      // Step 8: Capture console logs (before closing)
      await this.evidenceCapture.captureConsoleLogs(this.session);

      // Step 9: Save console logs
      await this.evidenceCapture.saveConsoleLogs(gameUrl);

      // Step 10: Get execution time
      const executionTimeSeconds = (Date.now() - startTime) / 1000;

      // Step 11: Evaluate
      const report = await this.evaluator.evaluate(
        gameUrl,
        this.evidenceCapture.getScreenshots(),
        this.evidenceCapture.getConsoleErrors(),
        this.evidenceCapture.getConsoleWarnings(),
        executionTimeSeconds
      );

      // Add load time to metadata
      if (loadTime) {
        report.metadata = {
          ...report.metadata,
          load_time_ms: loadTime,
        };
      }

      return report;
    } catch (error) {
      const executionTimeSeconds = (Date.now() - startTime) / 1000;

      // Capture error state screenshot if possible
      try {
        await this.evidenceCapture.captureScreenshot(this.session, 'error-state');
      } catch {
        // Ignore screenshot errors
      }

      // Capture console logs if possible
      try {
        await this.evidenceCapture.captureConsoleLogs(this.session);
      } catch {
        // Ignore log capture errors
      }

      // Return error report
      return {
        status: 'error',
        playability_score: 0,
        issues: [
          {
            severity: 'critical',
            description: `Test execution failed: ${error instanceof Error ? error.message : String(error)}`,
            confidence: 1.0,
          },
        ],
        screenshots: this.evidenceCapture.getScreenshots(),
        timestamp: new Date().toISOString(),
        game_url: gameUrl,
        execution_time_seconds: executionTimeSeconds,
        metadata: {
          console_errors: this.evidenceCapture.getConsoleErrors(),
          console_warnings: this.evidenceCapture.getConsoleWarnings(),
          load_time_ms: loadTime,
        },
      };
    }
  }

  /**
   * Load game with retry logic
   */
  private async loadGame(gameUrl: string, retries: number = 3): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.session.navigate(gameUrl);
        // Wait a bit for initial load
        await this.session.wait(2000);
        return; // Success
      } catch (error) {
        if (attempt === retries) {
          throw new Error(
            `Failed to load game after ${retries} attempts: ${error instanceof Error ? error.message : String(error)}`
          );
        }
        console.warn(`Load attempt ${attempt} failed, retrying...`);
        await this.session.wait(1000 * attempt); // Exponential backoff
      }
    }
  }
}

