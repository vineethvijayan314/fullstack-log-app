# Gemini Assistant Instructions

This document guides the Gemini AI assistant for effective collaboration on the `fullstack-log-app` project.

## Project Overview

This is a full-stack application for logging.

- **Backend:** Located in `/backend`, written in TypeScript and runs on Node.js. It likely uses a framework like Express.
- **Frontend:** A React application located in `/react`.
- **Database:** A PostgreSQL database, managed via Docker Compose. The schema is defined in `/db/init/init.sql`.
- **Containerization:** The application stack is orchestrated using `docker-compose.yml`.

## Development Workflow

- **Dependencies:** Use `npm install` in the `backend` and `react` directories as needed.
- **Testing:** The backend has Jest tests. Run tests using the scripts in `backend/package.json` after making changes.
- **Code Style:** Adhere to the existing code style and conventions found in the project.

## Special Modes

### YOLO Mode

When instructed to operate in "YOLO mode," you are authorized to work with a higher degree of autonomy. However, in this mode, you **must not** commit or push code directly. All changes should be staged and reviewed manually by the user.