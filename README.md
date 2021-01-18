# Track-your-streak

## Prerequirements

* Nodejs (version 12 or earlier)
* Yarn
* Docker

## Installation and setup

* Clone this repository
  ```bash
  git clone https://bitbucket.wihuri.fi/scm/prav/pravda-gdsn-admin.git
  ```

* Install packages
  ```bash
  yarn
  ```

### Setup database
* Set DATABASE_URL env variable to modules/backend/prisma .env file that points to live database.

If you want to use docker-compose to host database, DATABASE_URL should point to "postgresql://user:password@localhost:5432/zen-tracking"

* Run local Postgres database by running:
  ```bash
  docker-compose up
  ```

* Create a database named "zen-tracking"

If you have database running through docker-compose, you can do this manually by going to postgre admin (http://localhost:5050) and setting database manually there. To do this need to first create new server with name "pravda", host name "postgres", port "5432", maintenance database "zen-tracking", username "user" and password "password". If database named "zen-tracking"" isn't created automatically when server is created, create one.

Default email postgreadmin is "default@email.com" and password is "password"

* Import database dump (needs to be done on first start, works for database running through docker-compose):
  ```bash
  yarn postgreimport
  ```


## Develop

* Start docker to run local postgre database (needs to be up for backend to work)
  ```bash
  docker-compose up
  ```

* Start backend and frontend development servers
  ```bash
  yarn develop
  ```

## Build modules and run production build

* Build modules
  ```bash
  yarn build:all
  ```
* Run production build
  ```bash
  yarn run:prod
  ```

# Other

### Generate backend types from graphql (do this after updating .graphql files)
  ```bash
  yarn generate:backend
  ```
### Update backend prisma model and client (do this after modifying database models)
  ```bash
  yarn update-prisma
  ```

# Docker

NOTE: Docker needs to be up to run the following commands

* Import (from tmp/zen_tracking_mock_dump.sql)
  ```bash
  yarn postgreimport
  ```

* Dump (to tmp/zen_tracking_mock_dump.sql)
  ```bash
  yarn postgredump
  ```

* NOTE:
If you run into errors with project dependencies with e.g. eslint (not running in VSCode or in general), run 'yarn install' in the root of the project.
Adding new dependencies to submodules might cause these errors.