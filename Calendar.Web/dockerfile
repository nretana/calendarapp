#alpine setup
#commands used are based on /bin/sh
FROM node:alpine AS BUILD
ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

WORKDIR /calendarapp

COPY . .
COPY package.json ./
COPY package-lock.json ./

RUN npm install

RUN npm run build:prod


FROM nginx:1.23-alpine AS HOSTING
ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

WORKDIR /
RUN mkdir /initApp
COPY entrypoint.sh /initApp

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=BUILD calendarapp/build .

EXPOSE 443
WORKDIR /
USER root
RUN chmod +x ./initApp/entrypoint.sh
CMD /bin/sh ./initApp/entrypoint.sh