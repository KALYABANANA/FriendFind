# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8081
EXPOSE 8081

# Set environment variable for Expo web port
ENV EXPO_WEB_PORT=8081

# Start the application
CMD ["npx", "expo", "start", "--web", "--port", "8081"]