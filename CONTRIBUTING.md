# Contributing

Thank you for considering a contribution.

## Before starting
- Search existing issues and pull requests to avoid duplicated work.
- For significant changes, open an issue describing the problem and proposed approach.
- Follow the existing React 16 / Create React App 3 compatibility baseline unless a dependency upgrade is explicitly discussed.

## Development workflow

```bash
npm install
npm start
npm test -- --watchAll=false
npm run build
```

## Pull requests
- Keep changes focused and explain the user-visible impact.
- Add regression tests for bug fixes and tests for new calculation behavior.
- Include screenshots for material UI changes where practical.
- Update README.md and CHANGELOG.md when behavior or setup changes.
- Never include secrets, personal data, generated build output, or `node_modules`.

## Reporting bugs
Include browser and Node versions, steps to reproduce, expected behavior, actual behavior, and relevant console output.
