## Clone the repo

git clone <REPO_URL>
cd vehicle-repair-system

## IMPORTANT: Ensure you are on develop

git checkout develop

## Install dependencies (Do this in BOTH folders)

cd server
npm install
cd ../client
npm install

## Switch to develop and pull the latest changes

git checkout develop
git pull origin develop

## Create a NEW branch for your specific task

# Naming convention: feature/your-feature-name

# Example: feature/login-page or feature/navbar

git checkout -b feature/login-page

# Stage all files

git add .

# Commit with a clear message

git commit -m "Added login form UI with validation"

# Push YOUR feature branch, NOT develop

git push origin feature/login-page
