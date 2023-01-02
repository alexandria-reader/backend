Alexandria is an open source language learning app that allows users learn languages using text.

Read about how we made it [here](https://alexandria-reader.github.io/).

Alexandria is accessible [here](https://tryalexandria.com/).

# Running Alexandria locally for development

1. Follow the instructions here [https://docs.docker.com/get-docker/] to install Docker Desktop
2. Clone this repo and the [frontend](https://github.com/alexandria-reader/frontend)
3. Run `npm install` to install the dependencies
4. Add a .`env` file to the root directory with the values from `src/model/.env.sample`
5. Run `npm run start-docker-postgres`
6. Run `npm run dev`
7. Follow the getting started instructions in the frontend `README.md`

# Testing

To run the tests, run `npm run pgtest`. This command spins up a docker container with a fresh postgres database for the tests, runs the tests, and then shuts down the container. Just running `npm test` will cause the tests to fail if the docker container is not available.

# Troubleshooting

If, when getting the backend and frontend working together, you get a 500 error from the languages endpoint, make sure that the database is running locally and that the seed data is present. You can start the database by running `npm run start-docker-postgres`.
