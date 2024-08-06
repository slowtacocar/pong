FROM node:20.16

WORKDIR /opt/pong

COPY .yarn .yarn
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .

RUN yarn --immutable

COPY . .

ENTRYPOINT ["yarn", "start"]
