# Contributing to For the Badge

Thank you for your interest in contributing to For the Badge! We welcome contributions from everyone.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/forthebadge/for-the-badge/issues)
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Browser/environment details
   - Screenshots if applicable

### Suggesting Features

1. Check existing [Issues](https://github.com/forthebadge/for-the-badge/issues) for similar suggestions
2. Create a new issue with the "feature request" label
3. Describe the feature and its use case clearly

### Pull Requests

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our code style
5. **Test** your changes:
   ```bash
   yarn test
   ```
6. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add new badge style option"
   ```
7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** against the `main` branch

## Development Setup

```bash
# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Start development server
yarn dev
```

## Code Style

We use ESLint for code formatting. Run the linter before committing:

```bash
yarn lint
```

### Style Guidelines

- Use TypeScript for all new code
- Use 4-space indentation
- Use double quotes for strings
- Use semicolons
- Write descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add custom color picker to badge creator
fix: resolve badge rendering issue on Safari
docs: update installation instructions
```

## Testing

Run the test suite before submitting a PR:

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch
```

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for helping make For the Badge better! 🎉
