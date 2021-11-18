- [Architecture](#architecture)
- [Getting started](#getting-started)

## Architecture
The primary components are the database (PostgreSQL), web application (NextJS), backend (Strapi), reverse proxy (Nginx), and containerization (Docker). Both Strapi and NextJS are run as servers.

The database, web application, and backend each are ran in a docker container, which are managed through docker compose. `scripts/run` is a script that mostly abstracts managing these containers.

Other processes we have are:
- [cypress](https://www.cypress.io/), an end-to-end testing framework.
- GitHub actions which rebuilds and restarts docker processes when commits are pushed to the main branch.

## Getting started
### Requirements
    - [docker](https://docs.docker.com/get-docker/)
    - [docker compose](https://docs.docker.com/compose/install/)
    - [nvm](https://github.com/nvm-sh/nvm)
```bash
git clone https://github.com/t-wilkinson/infinite-closet
cd infinite-closet
scripts/run local up
```

Done!
