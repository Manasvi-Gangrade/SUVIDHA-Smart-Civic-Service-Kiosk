FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

# Use the built-in non-root user from the Node image for better container security.
USER node

CMD ["node", "server.js"]
