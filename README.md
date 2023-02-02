# Svelte Kit 1.0 + SQLite Demo App

Code from following YouTube tutorials: 
  - [SvelteKit 1.0 with SQLite Tutorial](https://youtu.be/iO4VUbQ6ua4)
  - [Authentication and Authorization in SvelteKit 1 with SQLite](https://youtu.be/XRa-b5E7x8w)
  - [Build and run SvelteKit Apps with Docker](https://youtu.be/LwzoWuHjOWk)

Full Playlist: [SvelteKit](https://www.youtube.com/playlist?list=PLIyDDWd5rhaYwAiXQyonufcZgc_xOMtId)

## Docker

Build Container:

```sh
docker build -t sveltekit-sqlite-img .
```

Run Container:

```sh
docker run -d -p 3000:3000 \
  --mount type=bind,source="$(pwd)"/data/,target=/app/data/ \
  --rm --name sveltekit-sqlite \
  sveltekit-sqlite-img
```
