# Gemini Assistant Instructions

This document guides the Gemini AI assistant for effective collaboration on the fullstack-log-app project.

## Project Overview

This is a full-stack application for logging.

- **Backend**: Located in `/backend`, written in TypeScript and runs on Node.js. It likely uses a framework like Express.
- **Frontend**: A React application located in `/react`.
- **Database**: A PostgreSQL database, managed via Docker Compose. The schema is defined in `/db/init/init.sql`.
- **Containerization**: The application stack is orchestrated using `docker-compose.yml`.

## Development Workflow

- **Dependencies**: Use `npm install` in the backend and react directories as needed.
- **Running the Stack**: Use `docker-compose up --build` to start the entire application stack.

## Coding & Git Practices

- **Commit Messages**: Use Conventional Commits for clear and readable history (e.g., `feat:`, `fix:`, `docs:`, `refactor:`).
- **Branching**: Create branches for new work using a prefix like `feat/` for features or `fix/` for bug fixes (e.g., `feat/user-authentication`).
- **Code Style**: Adhere to the existing code style, enforced by linters and formatters in the project. Ensure your editor is configured to use them.
- **Pull Requests (PRs)**: All changes should be submitted through a Pull Request. Provide a clear description of the changes and their purpose.
- **Testing**: New features and bug fixes must be accompanied by relevant tests. Run existing tests to check for regressions before submitting a PR.
- **Commenting**: Avoid comments that explain what the code is doing. Code should be self-documenting through clear variable and function names. Only add comments to explain why a complex or non-obvious piece of logic was implemented in a certain way.
- **Environment Variables**: Never commit sensitive keys or secrets. Use `.env` files for local configuration and ensure they are included in `.gitignore`.

## Special Modes

### YOLO Mode

When instructed to operate in "YOLO mode," you are authorized to work with a higher degree of autonomy. However, in this mode, you must not commit or push code directly. All changes should be staged and reviewed manually by the user.