# AIDE Project Documentation

## Overview

AIDE (AI Development Environment) is a TypeScript/Node.js project that provides LSP client infrastructure for reliable communication with TypeScript language servers.

## Project Structure

```
aide/
├── src/                 # Source code
│   ├── __tests__/       # Unit tests
│   └── LSPClient.ts     # Main LSP client implementation
├── docs/                # Documentation
├── dist/                # Compiled output
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Test configuration
└── .eslintrc.js         # ESLint configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run linting:
   ```bash
   npm run lint
   ```

## Development

- Use TypeScript for all source code
- Follow ESLint rules for code quality
- Write tests for all new functionality
- Use Jest for testing framework