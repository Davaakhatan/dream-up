# System Pattern: DreamUp Browser Game QA Pipeline

## Core Pattern
**Autonomous Browser Game Testing Agent** - An AI-powered QA system that simulates user interactions, captures visual evidence, and evaluates playability metrics for browser-based games.

## Key Components
1. **Browser Automation Layer** - Uses Browserbase (or alternative) to control headless browser
2. **Interaction Engine** - Detects UI patterns and executes gameplay sequences
3. **Evidence Capture** - Screenshots, console logs, error tracking
4. **AI Evaluation** - LLM analysis of captured evidence with structured output
5. **CLI Interface** - Command-line tool for executing tests

## Architecture Principles
- **Modular Design** - Separated concerns for browser, interactions, evaluation, reporting
- **Configuration-Driven** - Action sequences and timeouts defined in JSON config
- **Graceful Degradation** - Handles failures without crashing, continues with partial data
- **Evidence-Based** - All assessments backed by timestamped screenshots and logs

## Success Patterns
- Maximum 5 minute execution time per game
- 3 retry attempts for failed loads
- 3-5 screenshots per test session
- Structured JSON output with confidence scores

