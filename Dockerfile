
# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Build the backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/. .
COPY --from=frontend-builder /app/dist ./dist

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=backend-builder /app .
CMD ["npm", "start"]
