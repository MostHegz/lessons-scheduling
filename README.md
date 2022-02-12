# Description

This is an application for calendar creation using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. The database used in [MongoDB](https://www.mongodb.com/) This solution utilize [RRule](https://github.com/jakubroztocil/rrule) for recurring events and [JWT](https://jwt.io/) to encode common user data in the authorization header.

# Table of Content

1. [ Features. ](#features)
2. [ Getting Started. ](#start)
3. [ Todo List. ](#todo)

<a name="features"></a>

## Features

1. Add lesson API
2. Update lesson API (includes changing lesson dates)
3. Delete lesson API
4. List lessons between 2 dates

For API documentation please check [ API collection ](#api-doc)

<a name="start"></a>

# Getting Started

## 1. Installing Packages

In the root directory run

```bash
$ npm install
```

## 2. Installing Docker

1. Make sure you have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)
2. In the root directory run

```bash
$ docker-compose up dev # To start development environment
```

Or

```bash
$ docker-compose up prod # To start production environment

```

3. After the container is ready and running you can now connect to it on port `3001`

## 3. API Collection

After running the App you can go to `localhost:3001/swagger` to check the available apis

<a name="todo"></a>

# To do List

1. Adding TCP gateway handling for communication between microservices
