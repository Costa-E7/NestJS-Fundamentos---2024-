FROM node:20.10.0-alpine as builder

ARG NODE_ENV=production

ENV NODE_ENV $NODE_ENV
ARG NPM_TOKEN

RUN npm config set @chaordic:registry https://npm.pkg.github.com/
RUN npm config set //npm.pkg.github.com/:_authToken "${NPM_TOKEN}"

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install -g @nestjs/cli
RUN npm ci --quiet --include=dev
RUN rm ~/.npmrc

COPY --chown=node:node prisma prisma
COPY --chown=node:node src src
COPY --chown=node:node nest-cli.json ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node *.d.ts ./

RUN npm run build

FROM node:20.10.0-alpine AS production

ARG NODE_ENV=production
ARG NPM_TOKEN

ENV NODE_ENV $NODE_ENV

RUN npm config set @chaordic:registry https://npm.pkg.github.com/
RUN npm config set //npm.pkg.github.com/:_authToken "${NPM_TOKEN}"

WORKDIR /app

COPY --chown=node:node --from=builder /app/package*.json ./

RUN npm ci --omit=dev && npm cache clean --force
RUN rm ~/.npmrc

COPY --chown=node:node --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=builder /app/dist ./dist

USER node

CMD npm run start:prod
