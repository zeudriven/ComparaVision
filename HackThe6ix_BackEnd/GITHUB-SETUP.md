# GitHub Setup Instructions

## First-time Setup

1. Initialize Git Repository (skip if already initialized)
```bash
git init
```

2. Set up Remote Repository
```bash
# Remove existing remote if it exists
git remote remove origin

# Add new remote
git remote add origin https://github.com/HacktheSix/HackThe6ix_BackEnd.git
```

3. Create and Switch to Main Branch
```bashh
git checkout -b main
```

4. Stage Files
```bash
git add .
```

5. Initial Commit
```bash
git commit -m "Initial commit: Auth0 + Supabase Integration"
```

6. Push to GitHub
```bash
git push -u origin main
```

## For Team Members

1. Clone the Repository
```bash
git clone https://github.com/HacktheSix/HackThe6ix_BackEnd.git
cd auth0_login
```

2. Create .env File
Copy `.env.example` and add your credentials:
```bash
cp .env.example .env
```

3. Install Dependencies
```bash
npm install
```

## Important Notes

- Never commit `.env` files
- Keep Supabase and Auth0 credentials private
- Pull latest changes before starting work:
```bash
git pull origin main
```

## Branching Strategy

1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

2. Make Changes and Commit
```bash
git add .
git commit -m "Description of changes"
```

3. Push Changes
```bash
git push origin feature/your-feature-name
```

4. Create Pull Request on GitHub
- Go to repository on GitHub
- Click "Pull Requests"
- Click "New Pull Request"
- Select your branch

## Additional Notes

### Stopping the Server
To stop the server, use:
```bash
# Windows
Ctrl + C

# Or if that doesn't work
node stop.js
```
