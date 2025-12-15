# Vehicle Repair Management System

A full-stack web application to manage vehicle repairs, customers, and inventory for Sri Lankan garages. This project is built using the MEN (MongoDB, Express, Node.js) stack with an Angular frontend.

---

## 1. Prerequisites

Before you begin, ensure you have the following software installed:

- **Docker Desktop:** [Download Here](https://www.docker.com/products/docker-desktop/) (Required for recommended setup)
- **Git:** [Download Here](https://git-scm.com/downloads)
- **VS Code:** [Download Here](https://code.visualstudio.com/) (Recommended)
- _(Optional)_ Node.js & Angular CLI (Only needed if running manually without Docker)

---

## 2. Setup Instructions

Follow these steps exactly to get the project running on your machine.

1.  **Clone the Repository:**

    ```
    git clone <your-github-repo-url>
    cd vehicle-repair-system
    ```

2.  **Environment Setup:**
    The project requires a `.env` file for the backend to connect to the database.
    - **Ask the Team Lead** for the secure content of this file.
    - Navigate to the `/server` directory.
    - Create a new file named `.env`.
    - Paste the content you received.

---

## 3. Running the Application (Docker Method - Recommended)

We use Docker to run the Frontend, Backend, and Database simultaneously with a single command. This avoids version conflicts.

1.  **Start the Project:**
    Open your terminal in the root folder (where `docker-compose.yml` is) and run:

    ```
    docker-compose up --build
    ```

    > _Note: The first run may take 5-10 minutes to download dependencies and build the images._

2.  **Access the App:**

    - **Frontend (Angular):** [http://localhost:4200](http://localhost:4200)
    - **Backend (API):** [http://localhost:5000](http://localhost:5000)

3.  **Stop the Project:**
    Press `Ctrl + C` in the terminal, or run:
    ```
    docker-compose down
    ```

---

## 4. Running Manually (Fallback Method)

Use this method _only_ if Docker is not working on your machine.

1.  **Install Dependencies:**

    ```
    cd server && npm install
    cd ../client && npm install
    ```

2.  **Run Backend (Terminal 1):**

    ```
    cd server
    npm run dev
    ```

3.  **Run Frontend (Terminal 2):**
    ```
    cd client
    ng serve
    ```

**Troubleshooting:** If the server fails to connect to the database, your IP address might not be whitelisted. Contact the Team Lead to get your IP added to the MongoDB Atlas settings.

---

## 5. Git Workflow & Contribution Guide

Follow these rules to prevent conflicts and keep our repository clean.

> **PRIMARY RULE: NEVER PUSH DIRECTLY TO `develop` OR `main`. ALWAYS USE A PULL REQUEST.**

### Step-by-Step Workflow

1.  **Get the Latest Code (Start of Day):**
    Before starting any work, make sure you have the latest version of the `develop` branch.

    ```
    git checkout develop
    git pull origin develop
    ```

2.  **Create Your Feature Branch:**
    Create a new branch from `develop` for your specific task. Use a descriptive name.

    ```
    # Example for a new feature
    git checkout -b feature/user-login-page
    ```

3.  **Do Your Work:**
    Write your code. If using Docker, the app will auto-reload when you save files.

4.  **Commit Your Changes:**
    Commit your work with a clear, descriptive message.

    ```
    git add .
    git commit -m "feat: Implement user login form with validation"
    ```

5.  **Push Your Branch to GitHub:**
    Push **your feature branch**, not `develop`.

    ```
    git push origin feature/user-login-page
    ```

6.  **Create a Pull Request (PR):**
    - Go to the project's GitHub repository page.
    - Click **"Compare & pull request"** on the yellow banner.
    - Ensure the target is: **base: `develop`** ← **compare: `feature/user-login-page`**.
    - Add a description and assign a reviewer.

---

## 6. Troubleshooting Docker

- **"Angular Live Development Server is listening on 0.0.0.0:4200":** This is a SUCCESS message. Open your browser to localhost:4200.
- **"Port 5000 is already in use":** You might have a manual node server running. Kill all terminals and try again.
- **"Exited with code 0":** If a container crashes immediately, check the logs or ask the Team Lead.
