FROM node:16-alpine

WORKDIR /streamer

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "node", "index.js" ]