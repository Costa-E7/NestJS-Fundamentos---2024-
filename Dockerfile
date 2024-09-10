FROM node:20-alpine

ARG NODE_ENV=production
ARG NPM_TOKEN


RUN npm config set @chaordic:registry https://npm.pkg.github.com/
RUN npm config set //npm.pkg.github.com/:_authToken "${NPM_TOKEN}"


COPY . /app

WORKDIR /app
RUN npm install

CMD npm start

EXPOSE 3000

FROM node:20-alpine as production

ARG NODE_ENV=production
ARG NPM_TOKEN


RUN npm config set @chaordic:registry https://npm.pkg.github.com/
RUN npm config set //npm.pkg.github.com/:_authToken "${NPM_TOKEN}"


COPY . /app

WORKDIR /app
RUN npm install

CMD npm start

EXPOSE 3000