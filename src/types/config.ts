/**
 * Configuration types for QA agent actions and timeouts
 */

export interface ActionConfig {
  type: 'wait' | 'click' | 'keypress' | 'screenshot';
  duration?: number; // for wait
  selector?: string; // for click
  x?: number; // for click - relative x coordinate (0-1) or absolute pixel
  y?: number; // for click - relative y coordinate (0-1) or absolute pixel
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

