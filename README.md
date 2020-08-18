# Steam GTX 1060 Or Lesser GPU Popularity
This repository holds the front end and back end of my webpage that tracks the popularity of the GTX 1060 or lesser GPUs among Steam users.

At the time I created this, the GTX 1060 was the most popular GPU on Steam, and it stands as practically the bare minimum VR-capable card. I was curious about what the percentage of users was who had that card or lesser as it would show the percentage of users who were due for an upgrade in order to make use of VR, and because it seemed like combined it might be a high number. Furthermore, the GTX 1060 is about on par with or slightly weaker than the GPUs found in the current day consoles (Xbox One X and PS4 Pro at the time of this writing), so it surprised me to discover that most Steam users had computers below the capabilities of consoles at the time of this creation. This metric was one I was interested in tracking over time. The ranking of GPUs was accomplished by matching data from the [Steam Hardware Survey](https://store.steampowered.com/hwsurvey/) with results on [UserBenchmark](https://www.userbenchmark.com/page/developer) and is kept in sync monthly.

This project was created as an experiment to demonstrate some proficency creating projects with Nuxt.js and Buefy with a responsive design.
It is hosted on a virtual Linux server running in the cloud using docker with a CI/CD pipeline that utilizes GitHub Actions, Docker Hub, and [Watchtower](https://github.com/containrrr/watchtower).

## Usage

1. (OPTIONAL) Create a .env file at the root of this project that contains the following values
    - `SITE_ROOT=/some-directory/` the subdirectory the site should run under (defaults to /)
2. Run `npm install` to install necessary packages
3. Run `npm run dev` to develop locally
4. Run `npm run build` to build production dist
5. Run `npm start` to run in production mode

# Docker Container

To run an instance of this project via docker, run the following command:

```
docker run -d --name steam-hardware-survey ryuyandev/steam-hardware-survey
```

The docker image is built such that it expects the site to operate under the subdirectory of /steam-gpus
