FROM node:22-alpine AS builder
WORKDIR /app
COPY frontend/ ./frontend/
RUN cd frontend && npm ci && npm run build

FROM node:22-alpine
WORKDIR /app
COPY backend/ ./backend/
COPY --from=builder /app/ecommerce-backend/dist /app/backend/dist
RUN cd backend && npm ci --production
EXPOSE 3000
CMD ["node", "backend/server.js"]