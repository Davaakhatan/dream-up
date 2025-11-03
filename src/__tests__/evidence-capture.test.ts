/**
 * Tests for evidence capture system
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { EvidenceCapture } from '../agent/evidence-capture.js';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Mock fs/promises
jest.mock('fs/promises');

describe('EvidenceCapture', () => {
  let capture: EvidenceCapture;
  const testOutputDir = './test-output';

  beforeEach(() => {
    capture = new EvidenceCapture(testOutputDir);
  });

  describe('initialize', () => {
    it('should create output directories', async () => {
      await capture.initialize();
      // Verify mkdir was called for output and subdirectories
      expect(mkdir).toHaveBeenCalled();
    });
  });

  describe('screenshot capture', () => {
    it('should generate valid screenshot info', async () => {
      const mockSession = {
        screenshot: jest.fn().mockResolvedValue(Buffer.from('fake-image')),
      } as any;

      const screenshot = await capture.captureScreenshot(mockSession, 'test');
      
      expect(screenshot).toBeDefined();
      expect(screenshot.timestamp).toBeDefined();
      expect(screenshot.label).toBe('test');
    });
  });

  describe('console logs', () => {
    it('should capture console errors', async () => {
      const mockSession = {
        getConsoleLogs: jest.fn().mockResolvedValue([
          { level: 'error', message: 'Test error', timestamp: Date.now() },
        ]),
      } as any;

      await capture.captureConsoleLogs(mockSession);
      const errors = capture.getConsoleErrors();
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('[error]');
    });

    it('should capture console warnings', async () => {
      const mockSession = {
        getConsoleLogs: jest.fn().mockResolvedValue([
          { level: 'warn', message: 'Test warning', timestamp: Date.now() },
        ]),
      } as any;

      await capture.captureConsoleLogs(mockSession);
      const warnings = capture.getConsoleWarnings();
      
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0]).toContain('[warn]');
    });
  });
});

