FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


FROM node:20-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm run build

RUN npm prune --omit=dev


FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

EXPOSE 4000

CMD ["node", "dist/main.js"]