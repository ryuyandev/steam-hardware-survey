FROM node:12-alpine

LABEL com.centurylinklabs.watchtower.enable="true"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY nuxt.config.js ./

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ARG SITE_ROOT_ARG
ENV SITE_ROOT=$SITE_ROOT_ARG

RUN npm run build
CMD ["npm", "start"]