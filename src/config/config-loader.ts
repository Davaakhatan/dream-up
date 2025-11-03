/**
 * Configuration loader from JSON files
 */

import { readFile } from 'fs/promises';
import type { QAConfig } from '../types/config.js';
import { defaultConfig } from './default-config.js';

export { defaultConfig };

export async function loadConfig(configPath?: string): Promise<QAConfig> {
  if (!configPath) {
    return defaultConfig;
  }

  try {
    const configStr = await readFile(configPath, 'utf-8');
    const config = JSON.parse(configStr) as QAConfig;

    // Validate and merge with defaults
    return {
      actions: config.actions || defaultConfig.actions,
      timeouts: {
        load: config.timeouts?.load ?? defaultConfig.timeouts.load,
        action: config.timeouts?.action ?? defaultConfig.timeouts.action,
        total: config.timeouts?.total ?? defaultConfig.timeouts.total,
      },
    };
  } catch (error) {
    console.warn(`Failed to load config from ${configPath}, using defaults:`, error);
    return defaultConfig;
  }
}

