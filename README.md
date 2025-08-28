# Fullstack Log App

**Lint:** [![Lint Status](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml/badge.svg?branch=main&event=push&status=success&job=lint)](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml)

**Backend Build:** [![Backend Build Status](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml/badge.svg?branch=main&event=push&status=success&job=build_backend)](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml)

**Frontend Build:** [![Frontend Build Status](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml/badge.svg?branch=main&event=push&status=success&job=build_frontend)](https://github.com/vineethvijayan314/fullstack-log-app/actions/workflows/ci.yml)

This is a full-stack application for logging.

## Architecture

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