# Zen tracking

## View site live: [https:/zen-tracking.com](https://zen-tracking.com)

## Prerequirements

- Nodejs (version 12 or later)
- Yarn
- Docker

### Optional

- Python, tesseract and fin.traineddata, for [generate-quotes](#generate-quotes)

## Installation and setup

- Clone this repository

  ```bash
  git clone https://github.com/ekkusi/zen-tracking.git
  ```

- Install packages, generate prisma client and build backend

  ```bash
  yarn setup
  ```

  Which runs all these:

  ```bash
    yarn install
    yarn generate-prisma
    yarn build:backend
  ```

On first setup, you also need to:

### Setup database

- Set DATABASE_URL env variable to modules/backend/prisma .env file that points to live database. If there is no .env file here yet, create one.

If you want to use docker-compose to host database, DATABASE_URL should point to "postgresql://user:password@localhost:5432/zen-tracking"

- Run local Postgres database by running:

  ```bash
  docker-compose up
  ```

- Create a database named "zen-tracking"

If you have database running through docker-compose, you can do this manually by going to postgre admin (http://localhost:5050) and setting database manually there. To do this need to first create new server with name "zen-tracking", host name "postgres", port "5432", maintenance database "zen-tracking", username "user" and password "password". If database named "zen-tracking"" isn't created automatically when server is created, create one.

Default email postgreadmin is "default@email.com" and password is "password"

- Install [https://blog.timescale.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows/](psql) if you don't yet have it

- Import database dump and generate mock data (needs to be done on first start, works for database running through docker-compose):
  ```bash
  yarn setup-db-and-prisma
  ```

## Develop

- Start docker to run local postgre database (needs to be up for backend to work)

  ```bash
  docker-compose up
  ```

- Start backend and frontend development servers

  ```bash
  yarn develop
  ```

- For better frontend logging, run these separately (in frontend folder):
  ```bash
  yarn start-react
  yarn apollo:update-types --watch
  ```
  Apollo-codegen logging doesn't show all (at the time of writing this) the logs in a best way when ran with `concurrently`,
  so it is advised to run commands shown above separately for a better development experience. If you don't need to update
  query typing generation (`apollo client:codegen`), you can leave the latter command out.

## Build modules and run production build

- Build modules
  ```bash
  yarn build:all
  ```
- Run production build
  ```bash
  yarn run:prod
  ```

# Other

### Generate backend types from graphql (do this after updating .graphql files, normally this is running on watch with develop, so no need to worry)

NOTE: Backend needs to be running to run this. Graphql-code-generator fetches graphql schema from http://localhost:4000/graphql to take types from.

```bash
yarn generate-types:backend
```

### Update frontend graphql query types

NOTE: Backend needs to be running to run this. Apollo client:codegen fetches graphql schema from http://localhost:4000/graphql to take types from.

```bash
yarn generate-types:frontend
```

### Update backend prisma model and client (do this after modifying database models)

```bash
yarn update-prisma
```

## Bash scripts

In /scripts folders there is some bash scripts to help development. `dumpdb.sh` and `importdb.sh` scripts are to help importing/dumping dbs.

`download-quote-images.sh` is used to update frontend/public/photos/quotes, which are used in quote of the day feature. NOTE: To run this script, you need
to have [instagram-scraper](https://github.com/arc298/instagram-scraper) installed.

## Generate quotes

You can generate quotes to Quote-table of connected db by running

```bash
  yarn generate-quotes
```

This will process images in /modules/frontend/public/photos/quotes and extract text from the photos, if some is found, and add quotes from them to Quote-table.

NOTE: This requires following things

- [Tesseract](https://github.com/tesseract-ocr/tesseract) is installed to the machine your running this script from
- [fin.traineddata](https://github.com/tesseract-ocr/tessdata/blob/master/fin.traineddata) tesseract language pack is downloaded to your tesseract-ocr/tessdata/ folder (where you install tesseract in last step). In linux this will be in `/usr/share/tesseract-ocr/4.00/tessdata` by default, if you install tesseract by `sudo apt install tesseract-ocr`.

## /Graphql API development in backend

To open backend graphql api environment, navigate to http://localhost:4000/graphql when dev environment is up.

When running queries from here, you must first fetch accesstoken to run some mutations.
Easiest way to do this is to login with `main-user` or whatever user you want to make modifications with (users can be found in mockData.json in backend). Login by running this query, or with the user you want (passwords and name in mockData.json):

```
 mutation login {
  login(name: "main-user", password: "asd123") {
    accessToken
  }
}
```

And put the resulting accessToken to Graphiql HTTP Headers (can be found in bottom left of the page):

````
{
    "Authorization": "Bearer <YOUR_ACCESS_TOKEN_HERE>"
}



# Docker

NOTE: Docker needs to be up to run the following commands

- Import (from tmp/zen_tracking_mock_dump.sql)

  ```bash
  yarn postgreimport
````

- Dump (to tmp/zen_tracking_mock_dump.sql)

  ```bash
  yarn postgredump
  ```

- NOTE:
  If you run into errors with project dependencies with e.g. eslint (not running in VSCode or in general), run 'yarn install' in the root of the project.
  Adding new dependencies to submodules might cause these errors.
