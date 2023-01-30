FROM node:16-alpine

WORKDIR /usr/src/app

COPY src/ /usr/src/app/

RUN npm install

ENTRYPOINT [ "node", "app.js" ]