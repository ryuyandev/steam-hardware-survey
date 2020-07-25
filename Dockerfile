FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY nuxt.config.js ./
COPY data ./data

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

RUN npm run build
CMD ["npm", "start"]