# Svelte Kit 1.0 + SQLite Demo App

Code from [this YouTube tutorial](https://youtu.be/iO4VUbQ6ua4)


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
