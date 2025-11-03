/**
 * Modern CLI UI utilities for better user experience
 */

import chalk from 'chalk';
import ora, { type Ora } from 'ora';

export class CLIUI {
  private spinner: Ora | null = null;

  /**
   * Display welcome banner
   */
  static banner(): void {
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║') + chalk.bold.white('  DreamUp QA Agent - Browser Game Testing Pipeline  ') + chalk.bold.cyan('║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════╝\n'));
  }

  /**
   * Start a spinner with message
   */
  startSpinner(message: string): void {
    this.spinner = ora(message).start();
  }

  /**
   * Update spinner message
   */
  updateSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }

  /**
   * Stop spinner with success
   */
  succeedSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner with failure
   */
  failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  /**
   * Display info message
   */
  static info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Display success message
   */
  static success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  /**
   * Display warning message
   */
  static warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  /**
   * Display error message
   */
  static error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  /**
   * Display section header
   */
  static section(title: string): void {
    console.log(chalk.bold.cyan(`\n${title}`));
    console.log(chalk.gray('─'.repeat(title.length)));
  }

  /**
   * Display key-value pair
   */
  static keyValue(key: string, value: string | number, color: 'default' | 'success' | 'warning' | 'error' = 'default'): void {
    const colors = {
      default: chalk.white,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
    };
    console.log(`   ${chalk.gray(key + ':')} ${colors[color](String(value))}`);
  }

  /**
   * Display test report summary
   */
  static reportSummary(report: any): void {
    console.log(chalk.bold('\n📊 Test Results Summary'));
    console.log(chalk.gray('═'.repeat(50)));

    // Status with color
    const statusColor =
      report.status === 'pass' ? 'green' :
      report.status === 'partial' ? 'yellow' :
      report.status === 'error' ? 'red' : 'red';

    CLIUI.keyValue('Status', report.status.toUpperCase(), report.status === 'pass' ? 'success' : report.status === 'partial' ? 'warning' : 'error');
    
    // Score with color gradient
    const scoreColor = report.playability_score >= 80 ? 'success' : report.playability_score >= 50 ? 'warning' : 'error';
    CLIUI.keyValue('Playability Score', `${report.playability_score}/100`, scoreColor);
    
    CLIUI.keyValue('Issues Found', report.issues.length, report.issues.length === 0 ? 'success' : 'warning');
    CLIUI.keyValue('Screenshots Captured', report.screenshots.length);
    CLIUI.keyValue('Execution Time', `${report.execution_time_seconds.toFixed(2)}s`);
    
    if (report.metadata?.load_time_ms) {
      CLIUI.keyValue('Load Time', `${(report.metadata.load_time_ms / 1000).toFixed(2)}s`);
    }
  }

  /**
   * Display issues list
   */
  static issues(issues: any[]): void {
    if (issues.length === 0) {
      console.log(chalk.green('\n✓ No issues detected!'));
      return;
    }

    console.log(chalk.bold('\n⚠️  Issues Detected'));
    console.log(chalk.gray('─'.repeat(50)));

    issues.forEach((issue, i) => {
      const severityColor =
        issue.severity === 'critical' ? chalk.red :
        issue.severity === 'warning' ? chalk.yellow :
        chalk.blue;

      console.log(`\n   ${chalk.bold(`${i + 1}.`)} ${severityColor(`[${issue.severity.toUpperCase()}]`)}`);
      console.log(`      ${issue.description}`);
      if (issue.confidence !== undefined) {
        console.log(`      ${chalk.gray(`Confidence: ${(issue.confidence * 100).toFixed(0)}%`)}`);
      }
    });
  }

  /**
   * Display progress bar
   */
  static progress(current: number, total: number, label: string): void {
    const percentage = Math.round((current / total) * 100);
    const filled = Math.round((current / total) * 20);
    const empty = 20 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    process.stdout.write(`\r   ${chalk.cyan(bar)} ${percentage}% ${label}`);
    if (current === total) {
      process.stdout.write('\n');
    }
  }
}

