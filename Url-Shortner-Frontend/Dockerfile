# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Accept build arguments (None currently required)

# Set environment variables for the build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application and build
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the build stage to Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
