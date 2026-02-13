# TODO

This file serves as a technical roadmap outlining planned features and enhancements for the project.

## Milestone 1

- [x] **Advanced Filtering**: Extend GitService with additional filtering capabilities including `since-tag` and Git revision range (`branch..branch`) support
- [x] **Pull Request Reports**: Implement PR-based reporting functionality that generates reports based on commit history within pull requests
- [x] **Changelog Generation**: Develop automated changelog creation from commit history with semantic versioning support

## Milestone 2

- [x] **Global Configuration**: Add support for global configuration file (e.g., `~/.git-friday/config.json`) to store default settings across all projects
- [ ] ~~**Configuration Hierarchy**: Implement three-tier configuration system (CLI flags > .env > global config) with proper precedence handling~~ **DEPRECATED**: Decided against configuration hierarchy in favor of a single source of truth. API key declaration remains in the .env file.

### New

- [ ] **Localization**: Translate the entire application to English and Russian, optimize localization workflow and management
- [ ] **Error Messages & UX**: Add readable and comprehensive error messages, improve UI/UX to provide better understanding of what is happening and what went wrong

## Milestone 3

- [ ] **Multi-Provider Support**: Integrate alternative AI providers beyond OpenRouter, with emphasis on local LLM support
- [ ] **SQLite Integration**: Add SQLite database support for storing statistics and generation history

## Milestone 4

- [ ] **Project Configuration**: Implement project-specific configuration system allowing custom markdown files to be included in AI context

## Milestone 5

- [ ] **File-Based Profiles**: Add ability to create custom file-based profiles containing:
  - A configuration file with custom `git log` flags for filtering commits
  - Custom system prompts for AI behavior tuning
  - Custom user prompts for report generation customization

## Miscellaneous

- [ ] **Logging**: Implement logging system with support for different log levels and output formats in local machine
- [ ] **Documentation**: Enhance documentation with detailed guides and tutorials for advanced usage
- [ ] **Testing**: Expand test suite to cover edge cases and ensure robustness of core functionalities
- [ ] **Make statistics optional**: Add an option to disable statistics collection and reporting
