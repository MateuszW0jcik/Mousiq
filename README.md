# Mousiq

This repository contains a complete implementation of the **Mousiq** e-commerce application (a mouse store) built
in two architectural variants. Both implementations share identical business logic and a common
frontend, ensuring a fair and reliable comparison.

## Key Principles

- **Identical functionality** - both architectures implement the same business logic and API contracts
- **Shared frontend** - a single React interface works with both backend variants
- **Isolated execution** - architectures are run separately, never simultaneously, to ensure accurate measurements
- **Repeatable testing** - JMeter scenarios (load, stress, spike, endurance) guarantee comparable results
- **Automated measurement** - Prometheus + Grafana collect CPU and memory metrics; Python scripts generate charts

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.4.0, Spring Cloud |
| Frontend | React, TypeScript |
| Database | PostgreSQL |
| Containerization | Docker, Docker Compose |
| Performance testing | Apache JMeter |
| Monitoring | Prometheus, Grafana, Zipkin |

## Running the Project

Each component has its own `README.md` with setup and run instructions.