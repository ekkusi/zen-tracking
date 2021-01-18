FROM node:10

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/
COPY modules/backend/package.json /app/modules/backend/package.json
COPY modules/frontend/package.json /app/modules/frontend/package.json

RUN yarn install

COPY . /app/

RUN yarn build:backend
RUN yarn build:frontend

EXPOSE 4000

CMD [ "yarn","run:prod"]