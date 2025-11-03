# Active Context: DreamUp QA Pipeline Implementation

## Current Phase
**Initial Setup & Architecture** - Day 1

## Key Decisions Made
1. **Language**: TypeScript (as preferred)
2. **Browser Control**: Browserbase (primary) with fallback options
3. **LLM**: OpenAI GPT-4V for vision analysis, GPT-4 for text evaluation
4. **Project Structure**: Modular monorepo with separate packages for core functionality

## Technical Stack
- Runtime: Node.js with TypeScript
- Browser: Browserbase API
- AI: OpenAI API (GPT-4V for vision, GPT-4 for evaluation)
- CLI: Commander.js for command interface
- Config: JSON-based action sequences

## Design Constraints
- Must work in Lambda environment (for future integration)
- 5-minute timeout per game
- Structured JSON output format required
- Must handle headless browser limitations

## Current Focus
Setting up project foundation: package.json, TypeScript config, core module structure

