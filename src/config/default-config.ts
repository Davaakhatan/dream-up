/**
 * Default configuration for QA agent
 */

import type { QAConfig } from '../types/config.js';

export const defaultConfig: QAConfig = {
  actions: [
    { type: 'wait', duration: 3 }, // Wait for game to fully load
    // Screenshot will be captured automatically after initial load
    { type: 'wait', duration: 1 },
    // Test arrow keys - screenshot will be captured after each sequence
    // Optimized for speed - single keypress per direction
    { type: 'keypress', key: 'ArrowRight', repeat: 1 },
    { type: 'wait', duration: 0.5 },
    { type: 'keypress', key: 'ArrowDown', repeat: 1 },
    { type: 'wait', duration: 0.5 },
    { type: 'keypress', key: 'ArrowLeft', repeat: 1 },
    { type: 'wait', duration: 0.5 },
    { type: 'keypress', key: 'ArrowUp', repeat: 1 },
    { type: 'wait', duration: 0.5 },
    // Test spacebar (common for jump, shoot, action buttons)
    { type: 'keypress', key: 'Space', repeat: 1 },
    { type: 'wait', duration: 0.5 },
    // Test mouse clicks on game area (simulate gameplay interactions)
    // Try clicking center of canvas if it exists (for canvas-based games)
    { type: 'click', selector: 'canvas', x: 0.5, y: 0.5 }, // Click center of canvas (relative coordinates 0-1)
    { type: 'wait', duration: 0.5 },
    // More arrow key sequences to simulate gameplay
    { type: 'keypress', key: 'ArrowRight', repeat: 2 },
    { type: 'wait', duration: 0.5 },
    { type: 'keypress', key: 'ArrowUp', repeat: 2 },
    { type: 'wait', duration: 1 }, // Final wait before final screenshot
  ],
  timeouts: {
    load: 30,
    action: 20, // Increased to 20s to handle modal dismissal + screenshot
    total: 300, // 5 minutes
  },
};

