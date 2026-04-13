# Programming Languages Used in Amena Project

This document details the exact programming languages utilized across the entire project, why they were chosen, and what role they play in the system.

## 1. TypeScript
- **Area Used:** Frontend (React)
- **File Extensions:** `.ts`, `.tsx`
- **Details:** TypeScript is the primary language used for the frontend application. It is a strict syntactical superset of JavaScript that adds optional static typing.
- **Why it's used:** It is used instead of standard JavaScript to prevent runtime bugs by catching errors during development. It powers all the React components, state management, and the interactive UI logic for both the client shop and the Admin Dashboard.

## 2. Java
- **Area Used:** Backend (Server)
- **File Extensions:** `.java`
- **Details:** Java (specifically version 21) is the backend programming language processing all the core business logic.
- **Why it's used:** Java is used in conjunction with the Spring Boot framework to create a highly scalable, secure, and robust RESTful API. It handles user requests, data validation, authentication, and communication with the database.

## 3. SQL (Structured Query Language)
- **Area Used:** Database (PostgreSQL)
- **File Extensions:** `.sql` (used dynamically via Java/Liquibase)
- **Details:** SQL is the standard declarative language used to communicate with relational databases.
- **Why it's used:** While you might not write raw SQL frequently because Spring Data JPA handles it automatically, SQL is the underlying language used by the PostgreSQL database to store, update, and retrieve everything: products, orders, users, and comments.

## 4. CSS (Cascading Style Sheets)
- **Area Used:** Frontend Styling
- **File Extensions:** `.css`
- **Details:** The stylesheet language used for describing the presentation of the HTML documents on the web.
- **Why it's used:** The project uses **Tailwind CSS**, a utility-first CSS framework. Rather than writing raw CSS, Tailwind generates the CSS based on class names written inside the TypeScript (`.tsx`) files, ensuring the application is responsive and looks beautiful on all devices.

## 5. HTML
- **Area Used:** Frontend Structure
- **File Extensions:** `.html`
- **Details:** The standard markup language for documents designed to be displayed in a web browser.
- **Why it's used:** Vite uses an `index.html` file as the entry point of the React application. React dynamically renders HTML elements to the screen based on the TypeScript components.

---

### Supporting Configuration Languages
While not strictly "programming" languages, the project relies heavily on these formatting languages to function:
- **YAML (`.yml`, `.yaml`)**: Used to configure the Docker infrastructure (`docker-compose.yml`), the Spring Boot application properties (`application.yml`), and the OpenAPI specifications (`openapi.yaml`).
- **JSON (`.json`)**: Used in the frontend for `package.json` to manage JavaScript dependencies and scripts.
- **XML (`.xml`)**: Used in the backend for `pom.xml` to manage Maven project dependencies and Java build configurations.

---

## 🛠 Project Elaboration & Workflow

When we talk about the "elaboration" of this project, we are talking about how these distinct programming languages and tools combine to create a working system. Here is the step-by-step workflow of how a feature elaborates from a user action all the way to the database:

### 1. User Interaction (The Frontend)
It all starts when a user or administrator interacts with the **React (TypeScript)** interface. For example, if you click the "Approuver" (Approve) button on a new comment in the Admin Dashboard:
- An `onClick` event is triggered in the TypeScript code (`AdminDashboardPage.tsx`).
- React immediately updates the state locally so the user instantly sees the UI change (e.g., the badge turns Green), which is styled seamlessly by **Tailwind CSS**.

### 2. The Network Request (The Bridge)
While the UI updates immediately, that change needs to be saved permanently. 
- The Frontend uses a service layer (usually `fetch` or `axios` in JavaScript/TypeScript) to send an HTTP REST Request (e.g., `PUT /api/reviews/1`). 
- This request contains a **JSON** packet detailing the change (e.g., `{"status": "Approuvé"}`).

### 3. Server Processing (The Backend)
The HTTP request arrives at the **Java / Spring Boot** server running on port `8080`.
- The request hits a **Controller** (`ReviewController.java`), which acts as the gatekeeper.
- It checks security authorizations (e.g., *"Is this user an Admin?"*).
- The controller passes the task to the **Service layer**, where business rules are validated (e.g., *"Does review ID 1 actually exist?"*).

### 4. Directing the Database (Data Access)
Once the Java logic confirms everything is correct, it needs to save the data.
- Spring Boot uses internal entities and repositories extending JPA. 
- You don't have to write manual **SQL** here; Java translates your `reviewRepository.save(review)` command into a secure, raw SQL `UPDATE` statement under the hood.

### 5. Final Storage (Database)
The generated SQL command targets the **PostgreSQL** database running safely inside its **Docker (YAML)** container.
- The `reviews` table in PostgreSQL is modified, changing the status from 'En attente' to 'Approuvé'.
- The Database sends a success signal back to Java, which then sends an "HTTP 200 OK" signal back to your TypeScript browser application.

### Elaboration Summary
By separating the project closely into these layers, development becomes much safer and easier to track. The **Frontend** only worries about making things look good and accessible, the **Backend** acts as the secure brain of operations, and the **Database** is the final, permanent memory vault!
