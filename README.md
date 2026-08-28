# 🔗 LinkForge: Intelligent URL Management Platform

**LinkForge** is a powerful, modern URL shortening service that allows users to instantly generate short links, securely manage them, and track comprehensive real-time analytics. Built with a robust Java 21 Spring Boot backend and a responsive React frontend, LinkForge is designed to be fast, scalable, and user-friendly.

## 📚 Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Screenshots](#screenshots)
* [Contributions](#contribution)
* [License](#license)
* [Author](#author)

## Overview

LinkForge provides a complete solution for link management. Beyond just shortening long URLs, it offers detailed, real-time insights into link usage, including the total number of clicks and individual user interactions. The platform ensures a personalized and secure experience through full user authentication and a modern, fast user interface.

## Key Features

  * **✅ Shorten Links:** Instantly generate concise, shareable short URLs for any long link.
  * **🏷️ Custom URL Aliases:** Optionally create your own custom vanity URL aliases (e.g. `linkforge.com/s/my-brand`).
  * **⏳ Link Expiration:** Set an optional expiration date for temporary links. Expired links safely return a `410 Gone` while preserving historical click analytics.
  * **📈 Async Analytics:** A high-throughput, non-blocking click tracking pipeline decoupling user redirects from heavy persistence operations to maximize speed.
  * **👤 User Tracking:** Monitor granular link usage, tracking individual clicks associated with authenticated users.
  * **🔒 User Authentication:** Secure login and signup functionality powered by JWT for a personalized and private link management experience.
  * **✨ Modern UI:** A smooth, reactive frontend built with ReactJS for an excellent user experience.
  * **🚀 Fast & Scalable:** A robust and efficient backend powered by Spring Boot (Java 21) ensures high performance and scalability.

## Tech Stack

LinkForge is a full-stack application leveraging modern, industry-standard technologies:

### Backend (API)

| Technology | Purpose |
| :--- | :--- |
| **Java 21 & Spring Boot** | Core framework for the RESTful API, providing speed and stability. |
| **Spring @Async** | Dedicated `ThreadPoolTaskExecutor` for fire-and-forget asynchronous background analytics persistence. |
| **Spring Security** | Handling authorization, user authentication, and securing endpoints. |
| **JWT Authentication** | Secure, stateless authentication for API communication. |
| **PostgreSQL** | Relational database for persistence of short links, long URLs, user data, and click analytics. |

### Frontend (UI)

| Technology | Purpose |
| :--- | :--- |
| **ReactJS (Vite)** | Library for building the responsive and dynamic Single Page Application (SPA). |
| **React Router** | Managing client-side routing and navigation within the application. |
| **Axios** | Efficient, promise-based HTTP client for communicating with the Spring Boot API. |

## Getting Started

Follow these steps to set up and run LinkForge locally.

### Prerequisites

  * Java Development Kit (JDK 21)
  * Node.js and npm (or yarn)
  * A running instance of PostgreSQL database.
  * Maven (for Spring Boot build)

### 1\. Database & Environment Setup

1. Copy the example environment file in the backend directory:
   ```bash
   cd Url-Shortner-sb
   cp .env.example .env
   ```
2. Update the `.env` file with your actual database credentials and JWT secrets:
   ```env
   DB_URL=jdbc:postgresql://localhost:5432/linkforge
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRATION_MS=86400000
   FRONTEND_URL=http://localhost:5173
   ```

### 2\. Backend Setup

1.  Navigate to the `Url-Shortner-sb` directory.
2.  Build the project using Maven:
    ```bash
    ./mvnw clean install
    ```
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The API should start running on `http://localhost:9090`.

### 3\. Frontend Setup

1.  Navigate to the `Url-Shortner-Frontend` directory.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The React application should open in your browser at `http://localhost:5173`.

## Screenshots
  ![alt text](<Images/Login.png>)  
  ![alt text](<Images/Home.png>)  
  ![alt text](<Images/About.png>)  
  ![alt text](<Images/Create_Short_URL.png>)  
  ![alt text](<Images/Dashboard.png>)  

## Contribution

We welcome contributions! If you have suggestions for new features, bug fixes, or improvements, please:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

## Author

Ganesh
