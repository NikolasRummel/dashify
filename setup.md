# Quick Setup Guide for Professor

## Prerequisites
1. **Docker Desktop** - Download and install from https://www.docker.com/products/docker-desktop/
2. **Node.js** (v18+) - Download from https://nodejs.org/
3. **Git** - Should be pre-installed on most systems

## One-Command Setup

1. **Clone and start the application:**
   ```bash
   git clone <your-repo-url>
   cd g3-dashify
   ./start.sh
   ```

2. **Wait for everything to start** (takes 2-3 minutes on first run)

3. **Open your browser and go to:** http://localhost:3000

4. **Create your account:**
   - Click "Don't have an account yet? Sign up"
   - Fill in your details (username, email, password)
   - Click "Sign up"
   - Login with your new credentials

## What's Running
- **Frontend:** http://localhost:3000 (Next.js application)
- **Backend:** http://localhost:8081 (Spring Boot API)
- **Database:** PostgreSQL on port 5541
- **Admin:** PgAdmin on http://localhost:5540

## To Stop Everything
```bash
./stop.sh
```

## If Something Goes Wrong
1. Make sure Docker Desktop is running
2. Run `./stop.sh` then `./start.sh` again
3. Check the logs: `docker-compose logs`

That's it! The application should be fully functional. 🎉 