FROM node:18-alpine AS builder

RUN mkdir /app && mkdir /app/data

COPY . /app

RUN cd /app && yarn install && \
  echo "DB_PATH=/app/data/chinook.db" > /app/.env && \
  echo "SERVER_ASSETS=/app/server-assets" >> /app/.env && \
  yarn build 



FROM node:18-alpine

RUN mkdir /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/yarn.lock /app/
COPY --from=builder /app/server-assets/ /app/server-assets/

RUN cd /app && \ 
  yarn install --production && \
  yarn cache clean

WORKDIR /app

CMD ["node", "build/index.js"]
