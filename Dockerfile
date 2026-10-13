FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=build --chown=node:node /app/dist/shinbaby-web ./dist/shinbaby-web
USER node
ENV PORT=4000
EXPOSE 4000
CMD ["node", "dist/shinbaby-web/server/server.mjs"]
