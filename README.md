# Fullstack Log App

**Lint:** [![Lint Status](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml/badge.svg?branch=main&event=push&status=success&job=lint)](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml)

**Backend Build:** [![Backend Build Status](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml/badge.svg?branch=main&event=push&status=success&job=build_backend)](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml)

**Frontend Build:** [![Frontend Build Status](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml/badge.svg?branch=main&event=push&status=success&job=build_frontend)](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml)


## Prerequisites

To run this project, you need to have the following installed on your machine:

*   **Docker**: For running the PostgreSQL database.
*   **Docker Compose**: For defining and running the database service.
*   **Node.js** (with npm): For running the backend and frontend applications.

## Getting Started

Follow these steps to get the project up and running on your local machine:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/vineethvijayan314/fullstack-log-app.git
    cd fullstack-log-app
    ```

2.  **Install Dependencies:**

    We have a monorepo setup, so dependencies are managed at the root level. Run the following command to install all dependencies:

    ```bash
    npm install
    ```

3.  **Start the database:**

    This command will build the Docker image for the database (if not already built) and start the PostgreSQL service.

    ```bash
    docker-compose up --build -d db
    ```

4.  **Start the backend server:**

    ```bash
    npm run start:backend
    ```

    The backend API should now be accessible at `http://localhost:4000`.

5.  **Start the frontend development server:**

    Open a new terminal window, navigate to the project root, and then:

    ```bash
    npm run start:frontend
    ```

    The frontend application should now be accessible at `http://localhost:5173`.

6.  **Access the application:**

    Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

7.  **Unit Testin:**

    We have tests for backend application. You can run them using the following command:

    ```bash
    npm run test:backend
    ```

    This will execute the backend tests and display the results in the terminal.


## High Level Architecture

```mermaid
graph TD
    A[User] -->|Accesses| B(Frontend - React App)
    B -->|API Calls| C(Backend - Node.js/Express App)
    C -->|Queries| D(Database - PostgreSQL)

    subgraph Infrastructure
        E[Docker Compose] --> H(Database Container)
    end

    H --> D
```

## Backend Data Flow

```mermaid
graph TD
    A[Client Request] --> B(Express Server)
    B --> C(Routing Layer)
    C --> D(Controller)
    D --> E(Repository)
    E --> F(Database Connection Pool)
    F --> G[PostgreSQL Database]

    G -->|Data Response| F
    F -->|Data Response| E
    E -->|Data Response| D
    D -->|JSON Response| C
    C -->|JSON Response| B
    B -->|JSON Response| A
```
