# TODO

This file serves as a technical roadmap outlining planned features and enhancements for the project.

## Feature Categories

### Core Reporting Features
- [ ] **Pull Request Reports**: Implement PR-based reporting functionality that generates reports based on commit history within pull requests
- [ ] **Changelog Generation**: Develop automated changelog creation from commit history with semantic versioning support

### Git Service Enhancements
- [ ] **Advanced Filtering**: Extend GitService with additional filtering capabilities including `since-tag` and Git revision range (`branch..branch`) support

### Project Memory System
- [ ] **Project Configuration**: Implement project-specific configuration system allowing custom markdown files to be included in AI context
- [ ] **SQLite Integration**: Add SQLite database support for storing statistics and generation history

### Infrastructure & Configuration
- [ ] **Multi-Provider Support**: Integrate alternative AI providers beyond OpenRouter, with emphasis on local LLM support
- [ ] **Configuration Hierarchy**: Implement three-tier configuration system (CLI flags > .env > global config) with proper precedence handling