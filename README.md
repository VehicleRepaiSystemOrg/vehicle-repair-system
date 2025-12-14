# Vehicle Repair Management System

A full-stack web application to manage vehicle repairs, customers, and inventory for Sri Lankan garages. This project is built using the MEN (MongoDB, Express, Node.js) stack with an Angular frontend.

---

## 1. Prerequisites

Before you begin, ensure you have the following software installed on your computer.

- **Node.js and npm:** [Download Here](https://nodejs.org/)
- **Git:** [Download Here](https://git-scm.com/downloads)
- **Angular CLI:** Open your terminal and run:
  ```
  npm install -g @angular/cli
  ```
- **VS Code:** [Download Here](https://code.visualstudio.com/) (Recommended)

---

## 2. First-Time Setup

Follow these steps exactly to get the project running on your machine.

1.  **Clone the Repository:**

    ```
    git clone <your-github-repo-url>
    cd vehicle-repair-system
    ```

2.  **Get Environment Variables:**
    The project requires a `.env` file to connect to the database. **Ask the Team Lead** for the content of this file.

3.  **Create the `.env` File:**

    - Navigate to the `/server` directory.
    - Create a new file named `.env`.
    - Paste the content you received from the Team Lead into this file.

4.  **Install Dependencies:**
    You need to do this for both the backend and frontend.

    ```
    # Install backend dependencies
    cd server
    npm install

    # Install frontend dependencies
    cd ../client
    npm install
    ```

---

## 3. Running the Application

This project requires **two separate terminals** running at the same time.

### Terminal 1: Backend Server

Navigate to the server folder
cd server

Start the server in development mode
npm run dev

> The server will start on `http://localhost:5000`.

### Terminal 2: Frontend App

Navigate to the client folder
cd client

Start the Angular app
ng serve

> The application will be available at `http://localhost:4200`.

**Troubleshooting:** If the server fails to connect to the database, your IP address might not be whitelisted. Contact the Team Lead to get your IP added to the MongoDB Atlas settings.

---

## 4. Git Workflow & Contribution Guide

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

    # Example for fixing a bug
    git checkout -b bugfix/navbar-alignment
    ```

3.  **Do Your Work:**
    Write your code and save your files as you normally would.

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
    - Go to the project's GitHub repository page in your browser.
    - A yellow banner will appear for your recently pushed branch. Click **"Compare & pull request"**.
    - Ensure the target is correct: **base: `develop`** ← **compare: `your-feature-branch`**.
    - Add a title, a brief description of your changes, and create the pull request.
    - Assign another team member to review your code before it gets merged.
