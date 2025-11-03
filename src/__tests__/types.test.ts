/**
 * Tests for type definitions
 */

import { describe, it, expect } from '@jest/globals';
import type {
  ActionConfig,
  TimeoutConfig,
} from '../types/config.js';
import type {
  QAReport,
  Issue,
  ScreenshotInfo,
} from '../types/report.js';

describe('Type Definitions', () => {
  describe('ActionConfig', () => {
    it('should validate wait action', () => {
      const action: ActionConfig = {
        type: 'wait',
        duration: 2,
      };
      expect(action.type).toBe('wait');
      expect(action.duration).toBe(2);
    });

    it('should validate click action', () => {
      const action: ActionConfig = {
        type: 'click',
        selector: 'button.start',
      };
      expect(action.type).toBe('click');
      expect(action.selector).toBe('button.start');
    });

    it('should validate keypress action', () => {
      const action: ActionConfig = {
        type: 'keypress',
        key: 'ArrowRight',
        repeat: 5,
      };
      expect(action.type).toBe('keypress');
      expect(action.key).toBe('ArrowRight');
      expect(action.repeat).toBe(5);
    });

    it('should validate screenshot action', () => {
      const action: ActionConfig = {
        type: 'screenshot',
        label: 'baseline',
      };
      expect(action.type).toBe('screenshot');
      expect(action.label).toBe('baseline');
    });
  });

  describe('TimeoutConfig', () => {
    it('should validate timeout configuration', () => {
      const timeouts: TimeoutConfig = {
        load: 30,
        action: 10,
        total: 300,
      };
      expect(timeouts.load).toBe(30);
      expect(timeouts.action).toBe(10);
      expect(timeouts.total).toBe(300);
    });
  });

  describe('QAReport', () => {
    it('should create valid report structure', () => {
      const report: QAReport = {
        status: 'pass',
        playability_score: 85,
        issues: [],
        screenshots: [],
        timestamp: new Date().toISOString(),
        game_url: 'https://example.com/game.html',
        execution_time_seconds: 45.2,
      };

      expect(report.status).toMatch(/pass|fail|partial|error/);
      expect(report.playability_score).toBeGreaterThanOrEqual(0);
      expect(report.playability_score).toBeLessThanOrEqual(100);
      expect(report.game_url).toBeDefined();
    });

    it('should validate issue structure', () => {
      const issue: Issue = {
        severity: 'warning',
        description: 'Test issue',
        confidence: 0.8,
      };

      expect(issue.severity).toMatch(/critical|warning|info/);
      expect(issue.confidence).toBeGreaterThanOrEqual(0);
      expect(issue.confidence).toBeLessThanOrEqual(1);
    });

    it('should validate screenshot info', () => {
      const screenshot: ScreenshotInfo = {
        filename: 'screenshot-123.png',
        timestamp: new Date().toISOString(),
        label: 'baseline',
      };

      expect(screenshot.filename).toBeDefined();
      expect(screenshot.timestamp).toBeDefined();
    });
  });
});

