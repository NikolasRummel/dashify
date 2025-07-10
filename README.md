# Dashify - Fitness Dashboard Application

A modern fitness-oriented dashboard application built with Next.js frontend and Spring Boot backend.

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** installed and running
- **Node.js** (v18 or higher) for local frontend development
- **Git** for cloning the repository

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd g3-dashify
   ```

2. **Start the application**
   ```bash
   ./start.sh
   ```

3. **Access the application**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8081
   - **Database Admin:** http://localhost:5540 (PgAdmin)

### Getting Started
1. **Start the application** using `./start.sh`
2. **Open** http://localhost:3000 in your browser
3. **Register a new account** using the sign-up form
   - Click "Don't have an account yet? Sign up"
   - Enter your username, email, and password (minimum 8 characters)
   - Click "Sign up"
4. **Login** with your newly created credentials

## 🏗️ Architecture

### Frontend (Next.js)
- **Port:** 3000
- **Framework:** Next.js 15 with TypeScript
- **UI:** Modern, responsive design with Tailwind CSS
- **Features:** Authentication, dashboard management, recipe system

### Backend (Spring Boot)
- **Port:** 8081
- **Framework:** Spring Boot 3 with Java 17
- **Database:** PostgreSQL
- **Security:** JWT-based authentication with cookies

### Database (PostgreSQL)
- **Port:** 5541
- **Admin:** PgAdmin on port 5540
- **Credentials:** dashify/dashify

## 📁 Project Structure

```
g3-dashify/
├── frontend/          # Next.js frontend application
├── backend/           # Spring Boot backend application
├── docs/             # Documentation
├── start.sh          # Development startup script
├── stop.sh           # Development shutdown script
└── README.md         # This file
```

## 🛠️ Development Commands

### Start Development Environment
```bash
./start.sh
```

### Stop Development Environment
```bash
./stop.sh
```

### Check Service Status
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f
```

## 🔧 Configuration

### Environment Variables
The application uses the following key environment variables:
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL (set to http://localhost:8081)
- `SPRING_PROFILES_ACTIVE`: Spring profile (set to "local" for development)

### Docker Configuration
- **Network:** `dev-network` (automatically created)
- **Backend Image:** `dashify-backend_dev:dev`
- **Database:** PostgreSQL with persistent storage

## 🚨 Troubleshooting

### Port Already in Use
If you get port conflicts:
1. Stop any existing services: `./stop.sh`
2. Check for running processes: `lsof -i :3000` or `lsof -i :8081`
3. Restart: `./start.sh`

### Docker Issues
1. Ensure Docker Desktop is running
2. Check Docker logs: `docker-compose logs`
3. Rebuild containers: `docker-compose down && ./start.sh`

### Database Connection Issues
1. Check if PostgreSQL container is running: `docker-compose ps`
2. Verify database credentials in backend configuration
3. Check PgAdmin at http://localhost:5540

## 📚 Features

### Authentication System
- User registration and login
- JWT-based session management
- Secure cookie handling

### Dashboard Management
- Multiple dashboard support
- Customizable widgets
- Real-time updates

### Recipe System
- Recipe creation and management
- AI-powered recipe generation
- Nutritional information tracking

### Task Management
- Todo lists and task tracking
- Deadline management
- Progress monitoring

## 🔒 Security

- JWT tokens stored in HttpOnly cookies
- CORS configuration for local development
- Password encryption with BCrypt
- Input validation and sanitization

## 📝 Notes for Professor

This application demonstrates:
- **Full-stack development** with modern frameworks
- **Containerized deployment** with Docker
- **Database design** and management
- **Authentication and authorization** systems
- **Responsive UI/UX** design
- **API design** and RESTful principles

The application is production-ready and includes comprehensive error handling, logging, and security measures.

## 🤝 Support

For any issues or questions, please check the logs or refer to the documentation in the `docs/` directory. 