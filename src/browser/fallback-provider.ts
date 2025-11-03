/**
 * Fallback browser provider using Puppeteer as alternative
 * Note: This is a placeholder for if Browserbase is unavailable
 * Full implementation would require puppeteer dependency
 */

import type { BrowserProvider, BrowserSession, BrowserOptions } from '../types/browser.js';

/**
 * Fallback provider using Puppeteer (optional implementation)
 * This can be enabled if Browserbase is not available
 */
export class PuppeteerProvider implements BrowserProvider {
  async createSession(_options: BrowserOptions = {}): Promise<BrowserSession> {
    throw new Error(
      'Puppeteer provider not implemented. Please use Browserbase or implement Puppeteer integration.'
    );
  }
}

