/**
 * Browserbase provider implementation for browser automation
 */

import { Browserbase } from '@browserbasehq/sdk';
import type {
  BrowserProvider,
  BrowserSession,
  BrowserOptions,
  ConsoleLog,
} from '../types/browser.js';

export class BrowserbaseProvider implements BrowserProvider {
  private client: any; // Browserbase SDK may have different API structure
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BROWSERBASE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error(
        'BROWSERBASE_API_KEY environment variable is required. Get your key at https://www.browserbase.com'
      );
    }
    this.client = new Browserbase({ apiKey: this.apiKey });
  }

  async createSession(options: BrowserOptions = {}): Promise<BrowserSession> {
    // Browserbase SDK API may vary - use any type for flexibility
    const session = await (this.client as any).sessions?.create?.({
      projectId: process.env.BROWSERBASE_PROJECT_ID,
    }) || await (this.client as any).createSession?.({
      projectId: process.env.BROWSERBASE_PROJECT_ID,
    });

    if (!session || !session.id) {
      throw new Error('Failed to create browser session');
    }

    const sessionId = session.id;

    return new BrowserbaseSession(this.client, sessionId, options);
  }
}

class BrowserbaseSession implements BrowserSession {
  constructor(
    private client: any,
    public sessionId: string,
    private options: BrowserOptions
  ) {}

  async navigate(url: string): Promise<void> {
    // Browserbase SDK navigation - use type assertion for flexibility
    const sessions = (this.client as any).sessions;
    try {
      if (sessions?.navigate) {
        await sessions.navigate(this.sessionId, { url });
      } else if (sessions?.updateUrl) {
        await sessions.updateUrl(this.sessionId, url);
      } else {
        // Fallback: use evaluate
        await this.evaluate(`window.location.href = '${url}'`);
      }
    } catch (error) {
      // Fallback: try evaluate
      await this.evaluate(`window.location.href = '${url}'`);
    }
    // Wait for navigation to complete
    await this.wait(2000);
  }

  async screenshot(): Promise<Buffer> {
    try {
      const sessions = (this.client as any).sessions;
      const response = await sessions?.screenshot?.(this.sessionId) || 
                       await sessions?.getScreenshot?.(this.sessionId);
      
      // Browserbase may return base64 or buffer
      if (typeof response === 'string') {
        return Buffer.from(response, 'base64');
      }
      if (response?.screenshot) {
        if (typeof response.screenshot === 'string') {
          return Buffer.from(response.screenshot, 'base64');
        }
        return Buffer.from(response.screenshot);
      }
      // If response is already a buffer
      return Buffer.isBuffer(response) ? response : Buffer.from(response);
    } catch (error) {
      throw new Error(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async click(selector: string): Promise<void> {
    // Escape selector to prevent injection issues
    const escapedSelector = selector.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const sessions = (this.client as any).sessions;
    await sessions?.evaluate?.(this.sessionId, {
      script: `
        (function() {
          const selector = '${escapedSelector}';
          const element = document.querySelector(selector);
          if (element) {
            element.click();
            return true;
          } else {
            throw new Error('Element not found: ' + selector);
          }
        })()
      `,
    });
    await this.wait(500); // Small delay after click
  }

  async keypress(key: string): Promise<void> {
    const keyCode = this.getKeyCode(key);
    // Escape key name to prevent injection
    const escapedKey = key.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const escapedCode = keyCode.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const sessions = (this.client as any).sessions;
    await sessions?.evaluate?.(this.sessionId, {
      script: `
        (function() {
          const key = '${escapedKey}';
          const code = '${escapedCode}';
          const event = new KeyboardEvent('keydown', { key: key, code: code, bubbles: true });
          document.dispatchEvent(event);
          const event2 = new KeyboardEvent('keyup', { key: key, code: code, bubbles: true });
          document.dispatchEvent(event2);
        })()
      `,
    });
    await this.wait(100);
  }

  async wait(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async evaluate<T>(script: string): Promise<T> {
    const sessions = (this.client as any).sessions;
    const result = await sessions?.evaluate?.(this.sessionId, {
      script,
    }) || await sessions?.executeScript?.(this.sessionId, script);
    
    if (!result) {
      throw new Error('Failed to evaluate script');
    }
    
    return (result.result ?? result) as T;
  }

  async getConsoleLogs(): Promise<ConsoleLog[]> {
    // Inject console interceptor to capture logs
    try {
      const logs = await this.evaluate<Array<{ level: string; message: string; timestamp: number }>>(`
        (function() {
          if (!window.__qaConsoleLogs) {
            window.__qaConsoleLogs = [];
            const originalLog = console.log;
            const originalWarn = console.warn;
            const originalError = console.error;
            const originalInfo = console.info;

            function addLog(level, args) {
              window.__qaConsoleLogs.push({
                level: level,
                message: Array.from(args).map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' '),
                timestamp: Date.now()
              });
            }

            console.log = function(...args) {
              originalLog.apply(console, args);
              addLog('log', args);
            };
            console.warn = function(...args) {
              originalWarn.apply(console, args);
              addLog('warn', args);
            };
            console.error = function(...args) {
              originalError.apply(console, args);
              addLog('error', args);
            };
            console.info = function(...args) {
              originalInfo.apply(console, args);
              addLog('info', args);
            };
          }
          return window.__qaConsoleLogs;
        })()
      `);
      
      return logs.map(log => ({
        level: log.level as 'log' | 'warn' | 'error' | 'info',
        message: log.message,
        timestamp: log.timestamp,
      }));
    } catch (error) {
      console.warn('Failed to capture console logs:', error);
      return [];
    }
  }

  async close(): Promise<void> {
    const sessions = (this.client as any).sessions;
    await sessions?.delete?.(this.sessionId) || 
          await sessions?.close?.(this.sessionId);
  }

  private getKeyCode(key: string): string {
    const keyMap: Record<string, string> = {
      ArrowUp: 'ArrowUp',
      ArrowDown: 'ArrowDown',
      ArrowLeft: 'ArrowLeft',
      ArrowRight: 'ArrowRight',
      Space: 'Space',
      Enter: 'Enter',
      Escape: 'Escape',
    };
    return keyMap[key] || key;
  }
}

