FROM node:15.11.0

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/
COPY modules/backend/package.json /app/modules/backend/package.json
COPY modules/frontend/package.json /app/modules/frontend/package.json
COPY patches /app/patches

RUN yarn install

COPY . /app/

RUN NODE_yarn generate-prisma
RUN NODE_OPTIONS=--max_old_space_size=2048 yarn build:backend
RUN NODE_OPTIONS=--max_old_space_size=2048 yarn build:frontend

EXPOSE 4000

CMD [ "yarn","run:prod"]