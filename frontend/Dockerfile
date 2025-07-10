FROM --platform=linux/arm64 node:22

# Set working directory
WORKDIR /app

# Clean npm cache to avoid tracker issues
RUN npm cache clean --force

# Copy package files
COPY package*.json ./

# Install dependencies with compatibility mode
RUN npm install --legacy-peer-deps

# Copy all other frontend files
COPY . .

# Accept build argument for backend URL
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Expose port used by Next.js dev server
EXPOSE 3000

# Enable hot reload compatibility in Docker
ENV WATCHPACK_POLLING=true

# Start Next.js in dev mode (listen on all interfaces)
CMD ["npx", "next", "dev", "-H", "0.0.0.0"]