- [Architecture](#architecture)
- [Getting started](#getting-started)

## Architecture
The primary components are the database (PostgreSQL), web application (NextJS), backend (Strapi), reverse proxy (Nginx), and containerization (Docker). Both Strapi and NextJS are run as servers.

The database, web application, and backend each are ran in a docker container, which are managed through docker compose. `scripts/run` is a script that mostly abstracts managing these containers.

Other processes we have are:
- [cypress](https://www.cypress.io/), an end-to-end testing framework.
- GitHub actions which rebuilds and restarts docker processes when commits are pushed to the main branch.

## Getting started
Get [docker](https://docs.docker.com/get-docker/) and [docker compose](https://docs.docker.com/compose/install/) if you don't already have it
```bash
git clone https://github.com/t-wilkinson/infinite-closet
cd infinite-closet
scripts/run local up
```

Done!
