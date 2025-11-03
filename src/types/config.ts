/**
 * Configuration types for QA agent actions and timeouts
 */

export interface ActionConfig {
  type: 'wait' | 'click' | 'keypress' | 'screenshot';
  duration?: number; // for wait
  selector?: string; // for click
  key?: string; // for keypress
  repeat?: number; // for keypress repeat
  label?: string; // for screenshot
}

export interface TimeoutConfig {
  load: number; // seconds
  action: number; // seconds
  total: number; // seconds
}

export interface QAConfig {
  actions: ActionConfig[];
  timeouts: TimeoutConfig;
}

