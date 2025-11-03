/**
 * Tests for configuration system
 */

import { describe, it, expect } from '@jest/globals';
import { defaultConfig } from '../config/default-config.js';
import type { QAConfig, ActionConfig } from '../types/config.js';

describe('Configuration System', () => {
  describe('defaultConfig', () => {
    it('should have valid structure', () => {
      expect(defaultConfig).toBeDefined();
      expect(defaultConfig.actions).toBeInstanceOf(Array);
      expect(defaultConfig.timeouts).toBeDefined();
    });

    it('should have required timeout properties', () => {
      expect(defaultConfig.timeouts.load).toBeGreaterThan(0);
      expect(defaultConfig.timeouts.action).toBeGreaterThan(0);
      expect(defaultConfig.timeouts.total).toBeGreaterThan(0);
    });

    it('should have valid actions', () => {
      defaultConfig.actions.forEach((action: ActionConfig) => {
        expect(action.type).toMatch(/wait|click|keypress|screenshot/);
        if (action.type === 'wait') {
          expect(action.duration).toBeGreaterThan(0);
        }
        if (action.type === 'keypress') {
          expect(action.key).toBeDefined();
        }
      });
    });

    it('should have total timeout >= individual timeouts', () => {
      expect(defaultConfig.timeouts.total).toBeGreaterThanOrEqual(
        defaultConfig.timeouts.load
      );
      expect(defaultConfig.timeouts.total).toBeGreaterThanOrEqual(
        defaultConfig.timeouts.action
      );
    });
  });
});

