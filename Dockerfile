FROM node:20-alpine AS builder

RUN mkdir /app && mkdir /app/data

COPY . /app

RUN cd /app && yarn install && \
  echo "DB_PATH=/app/data/chinook.db" > /app/.env && \
  echo "SERVER_ASSETS=/app/server-assets" >> /app/.env && \
  echo "SUBSCRIPTION_DB_PATH=./data/subscriptions.db" >> /app/.env && \
  # they are not real keys, but necessary for the build
  echo "VAPID_PUBLIC_KEY=AAAaAAaaAaaaaxxH7ya9EGbq3NHaVrE8eFL07BVIPckc5dQMujxB3Pbp8uKfXEIecggUbdJaLvF-DDUhfzxCoC4 " >> /app/.env && \
  echo "VAPID_PRIVATE_KEY=_AAAaaaaaa0FJG27ntCf5q2KVtifHqF-mfW6TgtXOOg" >> /app/.env && \
  yarn build

FROM node:20-alpine

RUN mkdir /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/yarn.lock /app/
COPY --from=builder /app/server-assets/ /app/server-assets/

RUN cd /app && \ 
  yarn install --production && \
  yarn cache clean

WORKDIR /app

CMD ["node", "build/index.js"]
