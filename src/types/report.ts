/**
 * Types for QA test reports and evaluation results
 */

export interface Issue {
  severity: 'critical' | 'warning' | 'info';
  description: string;
  confidence: number; // 0-1
  evidence?: string[]; // screenshot filenames or log references
}

export interface ScreenshotInfo {
  filename: string;
  timestamp: string;
  label?: string;
  storageUrl?: string; // Firebase Storage URL (if uploaded)
  url?: string; // Public URL (either Firebase Storage or API endpoint)
}

export interface QAReport {
  status: 'pass' | 'fail' | 'partial' | 'error';
  playability_score: number; // 0-100
  issues: Issue[];
  screenshots: ScreenshotInfo[];
  timestamp: string;
  game_url: string;
  execution_time_seconds: number;
  metadata?: {
    console_errors?: string[];
    console_warnings?: string[];
    load_time_ms?: number;
  };
}

