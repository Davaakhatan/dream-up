/**
 * Integration tests for QA Agent
 */

import { describe, it, expect } from '@jest/globals';

describe('Integration Tests', () => {
  describe('Module Exports', () => {
    it('should export QAAgent', async () => {
      const module = await import('../index.js');
      expect(module.QAAgent).toBeDefined();
    });

    it('should export BrowserbaseProvider', async () => {
      const module = await import('../index.js');
      expect(module.BrowserbaseProvider).toBeDefined();
    });

    it('should export EvidenceCapture', async () => {
      const module = await import('../index.js');
      expect(module.EvidenceCapture).toBeDefined();
    });

    it('should export Evaluator', async () => {
      const module = await import('../index.js');
      expect(module.Evaluator).toBeDefined();
    });

    it('should export loadConfig', async () => {
      const module = await import('../index.js');
      expect(module.loadConfig).toBeDefined();
      expect(typeof module.loadConfig).toBe('function');
    });

    it('should export defaultConfig', async () => {
      const module = await import('../index.js');
      expect(module.defaultConfig).toBeDefined();
      expect(module.defaultConfig.actions).toBeDefined();
      expect(module.defaultConfig.timeouts).toBeDefined();
    });
  });

  describe('Type Exports', () => {
    it('should export type definitions', async () => {
      const module = await import('../index.js');
      // Type exports are compile-time only, but we can verify the module loads
      expect(module).toBeDefined();
    });
  });
});

