/**
 * Default configuration for QA agent
 */

import type { QAConfig } from '../types/config.js';

export const defaultConfig: QAConfig = {
  actions: [
    { type: 'wait', duration: 2 },
    { type: 'screenshot', label: 'baseline' },
    { type: 'wait', duration: 1 },
    { type: 'keypress', key: 'ArrowRight', repeat: 5 },
    { type: 'screenshot', label: 'after-movement' },
    { type: 'wait', duration: 1 },
    { type: 'keypress', key: 'Space', repeat: 2 },
    { type: 'screenshot', label: 'after-actions' },
  ],
  timeouts: {
    load: 30,
    action: 10,
    total: 300, // 5 minutes
  },
};

