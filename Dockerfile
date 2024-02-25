FROM node:20-alpine AS builder

RUN mkdir /app && mkdir /app/data

COPY . /app

RUN cd /app && yarn install && \
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
