# A-SAFE
typescript monorepo based rest-API architecture with fastify and prisma framework.

## Features
* Login
* List users
* Create a user
* Update a user
* Delete a user
* Authentication
* List posts
* Create a post
* Update a posts
* Delete a posts
* Upload profile picture
* [Swagger documentation](https://damp-beach-85831-b7586b3c325b.herokuapp.com/documentation/)

## What have I used?
* Fastify - Web server
* Prisma - Database ORM
* Postgresql - Database
* Swagger - API docs
* AWS S3 - Cloud storage
* Yarn - Package manager
* Jest - Testing framework
* Heroku - cloud platform

## How have I done it?
* I have implemented the functionalities as plugins, each one being an independent repo in order to easily maintain each plugin separately.
* All operations require authentication, except login.
* There are 2 roles: Admin and User.
* A user can edit their profile and list posts and create, edit or delete their own posts.
* An administrator can list, create, edit or delete users or posts of any user.
* All users can add a profile image.
* Before deleting a user you must delete all their posts.
* Users with id 1 and 2 are reserved for tests, so you cannot change the password or delete them.

## Repo struct
* packages - Contains the different plugins, the utilities and the API server.
* postgres-local - Contains a compose to deploy 2 docker containers for postgres.
* prisma - Contains the definition and configuration of prisma.
* requests - Contains definitions to attack the api using the [rest client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) vscode extension
* src - Contains the code to start the app
* tests - Contains the test scripts for jest
* example.env - Contains the environment variables that the app needs to work

## How to use

### 1. Clone this repo & install dependencies

Install Node dependencies:

`yarn install`

### 2. Set up the Postgres database

This uses Postgres database.

To set up your database, run:

```sh
yarn postgres:docker
```

### 3. Generate Prisma Client (type-safe database client) and init data

Run the following command to generate Prisma Client and init data:

```sh
npm prepare
```

### 4. Start the app

Launch your server with this command:

```sh
yarn build
yarn start
```

## For Run Test

Run test with command: 

```sh
yarn test
```

## For Build Generation

Build server with command: 

```sh
yarn build
```

