# Product Context: DreamUp Browser Game QA Pipeline

## Business Purpose
- Automate QA testing for DreamUp's AI-generated games
- Enable feedback loops for game-building agent improvement
- Demonstrate production-ready AI agent architecture

## Target Users
- **Primary**: DreamUp's game-building AI agent (automated consumer)
- **Secondary**: Game developers using DreamUp (via integration)
- **Tertiary**: QA engineers reviewing test results

## Success Metrics
- Successfully tests 3+ diverse browser games end-to-end
- 80%+ accuracy on playability assessment
- Graceful handling of common failure modes
- Clean, documented, modular codebase

## Scope Boundaries
### In Scope
- Single-player browser games
- Basic interaction patterns (click, keyboard)
- Visual evidence capture
- AI-based evaluation

### Out of Scope
- Multiplayer games
- Mobile browser emulation
- Security/performance testing
- Production integration (prototype only)

## Integration Points
- **Input**: Game URL (command-line)
- **Output**: JSON report with status, scores, issues, screenshots
- **Future**: Lambda function integration for game-building agent

