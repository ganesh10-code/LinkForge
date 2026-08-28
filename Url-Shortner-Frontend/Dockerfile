FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]

# Build image
# docker build -t shortify-frontend .

# Run container (map 5173 inside container -> 5173 on host)
# docker run -it -p 5173:5173 --name shortify-frontend-container shortify-frontend
